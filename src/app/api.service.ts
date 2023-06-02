import { Injectable } from '@angular/core';

export enum RequestMethod {
  GET = 'get',
  POST = 'post',
}
export enum RequestTarget { 
  ITEM = 'item',
  SHOP = 'shop',
  USER = 'user',
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'https://127.0.0.1:8000/api/v1'

  constructor() { }

  makeRequest(type: RequestMethod, target: RequestTarget) {
    let finalUrl = `${this.apiUrl}/${target}`
    
    fetch(finalUrl, {method: type})
  }
}
