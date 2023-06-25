import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../global.service';
import { ApiService, RequestMethod, RequestTarget } from '../api.service';
import { marked } from 'marked';
import { Item } from '../target.types';
import { ItemClass } from '../components/item/item.component';

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
    private api: ApiService
  ) {}

  ngOnInit() {
    const rawId = (this.activatedRoute.snapshot.paramMap.get('id') as string)
    this.readyPromise = this.api.makeRequest(
      RequestMethod.GET, RequestTarget.ITEM, rawId
    )
    this.readyPromise.then(([resp, status]) => {
      this.data = resp
      this.inCart = this.global.cartList.includes(this.data.id)
    }, () => {this.isLoadingFailed = true})
  }

  renderMD() {
    this.data.markdown = marked.parse(this.data.markdown)
  }

  addToCart() {
    if (!this.inCart) {
      this.global.cartList.push(this.data.id)
      this.global.cachedItems[this.data.id] = new ItemClass(this.data.id, this.data.name, this.data.image, this.data.imageAlt, this.data.price, this.data.shopId)
    }
    if (this.inCart) {
      this.global.cartList.splice(this.global.cartList.indexOf(this.data.id), 1)
    }

    this.global.commit()
  }
}
