import { Pipe, PipeTransform } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { formErrorMessageConst } from "app/utilities/variables/form-error-message.const";

@Pipe({
  name: "formErrorMessage",
  pure: false,
  standalone: true,
})
export class FormErrorMessagePipe implements PipeTransform {
  /**
   * Transforms the form error messages based on the provided form, field name, and current language.
   *
   * @param {FormGroup} form - The form group containing the form controls.
   * @param {string} fieldName - The name of the field to get the errors for.
   * @param {"pl" | "en"} currentLang - The current language to use for the error messages.
   * @return {string[]} An array of transformed error messages.
   */
  transform(
    form: FormGroup,
    fieldName: string,
    currentLang: "pl" | "en"
  ): string[] {
    const errors = form.controls[fieldName].errors || {};
    return Object.keys(errors).map((key) => {
      switch (key) {
        case "minlength": {
          return `${formErrorMessageConst[currentLang][key]} ${errors[key]["requiredLength"]}`;
        }
        case "maxlength": {
          return `${formErrorMessageConst[currentLang][key]} ${errors[key]["requiredLength"]}`;
        }
        default: {
          return `${formErrorMessageConst[currentLang][key]}`;
        }
      }
    });
  }
}
