import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { SharedModalDirective } from '../directives/sharedmodal.directive';


@NgModule({
  declarations: [SharedModalDirective],
  imports: [
    CommonModule,
    IonicModule,
  ],
  exports: [
    SharedModalDirective
  ]
})
export class ShardeModalDirectiveSharedModule { }
