import { Injectable } from '@angular/core';
import { GlobalService } from './global.service';
import { RequestTargetTypesMap } from './target.types';

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
  REG = 'auth/users'
}

class ResponseRef {
  constructor(public response: Response | null = null) {}
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  // private apiHost = 'https://yktinfo.pythonanywhere.com'
  private apiHost = 'http://127.0.0.1:8000'
  private apiUrl = `${this.apiHost}/api/v1`

  private baseHeaders = {
    'Content-Type': 'application/json',
    'Host': this.apiHost,
    'User-Agent': 'KnowPrice-app',
    'Accept': '*/*',
    'Accept-Encoding': 'gzip, deflate, br',
    'Connection': 'keep-alive',
  }

  constructor(public global: GlobalService) { }

  private async getSize(body: string | FormData): Promise<number> {
    if (typeof body === 'object') {
      const cl = new Response(body).headers.get('content-length')
      if (cl) {
        return parseInt(cl)
      }
    } else if (typeof body === 'string') {
      return body.length
    }
    throw Error('cannot get size of obj')
  }

  async makeRequest<K extends keyof RequestTargetTypesMap>
                   (type: RequestMethod, target: K | RequestTarget,
                    url: string = '',
                    body: string | FormData | null = null,
                    headers: Record<any, any> = {},
                    makeCache = true,
                    responseRef?: ResponseRef): Promise<[RequestTargetTypesMap[K], number]> {
    let finalUrl = `${this.apiUrl}/${target}/${url}`
    
    const cache = this.global.cache[finalUrl]
    if (cache !== undefined) {return cache}
    
    const finalHeaders: Record<string, string> = {}
    Object.assign(finalHeaders, this.baseHeaders, headers)

    if (this.global.apiToken)
      finalHeaders['Authorization'] = `Token ${this.global.apiToken}`
    
    if (type === RequestMethod.POST && body)
      finalHeaders['Content-Length'] = (await this.getSize(body)).toString()

    const init: Record<string, any> = {method: type, headers: finalHeaders}
    if (type === RequestMethod.POST && body)
      init['body'] = body
    
    const resp = await (await fetch(finalUrl, init))
    const result = await resp.json()
    if (responseRef) {
      responseRef.response = resp
    }

    if (makeCache) {
      this.global.cache[finalUrl] = [result, resp.status]
    }
    
    return [result, resp.status]
  }
  
  async makeRequestToField<T extends keyof RequestTargetTypesMap,
                           K extends keyof RequestTargetTypesMap[T]> 
                          (target: T | RequestTarget,
                           field: K | string,
                           id: number): Promise<[RequestTargetTypesMap[T][K], number]> {
    const [res, status] = await this.makeRequest(RequestMethod.GET, target, `${id}/${field.toString()}`)
    return [res as RequestTargetTypesMap[T][K], status]
  }

  async makeAuthorization(username: string, password: string): Promise<[RequestTargetTypesMap['auth/token/login'], number]> {
    const [resp, code] = await this.makeRequest(
      RequestMethod.POST,
      RequestTarget.LOGIN,
      '',
      JSON.stringify({'username': username, 'password': password}),
      {},
      false
    )

    const token = resp.auth_token
    this.global.apiToken = token
    this.global.accountData['username'] = username

    this.global.commit()

    console.log(this.global.apiToken)
    return [resp, code]
  }

  async createAccount(username: string, password: string, makeAuthorization = true): Promise<[RequestTargetTypesMap['auth/users'], number]> {
    const respRef = new ResponseRef()

    const [resp, code] = await this.makeRequest(
      RequestMethod.POST,
      RequestTarget.REG,
      '',
      JSON.stringify({'username': username, 'password': password}),
      {},
      false,
      respRef
    )

    if (makeAuthorization && respRef.response?.ok) {
      this.makeAuthorization(username, password)
    }

    return [resp, code]
  }
}
