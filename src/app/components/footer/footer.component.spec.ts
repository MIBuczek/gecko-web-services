import {
  ComponentFixture,
  fakeAsync,
  flush,
  inject,
  TestBed,
  tick,
} from "@angular/core/testing";
import { FooterComponent } from "./footer.component";
import { DB_MESSAGE_ACTIONS, MailingService } from "services/mailing/mailing.service";
import { By } from "@angular/platform-browser";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { TranslateTestingModule } from "ngx-translate-testing";
import { TranslateService } from "@ngx-translate/core";
import polishTranslation from "assets/i18n/pl.json";
import englishTranslation from "assets/i18n/en.json";
import { FIREBASE_DATABASE } from "utilities/firebase.tokens";
import { RecaptchaService } from "services/recaptcha/recaptcha.service";
import { NotificationComponent } from "../notification/notification.component";
import { ErrorMessageComponent } from "../error-message/error-message.component";

const TRANSLATION: any = {
  pl: polishTranslation,
  en: englishTranslation,
};

describe("FooterComponent", () => {
  let component: FooterComponent;
  let fixture: ComponentFixture<FooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        FooterComponent,
        NotificationComponent,
        ErrorMessageComponent,
        HttpClientTestingModule,
        ReactiveFormsModule,
        TranslateTestingModule.withTranslations(
          TRANSLATION
        ).withDefaultLanguage("pl"),
      ],
      providers: [
        { provide: FIREBASE_DATABASE, useValue: {} },
        MailingService,
        {
          provide: RecaptchaService,
          useValue: {
            getToken: jest.fn().mockResolvedValue("Test_Token"),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("is correct initial inner text header", inject(
    [TranslateService],
    (translateService: TranslateService) => {
      translateService.use("pl");
      const contact_header = fixture.debugElement.query(
        By.css(".contact-header")
      ).children[1];
      expect(contact_header.nativeElement["innerHTML"].trim()).toContain(
        polishTranslation.footer.title.trim()
      );
    }
  ));

  it("is header change lang inner text header", inject(
    [TranslateService],
    (translateService: TranslateService) => {
      translateService.use("en");
      const contact_header = fixture.debugElement.query(
        By.css(".contact-header")
      ).children[1];
      fixture.detectChanges();
      expect(contact_header.nativeElement["innerHTML"].trim()).toContain(
        englishTranslation.footer.title.trim()
      );
    }
  ));

  it("is form input email initially render correctly", fakeAsync(() => {
    const email_input_att = fixture.debugElement.query(
      By.css("input")
    ).attributes;
    expect(email_input_att["class"]).toEqual(
      "ng-untouched ng-pristine ng-invalid"
    );
    expect(email_input_att["formControlName"]).toEqual("email");
    expect(email_input_att["name"]).toEqual("email");
    expect(email_input_att["ng-reflect-name"]).toEqual("email");
    expect(email_input_att["type"]).toEqual("email");
    expect(email_input_att["placeholder"]).toEqual(
      polishTranslation.footer["input-email"]
    );
  }));

  it("is form textarea message initially render correctly", fakeAsync(() => {
    const message_textarea_att = fixture.debugElement.query(
      By.css("textarea")
    ).attributes;
    expect(message_textarea_att["class"]).toEqual(
      "ng-untouched ng-pristine ng-invalid"
    );
    expect(message_textarea_att["formControlName"]).toEqual("message");
    expect(message_textarea_att["name"]).toEqual("message");
    expect(message_textarea_att["ng-reflect-name"]).toEqual("message");
    expect(message_textarea_att["placeholder"]).toEqual(
      polishTranslation.footer["input-message"]
    );
  }));

  it("is form load correctly", () => {
    expect(component.formUserMessage.value).toEqual({ email: "", message: "" });
  });

  it("is form valid if all validation pass", () => {
    const user_form = component.formUserMessage;
    user_form.controls["email"].setValue("michal@test.pl");
    user_form.controls["message"].setValue("Test message");
    user_form.markAllAsTouched();
    expect(user_form.valid).toBeTruthy();
  });

  it("is email input validated correctly", () => {
    const user_form = component.formUserMessage;
    const email_form_field = user_form.controls["email"];
    user_form.markAllAsTouched();
    expect(email_form_field.errors?.["required"]).toBeTruthy();
    email_form_field.setValue("te");
    expect(email_form_field.errors?.["minlength"]).toBeTruthy();
    expect(email_form_field.errors?.["email"]).toBeTruthy();
  });

  it("is message textarea validated correctly", () => {
    const user_form = component.formUserMessage;
    const message_form_field = user_form.controls["message"];
    user_form.markAllAsTouched();
    expect(message_form_field.errors?.["required"]).toBeTruthy();
    message_form_field.setValue("te");
    expect(message_form_field.errors?.["minlength"]).toBeTruthy();
  });

  it("should return the correct form controls of formUserMessage", () => {
    const formControls = component.formControls;
    expect(formControls).toEqual(component.formUserMessage.controls);
  });

  it("should return an object with the correct keys", () => {
    const formControls = component.formControls;
    expect(Object.keys(formControls)).toEqual(["email", "message"]);
  });

  it("should return an object with the correct values", () => {
    const formControls = component.formControls;
    expect(formControls["email"]).toBeInstanceOf(FormControl);
    expect(formControls["message"]).toBeInstanceOf(FormControl);
  });

  describe("submit", () => {
    let mailingService: MailingService;
    let recaptchaService: RecaptchaService;

    beforeEach(() => {
      mailingService = TestBed.inject(MailingService);
      recaptchaService = TestBed.inject(RecaptchaService);
    });

    const flushPromises = (): Promise<void> =>
      new Promise((resolve) => setTimeout(resolve, 0));

    const fillValidForm = (): void => {
      component.formUserMessage.controls["email"].setValue("michal@test.pl");
      component.formUserMessage.controls["message"].setValue("Test message");
    };

    it("is the message sent when the form is valid and a token is issued", async () => {
      const sendEmailMessage = jest
        .spyOn(mailingService, "sendEmailMessage")
        .mockResolvedValue(DB_MESSAGE_ACTIONS.SUCCESS);
      fillValidForm();

      component.submit();
      await flushPromises();

      expect(recaptchaService.getToken).toHaveBeenCalledWith("sendEmailMessage");
      expect(sendEmailMessage).toHaveBeenCalledTimes(1);
      expect(component.submitStatus()).toEqual(DB_MESSAGE_ACTIONS.SUCCESS);
    });

    it("is the form reset after a successful send", async () => {
      jest
        .spyOn(mailingService, "sendEmailMessage")
        .mockResolvedValue(DB_MESSAGE_ACTIONS.SUCCESS);
      fillValidForm();

      component.submit();
      await flushPromises();

      expect(component.formUserMessage.value).toEqual({
        email: "",
        message: "",
      });
    });

    it("is the error status surfaced when the send fails", async () => {
      jest
        .spyOn(mailingService, "sendEmailMessage")
        .mockResolvedValue(DB_MESSAGE_ACTIONS.ERROR);
      fillValidForm();

      component.submit();
      await flushPromises();

      expect(component.submitStatus()).toEqual(DB_MESSAGE_ACTIONS.ERROR);
    });

    it("is nothing sent when the form is invalid", async () => {
      const sendEmailMessage = jest.spyOn(mailingService, "sendEmailMessage");
      /* Left empty, so every validator fails. */

      component.submit();
      await flushPromises();

      expect(sendEmailMessage).not.toHaveBeenCalled();
    });

    it("is nothing sent when reCAPTCHA issues no token", async () => {
      (recaptchaService.getToken as jest.Mock).mockResolvedValue(null);
      const sendEmailMessage = jest.spyOn(mailingService, "sendEmailMessage");
      fillValidForm();

      component.submit();
      await flushPromises();

      expect(sendEmailMessage).not.toHaveBeenCalled();
    });

    it("is nothing sent when the component was destroyed first", async () => {
      const sendEmailMessage = jest.spyOn(mailingService, "sendEmailMessage");
      fillValidForm();

      component.submit();
      component.ngOnDestroy();
      await flushPromises();

      expect(sendEmailMessage).not.toHaveBeenCalled();
    });

    it("is the submit status cleared ten seconds after a submission", fakeAsync(() => {
      jest
        .spyOn(mailingService, "sendEmailMessage")
        .mockResolvedValue(DB_MESSAGE_ACTIONS.SUCCESS);
      fillValidForm();

      component.submit();
      tick();
      expect(component.submitClearStatus()).toBe(true);

      tick(10000);

      expect(component.submitClearStatus()).toBe(false);
    }));
  });
});
