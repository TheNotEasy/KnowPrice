import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GlobalService } from './global.service';
import { LanguageService } from './language.service';
import { IonicStorageModule } from '@ionic/storage-angular';
import { ApiService } from './api.service';
import { AccountBannerComponent } from './components/account-banner/account-banner.component';
import { SearchbarComponentSharedModule } from './shared/searchbar.shared.module';
import { SharedModalDirective } from './directives/sharedmodal.directive';

@NgModule({
  declarations: [AppComponent, AccountBannerComponent],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, IonicStorageModule.forRoot(), SearchbarComponentSharedModule],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }, GlobalService, LanguageService, ApiService],
  bootstrap: [AppComponent],
})
export class AppModule {}
