import { Injectable } from '@angular/core';
import { City, Item, ItemData, RequestTargetTypesMap, Shop, ShopData } from './target.types';
import { ApiService, RequestMethod as Method, RequestSettings, RequestTarget } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class QueryService {
  shop: ShopQuery;

  constructor(
    private api: ApiService,
  ) {
    this.shop = new ShopQuery(this.api)
  }
}

async function propertyOf<K, T extends keyof K>(promise: Promise<K>, prop: T): Promise<Awaited<K>[T]> {
  return (await promise)[prop];
}

function idToString({id}: {id: number}) {
  return { extraUrl: id.toString() }
}

type ValueOf<T> = T[keyof T];

export abstract class BaseQuery<T extends ValueOf<RequestTargetTypesMap>> {  // trust to typescript, no need to allowing methods in properties
  protected abstract target: RequestTarget;

  allowed = [
    Method.GET,
    Method.POST,
    Method.PUT,
    Method.DELETE,
    Method.PATCH
  ]

  listAllowed = true;
  searchAllowed = true;

  constructor(
    private api: ApiService
  ) {}

  protected request<Arg>(method: Method, optionsFn?: (params: Arg) => RequestSettings<true>, allowed?: boolean) {
    allowed = allowed === undefined ? this.allowed.includes(method) : allowed;

    return (params: Arg) => {
      if (!allowed) {
        throw new Error('Method not allowed');
      }

      const options: RequestSettings<true> = optionsFn ? optionsFn(params) : {};
      return propertyOf(this.api.makeRequest(
        method,
        this.target,
        options,
      ), 'data') as Promise<T>;
    }
  }

  public get = this.request(Method.GET, idToString);
  public search = this.request(Method.GET, (query: string) => ({ query: { search: query } }), this.searchAllowed);
  public list = this.request(Method.GET, undefined, this.listAllowed);
  public post = this.request(Method.POST);
  public put = this.request(Method.PUT);
  public delete = this.request(Method.DELETE);
  public patch = this.request(Method.PATCH);
}

export class ShopQuery extends BaseQuery<Shop> {
  target = RequestTarget.SHOP
}

export class ItemQuery extends BaseQuery<Item> {
  target = RequestTarget.ITEM
}

export class ShopDataQuery extends BaseQuery<ShopData> {
  target = RequestTarget.SHOPDATA

  override listAllowed = false
  override searchAllowed = false
}

export class ItemDataQuery extends BaseQuery<ItemData> {
  target = RequestTarget.ITEMDATA

  override listAllowed = false
  override searchAllowed = false
}

export class CityQuery extends BaseQuery<City[]> {
  target = RequestTarget.CITY

  override get = this.list
}
