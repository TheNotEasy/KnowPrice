import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../global.service';
import { ApiService, RequestMethod, RequestTarget } from '../api.service';
import { marked } from 'marked';
import { Item } from '../target.types';
import { ItemClass } from '../components/item/item.component';
import { CartService } from '../cart.service';

@Component({
  selector: 'app-item',
  templateUrl: './item.page.html',
  styleUrls: ['./item.page.scss']})
export class ItemPage implements OnInit {
  readyPromise!: Promise<any>
  data!: Item;
  inCart: boolean = false

  id!: string

  public isLoadingFailed = false

  constructor(
    private activatedRoute: ActivatedRoute,
    private global: GlobalService,
    private api: ApiService,
    private cart: CartService,
  ) {}

  ngOnInit() {
    this.id = this.activatedRoute.snapshot.paramMap.get('id') as string
    this.readyPromise.then((resp) => {
      this.data = resp.data
      this.inCart = this.cart.includes(this.data.id)
    }, () => {this.isLoadingFailed = true})
  }

  renderMD() {
    this.data.markdown = marked.parse(this.data.markdown)
  }

  private async _load() {
    await this.api.makeRequest(
      RequestMethod.GET, RequestTarget.ITEM, {extraUrl: this.id, doRaise: true}
    )
  }

  cartAction() {
    if (!this.inCart) {
      this.cart.addItem(new ItemClass(this.data.id, this.data.name, this.data.image, this.data.imageAlt, this.data.price, this.data.shop))
    } else {
      this.cart.removeItem(this.cart.cartList.indexOf(this.data.id))
    }
    this.inCart = !this.inCart
  }
}
