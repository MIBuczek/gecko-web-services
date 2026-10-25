import { NgFor } from "@angular/common";
import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { TranslateModule } from "@ngx-translate/core";
import { BreadcrumbsComponent } from "components/breadcrumbs/breadcrumbs.component";
import { CookieComponent } from "components/cookie/cookie.component";
import { CopyRightsComponent } from "components/copy-rights/copy-rights.component";
import { NavigationComponent } from "components/navigation/navigation.component";
import { ScrollTopComponent } from "components/scroll-top/scroll-top.component";
import { IAppRouts } from "models/general";
import { BreadcrumbsService } from "services/breadcrumbs/breadcrumbs.service";

@Component({
  selector: "app-main",
  templateUrl: "./main.component.html",
  styleUrl: "./main.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    NgFor,
    RouterLink,
    TranslateModule,
    BreadcrumbsComponent,
    CookieComponent,
    CopyRightsComponent,
    NavigationComponent,
    ScrollTopComponent,
  ],
})
export class MainComponent implements OnInit {
  constructor(private bc: BreadcrumbsService, private route: ActivatedRoute) {}

  /**
   * A lifecycle hook that is called after Angular has initialized all data-bound properties of a directive.
   *
   */
  ngOnInit() {
    this.bc.updateBreadcrumbsPath = this.bc.generateBreadcrumbs(
      this.route.snapshot.data["breadcrumbs"] as Array<keyof IAppRouts>
    );
  }
}
