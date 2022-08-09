import {Component, OnDestroy} from '@angular/core';
import {LandSwitcherService} from "services/lang-switcher/land-switcher.service";
import {AbstractControl, FormControl, FormGroup, Validators} from "@angular/forms";
import {DB_MESSAGE_ACTIONS, MailingService} from "services/mailing/mailing.service";
import {EmailMessage} from "classes/email-message.class";
import {BehaviorSubject, bufferTime, filter, from, Observable, ReplaySubject, takeUntil} from "rxjs";
import {IErrorTextContent, IFooterTextContent} from "models/text-content";
import errorMessageTextContent from "text-content/error-message/index.json";
import footerTextContent from "text-content/footer/index.json";

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnDestroy {
  public errorMessages: IErrorTextContent = errorMessageTextContent;
  public textContent: IFooterTextContent = footerTextContent;

  public currentLang: 'PL' | 'EN' = "PL"
  public dbMessageActions = DB_MESSAGE_ACTIONS

  public submitStatus$?: Observable<DB_MESSAGE_ACTIONS>
  private submitStateClear$ = new BehaviorSubject(true)
  private subscription$ = new ReplaySubject(0);

  public formUserMessage = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email, Validators.minLength(3)]),
    message: new FormControl('', [Validators.required, Validators.minLength(3)])
  })

  constructor(private ls: LandSwitcherService, private ms: MailingService) {
    ls.getCurrentLang.pipe(takeUntil(this.subscription$))
      .subscribe((lang) => this.currentLang = lang)
    this.submitStateClear$.pipe(filter(Boolean), bufferTime(10000), takeUntil(this.subscription$))
      .subscribe(() => this.submitStateClear$.next(false))
  }

  get submitClearStatus(): Observable<boolean> {
    return this.submitStateClear$.asObservable()
  }

  get formControls(): { [x: string]: AbstractControl } {
    return this.formUserMessage.controls
  }

  public submit(): void {
    if (this.formUserMessage.invalid) return
    const {email, message} = this.formUserMessage.value
    this.submitStatus$ = from(this.ms.sendEmailMessage(new EmailMessage(email, message)))
    this.submitStateClear$.next(true);
    this.formUserMessage.reset({email: '', message: ''})
  }

  ngOnDestroy(): void {
    this.subscription$.next(1)
    this.subscription$.complete()
  }

}
