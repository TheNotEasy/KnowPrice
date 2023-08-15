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

  public isLoadingFailed = false

  constructor(
    private activatedRoute: ActivatedRoute,
    private global: GlobalService,
    private api: ApiService,
    private cart: CartService,
  ) {}

  ngOnInit() {
    const rawId = (this.activatedRoute.snapshot.paramMap.get('id') as string)
    this.readyPromise = this.api.makeRequest(
      RequestMethod.GET, RequestTarget.ITEM, {extraUrl: rawId, doRaise: true}
    )
    this.readyPromise.then((resp) => {
      this.data = resp.data
      this.inCart = this.cart.includes(this.data.id)
    }, () => {this.isLoadingFailed = true})
  }

  renderMD() {
    this.data.markdown = marked.parse(this.data.markdown)
  }

  addToCart() {
    if (!this.inCart) {
      this.cart.addItem(new ItemClass(this.data.id, this.data.name, this.data.image, this.data.imageAlt, this.data.price, this.data.shop))
    }
    if (this.inCart) {
      this.cart.removeItem(this.cart.cartList.indexOf(this.data.id))
    }
  }
}
