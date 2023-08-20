import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-account-banner',
  templateUrl: './account-banner.component.html',
  styleUrls: ['./account-banner.component.scss'],
})
export class AccountBannerComponent implements OnInit {
  @Input() username!: string
  @Input() name!: string
  @Input() surname!: string
  @Input() rating: number = 0  // maybe when we add delivery?

  constructor() { }

  ngOnInit() {}

}
