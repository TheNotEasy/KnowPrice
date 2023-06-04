import { Component, ElementRef, TemplateRef, ViewChild } from '@angular/core';
import { GlobalService } from '../global.service';
import { LanguageService } from '../language.service';
import { ViewContainerRef } from '@angular/core';
import { IonContent } from '@ionic/angular';

let langInstance: LanguageService;


export class NavListItem {
  constructor(
    public icon: string,
    private _text: Record<string, string>,
    public hasDropMenu = false,
    public dropMenu?: TemplateRef<any>,
    public redirectTo: string = '.') {}

  get text() {
    return langInstance.getString(this._text)
  }
}


@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {
  public navList: Array<NavListItem> = []

  @ViewChild('content') private content!: {'el': HTMLIonContentElement}

  @ViewChild('login') private login!: TemplateRef<any>

  constructor(
    private global: GlobalService,
    private lang: LanguageService,
  ) { langInstance = lang }

  ngOnInit() {
    if (this.global.apiToken === undefined) {
      this.navList = [
        new NavListItem('enter', this.lang.signInText, true),
      ]
    }
  }

  ngAfterViewInit() {
    for (const navItem of this.navList) {
      navItem.dropMenu = this.login
    }
  }
}
