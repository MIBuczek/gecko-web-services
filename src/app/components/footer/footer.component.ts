import { Component, OnDestroy } from "@angular/core";
import {
  AbstractControl,
  FormControl,
  FormGroup,
  UntypedFormControl,
  UntypedFormGroup,
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
  of,
  ReplaySubject,
  takeUntil,
} from "rxjs";

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

  get submitClearStatus(): Observable<boolean> {
    return this.submitStateClear$.asObservable();
  }

  get formControls(): { [x: string]: AbstractControl } {
    return this.formUserMessage.controls;
  }

  public submit(): void {
    if (this.formUserMessage.invalid) return;
    const { email, message } = this.formUserMessage.value;
    if (!email || !message) return;
    this.submitStatus$ = from(
      this.ms.sendEmailMessage(new EmailMessage(email, message))
    );
    this.submitStateClear$.next(true);
    this.formUserMessage.reset({ email: "", message: "" });
  }

  ngOnDestroy(): void {
    this.subscription$.next(1);
    this.subscription$.complete();
  }
}
