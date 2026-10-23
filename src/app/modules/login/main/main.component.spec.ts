import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ReactiveFormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import { RecaptchaService } from "app/services/recaptcha/recaptcha.service";
import { environment } from "environments/environment";
import { of, ReplaySubject } from "rxjs";
import { AuthService } from "services/auth/auth.service";
import { MainComponent } from "./main.component";

const buildComponent = async (
  currentUser: unknown
): Promise<{
  fixture: ComponentFixture<MainComponent>;
  component: MainComponent;
  auth: { currentUser: unknown; authError$: ReplaySubject<unknown>; login: jest.Mock };
  router: { navigate: jest.Mock };
  recaptcha: { getToken: jest.Mock };
}> => {
  const auth = {
    currentUser: of(currentUser),
    authError$: new ReplaySubject<unknown>(),
    login: jest.fn(),
  };
  const router = { navigate: jest.fn() };
  const recaptcha = { getToken: jest.fn().mockReturnValue(of("token")) };

  await TestBed.configureTestingModule({
    declarations: [MainComponent],
    providers: [
      { provide: AuthService, useValue: auth },
      { provide: Router, useValue: router },
      { provide: RecaptchaService, useValue: recaptcha },
    ],
    imports: [ReactiveFormsModule],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
  }).compileComponents();

  const fixture = TestBed.createComponent(MainComponent);
  fixture.detectChanges();
  return { fixture, component: fixture.componentInstance, auth, router, recaptcha };
};

describe("LoginMainComponent", () => {
  let component: MainComponent;
  let fixture: ComponentFixture<MainComponent>;
  let auth: { currentUser: unknown; authError$: ReplaySubject<unknown>; login: jest.Mock };
  let router: { navigate: jest.Mock };
  let recaptcha: { getToken: jest.Mock };

  beforeEach(async () => {
    ({ fixture, component, auth, router, recaptcha } = await buildComponent(null));
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("is the recaptcha site key taken from the environment", () => {
    expect(component.siteKey).toEqual(environment.recaptcha.siteKey);
  });

  it("is the form invalid when empty", () => {
    expect(component.logInForm.invalid).toBeTruthy();
  });

  it("is the email control rejecting a malformed address", () => {
    component.logInForm.controls.email.setValue("not-an-email");
    expect(component.logInForm.controls.email.hasError("email")).toBeTruthy();
  });

  it("is the email control enforcing a maximum length of 125", () => {
    component.logInForm.controls.email.setValue(`${"a".repeat(120)}@example.com`);
    expect(component.logInForm.controls.email.hasError("maxlength")).toBeTruthy();
  });

  it("is the password control enforcing a minimum length of 6", () => {
    component.logInForm.controls.password.setValue("12345");
    expect(component.logInForm.controls.password.hasError("minlength")).toBeTruthy();
  });

  it("is the form valid for correct credentials", () => {
    component.logInForm.setValue({
      email: "admin@example.com",
      password: "secret123",
    });
    expect(component.logInForm.valid).toBeTruthy();
  });

  it("is the submit button disabled while the form is invalid", () => {
    const submit = fixture.debugElement.nativeElement.querySelector(
      "button[type=submit]"
    ) as HTMLButtonElement;
    expect(submit.disabled).toBeTruthy();
  });

  it("is login called with the entered credentials", () => {
    component.logInForm.setValue({
      email: "admin@example.com",
      password: "secret123",
    });
    component.onSubmit();
    expect(auth.login).toHaveBeenCalledWith("admin@example.com", "secret123");
  });

  it("is login not called when the form is invalid", () => {
    component.onSubmit();
    expect(auth.login).not.toHaveBeenCalled();
  });

  it("is login not called when no recaptcha token is returned", () => {
    recaptcha.getToken.mockReturnValue(of(null));
    component.logInForm.setValue({
      email: "admin@example.com",
      password: "secret123",
    });
    component.onSubmit();
    expect(auth.login).not.toHaveBeenCalled();
  });

  it("is the requested recaptcha action passed through", () => {
    component.onSubmit();
    expect(recaptcha.getToken).toHaveBeenCalledWith("loginAction");
  });

  it("is loginError exposed from the auth service", () => {
    expect(component.loginError).toBe(auth.authError$);
  });
});

describe("LoginMainComponent - already authenticated", () => {
  let router: { navigate: jest.Mock };

  beforeEach(async () => {
    ({ router } = await buildComponent({ email: "admin@example.com" }));
  });

  it("is the user redirected to the admin panel", () => {
    expect(router.navigate).toHaveBeenCalledWith(["admin"]);
  });
});
