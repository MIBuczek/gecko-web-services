import {Component, OnDestroy, OnInit} from '@angular/core';
import {notFoundTextContent} from "text-content/not-found";
import {LandSwitcherService} from "services/lang-switcher/land-switcher.service";
import {ReplaySubject, takeUntil} from "rxjs";
import {TypeLang} from "models/general";
import {ActivatedRoute, Router} from "@angular/router";
import {BreadcrumbsService} from "services/breadcrumbs/breadcrumbs.service";

@Component({
  selector: 'app-not-found-page',
  templateUrl: './not-found-page.component.html',
  styleUrls: ['./not-found-page.component.scss']
})
export class NotFoundPageComponent implements OnInit, OnDestroy {

  public textContent = notFoundTextContent
  public currentLang: TypeLang = "PL"
  private subscription$ = new ReplaySubject(0);
  private readonly wrongPath: string;

  constructor(
    private ls: LandSwitcherService,
    private router: Router,
    private route: ActivatedRoute,
    private bc: BreadcrumbsService
  ) {
    ls.getCurrentLang.pipe(takeUntil(this.subscription$))
      .subscribe((lang) => this.currentLang = lang)
    this.wrongPath = this.router.url.replace('/', '')
  }

  ngOnInit() {
    const currentPath = this.route.snapshot.data['breadcrumbs']
    this.bc.updateBreadcrumbsPath = this.bc.generateBreadcrumbs([...currentPath, this.wrongPath])
  }

  ngOnDestroy(): void {
    this.subscription$.next(1)
    this.subscription$.complete()
  }
}
