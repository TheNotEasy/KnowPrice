import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ShopsPageRoutingModule } from './shops-routing.module';

import { ShopsPage } from './shops.page';
import { ItemComponentSharedModule } from '../shared/item.shared.module';
import { ErrorComponentSharedModule } from '../shared/error.shared.module';
import { LoadableDirectiveSharedModule } from '../shared/loadable.shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ShopsPageRoutingModule,
    ItemComponentSharedModule,
    ErrorComponentSharedModule,
    LoadableDirectiveSharedModule,
  ],
  declarations: [
    ShopsPage,
  ]
})
export class ShopsPageModule {
}
