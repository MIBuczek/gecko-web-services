import { AsyncPipe, NgIf } from "@angular/common";
import { Component, inject, OnDestroy } from "@angular/core";
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
import {
  BehaviorSubject,
  bufferTime,
  filter,
  from,
  Observable,
  ReplaySubject,
  takeUntil,
} from "rxjs";
import { RecaptchaService } from "services/recaptcha/recaptcha.service";
import { ErrorMessageComponent } from "components/error-message/error-message.component";
import { NotificationComponent } from "components/notification/notification.component";

@Component({
  selector: "app-footer",
  templateUrl: "./footer.component.html",
  styleUrls: ["./footer.component.scss"],
  standalone: true,
  imports: [
    AsyncPipe,
    NgIf,
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
  public submitStatus$?: Observable<DB_MESSAGE_ACTIONS>;
  private submitStateClear$ = new BehaviorSubject(true);
  private subscription$ = new ReplaySubject(0);

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
    /* Observable to clear state after submit the message */
    this.submitStateClear$
      .pipe(filter(Boolean), bufferTime(10000), takeUntil(this.subscription$))
      .subscribe(() => this.submitStateClear$.next(false));
  }

  /**
   * Returns an observable of the current clear status after submission.
   *
   * @return {Observable<boolean>} An observable of the current clear status after submission.
   */
  get submitClearStatus(): Observable<boolean> {
    return this.submitStateClear$.asObservable();
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
    this.recaptchaService
      .getToken("sendEmailMessage")
      .pipe(takeUntil(this.subscription$))
      .subscribe((token) => {
        if (this.formUserMessage.invalid || !token) return;
        const { email, message } = this.formUserMessage.value;
        if (!email || !message) return;
        this.submitStatus$ = from(
          this.mailingService.sendEmailMessage(new EmailMessage(email, message))
        );
        this.submitStateClear$.next(true);
        this.formUserMessage.reset({ email: "", message: "" });
      });
  }

  /**
   * A description of the entire function.
   *
   * @param {void} - No parameters
   * @return {void} - No return value
   */
  ngOnDestroy(): void {
    this.subscription$.next(1);
    this.subscription$.complete();
  }
}
