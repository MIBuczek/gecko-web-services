import {Component, OnDestroy} from '@angular/core';
import {privacyPolicyTextContent} from "text-content/privacy-policy";
import {ReplaySubject, takeUntil} from "rxjs";
import {LandSwitcherService} from "services/lang-switcher/land-switcher.service";

@Component({
  selector: 'app-privacy-policy-page',
  templateUrl: './privacy-policy-page.component.html',
  styleUrls: ['./privacy-policy-page.component.scss']
})
export class PrivacyPolicyPageComponent implements OnDestroy {
  public textContent = privacyPolicyTextContent
  public currentLang: 'PL' | 'EN' = "PL"
  private subscription$ = new ReplaySubject(0);

  constructor(private ls: LandSwitcherService,) {
    ls.getCurrentLang.pipe(takeUntil(this.subscription$))
      .subscribe((lang) => this.currentLang = lang)
  }

  ngOnDestroy(): void {
    this.subscription$.next(1)
    this.subscription$.complete()
  }
}
