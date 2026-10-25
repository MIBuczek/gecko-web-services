import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { TranslateModule } from "@ngx-translate/core";
import { BreadcrumbsComponent } from "components/breadcrumbs/breadcrumbs.component";
import { CopyRightsComponent } from "components/copy-rights/copy-rights.component";
import { NavigationComponent } from "components/navigation/navigation.component";
import { BreadcrumbsService } from "services/breadcrumbs/breadcrumbs.service";

@Component({
  selector: "app-not-found-main",
  templateUrl: `./main.component.html`,
  styleUrl: "./main.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    RouterLink,
    TranslateModule,
    BreadcrumbsComponent,
    CopyRightsComponent,
    NavigationComponent,
  ],
})
export class MainComponent implements OnInit {
  private readonly wrongPath: string;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private bc: BreadcrumbsService
  ) {
    /* Save wrong path to display it */
    this.wrongPath = this.router.url.replace("/", "");
  }

  /**
   * Initializes the component and updates the breadcrumbs path based on the data received from the route snapshot.
   *
   * @return {void} No return value
   */
  ngOnInit() {
    const currentPath = this.route.snapshot.data["breadcrumbs"];
    this.bc.updateBreadcrumbsPath = this.bc.generateBreadcrumbs([
      ...currentPath,
      this.wrongPath,
    ]);
  }
}
