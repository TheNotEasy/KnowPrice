import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { GlobalService } from 'src/app/global.service';
import { LanguageService } from 'src/app/language.service';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss'],
})
export class ItemComponent implements OnInit {

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
    this.clicked = this.global.cartList.includes(this)
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
    this.global.cartList.push(this)
  }
}
