import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { ItemComponent } from '../item/item.component';

@Component({
  selector: 'app-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.scss'],
})
export class ItemListComponent implements OnInit {
  @ViewChild('dynamic', { read: ViewContainerRef }) private viewRef: ViewContainerRef | undefined

  constructor() { }

  ngOnInit() {}

  ngAfterViewInit() {
    console.log('asd')
    if (this.viewRef == undefined) {
      return
    }

    this.viewRef.clear();
    this.viewRef.createComponent(ItemComponent)
  }
}
