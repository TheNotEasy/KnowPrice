import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CityPickerPageRoutingModule } from './city-picker-routing.module';

import { CityPickerPage } from './city-picker.page';
import { SearchbarComponentSharedModule } from '../shared/searchbar.shared.module';
import { LoadableDirectiveSharedModule } from '../shared/loadable.shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CityPickerPageRoutingModule,
    SearchbarComponentSharedModule,
    LoadableDirectiveSharedModule,
  ],
  declarations: [CityPickerPage]
})
export class CityPickerPageModule {}
