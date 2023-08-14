import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { LoadableDirective } from '../directives/loadable.directive';


@NgModule({
  declarations: [LoadableDirective],
  imports: [
    CommonModule,
    IonicModule,
  ],
  exports: [
    LoadableDirective
  ]
})
export class LoadableDirectiveSharedModule { }
