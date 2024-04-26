import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-error-message',
  templateUrl: './error-message.component.html',
})
export class ErrorMessageComponent {
  @Input({ required: true }) form: FormGroup | undefined;
  @Input({ required: true }) fieldName = '';

  /**
   * Current app selected lang.
   */
  currentLang: 'pl' | 'en' = 'pl';
}
