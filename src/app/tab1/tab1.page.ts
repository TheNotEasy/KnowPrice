import { Component } from '@angular/core';

import { ApiService, RequestMethod, RequestTarget } from '../api.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  public data!: Array<{id: number, 'name': string, 'ratings': string}>

  public readyPromise!: Promise<any>

  constructor(public api: ApiService) {}

  ngOnInit() {
    this.readyPromise = this.api.makeRequest(RequestMethod.GET, RequestTarget.SHOP)
    this.readyPromise.then((data) => {
      this.data = data
    })
  }
}
