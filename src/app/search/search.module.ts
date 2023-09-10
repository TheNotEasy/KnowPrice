import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SearchPageRoutingModule } from './search-routing.module';

import { SearchPage } from './search.page';
import { ItemComponentSharedModule } from '../shared/item.shared.module';
import { LoadableDirectiveSharedModule } from '../shared/loadable.shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SearchPageRoutingModule,
    ItemComponentSharedModule,
    LoadableDirectiveSharedModule,
  ],
  declarations: [SearchPage]
})
export class SearchPageModule {}
