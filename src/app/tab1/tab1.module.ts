import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tab1Page } from './tab1.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { Tab1PageRoutingModule } from './tab1-routing.module';
import { ShopComponent } from '../components/shop/shop.component';
import { ErrorComponentSharedModule } from '../shared/error.shared.module';
import { LoadableDirectiveSharedModule } from '../shared/loadable.shared.module';
import { ItemComponentSharedModule } from '../shared/item.shared.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    Tab1PageRoutingModule,
    ErrorComponentSharedModule,
    LoadableDirectiveSharedModule,
    ItemComponentSharedModule,
  ],
  declarations: [
    Tab1Page,
    ShopComponent
  ]
})
export class Tab1PageModule {}
