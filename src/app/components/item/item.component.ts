import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { CheckboxCustomEvent, IonCheckbox, IonItem } from '@ionic/angular';
import { CartService } from 'src/app/cart.service';
import { GlobalService } from 'src/app/global.service';
import { LanguageService } from 'src/app/language.service';

export class ItemClass {
  constructor(
    public id: number,
    public name: string, 
    public image: string, 
    public imageAlt: string,
    public price: number,
    public shop: {
      id: number,
      name: string
    }) {}
}

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss'],
})
export class ItemComponent {
  @Input() id: number = 0;
  @Input() name: string = '';
  @Input() image: string = '';
  @Input() imageAlt: string = '';
  @Input() price: number = 0;
  @Input() category: number = 0;
  @Input() buttonIcon: string = '';
  @Input() shop: {id: number, name: string} = {id: 0, name: ''};
  @Input() sale: number = 0;
  @Input() inStock: boolean = true;

  @ViewChild('card')
  element!: IonItem & {el: HTMLIonItemElement};

  cardButton!: HTMLIonButtonElement | null;
  icons!: NodeListOf<HTMLIonIconElement> | undefined;

  @ViewChild('checkbox')
  checkbox!: IonCheckbox

  inCartAlready!: boolean
  
  constructor(public global: GlobalService, public lang: LanguageService, public cart: CartService) { }

  ngAfterViewInit() {
    this.inCartAlready = this.global.cartList.includes(this.id)
    console.log(this)
  }

  onClick(event: CheckboxCustomEvent) {
    if (event.detail.checked) {
      this.cart.addItem(
        new ItemClass(this.id, this.name, this.image, this.imageAlt, this.price, this.shop)
      )
    } else {
      this.cart.removeItem(this.id)
    }
    
    this.global.commit()
  }
}
