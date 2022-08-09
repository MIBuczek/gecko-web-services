import {ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';

import {FooterComponent} from './footer.component';
import {LandSwitcherService} from "services/lang-switcher/land-switcher.service";
import {DB_MESSAGE_ACTIONS, MailingService} from "services/mailing/mailing.service";
import {By} from "@angular/platform-browser";
import {ReactiveFormsModule} from "@angular/forms";
import {of} from "rxjs";
import {footerTextContent} from "text-content/footer/index.json";

describe('FooterComponent', () => {
  let component: FooterComponent;
  let langSwitcher: LandSwitcherService
  let fixture: ComponentFixture<FooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [FooterComponent],
      providers: [LandSwitcherService, MailingService]
    }).compileComponents();
    fixture = TestBed.createComponent(FooterComponent);
    component = fixture.componentInstance;
    langSwitcher = TestBed.inject(LandSwitcherService)
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('is correct initial inner text header', () => {
    const contact_header = fixture.debugElement.query(By.css('.contact-header')).children[0]
    /* Check if UI show correct text initially  */
    expect(contact_header.nativeElement['innerHTML'])
      .toContain(footerTextContent[component.currentLang].title)
  })

  it('is header change lang inner text header', fakeAsync(() => {
    /* Create test action */
    const contact_header = fixture.debugElement.query(By.css('.contact-header')).children[0]
    langSwitcher.langToggle()
    tick(1000)
    fixture.detectChanges()

    /* Check if UI show correct text after lang change */
    expect(contact_header.nativeElement['innerHTML'])
      .toContain(footerTextContent[component.currentLang].title)
  }))

  it('is current year display correctly', () => {
    /* Check if current year is set correctly */
    expect(component.currentYear).toEqual(new Date().getFullYear())
  })

  it('is form input email initially render correctly', fakeAsync(() => {
    /* Check does input email has set all correct attributes */
    const email_input_att = fixture.debugElement.query(By.css('input')).attributes
    expect(email_input_att['class']).toEqual('ng-untouched ng-pristine ng-invalid')
    expect(email_input_att['formControlName']).toEqual('email')
    expect(email_input_att['name']).toEqual('email')
    expect(email_input_att['ng-reflect-name']).toEqual('email')
    expect(email_input_att['type']).toEqual('email')
    expect(email_input_att['placeholder']).toEqual(footerTextContent[component.currentLang].formEmail)
  }))

  it('is form textarea message initially render correctly', fakeAsync(() => {
    /* Check does textarea message has set all correct attributes */
    const message_textarea_att = fixture.debugElement.query(By.css('textarea')).attributes
    expect(message_textarea_att['class']).toEqual('ng-untouched ng-pristine ng-invalid')
    expect(message_textarea_att['formControlName']).toEqual('message')
    expect(message_textarea_att['name']).toEqual('message')
    expect(message_textarea_att['ng-reflect-name']).toEqual('message')
    expect(message_textarea_att['placeholder']).toEqual(footerTextContent[component.currentLang].formMessage)
  }))

  it('is form load correctly', () => {
    expect(component.formUserMessage.value).toEqual({email: '', message: ''})
  })

  it('is form valid if all validation pass', () => {
    /* Create test action */
    const user_form = component.formUserMessage
    user_form.controls['email'].setValue('michal@test.pl')
    user_form.controls['message'].setValue('Test message')
    user_form.markAllAsTouched()

    /* Check if form is valid if all fields are filled correctly */
    expect(user_form.valid).toBeTruthy()
  })

  it('is email input validated correctly', () => {
    /* Create test action */
    const user_form = component.formUserMessage
    const email_form_field = user_form.controls['email']
    user_form.markAllAsTouched()

    /* Check if error required show as true */
    expect(email_form_field.errors?.['required']).toBeTruthy()

    /* Check if error minlength and email pattern shows  */
    email_form_field.setValue('te')
    expect(email_form_field.errors?.['minlength']).toBeTruthy()
    expect(email_form_field.errors?.['email']).toBeTruthy()
  })

  it('is message textarea validated correctly', () => {
    /* Create test action */
    const user_form = component.formUserMessage
    const message_form_field = user_form.controls['message']
    user_form.markAllAsTouched();

    /* Check if error required show */
    expect(message_form_field.errors?.['required']).toBeTruthy()

    /* Check if error minlength shows */
    message_form_field.setValue('te')
    expect(message_form_field.errors?.['minlength']).toBeTruthy()
  })

  it('is error message show on interface', () => {
    /* Initial render */
    expect(fixture.debugElement.query(By.css('app-error-message'))).toBeFalsy()

    component.formUserMessage.markAllAsTouched()
    fixture.detectChanges();

    /* After making form touched and not valid */
    expect(fixture.debugElement.query(By.css('app-error-message'))).toBeTruthy()
  })

  it('is form submitting if is valid', () => {
    /* Create form mock action*/
    const user_form = component.formUserMessage
    user_form.controls['email'].setValue('michal@test.pl')
    user_form.controls['message'].setValue('Test message')

    /* Submit the message with success result */
    component.submit()
    component.submitStatus$ = of(DB_MESSAGE_ACTIONS.SUCCESS)
    fixture.detectChanges()
    const submit_status_message = fixture.debugElement.query(By.css('.message-success'))

    /* Check if user is informed about success submit on UI */
    expect(submit_status_message.nativeElement['innerText'].trim())
      .toEqual(footerTextContent[component.currentLang].formSuccessSubmit.trim())

    /*Check if form filed are cleared after submit */
    expect(user_form.value).toEqual({email: '', message: ''})
  })
});
