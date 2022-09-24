import {Component, EventEmitter, Input, Output} from '@angular/core';
import {ISingleCard} from "models/text-content";

@Component({
  selector: 'app-modal-card-details',
  templateUrl: './modal-card-details.component.html',
  styleUrls: ['./modal-card-details.component.scss']
})
export class ModalCardDetailsComponent {
  @Input() cardContent: ISingleCard | undefined;
  @Input() cardBtn: string = '';
  @Output() emitIsHide = new EventEmitter<number | null>()

  constructor() {
  }

  public hideCard() {
    this.emitIsHide.emit(null)
  }

}
