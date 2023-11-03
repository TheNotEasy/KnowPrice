import { Component, ElementRef, NgIterable, OnInit, ViewChild, ViewChildren, ViewContainerRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ItemComponent } from '../components/item/item.component';
import { LanguageService } from '../language.service';
import { ApiService, RequestMethod, RequestTarget } from '../api.service';
import { QueryList } from '@angular/core';
import { ItemData, Shop } from '../target.types';

type Item = {
  "id": number,
  "name": string,
  "price": number,
}

type ResponseData = {
  "id": number,
  "name": string,
  "categories": Array<string>,
  "rating": number,
  "item_set": Array<{'id': number, 'name': string, 'price': number, 'category': number}>,
  'address': string,
}

@Component({
  selector: 'app-shops',
  templateUrl: './shops.page.html',
  styleUrls: ['./shops.page.scss'],
})

export class ShopsPage implements OnInit {
  public data!: Shop
  public id!: string
  public loaded = false

  public type = "category"

  public title: string = ""

  public readyPromise!: Promise<any>

  constructor(
    private activatedRoute: ActivatedRoute,
    public lang: LanguageService,
    public api: ApiService,
  ) {}

  @ViewChild('loading') public loadingEl!: {'nativeElement': HTMLElement}
  @ViewChild('content') public page!: ElementRef<HTMLElement>

  @ViewChildren(ItemComponent) public items!: QueryList<ItemComponent>

  ngOnInit() {
    this.id = this.activatedRoute.snapshot.paramMap.get('id') as string
    this.load()
  }

  load() {
    this.readyPromise = this._load()
  }

  private async _load() {
    const resp = await this.api.makeRequest(RequestMethod.GET, RequestTarget.SHOP, {
      extraUrl: this.id,
      doRaise: true,
    });
    this.data = resp.data;
    this.title = this.data.name;

    this.loaded = true;
    return true;
  }
}
