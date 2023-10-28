import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ApiService, RequestMethod, RequestTarget } from 'src/app/api.service';
import { GlobalService } from 'src/app/global.service';
import { Item, Shop, ShopData } from 'src/app/target.types';

export enum LentaType {
  CITY = 0
}

@Component({
  selector: 'app-lenta',
  templateUrl: './lenta.component.html',
  styleUrls: ['./lenta.component.scss'],
})
export class LentaComponent {
  @Input() shops!: ShopData[]
  @Input() title!: string
  @Input() type!: LentaType
  @Input() readyPromise!: Promise<any>

  @Output() callback = new EventEmitter();

  constructor(private api: ApiService, public global: GlobalService) { }
}
