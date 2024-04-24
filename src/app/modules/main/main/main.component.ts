import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { ModalCardDetailsComponent } from 'components/modals/modal-card-details/modal-card-details.component';
import { IAppRouts } from 'models/general';
import { ISingleCard } from 'models/text-content';
import { BreadcrumbsService } from 'services/breadcrumbs/breadcrumbs.service';
import { tech_icons } from 'utilities/variables/tech-icon';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainComponent implements OnInit {
  readonly tech_icons = tech_icons

  constructor(
    private modalRef: MatDialog,
    private bc: BreadcrumbsService,
    private route: ActivatedRoute,
  ) {
  }

  public setCardStatus(card: ISingleCard | null) {
    if (card) {
      this.modalRef.open(ModalCardDetailsComponent, {
        data: { card }
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