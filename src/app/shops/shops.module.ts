import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ShopsPageRoutingModule } from './shops-routing.module';

import { ShopsPage } from './shops.page';
import { ItemComponent } from '../components/item/item.component';
import { ItemComponentSharedModule } from '../shared/item.shared.module';
import { ErrorComponentSharedModule } from '../shared/error.shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ShopsPageRoutingModule,
    ItemComponentSharedModule,
    ErrorComponentSharedModule,
  ],
  declarations: [
    ShopsPage,
  ]
})
export class ShopsPageModule {
}
