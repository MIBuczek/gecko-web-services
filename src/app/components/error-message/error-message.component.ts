
import { Component, Input, ChangeDetectionStrategy } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { FormErrorMessagePipe } from "app/pipes/form-error-message.pipe";

@Component({
  selector: "app-error-message",
  templateUrl: "./error-message.component.html",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [FormErrorMessagePipe],
})
export class ErrorMessageComponent {
  @Input({ required: true }) form: FormGroup | undefined;
  @Input({ required: true }) fieldName = "";

  /**
   * Current app selected lang.
   */
  currentLang: "pl" | "en" = "pl";
}
