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
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiHost = 'http://127.0.0.1:8000'
  private apiUrl = `${this.apiHost}/api/v1`
  private apiAuthUrl = `${this.apiHost}/auth/token`

  constructor(public global: GlobalService) { }

  async makeRequest<K extends keyof RequestTargetTypesMap>
                   (type: RequestMethod, target: K | RequestTarget, url: string = ''): Promise<RequestTargetTypesMap[K]> {
    let finalUrl = `${this.apiUrl}/${target}/${url}`
    
    const cache = this.global.cache[finalUrl]
    if (cache !== undefined) {return cache}
    
    const result = await (await fetch(finalUrl, {method: type})).json()
    this.global.cache[finalUrl] = result
    return result
  }

  async makeAuthorization(username: string, password: string) {
    const resp = await fetch(this.apiAuthUrl, {body: `{
      "username": ${username},
      "password": ${password},
    }`})
    const token = await resp.text()
    this.global.apiToken = token
  }
}
