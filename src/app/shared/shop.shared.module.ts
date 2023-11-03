import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ShopComponent } from '../components/shop/shop.component';
import { RouterModule } from '@angular/router';


@NgModule({
  declarations: [ShopComponent],
  imports: [
    CommonModule,
    IonicModule,
    RouterModule,
  ],
  exports: [
    ShopComponent
  ]
})
export class ShopComponentSharedModule { }
