import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ItemPageRoutingModule } from './item-routing.module';

import { ItemPage } from './item.page';
import { ErrorComponentSharedModule } from '../shared/error.shared.module';
import { MarkdownComponent } from '../components/markdown/markdown.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ItemPageRoutingModule,
    ErrorComponentSharedModule
  ],
  declarations: [ItemPage, MarkdownComponent]
})
export class ItemPageModule {}
