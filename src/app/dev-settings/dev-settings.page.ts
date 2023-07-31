import { Component, OnInit, ViewChild } from '@angular/core';
import { IonInput } from '@ionic/angular';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-dev-settings',
  templateUrl: './dev-settings.page.html',
  styleUrls: ['./dev-settings.page.scss'],
})
export class DevSettingsPage implements OnInit {
  @ViewChild('apiInput') apiInput!: IonInput

  constructor(public api: ApiService) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.apiInput.ionChange.subscribe(value => {
      if (!value.detail.value) return;
      this.api.apiHost = value.detail.value;
      this.api.updateApiUrls();
    })
  }
}
