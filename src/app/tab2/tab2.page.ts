import { ChangeDetectorRef, Component } from '@angular/core';
import { GlobalService } from '../global.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  items: Array<any> = []

  constructor(public global: GlobalService, public cdr: ChangeDetectorRef) {
    this.updateItems()
  }

  updateItems() {
    this.items = []
    for (let key of this.global.cartList) {
      let value = this.global.cachedItems[key];
      this.items.push(value)
    }
  }

  ionViewWillEnter() {
    this.updateItems()
  }
}
