import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ShopComponent } from '../components/shop/shop.component';


@NgModule({
  declarations: [ShopComponent],
  imports: [
    CommonModule,
    IonicModule,
  ],
  exports: [
    ShopComponent
  ]
})
export class ShopComponentSharedModule { }
