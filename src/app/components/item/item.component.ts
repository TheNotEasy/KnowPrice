import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ApiService, RequestMethod, RequestTarget } from 'src/app/api.service';
import { GlobalService } from 'src/app/global.service';
import { LanguageService } from 'src/app/language.service';

export class Item {
  constructor(public id: number, public name: string, public image: string, public imageAlt: string, public price: number, public shopId: number) {}
}

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss'],
})
export class ItemComponent implements OnInit {
  @Input() id: number = 0;
  @Input() name: string = '';
  @Input() image: string = '';
  @Input() imageAlt: string = '';
  @Input() price: number = 0;
  @Input() shopId: number = 0;
  @Input() category: number = 0;
  @Input() buttonIcon: string = '';
  @Input() showShop: boolean = false;

  @ViewChild('card')
  element!: {"nativeElement": HTMLElement};

  cardButton!: HTMLIonButtonElement | null;
  icons!: NodeListOf<HTMLIonIconElement> | undefined;

  private clicked: boolean = false
  
  private originalEl!: {"innerHTML": any, "backgroundColor": any, "transitionDuration": any};
  
  constructor(public global: GlobalService, public lang: LanguageService) { }

  ngOnInit() {
    this.clicked = this.global.cartList.includes(this.id)
  }

  ngAfterViewInit() {
    this.cardButton = this.element.nativeElement.querySelector('ion-button')

    this.originalEl = {"innerHTML": this.element.nativeElement.innerHTML,
                       "backgroundColor": this.element.nativeElement.style.backgroundColor,
                       "transitionDuration": this.element.nativeElement.style.transitionDuration}
    
    this.icons = this.cardButton?.querySelectorAll('ion-icon')

    this.updateView()

    console.log('asd')
  }

  updateView() {
    if (this.buttonIcon) {
      if (!this.clicked)
        this.element.nativeElement.remove()
      return
    }

    if (this.icons === undefined) {throw Error("icons list is undefined")}
    this.icons[0].hidden = this.clicked
    this.icons[1].hidden = !this.clicked
  }

  onClick() {
    if (!this.clicked) {
      this.global.cartList.push(this.id)
      this.global.cachedItems[this.id] = new Item(this.id, this.name, this.image, this.imageAlt, this.price, this.shopId)
    } else {
      this.global.cartList.splice(this.global.cartList.indexOf(this.id), 1)
    }

    this.clicked = !this.clicked
    this.global.commit()

    this.updateView()
  }
}
