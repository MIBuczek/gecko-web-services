import { JsonPipe, NgIf } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
} from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { Router, RouterLink } from "@angular/router";
import { ErrorMessageComponent } from "components/error-message/error-message.component";
import { NotificationComponent } from "components/notification/notification.component";
import { RecaptchaService } from "app/services/recaptcha/recaptcha.service";
import { AuthService } from "services/auth/auth.service";

@Component({
  selector: "app-login-main",
  templateUrl: "./main.component.html",
  styleUrl: "./main.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    JsonPipe,
    NgIf,
    ReactiveFormsModule,
    RouterLink,
    ErrorMessageComponent,
    NotificationComponent,
  ],
})
export class MainComponent {
  private auth = inject(AuthService);
  private router = inject(Router);
  private recaptchaService = inject(RecaptchaService);

  /**
   * @readonly Login Form
   */
  readonly logInForm = new FormGroup<{
    email: FormControl<string | null>;
    password: FormControl<string | null>;
  }>({
    email: new FormControl("", [
      Validators.required,
      Validators.email,
      Validators.minLength(3),
      Validators.maxLength(125),
    ]),
    password: new FormControl("", [
      Validators.required,
      Validators.minLength(6),
      Validators.maxLength(30),
    ]),
  });

  constructor() {
    /* Send an already authenticated user straight to the admin panel. */
    effect(() => {
      if (this.auth.currentUser()) this.router.navigate(["admin"]);
    });
  }

  get loginError() {
    return this.auth.authError;
  }

  /**
   * A method that handles form submission.
   *
   * @return {Promise<void>}
   */
  async onSubmit(): Promise<void> {
    const token = await this.recaptchaService.getToken("loginAction");
    if (this.logInForm.invalid || !token) return;
    const { email, password } = this.logInForm.value;
    if (!email || !password) return;
    await this.auth.login(email, password);
  }
}
