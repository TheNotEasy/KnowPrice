import { Component, Input, OnInit, Type, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
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
  public types = {
    NavListItem: NavListItem,
    NavListModalItem: NavListModalItem
  }

  constructor(private router: Router) { }

  ngOnInit() {}

  onClick() {
    if (this.clicked) {
      this.clicked = false
    } else {
      this.clicked = true
    }

    if (this.navItem.redirectTo && !this.navItem.hasModal) {
      this.router.navigate([this.navItem.redirectTo])
    }

    setTimeout(() => {
      if (this.navItem.callback !== null) 
        this.navItem.callback(this.clicked)
    }, 100)
  }

  ngAfterViewInit() {
    if (this.navItem.hasModal)
      (this.navItem as NavListModalItem).modal.native = this.modal
  }

  getNavItem(): NavListModalItem {
    if (!this.navItem.hasModal) {
      throw TypeError("Trying to access navItem without modal window via getNavItem() method")
    }
    return (this.navItem as NavListModalItem)
  }
}
