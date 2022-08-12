import {Component, OnInit} from '@angular/core';
import {BreadcrumbsService} from "services/breadcrumbs/breadcrumbs.service";
import {ActivatedRoute} from "@angular/router";
import {IAppRouts, TypeLang} from "models/general";
import ServiceCardsTextContent from "text-content/services-cards/index.json";
import {IServiceCardsTextContent} from "models/text-content";
import {LandSwitcherService} from "services/lang-switcher/land-switcher.service";
import {Observable} from "rxjs";

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent implements OnInit {
  readonly sctc: IServiceCardsTextContent = ServiceCardsTextContent
  readonly currentLang$: Observable<TypeLang>

  constructor(
    private ls: LandSwitcherService,
    public bc: BreadcrumbsService,
    private route: ActivatedRoute) {
    this.currentLang$ = this.ls.getCurrentLang
  }

  ngOnInit() {
    this.bc.updateBreadcrumbsPath =
      this.bc.generateBreadcrumbs(this.route.snapshot.data['breadcrumbs'] as Array<keyof IAppRouts>)
  }
}
