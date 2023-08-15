import { Injectable } from '@angular/core';
import { ItemClass } from './components/item/item.component';
import { Storage } from '@ionic/storage-angular';
import { ApiResponse } from './target.types';


class CartList extends Array {
  markedCartList: number[]

  constructor(markedCartList: number[], array?: number[]) {
    super();
    this.markedCartList = markedCartList
    if (array) {
      this.concat(this, array)
    }
  }

  override splice(start: number, deleteCount?: number | undefined): any[];
  override splice(start: number, deleteCount: number, ...items: any[]): any[] {
    const id = this[start];
    const result = super.splice(start, deleteCount, deleteCount, ...items);
    this.markedCartList.splice(
      this.markedCartList.indexOf(id), 1
    )
    console.log(this.markedCartList)
    return result
  }
}


@Injectable({
  providedIn: 'root'
})
export class GlobalService {
  public markedCartList: number[] = []
  public cartList: number[] = []
  public cachedShops: Record<number, string> = {}

  public cachedItems: Record<number, ItemClass> = {}
  public cache: Record<string, any> = {}
  public cachedShopsName: Record<number, string> = {}

  public apiToken: string | undefined = undefined;
  public accountData: Record<string, string | null> = {'username': null}
  public apiHost: string = 'http://127.0.0.1:8000';

  private keysList: Array<string>
  public readyPromise: Promise<void>

  constructor(private storage: Storage) {
    this.keysList = Object.getOwnPropertyNames(this)
    this.keysList.splice(0, 1);  // remove 'storage' property

    this.readyPromise = this.init()
  }

  private async init() {
    this.storage = await this.storage.create()

    for (const key of this.keysList) {
      if (key === 'cache') {continue}

      const data = await this.storage.get(key)

      if (data === null) {continue}
      this[key] = data
    }
  }

  async commit() {
    for (const key of this.keysList) {
      if (key == 'cache') continue;

      await this.storage.set(key, this[key])
    }
  }

  [key: string]: any
}
