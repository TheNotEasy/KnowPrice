import { ChangeDetectorRef, Component, TemplateRef, ViewChild } from '@angular/core';
import { GlobalService } from '../global.service';
import { LanguageService } from '../language.service';
import { ApiService } from '../api.service';
import { IonInput, IonModal } from '@ionic/angular';
import { ApiResponse, Auth } from '../target.types';
import { Router } from '@angular/router';

let langInstance: LanguageService;


interface INavListItem {
  icon: string,
  text: string,
  _text: Record<string, string> | string,
  callback: ((state: boolean) => void) | null
}

export class NavListItem implements INavListItem {
  public hasModal = false

  constructor(
    public icon: string,
    public _text: Record<string, string>,
    public redirectTo: string | null = '.',
    public callback: ((state: boolean) => void) | null = null) {}

  get text() {
    return langInstance.getString(this._text)
  }
}


class ModalInner {
  public native!: IonModal

  constructor(
    public template: TemplateRef<any>,
    public title: string,
    public height: number,
  ) {}
}


export class NavListModalItem implements INavListItem {
  public modal: ModalInner
  public hasModal = true
  public redirectTo = '.'

  constructor(
    public icon: string,
    public _text: Record<string, string> | string,
    modalTemplate: TemplateRef<any>,
    modalTitle: string,
    modalHeight: number,
    public callback: ((state: boolean) => void) | null
  ) {
    this.modal = new ModalInner(
      modalTemplate, modalTitle, modalHeight
    )
  }

  get text() {
    if (typeof this._text === 'string') {
      return this._text
    }
    return langInstance.getString(this._text)
  }
}


class Errors {
  username: string[] = []
  password: string[] = []
  password2: string[] = []
  non_field_errors: string[] = [];

  clearErrors() {
    for (const array of Object.values(this)) {
      if (typeof array === 'function') return
      array.length = 0
    }
  }
  
  [key: string]: string[] | any
}


// FIXME: Вернуться и сделать рефакторинг
// Если я не забью это)

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {
  public navList: Array<NavListItem | NavListModalItem> = []
  public _inReg = false

  public settingsNavList: Array<NavListItem | NavListModalItem> = []

  get inReg() {
    return this._inReg
  }

  set inReg(value) {
    this._inReg = value
    this.changeDetectorRef.detectChanges()
    setTimeout(() => {
      this.updateLoginView();
      (this.navList[0] as NavListModalItem).modal.height = value ? 365 : 300
    })
  }

  public isValid = false
  public isFailed = false
  
  private isValidInterval!: NodeJS.Timeout

  @ViewChild('login') private login!: TemplateRef<HTMLElement>
  public loginView!: {
    'element': Element,
    'inputs': NodeListOf<HTMLIonInputElement>,
    'passwords': NodeListOf<HTMLIonInputElement>,
    'error': Errors,
    'authenticating': boolean
  }

  public account!: {
    'username': string
  }

  public accountPromise!: Promise<boolean>

  constructor(
    public global: GlobalService,
    public lang: LanguageService,
    private changeDetectorRef: ChangeDetectorRef,
    private api: ApiService,
    private router: Router
  ) { langInstance = lang }

  ngOnInit() {}

  ngAfterViewInit() {
    this.global.readyPromise.then(() => {
      this.updateNavList()
    })
  }

  updateNavList() {
    if (this.global.apiToken === undefined) {
      this.navList = [
        new NavListModalItem('enter', this.lang.signInText, this.login, this.lang.getString(this.lang.signInText), 300 , (state: boolean) => {this.onLoginAppeared(state)}),
      ]
    } else {
      this.navList = [
        new NavListItem('exit', this.lang.signOutText, null, (state) => {this.global.apiToken = undefined; this.updateNavList(); this.global.commit()})
      ]
    }
    this.settingsNavList = [
      new NavListItem('settings', this.lang.settingsText, '/settings'),
      new NavListItem('bug', this.lang.bugReportText, '/support')
    ]
  }

  async auth() {
    const loginNav = this.navList[0] as NavListModalItem
    loginNav.modal.height = this.inReg ? 365 : 300

    this.loginView.authenticating = true
    this.loginView.error.clearErrors()

    const data = {'username': this.loginView.inputs[0].value, 'password': this.loginView.inputs[1].value}
    let response: ApiResponse<Auth>

    // if we assign method to variable, "this" in method context will be "undefined" :/
    // method.bind(this.api) doesn't work

    try {
      if (this.inReg) {
        response = await this.api.createAccount((data.username as string), (data.password as string))
      }
      else {
        response = await this.api.makeAuthorization((data.username as string), (data.password as string))
      }
    } catch (error) {
      this.loginView.error.non_field_errors.push('Что-то пошло не так, повторите попытку позже')
      const navItem = (this.navList[0] as NavListModalItem)
      navItem.modal.height += 50
      this.loginView.authenticating = false
      throw error
    }

    let errors = 0

    if (!response.success && !response.isFetchError) {
      for (const [key, error] of Object.entries(response.data as Auth)) {
        if (!Object.keys(new Errors()).includes(key)) continue
        if (typeof error === 'string') continue
        this.loginView.error[key] = error
        errors += error.length

        if (loginNav.modal)
          loginNav.modal.height += 50 * error.length
      }
    }

    if (errors === 0) {
      loginNav.modal.native.dismiss()
      this.updateNavList()

      if (this.inReg) {
        this.router.navigate(['finish-reg'])
      }
    }

    this.loginView.authenticating = false

    // if (resp['non_field_errors']) {
    //   this.loginView.error['non-field-errors'] = resp['non_field_errors']
    //   if (this.navList[0].dropMenuHeight)
    //     this.navList[0].dropMenuHeight += 50
    // }

    // if (resp['username']) {
    //   this.loginView.error['username'] = resp['username']
    //   if (this.navList[0].dropMenuHeight)
    //     this.navList[0].dropMenuHeight += 50
    // }
  }

  updateLoginView() {
    const el = document.getElementsByClassName('login')[0]
    const inputs = el.querySelectorAll('ion-input')
    const passwords = el.querySelectorAll<HTMLIonInputElement>('ion-input[ng-reflect-type=password]')

    this.loginView = {
      element: el,
      inputs: inputs,
      passwords: passwords,
      error: new Errors(),
      authenticating: false,
    }
  }

  onLoginAppeared(state: boolean) {
    const loginNav = this.navList[0] as NavListModalItem

    if (!state) {
      this.isValid = false
      clearInterval(this.isValidInterval)
      return
    }

    this.updateLoginView()

    // this.loginView.inputs.forEach((el) => {
    //   const innerInput = el.querySelector('input')
    //   IonInput.ɵcmp
    //   innerInput?.addEventListener('focus', () => {
    //     setTimeout(() => {
    //       innerInput.style.transform = ''  // Shit is happening
    //       el.style.pointerEvents = 'all'
    //       innerInput.focus()
    //       el.querySelector('input.cloned-input')?.remove()
          
    //       setTimeout(() => {
    //         el.classList.add('has-focus')
    //       })
    //     })
    //   })
    // })

    this.isValidInterval = setInterval(() => {
      this.isValid = this.loginView.inputs[0].value !== ''
      if (!this.isValid) return

      this.isValid = (this.loginView.passwords[0].value as string).length > 7
      if (!this.isValid) return
      
      if (this.inReg) {
        this.isValid = this.loginView.passwords[0].value === this.loginView.passwords[1].value
        if (!this.isValid && this.loginView.passwords[1].value !== '' && !this.loginView.error.password2.includes('Пароль не совпадает')) {
          this.loginView.error.password2.push('Пароль не совпадает')
          if (loginNav.modal.height)
            loginNav.modal.height += 50
        } else if (this.isValid && this.loginView.error.password2.includes('Пароль не совпадает')) {
          this.loginView.error.password2.splice(0)
          if (loginNav.modal.height)
            loginNav.modal.height -= 50
        }
      } 
    }, 100)
  }
}