import {Component, OnDestroy, OnInit} from '@angular/core';
import {ReplaySubject, takeUntil} from "rxjs";
import {LandSwitcherService} from "services/lang-switcher/land-switcher.service";
import {BreadcrumbsService} from "services/breadcrumbs/breadcrumbs.service";
import {ActivatedRoute} from "@angular/router";
import {IAppRouts, TypeLang} from "models/general";
import privacyPolicyTextContent from "text-content/privacy-policy/index.json";
import {IPrivacyPolicyTextContent} from "models/text-content";

@Component({
  selector: 'app-privacy-policy-page',
  templateUrl: './privacy-policy-page.component.html',
  styleUrls: ['./privacy-policy-page.component.scss']
})
export class PrivacyPolicyPageComponent implements OnInit, OnDestroy {
  public textContent: IPrivacyPolicyTextContent = privacyPolicyTextContent
  public currentLang: TypeLang = "PL"
  private subscription$ = new ReplaySubject(0);

  constructor(
    private ls: LandSwitcherService,
    private bc: BreadcrumbsService,
    private route: ActivatedRoute
  ) {
    ls.getCurrentLang.pipe(takeUntil(this.subscription$))
      .subscribe((lang) => this.currentLang = lang)
  }

  ngOnInit() {
    this.bc.updateBreadcrumbsPath =
      this.bc.generateBreadcrumbs(this.route.snapshot.data['breadcrumbs'] as Array<keyof IAppRouts>)
  }

  ngOnDestroy(): void {
    this.subscription$.next(1)
    this.subscription$.complete()
  }
}
