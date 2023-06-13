import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NavListItem, NavListModalItem } from 'src/app/tab3/tab3.page';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
})
export class ButtonComponent implements OnInit {
  @Input() navItem!: NavListItem | NavListModalItem

  @ViewChild('right') iconRight!: {'el': HTMLIonIconElement}
  @ViewChild('button') button!: {'nativeElement': HTMLElement}
  @ViewChild('modal') modal!: any

  public clicked = false

  constructor() { }

  ngOnInit() {}

  onClick() {
    if (!this.navItem.hasModal) {
      return
    }
    if (this.clicked) {
      this.clicked = false
    } else {
      this.clicked = true
    }

    setTimeout(() => {
      if (this.navItem.callback !== null) 
        this.navItem.callback(this.clicked)
    }, 100)
  }

  ngAfterViewInit() {
    if (!this.navItem.hasModal) {
      return
    }

    this.button.nativeElement.addEventListener('click', () => {
      this.onClick()
    });
    (this.navItem as NavListModalItem).modal.native = this.modal
  }
}
