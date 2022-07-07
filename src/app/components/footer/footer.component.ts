import {Component} from '@angular/core';
import {footerTextContent} from "text-content/footer";
import {LandSwitcherService} from "services/lang-switcher/land-switcher.service";
import {errorMessageTextContent} from "text-content/error-message";
import {AbstractControl, FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
  public currentYear = new Date().getFullYear()
  public currentLang: 'PL' | 'EN' = "PL"
  public textContent = footerTextContent;
  public errorMessages = errorMessageTextContent

  public formUserMessage = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email, Validators.minLength(3)]),
    message: new FormControl('', [Validators.required, Validators.minLength(3)])
  })

  constructor(private ls: LandSwitcherService) {
    ls.getCurrentLang.subscribe((lang) => this.currentLang = lang)
  }

  get formControls(): { [x: string]: AbstractControl } {
    return this.formUserMessage.controls
  }

  public submit(): void {
    if (this.formUserMessage.invalid) return
    console.log(this.formUserMessage.value)
  }
}
