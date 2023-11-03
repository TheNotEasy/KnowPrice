import { Component, ViewChild } from '@angular/core';

import { ApiService, RequestMethod, RequestTarget } from '../api.service';
import { LanguageService } from '../language.service';
import { Item, ShopData } from '../target.types';
import { IonInput, IonModal } from '@ionic/angular';
import { GlobalService } from '../global.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  public data!: ShopData[]

  public readyPromise!: Promise<any>
  public isLoadingFailed = false

  public findChoices: string[];
  public findChoicesIcons: string[];
  currentChoice: number = 0;
  public searchResults: Item[][] = [];

  public tagsList: string[] = [];

  public cityLentaShops: ShopData[] = [];

  public Range = (x: number) => {return Array.from(Array(x).keys())};

  @ViewChild("tagInput")
  tagInput!: IonInput;

  constructor(public api: ApiService, public lang: LanguageService, public global: GlobalService) {
    this.findChoices = [
      lang.getString(lang.itemsText),
      lang.getString(lang.shopsText),
    ]

    this.findChoicesIcons = [
      'cart',
      'storefront',
    ]
  }

  private async _load() {
    await this.global.readyPromise

    this.cityLentaShops = []

    if (!this.global.selectedCity) return

    const resp = await this.api.makeRequest(RequestMethod.GET, RequestTarget.CITY, {
      extraUrl: `?search=${this.global.selectedCity}`,
      doRaise: true
    })
    
    this.cityLentaShops = resp.data
  }

  load() {
    this.readyPromise = this._load();
  }

  ngOnInit() {
    this.load();
  }

  addTag(input: IonInput) {
    if (input.value === '') {
      return
    }

    this.tagsList.push(this.tagInput.value as any);
    this.tagInput.value = '';
  }
}
