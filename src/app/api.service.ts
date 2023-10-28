import { Injectable } from '@angular/core';
import { GlobalService } from './global.service';
import { ApiResponse, Auth, RequestTargetTypesMap } from './target.types';
import * as hash from 'object-hash';

export enum RequestMethod {
  GET = 'get',
  POST = 'post',
}
export enum RequestTarget {
  ITEM = 'item',
  SHOP = 'shop',
  SHOPDATA = 'shop-data',
  USER = 'user',
  LOGIN = 'auth/token/login',
  REG = 'auth/users',
  SEARCH_ITEM = 'find/item',
  SEARCH_SHOP = 'find/shop',
  CITY = 'city/shops',
  CITY_LIST = 'city/list'
}

export type RequestSettings<S = boolean> = {
  extraUrl?: string;
  body?: Record<any, any>;
  form?: FormData;
  headers?: Record<any, any>;
  makeCache?: boolean;
  doRaise?: boolean | S;
}

export class ResponseRef {
  constructor(public response: Response | null = null) { }
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  // public apiHost = 'https://yktinfodjango-1-t8836855.deta.app'
  public apiHost = 'http://127.0.0.1:8000'
  private apiUrl = `${this.apiHost}/api/v1`

  private baseHeaders = {
    'Content-Type': 'application/json',
    'Host': this.apiHost,
    'User-Agent': 'KnowPrice-app',
    'Accept': 'application/json',
    'Accept-Encoding': 'gzip, deflate, br',
    'Connection': 'keep-alive',
  }

  constructor(public global: GlobalService) {
    this.global.readyPromise.then(() => {
      this.apiHost = global.apiHost
    })
  }

  updateApiUrls() {
    this.apiUrl = `${this.apiHost}/api/v1`;
    this.global.apiHost = this.apiHost;
    this.global.commit()
    console.log(this.apiUrl)
  }

  private async getSize(body: string | FormData): Promise<number> {
    if (typeof body === 'object') {
      const cl = new Response(body).headers.get('content-length')
      if (cl) {
        return parseInt(cl)
      }
    } else if (typeof body === 'string') {
      return body.length
    }
    console.error(body)
    throw Error('cannot get size of obj')
  }

  private async constructHeaders(headers: Record<any, any>, type: RequestMethod, body?: string | FormData) {
    const finalHeaders: Record<string, string> = Object.assign({}, this.baseHeaders, headers)

    if (this.global.apiToken)
      finalHeaders['Authorization'] = `Token ${this.global.apiToken}`
    
    if (type === RequestMethod.POST && body)
      finalHeaders['Content-Length'] = (await this.getSize(body)).toString()
    
    return finalHeaders;
  }

  private normalizeBody(body: Record<any, any>, form?: FormData): FormData | string {
    let normBody: FormData | string;

    if (body && form) throw TypeError("Body and form are passed to request")
    else if (form) normBody = form
    else normBody = JSON.stringify(body)

    return normBody
  }

  async makeRequest<K extends keyof RequestTargetTypesMap, S = boolean>
    (method: RequestMethod, target: K | RequestTarget,
      {
        extraUrl = '', body = {}, form, headers = {}, makeCache = true, doRaise = false
      }: RequestSettings<S> = {}): Promise<ApiResponse<RequestTargetTypesMap[K], S>> {

    let normBody = undefined
    if (method != RequestMethod.GET) {
      normBody = this.normalizeBody(body, form)
    }

    await this.global.readyPromise

    const url = `${this.apiUrl}/${target}/${extraUrl ? extraUrl : ''}`

    const cacheKey = `${url}${normBody ? hash(normBody) : ''}`
    const cache = this.global.cache[cacheKey]
    if (cache !== undefined) { return cache }

    const finalHeaders: Record<string, string> = await this.constructHeaders(headers, method, normBody);

    const requestOptions: Record<string, any> = { method: method, headers: finalHeaders }
    if (body)
      requestOptions['body'] = normBody

    const response = await (await fetch(url, requestOptions))
    const json = response.status < 500 ? await response.json() : undefined

    if (doRaise && !response.ok) {
      throw Error('Got error from server')
    }

    const parsedResponse: Record<any, any> | ApiResponse = {
      success: response.ok,
      data: json,
      code: response.status,
      response: response
    }

    if (makeCache && response.ok) 
      this.global.cache[cacheKey] = parsedResponse

    return parsedResponse as ApiResponse<RequestTargetTypesMap[K], S>
  }

  async makeRequestToField<T extends keyof RequestTargetTypesMap,
    K extends keyof RequestTargetTypesMap[T]>
    (target: T | RequestTarget,
      field: K | string,
      id: number): Promise<ApiResponse<{result: RequestTargetTypesMap[T][K]}>> {
    const response = await this.makeRequest(RequestMethod.GET, target, { extraUrl: `${id}/${field.toString()}` });
    return response as ApiResponse<{result: RequestTargetTypesMap[T][K]}>
  }

  async makeAuthorization(username: string, password: string): Promise<ApiResponse<Auth>> {
    const response = await this.makeRequest(
      RequestMethod.POST,
      RequestTarget.LOGIN,
      {
        body: { 'username': username, 'password': password },
        makeCache: false,
      }
    )

    if (!response.success) {
      return response
    }

    const token = response.data.auth_token
    this.global.apiToken = token
    this.global.accountData['username'] = username

    this.global.commit()

    return response
  }

  async createAccount(username: string, password: string, makeAuthorization = true): Promise<ApiResponse> {
    const response = await this.makeRequest(
      RequestMethod.POST,
      RequestTarget.REG,
      {
        body: { 'username': username, 'password': password },
        makeCache: false,
      }
    )

    if (makeAuthorization && response.success) {
      console.log(response.data)
      this.makeAuthorization(username, password)
    }

    return response
  }
}
