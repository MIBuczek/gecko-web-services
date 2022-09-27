import {Component, OnDestroy, OnInit} from '@angular/core';
import {BreadcrumbsService} from "services/breadcrumbs/breadcrumbs.service";
import {ActivatedRoute} from "@angular/router";
import {IAppRouts, TypeLang} from "models/general";
import ServiceCardsTextContent from "text-content/services-cards/index.json";
import {IServiceCardsTextContent} from "models/text-content";
import {LandSwitcherService} from "services/lang-switcher/land-switcher.service";
import {MatDialog} from "@angular/material/dialog";
import {ModalCardDetailsComponent} from "components/modals/modal-card-details/modal-card-details.component";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent implements OnInit, OnDestroy {
  readonly sctc: IServiceCardsTextContent = ServiceCardsTextContent
  public currentLang: TypeLang = 'PL'
  private subscription = new Subscription()

  constructor(
    private modalRef: MatDialog,
    private ls: LandSwitcherService,
    private bc: BreadcrumbsService,
    private route: ActivatedRoute) {
    this.subscription.add(this.ls.getCurrentLang.subscribe((lang) => this.currentLang = lang))
  }

  public isOpenCard(cardIndex: number | null): boolean {
    return typeof cardIndex === 'number'
  }

  public setCardStatus(card_index: number | null) {
    if (this.isOpenCard(card_index)) {
      this.modalRef.open(ModalCardDetailsComponent, {
        data: {
          openCard: this.sctc[this.currentLang].cards[card_index as number],
          btnText: this.sctc[this.currentLang].btn.hide
        }
      })
    } else {
      this.modalRef.closeAll()
    }
  }

  ngOnInit() {
    this.bc.updateBreadcrumbsPath =
      this.bc.generateBreadcrumbs(this.route.snapshot.data['breadcrumbs'] as Array<keyof IAppRouts>)
  }

  ngOnDestroy() {
    this.subscription.unsubscribe()
  }
}
