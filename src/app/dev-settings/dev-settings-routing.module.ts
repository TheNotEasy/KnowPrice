import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DevSettingsPage } from './dev-settings.page';

const routes: Routes = [
  {
    path: '',
    component: DevSettingsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DevSettingsPageRoutingModule {}
