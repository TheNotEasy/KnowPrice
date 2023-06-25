import { Injectable } from '@angular/core';
import { ItemClass } from './components/item/item.component';
import { Storage } from '@ionic/storage-angular';


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
  public markedCartList: Array<number> = []
  public cartList: number[] = []

  public cachedItems: Record<number, ItemClass> = {}
  public cache: Record<any, any> = {}

  public apiToken: string | undefined = undefined;
  public accountData: Record<string, string | null> = {'username': null}

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

  commit() {
    for (const key of this.keysList) {
      this.storage.set(key, this[key])
    }
  }

  [key: string]: any
}
