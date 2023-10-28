import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService, RequestMethod, RequestTarget } from '../api.service';
import { InputCustomEvent, IonSearchbar, SearchbarCustomEvent } from '@ionic/angular';
import { SearchbarComponent } from '../components/searchbar/searchbar.component';
import { City } from '../target.types';
import { GlobalService } from '../global.service';

const TIMEOUT_LENGTH_TO_SEARCH = 500

@Component({
  selector: 'app-city-picker',
  templateUrl: './city-picker.page.html',
  styleUrls: ['./city-picker.page.scss'],
})
export class CityPickerPage implements OnInit {
  public readyPromise!: Promise<any>
  private searchTimeout: NodeJS.Timeout | null = null

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

  constructor(private api: ApiService, public global: GlobalService) { }

  ngOnInit() {}

  change(event: SearchbarCustomEvent) {
    if (this.searchTimeout !== null)
      clearTimeout(this.searchTimeout)
    this.searchTimeout = setTimeout(() => {
      this.search(event.detail.value as string)
    }, TIMEOUT_LENGTH_TO_SEARCH)
  }

  search(query: string) {
    this.readyPromise = this._search(query.toLowerCase());
  }

  private async _search(query: string) {
    const resp = await this.api.makeRequest(RequestMethod.GET, RequestTarget.CITY_LIST, {
      doRaise: true,
      extraUrl: `?search=${query}`
    })
    this.suggestions = resp.data
  }

  apply(city: string) {
    console.log(`selectedCity has changed to ${city}`)
    this.global.selectedCity = city
    this.global.commit(['selectedCity'])
  }

  unpick(event: CustomEvent) {
    if (event.detail.role !== 'confirm') {
      return
    }

    this.global.selectedCity = null
    this.global.commit(['selectedCity'])
  }
}
