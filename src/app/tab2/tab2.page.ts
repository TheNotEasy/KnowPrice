import { Component, ElementRef, ViewChildren } from '@angular/core';
import { GlobalService } from '../global.service';
import { ApiService, RequestMethod, RequestTarget } from '../api.service';
import { CartService } from '../cart.service';
import { Item } from '../target.types';
import { Router } from '@angular/router';
import { AlertController, CheckboxCustomEvent, GestureController, IonCheckbox, IonLabel } from '@ionic/angular';


@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  items: Record<string, Item[]> = {}

  readyPromise: Promise<any> | undefined
  isLoadingFailed = false

  _deleteModeTriggered = false

  get deleteModeTriggered() {
    return this._deleteModeTriggered
  }

  set deleteModeTriggered(value) {
    this._deleteModeTriggered = value
    if (!value)
      this.deleteCheckboxSelected = []
  }

  timeoutHandler: NodeJS.Timeout | null = null

  deleteCheckboxSelected: number[] = []

  updateItemsCallback = () => {this.updateItems()}

  @ViewChildren("item", { read: ElementRef }) nativeItems!: ElementRef<HTMLIonItemElement>[];
  @ViewChildren("deleteCheckbox", { read: ElementRef }) deleteCheckboxes!: ElementRef<HTMLIonCheckboxElement>[];

  constructor(
    public global: GlobalService,
    public api: ApiService,
    public router: Router,
    public cart: CartService,
    private alertController: AlertController
  ) {
    cart.addEventListener('changed', this.updateItemsCallback)
  }

  getItemGroup(shop: string) {
    const group = this.items[shop]
    if (group === undefined) {
      this.items[shop] = []
      return this.items[shop]
    }
    return group
  }

  private async _updateItems() {
    console.log("Updating cart view")
    await this.global.readyPromise

    this.items = {}

    for (const key of this.cart.cartList) {
      const cache = this.global.cachedItems[key]
      let value: Item;
      if (cache === undefined) {
        value = (await this.api.makeRequest(
          RequestMethod.GET, RequestTarget.ITEM, {doRaise: true, extraUrl: key.toString()})).data
        this.global.cachedItems[key] = value
        this.global.commit()
      } else {
        value = cache as Item
      }
      this.getItemGroup(value.shop.name).push(value)
    }

    return true
  }

  updateItems() {
    const readyPromise = this._updateItems()
    if (!this.readyPromise) {
      this.readyPromise = readyPromise
    }
  }

  getItemPriceSum() {
    let sum = 0;
    for (const items of Object.values(this.items)) {
      for (const item of items) {
        sum += item.price
      }
    }
    
    return sum;
  }

  ngOnInit() {
    this.updateItems()
  }

  onMark(id: number) {
    if (!this.deleteModeTriggered) return
    let index = this.deleteCheckboxSelected.indexOf(id)
    if (index === -1) {
      this.deleteCheckboxSelected.push(id)
    } else {
      this.deleteCheckboxSelected.splice(id, 1)
    }
  }

  holdCount(){
    this.timeoutHandler = setTimeout(() => {
      console.log("Holded")
      this.deleteModeTriggered = true
      this.timeoutHandler = null
    }, 1000);
  }

  endCount(id: number){
    if (this.timeoutHandler) {
      clearTimeout(this.timeoutHandler);
      this.timeoutHandler = null;

      this.router.navigate(['items', id])
    }
  }

  onTap(id: number) {
    console.log("ASD1")
    if (!this.deleteModeTriggered)
      this.router.navigate(['items', id])
    else {
      const index = this.deleteCheckboxSelected.indexOf(id)
      if (index !== -1)
        this.deleteCheckboxSelected.splice(index, 1)
      else
        this.deleteCheckboxSelected.push(id)
    }
  }

  async delete(items: Item[] | number[], onDismiss?: () => any) {
    const alert = await this.alertController.create({
      header: 'Вы уверены?',
      message: `Вы точно хотите удалить (${items.length}) товары`,
      buttons: [
        {
          text: 'Нет',
          role: 'cancel',
        },
        {
          text: 'Да',
          role: 'destructive',
          handler: () => {
            items.forEach((item) => {
              if (typeof item === 'number')
                this.cart.removeItem(item)
              else
                this.cart.removeItem(item.id)
            })
          }
        }
      ],
      
    });
    
    await alert.present()
    if (onDismiss) {
      await alert.onWillDismiss()
      onDismiss()
    } 
  }

  async deleteAll() {
    let items: Item[] = []
    for (const value of Object.values(this.items)) {
      items = [...items, ...value]
    }
    await this.delete(items)
  }

  async deleteSelected() {
    await this.delete(this.deleteCheckboxSelected, () => {this.deleteModeTriggered = false})
  }
}
