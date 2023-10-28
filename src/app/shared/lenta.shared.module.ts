import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { LentaComponent } from '../components/lenta/lenta.component';
import { LoadableDirectiveSharedModule } from './loadable.shared.module';
import { ShopComponentSharedModule } from './shop.shared.module';


@NgModule({
  declarations: [LentaComponent],
  imports: [
    CommonModule,
    IonicModule,
    RouterModule,
    LoadableDirectiveSharedModule,
    ShopComponentSharedModule,
  ],
  exports: [
    LentaComponent
  ]
})
export class LentaComponentSharedModule { }
