import { FormControl, FormGroup, Validators } from "@angular/forms";
import { formErrorMessageConst } from "app/utilities/variables/form-error-message.const";
import { FormErrorMessagePipe } from "./form-error-message.pipe";

const buildForm = (
  emailValue: string,
  messageValue: string
): FormGroup =>
  new FormGroup({
    email: new FormControl(emailValue, [
      Validators.required,
      Validators.email,
      Validators.minLength(3),
    ]),
    message: new FormControl(messageValue, [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(10),
    ]),
  });

describe("FormErrorMessagePipe", () => {
  let pipe: FormErrorMessagePipe;

  beforeEach(() => {
    pipe = new FormErrorMessagePipe();
  });

  it("is no message emitted for a field without errors", () => {
    const form = buildForm("michal@test.pl", "Test message");

    expect(pipe.transform(form, "email", "pl")).toEqual([]);
  });

  it("is the required message returned for an empty field", () => {
    const form = buildForm("", "");

    expect(pipe.transform(form, "email", "pl")).toEqual([
      formErrorMessageConst["pl"]["required"],
    ]);
  });

  it("is the minlength message returned with its required length", () => {
    /* The message field has no email validator, so minlength is the only error. */
    const form = buildForm("michal@test.pl", "te");

    expect(pipe.transform(form, "message", "pl")).toEqual([
      `${formErrorMessageConst["pl"]["minlength"]} 3`,
    ]);
  });

  it("is the maxlength message returned with its required length", () => {
    const form = buildForm("michal@test.pl", "a message that is too long");

    expect(pipe.transform(form, "message", "pl")).toEqual([
      `${formErrorMessageConst["pl"]["maxlength"]} 10`,
    ]);
  });

  it("is every active error returned when more than one applies", () => {
    const form = buildForm("te", "Test message");

    /* "te" is both too short and not a valid email address. The pipe maps over
       the error keys Angular merged, so compare as a set. */
    expect(
      pipe.transform(form, "email", "pl").sort()
    ).toEqual(
      [
        `${formErrorMessageConst["pl"]["minlength"]} 3`,
        formErrorMessageConst["pl"]["email"],
      ].sort()
    );
  });

  it("is the message emitted in the requested language", () => {
    const form = buildForm("te", "Test message");

    expect(pipe.transform(form, "email", "en").sort()).toEqual(
      [
        `${formErrorMessageConst["en"]["minlength"]} 3`,
        formErrorMessageConst["en"]["email"],
      ].sort()
    );
  });

  it("is the email pattern message returned for a malformed address", () => {
    const form = buildForm("not-an-email", "Test message");

    expect(pipe.transform(form, "email", "en")).toEqual([
      formErrorMessageConst["en"]["email"],
    ]);
  });
});
