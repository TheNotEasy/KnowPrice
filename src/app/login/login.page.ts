import { Component, OnInit } from '@angular/core';
import { ShopComponent } from '../components/shop/shop.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  constructor() { }

  ngOnInit() {
    let component = new ShopComponent()
    console.log(component)
  }
}
