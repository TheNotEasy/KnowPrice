import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  public lang: string = 'ru';

  public addedToList = {
    ru: "Товар был доюавлен в корзину",
    en: 'asd',
  };

  public signInText = {
    ru: "Войти",
    en: "Sign in",
  }

  public signUpText = {
    ru: "Зарегистрироваться",
    en: "Sign up"
  }

  getString(localization: any) {
    return localization[this.lang]
  }

  constructor() { }
}
