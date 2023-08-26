import { Component, ElementRef, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CheckboxCustomEvent, IonCheckbox, IonItemSliding, ModalController } from '@ionic/angular';
import { BehaviorSubject, Subject } from 'rxjs';
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

  private _deleteModeTriggered!: boolean

  get deleteModeTriggered() {
    return this._deleteModeTriggered
  }
  @Input() set deleteModeTriggered(val) {
    this._deleteModeTriggered = val
    this.updateCheckbox(val)
  }
  @Input() checkedInDeleteMode!: boolean

  @Output() onChange = new EventEmitter()

  @ViewChild('itemSliding') itemSliding!: IonItemSliding
  @ViewChild(IonCheckbox) checkbox!: IonCheckbox

  onTouchEndAction: (() => void) | undefined

  public checked = new BehaviorSubject<boolean>(false)

  constructor(
    public global: GlobalService,
    private router: Router,
    public cart: CartService,
    public modalController: ModalController
  ) {}

  onMark(id: number, event: CheckboxCustomEvent) {
    this.onChange.emit()

    event.stopPropagation()
    event.preventDefault()

    if (this.deleteModeTriggered) return

    if (event.detail.checked) {
      if (this.global.markedCartList.includes(this.item.id)) return
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

  async onTouchEnd() {
    const ratio = await this.itemSliding.getSlidingRatio()

    if (ratio == 1) {
      this.router.navigate(['items', this.item.id])
      this.itemSliding.close()
    }
  }

  updateCheckbox(deleteModeTriggered = this.deleteModeTriggered) {
    this.checked.next((
      this.global.markedCartList.includes(this.item.id) && !deleteModeTriggered
    ) || (
      this.checkedInDeleteMode && deleteModeTriggered
    ))
  }
}
