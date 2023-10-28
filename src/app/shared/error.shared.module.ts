import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ErrorComponent } from '../error/error.component';


@NgModule({
  declarations: [ErrorComponent],
  imports: [
    CommonModule,
    IonicModule,
  ],
  exports: [
    ErrorComponent
  ]
})
export class ErrorComponentSharedModule { }
