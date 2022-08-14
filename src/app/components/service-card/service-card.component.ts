import {Component, EventEmitter, Input, Output} from '@angular/core';
import {ISingleCard, ISingleCardBtn} from "models/text-content";

export interface ICardEmitter {
  cardIndex: number | undefined,
  isCardOpen: boolean
}

@Component({
  selector: 'app-service-card',
  templateUrl: './service-card.component.html',
  styleUrls: ['./service-card.component.scss']
})
export class ServiceCardComponent {
  @Input() cardContent: ISingleCard | undefined;
  @Input() cardIndex: number | undefined;
  @Input() cardBtn: ISingleCardBtn | undefined;
  @Output() emitIsOpen = new EventEmitter<ICardEmitter>()
  public isCardOpen = false

  public showMore() {
    this.isCardOpen = !this.isCardOpen
    this.emitIsOpen.emit({cardIndex: this.cardIndex, isCardOpen: this.isCardOpen})
  }
}
