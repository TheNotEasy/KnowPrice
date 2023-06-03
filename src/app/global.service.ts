import { Injectable } from '@angular/core';
import { Item } from './components/item/item.component';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {
  public cartList: Array<number> = []

  public cachedItems: Record<number, Item> = {}
  public cache: Record<any, any> = {}

  public apiToken: string | undefined;

  private keysList: Array<string>

  constructor(private storage: Storage) {
    this.keysList = Object.getOwnPropertyNames(this)
    this.keysList.splice(0, 1)  // remove 'storage' property

    this.init()
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

  commit() {
    for (const key of this.keysList) {
      this.storage.set(key, this[key])
    }
  }

  [key: string]: any
}
