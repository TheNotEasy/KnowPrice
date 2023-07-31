import { Component, ViewChild } from '@angular/core';

import { ApiService } from '../api.service';
import { LanguageService } from '../language.service';
import { ShopData } from '../target.types';
import { IonInput, IonModal } from '@ionic/angular';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  public data!: ShopData[]

  public readyPromise!: Promise<[any, number]>
  public isLoadingFailed = false

  public findChoices: string[];
  public findChoicesIcons: string[];
  currentChoice: number = 0;

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

  addTag() {
    this.tagsList.push(this.tagInput.value as any);
    this.tagInput.value = '';
  }

  search() {
    this.isLoadingFailed = false;
    
  }
}
