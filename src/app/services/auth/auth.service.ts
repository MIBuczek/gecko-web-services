import { inject, Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword, user } from '@angular/fire/auth'
import { Router } from '@angular/router';
import { signOut, User } from 'firebase/auth';
import { Observable, of, ReplaySubject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth: Auth = inject(Auth);
  private readonly user$ = user(this.auth)
  readonly authError$ = new ReplaySubject()


  constructor(private router: Router) {
  }

  /**
 * Get the current user.
 *
 * @return {Observable<User>} The current user.
 */
  get currentUser(): Observable<User | null> {
    return this.user$
  }
  /**
 * A function to login with the provided email and password.
 *
 * @param {string} email - The email of the user.
 * @param {string} password - The password of the user.
 * @return {Promise<any>} Redirect user do admin panel.
 */
  async login(email: string, password: string): Promise<void> {
    try {
      const resp = await signInWithEmailAndPassword(this.auth, email, password);
      if (resp) {
        await this.router.navigate(['/admin'])
      }
    } catch (err) {
      this.authError$.next(err)
      setTimeout(() => this.authError$.next(null), 10000)
      console.error(err)
    }
  }

  /**
 * Logs out the user by signing them out of the authentication service.
 *
 * @return {Promise<void>} A promise that resolves when the user is successfully logged out.
 */
  async logout(): Promise<void> {
    try {
      await signOut(this.auth)

      console.log('logged out')
    } catch (err) {
      console.error(err)
    }
  }
}
