import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CheckboxCustomEvent, IonCheckbox, IonItemSliding } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { CartService } from 'src/app/cart.service';
import { GlobalService } from 'src/app/global.service';
import { ItemData } from 'src/app/target.types';

@Component({
  selector: 'app-cart-item',
  templateUrl: './cart-item.component.html',
  styleUrls: ['./cart-item.component.scss'],
})
export class CartItemComponent {
  @Input() item!: ItemData
  @Input() deleteModeTriggered!: boolean
  @Input() checkedInDeleteMode!: boolean

  @Output() onChange = new EventEmitter()

  public mainCheckboxChecked = new BehaviorSubject(false)

  @ViewChild(IonItemSliding) itemSliding!: IonItemSliding
  @ViewChild('checkbox') mainCheckbox: IonCheckbox | undefined

  constructor(
    public cart: CartService,
    private global: GlobalService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.updateMainChecked()
  }

  onMark(event: CheckboxCustomEvent) {
    this.onChange.emit(event)
    this.mainCheckboxChecked.next(event.detail.checked)

    if (this.deleteModeTriggered) return
    const index = this.global.markedCartList.indexOf(this.item.id)
    if (event.detail.checked) {
      if (index !== -1) return
      this.global.markedCartList.push(this.item.id)
    } else {
      this.global.markedCartList.splice(index, 1)
    }

    this.global.commit(["markedCartList"])
  }

  async onTouchEnd() {
    const ratio = await this.itemSliding.getSlidingRatio()

    if (ratio == 1) {
      this.router.navigate(['items', this.item.id])
      this.itemSliding.close()
    }
  }

  updateMainChecked() {
    this.mainCheckboxChecked.next(this.global.markedCartList.includes(this.item.id))
  }
}
