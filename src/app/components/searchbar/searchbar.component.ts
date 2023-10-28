import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { IonInput } from '@ionic/angular';

@Component({
  selector: 'app-searchbar',
  templateUrl: './searchbar.component.html',
  styleUrls: ['./searchbar.component.scss'],
})
export class SearchbarComponent implements OnInit {
  @Output() onEnter = new EventEmitter();
  @Output() onChange = new EventEmitter();

  @ViewChild('searchbar') searchbar!: IonInput

  get value() {
    return this.searchbar.value as string
  }

  set value(val: string) {
    this.searchbar.value = val;
  }

  constructor() { }

  ngOnInit() {}

}
