import {
  ComponentFixture,
  fakeAsync,
  inject,
  TestBed,
} from "@angular/core/testing";
import { FooterComponent } from "./footer.component";
import {
  DB_MESSAGE_ACTIONS,
  MailingService,
} from "services/mailing/mailing.service";
import { By } from "@angular/platform-browser";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { of } from "rxjs";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { TranslateTestingModule } from "ngx-translate-testing";
import { TranslateService } from "@ngx-translate/core";
import polishTranslation from "assets/i18n/pl.json";
import englishTranslation from "assets/i18n/en.json";
import { provideFirebaseApp } from "@angular/fire/app";
import { provideDatabase } from "@angular/fire/database";
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { environment } from "environments/environment";
import { NotificationComponent } from "../notification/notification.component";
import { ErrorMessageComponent } from "../error-message/error-message.component";
import { formErrorMessageConst } from "app/utilities/variables/form-error-message.const";

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
        HttpClientTestingModule,
        provideFirebaseApp(() => initializeApp(environment.firebase)),
        provideDatabase(() => getDatabase()),
        ReactiveFormsModule,
        TranslateTestingModule.withTranslations(
          TRANSLATION
        ).withDefaultLanguage("pl"),
      ],
      declarations: [
        FooterComponent,
        NotificationComponent,
        ErrorMessageComponent,
      ],
      providers: [MailingService],
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

  it("is form submitting if is valid", () => {
    /* Create form mock action*/
    const user_form = component.formUserMessage;
    user_form.controls["email"].setValue("michal@test.pl");
    user_form.controls["message"].setValue("Test message");
    component.resolvedRecaptcha("test-token");
    fixture.detectChanges();
    component.submit();
    component.submitStatus$ = of(DB_MESSAGE_ACTIONS.SUCCESS);
    fixture.detectChanges();
    const submit_status_message = fixture.debugElement.query(By.css("strong"));
    expect(submit_status_message.nativeElement["textContent"].trim()).toEqual(
      polishTranslation.footer["submit-success"]
    );
    expect(user_form.value).toEqual({ email: "", message: "" });
  });

  it("should not submit if the formUserMessage is invalid", () => {
    component.formUserMessage.setValue({
      email: "test@test.com",
      message: "Test message",
    });
    component.submit();
    expect(component.submitStatus$).toBeUndefined();
  });

  it("should not submit if the token is not available", () => {
    component.resolvedRecaptcha(null);
    component.formUserMessage.setValue({
      email: "test@test.com",
      message: "Test message",
    });
    component.submit();
    expect(component.submitStatus$).toBeUndefined();
  });

  it("should submit the form data and set the email message status when both email and message are provided", () => {
    component.resolvedRecaptcha("test-token");
    component.formUserMessage.setValue({
      email: "test@test.com",
      message: "Test message",
    });
    component.submit();
    expect(component.submitStatus$).toBeDefined();
  });

  it("should reset the formUserMessage after submission", () => {
    component.resolvedRecaptcha("test-token");
    component.formUserMessage.setValue({
      email: "test@test.com",
      message: "Test message",
    });
    component.submit();
    expect(component.formUserMessage.value).toEqual({ email: "", message: "" });
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
});
