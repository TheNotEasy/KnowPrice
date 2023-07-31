import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  public lang: string = 'ru';

  public addedToList = {ru: "Товар был доюавлен в корзину", en: 'asd'};

  public signInText = {ru: "Войти", en: "Sign in"}
  public signUpText = {ru: "Зарегистрироваться", en: "Sign up"}
  public signOutText = {ru: "Выйти", en: "Sign out"}

  public authenticateText = {ru: "АВТОРИЗОВАТЬСЯ", en: "AUTHENTICATE"}
  public haveAccountText = {ru: "Уже есть аккаунт?", en: "Already have account?"}
  public haventAccountText = {ru: "Нет аккаунта?", en: "Doesn't have account?"}
  public accountText = {ru: "Аккаунт", en: "Account"}

  public username = {ru: "Логин", en: "Username"}  
  public password = {ru: "Пароль", en: "Пароль"}

  public settingsText = {ru: "Настройки", en: "Settings"}
  public supportText = {ru: "Поддержка", en: "Support"}

  public searchText = {ru: "Искать", en: "Search"}

  public shopsText = {ru: "Магазин", en: "Shop"}
  public itemsText = {ru: "Товар", en: "Good"}

  getString(localization: Record<string, string>): string {
    return localization[this.lang]
  }

  constructor() { }

  [key: string]: any
}
