import { NgClass, NgFor, NgIf } from "@angular/common";
import { Component, inject } from "@angular/core";
import { RouterLink } from "@angular/router";
import { TranslateModule } from "@ngx-translate/core";
import { BreadcrumbsService } from "services/breadcrumbs/breadcrumbs.service";
import { IAppRouts } from "models/general";

@Component({
  selector: "app-breadcrumbs",
  templateUrl: "./breadcrumbs.component.html",
  styleUrls: ["./breadcrumbs.component.scss"],
  standalone: true,
  imports: [NgClass, NgFor, NgIf, RouterLink, TranslateModule],
})
export class BreadcrumbsComponent {
  private bc = inject(BreadcrumbsService);

  readonly availableRouts: Array<keyof IAppRouts> = [
    "main-page",
    "privacy-policy",
  ];
  readonly breadcrumbs = this.bc.breadcrumbsItems;

  /* Method to convert any value to string to be accepted by routerLink*/
  public convertToString(path: keyof IAppRouts | string | number): string {
    return String(path);
  }
}
