import { Component, ElementRef, ViewChildren } from '@angular/core';
import { GlobalService } from '../global.service';
import { ApiService, RequestMethod, RequestTarget } from '../api.service';
import { CartService } from '../cart.service';
import { Item } from '../target.types';
import { Router } from '@angular/router';


@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  items: Record<string, Item[]> = {}

  readyPromise!: Promise<any>
  isLoadingFailed = false

  @ViewChildren("item", { read: ElementRef }) nativeItems!: ElementRef<HTMLIonItemElement>;

  constructor(
    public global: GlobalService,
    public api: ApiService,
    public router: Router,
    public cart: CartService) {
    cart.addEventListener('changed', () => {this.updateItems()})
  }

  getItemGroup(shop: string) {
    const group = this.items[shop]
    if (group === undefined) {
      this.items[shop] = []
      return []
    }
    return group
  }

  async updateItems() {
    for (const key of this.cart.cartList) {
      const cache = this.global.cachedItems[key]
      let value: Item;
      if (cache === undefined) {
        value = (await this.api.makeRequest(
          RequestMethod.GET, RequestTarget.ITEM, {doRaise: true})).data
      } else {
        value = cache as Item
      }
      this.getItemGroup(value.shop.name).push(value)
    }
  }

  ionViewWillEnter() {
    this.updateItems()
  }

  getItemPriceSum() {
    let sum = 0;
    for (const items of Object.values(this.items)) {
      for (const item of items) {
        sum += item.price
      }
    }
  }
}
