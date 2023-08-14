import { Component } from '@angular/core';
import { GlobalService } from '../global.service';
import { ApiService, RequestMethod, RequestTarget } from '../api.service';
import { CheckboxCustomEvent, IonItem } from '@ionic/angular';
import { ItemClass } from '../components/item/item.component';
import { CartService } from '../cart.service';
import { Item } from '../target.types';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  items: Record<number, Item[]> = {}
  shops: Record<number, string> = {}

  promises: Promise<any>[] = []
  readyPromise!: Promise<any>

  changed = true
  isLoadingFailed = false

  timeoutHandler: NodeJS.Timeout | null = null

  constructor(
    public global: GlobalService,
    public api: ApiService,
    public router: Router,
    public cart: CartService) {
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
    promise.then((resp) => {
      if (!resp.success) {return}
      this.shops[item] = resp.data.result
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

    for (let key of this.global.cartList) {
      let value = this.global.cachedItems[key];
      let shop = [];
      if (value === undefined) {
        const request = this.api.makeRequest(
          RequestMethod.GET, RequestTarget.ITEM, {extraUrl: key.toString()}
        )
        request.then((resp) => {
          if (!resp.success) {return}
          shop = this.getShopGroup(resp.data.shopId)
          this.global.cachedItems[key] = new ItemClass(
            resp.data.id, resp.data.name, resp.data.image, resp.data.imageAlt, resp.data.price, resp.data.shopId
          )
          value = resp.data
          this.loadShopName(resp.data.shopId)
        })
        request.catch(() => {
          this.isLoadingFailed = true
        })
      } else {
        shop = this.getShopGroup(value.shopId)
      }
      shop.push(value)
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

  itemMouseUp(ionItem: IonItem, itemId: number) {
    console.log('asdup')

    console.log(ionItem)
    if (this.timeoutHandler) {
      clearTimeout(this.timeoutHandler);
      this.timeoutHandler = null;
      this.router.navigate(['items', itemId])
    }
  }

  itemMouseLeave(ionItem: {el: HTMLIonItemElement}, itemId: number) {
    ionItem.el.classList.remove('hovered-item')

    if (this.timeoutHandler) {
      clearTimeout(this.timeoutHandler);
      this.timeoutHandler = null;
      this.router.navigate(['items', itemId])
    }
  }

  itemMouseDown(ionItem: {el: HTMLIonItemElement}, itemId: number) {
    console.log('asddown')

    ionItem.el.classList.add('hovered-item')
    this.timeoutHandler = setTimeout(() => {
      this.cart.removeItem(itemId)
      this.timeoutHandler = null
      this.changed = true
      this.updateItems()
    }, 1500);
  }
}
