import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FinishRegPage } from './finish-reg.page';

const routes: Routes = [
  {
    path: '',
    component: FinishRegPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FinishRegPageRoutingModule {}
