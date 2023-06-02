import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  public lang: string = 'en';

  public addedToList = {
    'ru': 'Товар был доюавлен в корзину',
    'en': 'asd'
  };

  getString(localization: any) {
    console.log(localization)
    return localization[this.lang]
  }

  constructor() { }
}
