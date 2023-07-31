import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DevSettingsPageRoutingModule } from './dev-settings-routing.module';

import { DevSettingsPage } from './dev-settings.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DevSettingsPageRoutingModule
  ],
  declarations: [DevSettingsPage]
})
export class DevSettingsPageModule {}
