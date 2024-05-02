import { Component, OnDestroy } from "@angular/core";
import {
  AbstractControl,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
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
import { environment } from "environments/environment";

@Component({
  selector: "app-footer",
  templateUrl: "./footer.component.html",
  styleUrls: ["./footer.component.scss"],
})
export class FooterComponent implements OnDestroy {
  public dbMessageActions = DB_MESSAGE_ACTIONS;
  public submitStatus$?: Observable<DB_MESSAGE_ACTIONS>;
  private submitStateClear$ = new BehaviorSubject(true);
  private subscription$ = new ReplaySubject(0);
  readonly siteKey = environment.recaptcha.siteKey;
  private token: string | null = null;

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

  constructor(private ms: MailingService) {
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
   * Returns the reCAPTCHA token.
   *
   * @return {string | null} The reCAPTCHA token or null if not available.
   */
  get getRecaptchaToken(): string | null {
    return this.token;
  }

  /**
   * Submits the form data if valid and sets the email message status based on the response.
   */
  public submit(): void {
    if (this.formUserMessage.invalid || !this.token) return;
    const { email, message } = this.formUserMessage.value;
    if (!email || !message) return;
    this.submitStatus$ = from(
      this.ms.sendEmailMessage(new EmailMessage(email, message))
    );
    this.submitStateClear$.next(true);
    this.formUserMessage.reset({ email: "", message: "" });
  }

  /**
   * Sets the resolved reCAPTCHA token.
   *
   * @param {string | null} token - The resolved reCAPTCHA token.
   * @return {void}
   */
  resolvedRecaptcha(token: string | null): void {
    this.token = token;
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
