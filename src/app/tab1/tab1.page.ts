import { Component } from '@angular/core';

import { ApiService, RequestMethod, RequestTarget } from '../api.service';
import { LanguageService } from '../language.service';
import { ShopData } from '../target.types';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  public data!: ShopData[]

  public readyPromise!: Promise<[any, number]>
  public isLoadingFailed = false

  constructor(public api: ApiService, public lang: LanguageService) {}

  ngOnInit() {
    this.readyPromise = this.api.makeRequest(RequestMethod.GET, RequestTarget.SHOPDATA)
    this.readyPromise.then(([data, status]) => {
      this.data = data
    }, () => {
      this.isLoadingFailed = true
    })
  }
}
