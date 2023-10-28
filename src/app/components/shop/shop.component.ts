import { Component, Input, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss'],
})
export class ShopComponent implements OnInit {
  @Input() name: string = '';
  @Input() rating: string = '';
  @Input() id: number = 0;

  constructor() { }

  ngOnInit() {}
}
