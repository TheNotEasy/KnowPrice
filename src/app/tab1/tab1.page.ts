import { Component, ViewChild } from '@angular/core';

import { ApiService, RequestMethod, RequestTarget } from '../api.service';
import { LanguageService } from '../language.service';
import { Item, ShopData } from '../target.types';
import { IonInput, IonModal } from '@ionic/angular';

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

  public searchCallback: () => any = () => {this.search()}

  public tagsList: string[] = [];

  public Range = (x: number) => {return Array.from(Array(x).keys())};

  @ViewChild("tagInput")
  tagInput!: IonInput;

  constructor(public api: ApiService, public lang: LanguageService) {
    this.findChoices = [
      lang.getString(lang.itemsText),
      lang.getString(lang.shopsText),
    ]

    this.findChoicesIcons = [
      'cart',
      'storefront',
    ]
  }

  ngOnInit() {
    
  }

  addTag(input: IonInput) {
    if (input.value === '') {
      return
    }

    this.tagsList.push(this.tagInput.value as any);
    this.tagInput.value = '';
  }

  async search() {
    this.isLoadingFailed = false;
    this.searchResults = [];

    const promises: Promise<any>[] = [];
    for (const tagIndex of this.Range(this.tagsList.length)) {
      let promise = this.api.makeRequest(RequestMethod.POST, RequestTarget.SEARCH, {
        extraUrl: `${['item', 'shop'][this.currentChoice]}`,
        doRaise: true,
        body: {"tag": this.tagsList[tagIndex]}
      });
      promises.push(promise)
      promise.then((response) => {
        this.searchResults.push(response.data as Item[])
      })
    }
    this.readyPromise = Promise.all(promises)
    this.readyPromise.then(() => {
      console.log(this.searchResults)
    })
  }
}
