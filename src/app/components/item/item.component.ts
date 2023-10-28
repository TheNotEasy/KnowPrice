import { Component, Input, OnInit, Output, ViewChild, EventEmitter, SimpleChanges } from '@angular/core';
import { CheckboxCustomEvent, IonCheckbox, IonItem } from '@ionic/angular';
import { CartService } from 'src/app/cart.service';
import { GlobalService } from 'src/app/global.service';
import { LanguageService } from 'src/app/language.service';
import { Item } from 'src/app/target.types';

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
  @Input() name!: string;
  @Input() image: string = '';
  @Input() imageAlt: string = '';
  @Input() price: number = 0;
  @Input() category: number = 0;
  @Input() buttonIcon: string = '';
  @Input() shop: {id: number, name: string} = {id: 0, name: ''};
  @Input() sale: number = 0;
  @Input() inStock: boolean = true;
  @Input() checked!: boolean;

  @Input() data!: Item;

  @Output() onChange = new EventEmitter();

  @ViewChild('card')
  element!: IonItem & {el: HTMLIonItemElement};

  cardButton!: HTMLIonButtonElement | null;
  icons!: NodeListOf<HTMLIonIconElement> | undefined;

  @ViewChild('checkbox')
  checkbox!: IonCheckbox
  
  constructor(public global: GlobalService, public lang: LanguageService, public cart: CartService) { 
    if (this.data) {
      Object.assign(this, this.data);  // FIXME: maybe XSS?
    }
  }
  
  onClick(event: CheckboxCustomEvent) {
    if (this.onChange.observed) {
      this.onChange.emit(event)
      return
    }
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
