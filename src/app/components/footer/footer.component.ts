
import { Component, inject, OnDestroy, signal, ChangeDetectionStrategy } from "@angular/core";
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { TranslateModule } from "@ngx-translate/core";
import {
  DB_MESSAGE_ACTIONS,
  MailingService,
} from "services/mailing/mailing.service";
import { EmailMessage } from "classes/email-message.class";
import { RecaptchaService } from "services/recaptcha/recaptcha.service";
import { ErrorMessageComponent } from "components/error-message/error-message.component";
import { NotificationComponent } from "components/notification/notification.component";

@Component({
  selector: "app-footer",
  templateUrl: "./footer.component.html",
  styleUrls: ["./footer.component.scss"],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    ReactiveFormsModule,
    TranslateModule,
    ErrorMessageComponent,
    NotificationComponent,
  ],
})
export class FooterComponent implements OnDestroy {
  private mailingService = inject(MailingService);
  private recaptchaService = inject(RecaptchaService);

  public dbMessageActions = DB_MESSAGE_ACTIONS;
  public readonly submitStatus = signal<DB_MESSAGE_ACTIONS | null>(null);

  private readonly _submitClearStatus = signal(true);

  /**
   * Whether the submit result banner should still be displayed.
   *
   * @return {Signal<boolean>} The clear status after submission.
   */
  public readonly submitClearStatus = this._submitClearStatus.asReadonly();

  private submitClearTimer?: ReturnType<typeof setTimeout>;
  private destroyed = false;

  public formUserMessage = new FormGroup<{
    email: FormControl<string | null>;
    message: FormControl<string | null>;
  }>({
    email: new FormControl("", [
      Validators.required,
      Validators.email,
      Validators.minLength(3),
    ]),
    message: new FormControl("", [
      Validators.required,
      Validators.minLength(3),
    ]),
  });

  constructor() {
    /* Clears the submit banner a fixed time after it is shown. */
    this.scheduleSubmitStateClear();
  }

  /**
   * Returns the form controls of the formUserMessage.
   *
   * @return { { [x: string]: AbstractControl } } The form controls of formUserMessage.
   */
  get formControls(): { [x: string]: AbstractControl } {
    return this.formUserMessage.controls;
  }

  /**
   * Submits the form data if valid and sets the email message status based on the response.
   */
  public submit(): void {
    void this.recaptchaService.getToken("sendEmailMessage").then((token) => {
      if (this.destroyed) return;
      if (this.formUserMessage.invalid || !token) return;
      const { email, message } = this.formUserMessage.value;
      if (!email || !message) return;

      this._submitClearStatus.set(true);
      this.scheduleSubmitStateClear();
      this.formUserMessage.reset({ email: "", message: "" });

      void this.mailingService
        .sendEmailMessage(new EmailMessage(email, message))
        .then((status) => {
          if (!this.destroyed) this.submitStatus.set(status);
        });
    });
  }

  ngOnDestroy(): void {
    this.destroyed = true;
    clearTimeout(this.submitClearTimer);
  }

  private scheduleSubmitStateClear(): void {
    clearTimeout(this.submitClearTimer);
    this.submitClearTimer = setTimeout(
      () => this._submitClearStatus.set(false),
      10000
    );
  }
}
