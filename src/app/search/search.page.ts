import { Component, OnInit, ViewChild } from '@angular/core';
import { InputCustomEvent, IonInput } from '@ionic/angular';
import { ApiService, RequestMethod, RequestTarget } from '../api.service';
import { BehaviorSubject } from 'rxjs';
import { ItemData } from '../target.types';
import { SearchbarComponent } from '../components/searchbar/searchbar.component';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {
  @ViewChild(SearchbarComponent) searchbar!: SearchbarComponent

  public inSearch = new BehaviorSubject(false);
  public searchPromise!: Promise<any>
  public searchResults!: ItemData[]
  public searchQuery!: string

  constructor(
    private api: ApiService
  ) { }

  ngOnInit() {
  }

  async search(query?: string) {
    if (!query) {
      query = this.searchbar.value?.toString() as string
    } else {
      this.searchbar.value = query
    }
    if (query === '') return

    this.searchQuery = query

    this.inSearch.next(true)

    const searchPromise = this.api.makeRequest(RequestMethod.POST, RequestTarget.SEARCH_ITEM, {
      body: {
        'tag': query
      },
      doRaise: true,
    })

    this.searchPromise = searchPromise

    const resp = await searchPromise
    this.searchResults = resp.data
  }
}
