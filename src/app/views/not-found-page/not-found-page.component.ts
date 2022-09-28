import {Component, OnInit} from '@angular/core';
import {TypeLang} from "models/general";
import {ActivatedRoute, Router} from "@angular/router";
import {BreadcrumbsService} from "services/breadcrumbs/breadcrumbs.service";

@Component({
  selector: 'app-not-found-page',
  templateUrl: './not-found-page.component.html',
  styleUrls: ['./not-found-page.component.scss']
})
export class NotFoundPageComponent implements OnInit {
  public currentLang: TypeLang = "PL"
  private readonly wrongPath: string;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private bc: BreadcrumbsService,
  ) {
    /* Save wrong path to display it */
    this.wrongPath = this.router.url.replace('/', '')
  }

  ngOnInit() {
    const currentPath = this.route.snapshot.data['breadcrumbs']
    this.bc.updateBreadcrumbsPath = this.bc.generateBreadcrumbs([...currentPath, this.wrongPath])
  }
}
