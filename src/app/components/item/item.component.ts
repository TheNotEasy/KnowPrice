import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { GlobalService } from 'src/app/global.service';
import { LanguageService } from 'src/app/language.service';

export class Item {
  constructor(id: number, name: string, image: string, imageAlt: string, price: number, shopId: number) {}
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

  @ViewChild('card')
  element!: {"nativeElement": HTMLElement};

  cardButton!: HTMLIonButtonElement | null;

  private clicked: boolean = false

  private originalEl!: {"innerHTML": any, "backgroundColor": any, "transitionDuration": any};
  
  constructor(public global: GlobalService, public lang: LanguageService) { }

  ngOnInit() {
    this.clicked = this.global.cartList.includes(1)
  }

  ngAfterViewInit() {
    this.cardButton = this.element.nativeElement.querySelector('ion-button')

    this.element.nativeElement.addEventListener("click", () => {
      this.onClick()
    })
    this.originalEl = {"innerHTML": this.element.nativeElement.innerHTML,
                       "backgroundColor": this.element.nativeElement.style.backgroundColor,
                       "transitionDuration": this.element.nativeElement.style.transitionDuration}
    
    const icons = this.cardButton?.querySelectorAll('ion-icon')
    if (icons === undefined) {throw Error("icons list is undefined")}
    icons[0].hidden = this.clicked
    icons[1].hidden = !this.clicked
  }

  onClick() {
    if (!this.clicked) {
      this.global.cartList.push(this.id)
    } else {
      this.global.cartList.splice(this.global.cartList.indexOf(this.id), 1)
    }

    this.global.commit()
  }
}
