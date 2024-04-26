import { Pipe, PipeTransform } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { formErrorMessageConst } from 'app/utilities/variables/form-error-message.const';

@Pipe({
  name: 'formErrorMessage',
  pure: false,
  standalone: true
})
export class FormErrorMessagePipe implements PipeTransform {
  /**
   * Pipe to handle the form error messages
   *
   * @param form
   * @param fieldName
   * @param currentLang
   */
  transform(form: FormGroup, fieldName: string, currentLang: 'pl' | 'en'): string[] {
    const errors = form.controls[fieldName].errors || {};
    return Object.keys(errors).map((key) => {
      switch (key) {
        case 'minlength': {
          return `${formErrorMessageConst[currentLang][key]} ${errors[key]['requiredLength']}`;
        }
        case 'maxlength': {
          return `${formErrorMessageConst[currentLang]}[key]} ${errors[key]['requiredLength']}`;
        }
        default: {
          return `${formErrorMessageConst[currentLang][key]}`;
        }
      }
    });
  }
}
