import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tab1Page } from './tab1.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { Tab1PageRoutingModule } from './tab1-routing.module';
import { ErrorComponentSharedModule } from '../shared/error.shared.module';
import { LoadableDirectiveSharedModule } from '../shared/loadable.shared.module';
import { ItemComponentSharedModule } from '../shared/item.shared.module';
import { SearchbarComponentSharedModule } from '../shared/searchbar.shared.module';
import { LentaComponentSharedModule } from '../shared/lenta.shared.module';
import { ShardeModalDirectiveSharedModule } from '../shared/sharedmodal.shaded.module';

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
    SearchbarComponentSharedModule,
    LentaComponentSharedModule,
    ShardeModalDirectiveSharedModule,
  ],
  declarations: [
    Tab1Page,
  ]
})
export class Tab1PageModule {}
