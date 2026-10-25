import { AsyncPipe, JsonPipe, NgIf } from "@angular/common";
import { ChangeDetectionStrategy, Component } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { Router, RouterLink } from "@angular/router";
import { ErrorMessageComponent } from "components/error-message/error-message.component";
import { NotificationComponent } from "components/notification/notification.component";
import { AppCheckService } from "app/services/app-check/app-check.service";
import { RecaptchaService } from "app/services/recaptcha/recaptcha.service";
import { take } from "rxjs";
import { AuthService } from "services/auth/auth.service";

@Component({
  selector: "app-login-main",
  templateUrl: "./main.component.html",
  styleUrl: "./main.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    AsyncPipe,
    JsonPipe,
    NgIf,
    ReactiveFormsModule,
    RouterLink,
    ErrorMessageComponent,
    NotificationComponent,
  ],
})
export class MainComponent {
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

  constructor(
    private auth: AuthService,
    private router: Router,
    private recaptchaService: RecaptchaService
  ) {
    this.auth.currentUser.pipe(take(1)).subscribe((user) => {
      if (user) this.router.navigate(["admin"]);
    });
  }

  get loginError() {
    return this.auth.authError$;
  }
  /**
   * A method that handles form submission.
   *
   * @return void
   */
  onSubmit(): void {
    this.recaptchaService
      .getToken("loginAction")
      .pipe(take(1))
      .subscribe((token) => {
        if (this.logInForm.invalid || !token) return;
        const { email, password } = this.logInForm.value;
        if (!email || !password) return;
        this.auth.login(email, password);
      });
  }
}
