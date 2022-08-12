import {Component, Input, OnInit} from '@angular/core';
import {ISingleCard} from "models/text-content";

@Component({
  selector: 'app-service-card',
  templateUrl: './service-card.component.html',
  styleUrls: ['./service-card.component.scss']
})
export class ServiceCardComponent {
  @Input() cardContent: ISingleCard | undefined

  constructor() {
  }

}
