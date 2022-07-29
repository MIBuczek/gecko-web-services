import {Component, OnDestroy} from '@angular/core';
import {notFoundTextContent} from "text-content/not-found";
import {LandSwitcherService} from "services/lang-switcher/land-switcher.service";
import {ReplaySubject, takeUntil} from "rxjs";

@Component({
  selector: 'app-not-found-page',
  templateUrl: './not-found-page.component.html',
  styleUrls: ['./not-found-page.component.scss']
})
export class NotFoundPageComponent implements OnDestroy {

  public textContent = notFoundTextContent
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
