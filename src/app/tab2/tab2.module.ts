import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tab2Page } from './tab2.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { Tab2PageRoutingModule } from './tab2-routing.module';
import { ItemComponentSharedModule } from '../shared/item.shared.module';
import { ArrayPipe } from '../array.pipe';
import { ErrorComponentSharedModule } from "../shared/error.shared.module";
import { LoadableDirectiveSharedModule } from '../shared/loadable.shared.module';
import { LongPressDirectiveSharedModule } from '../shared/long-press.shared.module';
import { CartItemComponent } from '../components/cart-item/cart-item.component';

@NgModule({
    declarations: [Tab2Page, ArrayPipe, CartItemComponent],
    imports: [
        IonicModule,
        CommonModule,
        FormsModule,
        ExploreContainerComponentModule,
        Tab2PageRoutingModule,
        ItemComponentSharedModule,
        ErrorComponentSharedModule,
        LoadableDirectiveSharedModule,
        LongPressDirectiveSharedModule,
    ]
})
export class Tab2PageModule {}
