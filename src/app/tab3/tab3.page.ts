import { ChangeDetectorRef, Component, TemplateRef, ViewChild } from '@angular/core';
import { GlobalService } from '../global.service';
import { LanguageService } from '../language.service';
import { ApiService } from '../api.service';
import { IonInput, IonModal } from '@ionic/angular';

let langInstance: LanguageService;


interface INavListItem {
  icon: string,
  text: string,
  _text: Record<string, string>,
  callback: ((state: boolean) => void) | null
}

export class NavListItem implements INavListItem {
  public hasModal = false

  constructor(
    public icon: string,
    public _text: Record<string, string>,
    public redirectTo: string = '.',
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
    public _text: Record<string, string>,
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
      (this.navList[0] as NavListModalItem).modal.height = value ? 400 : 300
    })
  }

  public isValid = false
  
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
        new NavListItem('exit', this.lang.signOutText, '.', (state) => {this.global.apiToken = undefined; this.updateNavList(); this.global.commit()})
      ]
    }
    this.settingsNavList = [
      new NavListItem('settings', this.lang.settingsText, '/settings')
    ]
  }

  async auth() {
    const loginNav = this.navList[0] as NavListModalItem
    loginNav.modal.height = this.inReg ? 400 : 300

    this.loginView.authenticating = true
    this.loginView.error.clearErrors()

    const data = {'username': this.loginView.inputs[0].value, 'password': this.loginView.inputs[1].value}
    let resp
    let status

    // if we assign method to variable, "this" in method context will be "undefined" :/
    // method.bind(this.api) doesn't work

    if (this.inReg) {
      [resp, status] = await this.api.createAccount((data.username as string), (data.password as string))
    }
    else {
      [resp, status] = await this.api.makeAuthorization((data.username as string), (data.password as string))
    }

    let errors = 0

    for (const [key, error] of Object.entries(resp)) {
      if (!Object.keys(new Errors()).includes(key)) continue
      if (typeof error === 'string') continue
      this.loginView.error[key] = error
      errors += error.length

      if (loginNav.modal)
        loginNav.modal.height += 50 * error.length
    }

    if (errors === 0) {
      loginNav.modal.native.dismiss()
      this.updateNavList()
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