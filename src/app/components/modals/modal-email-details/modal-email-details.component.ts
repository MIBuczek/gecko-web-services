import { ChangeDetectionStrategy, Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { EmailActionAdmin, IAdminEmail } from "app/models/email-message";

@Component({
  selector: "app-modal-email-details",
  templateUrl: "./modal-email-details.component.html",
  styleUrl: "./modal-email-details.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false
})
export class ModalEmailDetailsComponent {
  constructor(
    private modalRef: MatDialogRef<ModalEmailDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IAdminEmail
  ) {}

  /**
   * Updates the email by closing the modal and returning an object with the email ID and the action performed.
   *
   * @return {void} This function does not return a value.
   */
  updateEmail(): void {
    this.modalRef.close({
      id: this.data.id,
      action: EmailActionAdmin.ANSWERED,
    });
  }

  /**
   * Closes the modal and returns an object with the email ID and the action performed.
   *
   * @return {void} This function does not return a value.
   */
  deleteEmail(): void {
    this.modalRef.close({ id: this.data.id, action: EmailActionAdmin.DELETE });
  }

  /**
   * Closes the modal and returns an object with the email ID and the action performed.
   *
   * @return {void} This function does not return a value.
   */
  closeModal(): void {
    this.modalRef.close({ id: this.data.id, action: EmailActionAdmin.CLOSE });
  }
}
