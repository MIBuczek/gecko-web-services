import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { IAppRouts } from "models/general";
import { BreadcrumbsService } from "services/breadcrumbs/breadcrumbs.service";

@Component({
  selector: "app-main",
  templateUrl: "./main.component.html",
  styleUrl: "./main.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false
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
