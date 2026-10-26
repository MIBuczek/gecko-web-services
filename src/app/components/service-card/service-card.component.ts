
import { Component, EventEmitter, Input, Output, ChangeDetectionStrategy } from "@angular/core";
import { ISingleCard } from "models/text-content";

@Component({
  selector: "app-service-card",
  templateUrl: "./service-card.component.html",
  styleUrls: ["./service-card.component.scss"],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: true,
})
export class ServiceCardComponent {
  @Input() cardContent: ISingleCard | undefined;
  @Input() cardIndex: number | null = null;
  @Input() cardBtn: string = "";
  @Output() emitIsOpen = new EventEmitter<number | null>();

  public showCard(event: Event) {
    event.stopPropagation();
    this.emitIsOpen.emit(this.cardIndex);
  }
}
