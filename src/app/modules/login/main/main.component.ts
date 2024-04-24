import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Route, Router } from '@angular/router';
import { AuthService } from 'services/auth/auth.service';

@Component({
  selector: 'app-login-main',
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainComponent {

  /**
    * @readonly Login Form
    */
  readonly logInForm = new FormGroup<{ email: FormControl<string | null>, password: FormControl<string | null> }>({
    email: new FormControl('', [
      Validators.required,
      Validators.email,
      Validators.minLength(3),
      Validators.maxLength(125)
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
      Validators.maxLength(30)
    ])
  });

  constructor(private auth: AuthService, private router: Router) { }

  /**
   * A method that handles form submission.
   *
   * @return void
   */
  async onSubmit() {
    if (this.logInForm.invalid) return;
    const { email, password } = this.logInForm.value;
    console.log(email, password)
    if (!email || !password) return
    try {
      const credentials = this.auth.login(email, password)
      if (!credentials) return
      await this.router.navigate(['/admin'])
    } catch (err) {
      console.error(err)
    }
  }
}
