import {Component, OnInit} from '@angular/core';
import {BreadcrumbsService} from "services/breadcrumbs/breadcrumbs.service";
import {ActivatedRoute} from "@angular/router";
import {IAppRouts} from "models/general";

@Component({
  selector: 'app-privacy-policy-page',
  templateUrl: './privacy-policy-page.component.html',
  styleUrls: ['./privacy-policy-page.component.scss']
})
export class PrivacyPolicyPageComponent implements OnInit {

  constructor(
    private bc: BreadcrumbsService,
    private route: ActivatedRoute,
  ) {
  }

  ngOnInit() {
    this.bc.updateBreadcrumbsPath =
      this.bc.generateBreadcrumbs(this.route.snapshot.data['breadcrumbs'] as Array<keyof IAppRouts>)
  }
}
