import { Component } from '@angular/core';

import { ProductViewPage } from '../product-view/product-view.page';
import { ApiService, RequestMethod, RequestTarget } from '../api.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  public data!: Array<{'name': string, 'rating': string}>

  public readyPromise!: Promise<any>

  constructor(public api: ApiService) {}

  ngOnInit() {
    this.readyPromise = this.api.makeRequest(RequestMethod.GET, RequestTarget.SHOP)
    this.readyPromise.then((data) => {
      this.data = data
    })
  }
}
