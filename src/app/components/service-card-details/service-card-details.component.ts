import {Component, EventEmitter, Input, Output} from '@angular/core';
import {ISingleCard} from "models/text-content";

@Component({
  selector: 'app-service-card-details',
  templateUrl: './service-card-details.component.html',
  styleUrls: ['./service-card-details.component.scss']
})
export class ServiceCardDetailsComponent {
  @Input() cardContent: ISingleCard | undefined;
  @Input() cardIndex: number | undefined;
  @Input() cardBtn: string = '';
  @Output() emitIsHide = new EventEmitter<number | null>()

  constructor() {
  }

  public hideCard() {
    this.emitIsHide.emit(null)
  }

}
