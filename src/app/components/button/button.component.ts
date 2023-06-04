import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NavListItem } from 'src/app/tab3/tab3.page';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
})
export class ButtonComponent implements OnInit {
  @Input() navItem!: NavListItem

  @ViewChild('right') iconRight!: {'el': HTMLIonIconElement}
  @ViewChild('button') button!: {'nativeElement': HTMLElement}

  public clicked = true

  constructor() { }

  ngOnInit() {}

  onClick() {
    if (!this.navItem.hasDropMenu) {
      return
    }
    if (this.clicked) 
      this.iconRight.el.classList.remove('rotated')
    else 
      this.iconRight.el.classList.add('rotated')
    this.clicked = !this.clicked
  }

  ngAfterViewInit() {
    this.button.nativeElement.addEventListener('click', () => {
      this.onClick()
    })
  }
}
