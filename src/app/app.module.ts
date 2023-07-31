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
import { LoadableDirective } from './directives/loadable.directive';

@NgModule({
  declarations: [AppComponent, LoadableDirective],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, IonicStorageModule.forRoot()],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }, GlobalService, LanguageService, ApiService],
  bootstrap: [AppComponent],
})
export class AppModule {}
