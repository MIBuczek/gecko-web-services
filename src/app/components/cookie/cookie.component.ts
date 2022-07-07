import {Component, OnInit} from '@angular/core';
import {cookiesTextContent} from "text-content/cookies";
import {LandSwitcherService} from "services/lang-switcher/land-switcher.service";

@Component({
  selector: 'app-cookie',
  templateUrl: './cookie.component.html',
  styleUrls: ['./cookie.component.scss']
})
export class CookieComponent implements OnInit {
  public textContent = cookiesTextContent;
  public isCookiesAccepted: boolean = false
  public currentLang: 'PL' | 'EN' = "PL"

  constructor(private ls: LandSwitcherService) {
    ls.getCurrentLang.subscribe((lang) => this.currentLang = lang)
  }

  acceptCookies(): void {
    window.localStorage.setItem('cookies', String(true))
    this.isCookiesAccepted = true;
  }

  ngOnInit(): void {
    this.isCookiesAccepted = !!window.localStorage.getItem('cookies')
  }
}
