import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { LongPressDirective } from '../directives/long-press.directive';


@NgModule({
  declarations: [LongPressDirective],
  imports: [
    CommonModule,
    IonicModule,
  ],
  exports: [
    LongPressDirective
  ]
})
export class LongPressDirectiveSharedModule { }
