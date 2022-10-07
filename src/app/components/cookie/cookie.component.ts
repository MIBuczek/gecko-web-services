import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-cookie',
  templateUrl: './cookie.component.html',
  styleUrls: ['./cookie.component.scss']
})
export class CookieComponent implements OnInit {
  public isCookiesAccepted: boolean = false

  constructor() {
  }
  acceptCookies(): void {
    window.localStorage.setItem('cookies', String(true))
    this.isCookiesAccepted = true;
  }

  ngOnInit(): void {
    this.isCookiesAccepted = !!window.localStorage.getItem('cookies')
  }
}
