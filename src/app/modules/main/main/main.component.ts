import { NgClass, NgFor } from "@angular/common";
import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute } from "@angular/router";
import { TranslateModule } from "@ngx-translate/core";
import { BreadcrumbsComponent } from "components/breadcrumbs/breadcrumbs.component";
import { CookieComponent } from "components/cookie/cookie.component";
import { CopyRightsComponent } from "components/copy-rights/copy-rights.component";
import { FooterComponent } from "components/footer/footer.component";
import { LoaderComponent } from "components/loader/loader.component";
import { ModalCardDetailsComponent } from "components/modals/modal-card-details/modal-card-details.component";
import { NavigationComponent } from "components/navigation/navigation.component";
import { ScrollTopComponent } from "components/scroll-top/scroll-top.component";
import { ServiceCardComponent } from "components/service-card/service-card.component";
import { IAppRouts } from "models/general";
import { ISingleCard } from "models/text-content";
import { BreadcrumbsService } from "services/breadcrumbs/breadcrumbs.service";
import { tech_icons } from "utilities/variables/tech-icon.const";

@Component({
  selector: "app-main",
  templateUrl: "./main.component.html",
  styleUrl: "./main.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    NgClass,
    NgFor,
    TranslateModule,
    BreadcrumbsComponent,
    CookieComponent,
    CopyRightsComponent,
    FooterComponent,
    LoaderComponent,
    NavigationComponent,
    ScrollTopComponent,
    ServiceCardComponent,
  ],
})
export class MainComponent implements OnInit {
  readonly tech_icons = tech_icons;

  constructor(
    private modalRef: MatDialog,
    private bc: BreadcrumbsService,
    private route: ActivatedRoute
  ) {}

  /**
   * Sets the status of the card.
   *
   * @param {ISingleCard | null} card - The card to set the status for.
   */
  public setCardStatus(card: ISingleCard | null) {
    if (card) {
      this.modalRef.open(ModalCardDetailsComponent, {
        data: { card },
      });
    } else {
      this.modalRef.closeAll();
    }
  }

  /**
   * Initializes the component and updates the breadcrumbs path based on the data received from the route snapshot.
   *
   * @return {void} No return value
   */
  ngOnInit() {
    this.bc.updateBreadcrumbsPath = this.bc.generateBreadcrumbs(
      this.route.snapshot.data["breadcrumbs"] as Array<keyof IAppRouts>
    );
  }
}
