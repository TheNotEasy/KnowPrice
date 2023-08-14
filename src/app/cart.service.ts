import { Injectable } from '@angular/core';
import { GlobalService } from './global.service';
import { ItemClass } from './components/item/item.component';

interface Events {
  add: ItemClass,
  remove: number,
  changed: number
}


@Injectable({
  providedIn: 'root'
})
export class CartService {
  public cartList: number[]
  private markedCartList: number[]

  private onAddEventListeners: ((item: ItemClass) => void)[] = []
  private onRemoveEventListeners: ((item: number) => void)[] = []
  private onChangeEventListeners: ((item: Events[keyof Events]) => void)[] = []

  constructor(private global: GlobalService) { 
    this.cartList = global.cartList
    this.markedCartList = global.markedCartList
  }

  addEventListener(event: keyof Events, callback: (item: Events[keyof Events]) => void) {
    if (event === 'add') {
      this.onAddEventListeners.push(callback)
    } else if (event === 'remove') {
      this.onRemoveEventListeners.push(callback)
    } else if (event === 'changed') {
      this.onChangeEventListeners.push(callback)
    }
  }

  private serveEventListeners<T>(eventListeners: ((item: T) => void)[], argument: T) {
    eventListeners.forEach((callback) => {
      callback(argument)
    })
  }

  // async functions, cuz serving listeners take some time

  async addItem(item: ItemClass) {
    if (!this.cartList.includes(item.id))
      this.cartList.push(item.id)
    this.global.cachedItems[item.id] = item

    await this.global.commit()

    this.serveEventListeners(this.onAddEventListeners, item)
    this.serveEventListeners(this.onChangeEventListeners, item)
  }

  async removeItem(item: number) {
    this.cartList.splice(this.cartList.indexOf(item), 1)
    delete this.global.cachedItems[item]

    if (this.markedCartList.includes(item)) this.markedCartList.splice(this.markedCartList.indexOf(item), 1)
    
    await this.global.commit()

    this.serveEventListeners(this.onRemoveEventListeners, item)
    this.serveEventListeners(this.onChangeEventListeners, item)
  }

  includes(id: number) {
    return this.global.cartList.includes(id)
  }
}
