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

  changed = true
  isLoadingFailed = false

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

  private loadShopName(item: number) {
    const promise = this.api.makeRequestToField(
      RequestTarget.SHOP, 'name', item
    )
    promise.then(([res, status]) => {
      this.shops[item] = res.result
    })
    this.promises.push(promise)
  }

  updateItems() {
    if (!this.changed) {
      return
    }
    console.log("Passed changed check")
    this.changed = false

    this.items = {}

    console.log("Going to parse next cart list...")
    console.log(this.global.cartList)

    if (this.global.cartList.length === 0) {
      debugger
    }
    for (let key of this.global.cartList) {
      let value = this.global.cachedItems[key];
      let shop = [];
      if (value === undefined) {
        const request = this.api.makeRequest(
          RequestMethod.GET, RequestTarget.ITEM, key.toString()
        )
        request.then(([resp, status]) => {
          shop = this.getShopGroup(resp.shopId)
          this.global.cachedItems[key] = new ItemClass(
            resp.id, resp.name, resp.image, resp.imageAlt, resp.price, resp.shopId
          )
          value = resp
        })
        request.catch(() => {
          this.isLoadingFailed = true
        })
      } else {
        shop = this.getShopGroup(value.shopId)
      }
      shop.push(value)
      this.loadShopName(key)
      console.log("Parsed item with id: " + key)
    }
    console.log("Parsed! Final look of items:")
    console.log(this.items)
    this.readyPromise = Promise.all(this.promises)
    this.readyPromise.catch(() => {
      this.isLoadingFailed = true
    })
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
