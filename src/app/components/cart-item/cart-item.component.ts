import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { CheckboxCustomEvent } from '@ionic/angular';
import { GlobalService } from 'src/app/global.service';
import { ItemData } from 'src/app/target.types';

@Component({
  selector: 'app-cart-item',
  templateUrl: './cart-item.component.html',
  styleUrls: ['./cart-item.component.scss'],
})
export class CartItemComponent implements OnInit {
  @Input() item!: ItemData
  @Input() deleteModeTriggered!: boolean

  constructor(public global: GlobalService) { }

  ngOnInit() {}

  onMark(id: number, event: CheckboxCustomEvent) {
    if (event.detail.checked) {
      this.global.markedCartList.push(id)
    }
    else {
      this.global.markedCartList.splice(
        this.global.markedCartList.indexOf(id),
        1
      )
    }
      
    this.global.commit()
  }

  test(event: any) {
    console.log(event)
  }

}
