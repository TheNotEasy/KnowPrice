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

  async makeRequest<K extends keyof RequestTargetTypesMap>
                   (type: RequestMethod, target: K | RequestTarget,
                    url: string = '',
                    body: Record<any, any> = {},
                    headers: Record<any, any> = {},
                    makeCache = true,
                    responseRef?: ResponseRef): Promise<[RequestTargetTypesMap[K], number]> {
    let finalUrl = `${this.apiUrl}/${target}/${url}`
    
    const cache = this.global.cache[finalUrl]
    if (cache !== undefined) {return cache}
    
    const finalHeaders: Record<string, string> = structuredClone(this.baseHeaders)
    if (this.global.apiToken)
      finalHeaders['Authorization'] = `Token ${this.global.apiToken}`
    
    if (type === RequestMethod.POST && body)
      finalHeaders['Content-Length'] = JSON.stringify(body).length.toString()
    
    for (const [key, value] of Object.entries(headers)) {
      finalHeaders[key] = value
    }

    const init: Record<string, any> = {method: type, headers: finalHeaders}
    if (type === RequestMethod.POST)
      init['body'] = JSON.stringify(body)
    
    const resp = await (await fetch(finalUrl, init))
    const result = await resp.json()
    if (responseRef) {
      responseRef.response = resp
    }

    if (makeCache)
      this.global.cache[finalUrl] = [result, resp.status]
    return [result, resp.status]
  }

  async makeAuthorization(username: string, password: string): Promise<[RequestTargetTypesMap['auth/token/login'], number]> {
    const [resp, code] = await this.makeRequest(
      RequestMethod.POST,
      RequestTarget.LOGIN,
      '',
      {'username': username, 'password': password},
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
      {'username': username, 'password': password},
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
