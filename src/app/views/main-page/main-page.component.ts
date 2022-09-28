import {Component, OnInit} from '@angular/core';
import {BreadcrumbsService} from "services/breadcrumbs/breadcrumbs.service";
import {ActivatedRoute} from "@angular/router";
import {IAppRouts} from "models/general";
import {ISingleCard} from "models/text-content";
import {MatDialog} from "@angular/material/dialog";
import {ModalCardDetailsComponent} from "components/modals/modal-card-details/modal-card-details.component";

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent implements OnInit {

  constructor(
    private modalRef: MatDialog,
    private bc: BreadcrumbsService,
    private route: ActivatedRoute,
  ) {
  }

  public setCardStatus(card: ISingleCard | null) {
    if (card) {
      this.modalRef.open(ModalCardDetailsComponent, {
        data: {card}
      })
    } else {
      this.modalRef.closeAll()
    }
  }

  ngOnInit() {
    this.bc.updateBreadcrumbsPath =
      this.bc.generateBreadcrumbs(this.route.snapshot.data['breadcrumbs'] as Array<keyof IAppRouts>)
  }
}
