import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FinishRegPageRoutingModule } from './finish-reg-routing.module';

import { FinishRegPage } from './finish-reg.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FinishRegPageRoutingModule
  ],
  declarations: [FinishRegPage]
})
export class FinishRegPageModule {}
