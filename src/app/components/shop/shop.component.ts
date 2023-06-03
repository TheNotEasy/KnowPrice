import { Component, Input, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss'],
})
export class ShopComponent implements OnInit {
  @Input() name: string = '';
  @Input() rating: string = '';

  @ViewChild('main') private main!: {'nativeElement': HTMLElement}

  constructor() { }

  ngOnInit() {}
  ngAfterViewInit() {
    setTimeout(() => {
      const barFill: HTMLElement | null = this.main.nativeElement.querySelector('.shop__rating-bar-fill')
      if (barFill === null) {return}
      barFill.style.width = `calc(100% / 5 * ${this.rating})`
    }, 100)
  }
}
