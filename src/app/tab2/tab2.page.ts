import { Component } from '@angular/core';
import { GlobalService } from '../global.service';
import { ApiService, RequestMethod, RequestTarget } from '../api.service';
import { CheckboxCustomEvent } from '@ionic/angular';
import { ItemClass } from '../components/item/item.component';
import { CartService } from '../cart.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  items: Record<number, any[]> = {}
  shops: Record<number, string> = {}

  promises: Promise<any>[] = []
  readyPromise!: Promise<any>

  changed: boolean = true

  constructor(
    public global: GlobalService,
    public api: ApiService,
    cart: CartService) {
    cart.addEventListener('changed', () => {this.onCartChange()})
  }

  private onCartChange() {
    this.changed = true
  }
  
  private getShopGroup(shop: number) {
    const shopGroup = this.items[shop]
    if (shopGroup === undefined)
      this.items[shop] = []
    return this.items[shop]
  }

  private async loadShopName(item: number) {
    const promise = this.api.makeRequestToField(
      RequestTarget.SHOP, 'name', item
    )
    promise.then(([res, status]) => {
      this.shops[item] = res
    })
    this.promises.push(promise)
  }

  updateItems() {
    if (!this.changed) {
      return
    }
    this.changed = false

    this.items = {}
    for (let key of this.global.cartList) {
      let value = this.global.cachedItems[key];
      if (value === undefined) {
        this.api.makeRequest(
          RequestMethod.GET, RequestTarget.ITEM, key.toString()
        ).then(([resp, status]) => {
          const shop = this.getShopGroup(resp.shop)
          shop.push(resp)
          this.loadShopName(key)
          this.global.cachedItems[key] = new ItemClass(
            resp.id, resp.name, resp.image, resp.imageAlt, resp.price, resp.shop
          )
        })
      } else {
        const shop = this.getShopGroup(value.shopId)
        shop.push(value)
      }
    }
    this.readyPromise = Promise.all(this.promises)

    
  }

  ionViewWillEnter() {
    this.updateItems()
  }

  checkboxClick(e: CheckboxCustomEvent, id: number) {
    if (e.detail.checked)
      this.global.markedCartList.push(id)
    else
      this.global.markedCartList.splice(
        this.global.markedCartList.indexOf(id), 1
      )
    this.global.commit()
  }
}
