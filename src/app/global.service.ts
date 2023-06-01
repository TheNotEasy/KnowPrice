import { Injectable } from '@angular/core';
import { ItemComponent } from './components/item/item.component';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {
  public cartList: Array<ItemComponent> = []

  private keysList: Array<string>

  constructor(private storage: Storage) {
    this.keysList = Object.getOwnPropertyNames(this)
    this.keysList.splice(0, 1)  // remove 'storage' property

    this.init()
  }

  private async init() {
    this.storage = await this.storage.create()

    for (const key of this.keysList) {
      this[key] = await this.storage.get(key)
    }
  }

  commit() {
    for (const key of this.keysList) {
      this.storage.set(key, this[key])
    }
  }

  [key: string]: any
}
