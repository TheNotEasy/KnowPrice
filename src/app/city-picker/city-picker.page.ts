import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService, RequestMethod, RequestTarget } from '../api.service';
import { IonRouterOutlet, IonSearchbar, NavController, SearchbarCustomEvent } from '@ionic/angular';
import { City } from '../target.types';
import { GlobalService } from '../global.service';

@Component({
  selector: 'app-city-picker',
  templateUrl: './city-picker.page.html',
  styleUrls: ['./city-picker.page.scss'],
})
export class CityPickerPage implements OnInit {
  public readyPromise!: Promise<any>
  public suggestions: City[] = []

  public unpickAlertButtons = [
    {
      text: 'Отмена',
      role: 'cancel',
      handler: () => {
        console.log('Alert canceled');
      },
    },
    {
      text: 'Да',
      role: 'confirm',
      handler: () => {
        console.log('Alert confirmed');
      },
    },
  ];

  @ViewChild('searchbar', {read: IonSearchbar}) searchbar!: IonSearchbar

  constructor(
    private api: ApiService,
    public global: GlobalService,
    private routerOutlet: IonRouterOutlet,
    private navCtrl: NavController,
  ) { }

  ngOnInit() {
    // this.search('');
  }

  change(event: SearchbarCustomEvent) {
    this.search(event.detail.value as string)
  }

  search(query: string) {
    this.readyPromise = this._search(query.toLowerCase());
  }

  private async _search(query: string) {
    const resp = await this.api.makeRequest(RequestMethod.GET, RequestTarget.CITY_LIST, {
      doRaise: true,
      extraUrl: `?search=${query}`,
      makeCache: false,
    })
    this.suggestions = resp.data
  }

  apply(city: string) {
    console.log(`selectedCity has changed to ${city}`)
    this.global.selectedCity = city
    this.global.commit(['selectedCity'])

    this.navCtrl.setDirection('back')
    this.routerOutlet.pop(1);
  }

  unpick(event: CustomEvent) {
    if (event.detail.role !== 'confirm') {
      return
    }

    this.global.selectedCity = null
    this.global.commit(['selectedCity'])
  }
}
