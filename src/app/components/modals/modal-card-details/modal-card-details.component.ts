import { NgFor } from "@angular/common";
import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { TranslateModule } from "@ngx-translate/core";
import { ISingleCard } from "models/text-content";

interface IModalData {
  card: ISingleCard;
}

@Component({
  selector: "app-modal-card-details",
  templateUrl: "./modal-card-details.component.html",
  styleUrls: ["./modal-card-details.component.scss"],
  standalone: true,
  imports: [NgFor, TranslateModule],
})
export class ModalCardDetailsComponent {
  constructor(
    private modalRef: MatDialogRef<ModalCardDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IModalData
  ) {}

  /**
   * Closes the modal by calling the `close` method on the `modalRef` object.
   *
   * @return {void} This function does not return anything.
   */
  hideCard(): void {
    this.modalRef.close();
  }
}
