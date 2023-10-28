import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { SearchbarComponent } from '../components/searchbar/searchbar.component';


@NgModule({
  declarations: [SearchbarComponent],
  imports: [
    CommonModule,
    IonicModule,
  ],
  exports: [
    SearchbarComponent
  ]
})
export class SearchbarComponentSharedModule { }
