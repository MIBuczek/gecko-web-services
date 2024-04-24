import { inject, Injectable } from '@angular/core';
import { Auth, GoogleAuthProvider, signInWithEmailAndPassword, user } from '@angular/fire/auth'
import { OAuthCredential, signOut } from 'firebase/auth';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth: Auth = inject(Auth);
  private provider = new GoogleAuthProvider();
  readonly user$ = user(this.auth)

  /**
 * A function to login with the provided email and password.
 *
 * @param {string} email - The email of the user.
 * @param {string} password - The password of the user.
 * @return {Promise<any>} The credentials of the logged-in user.
 */
  async login(email: string, password: string): Promise<OAuthCredential | null> {
    try {
      const resp = await signInWithEmailAndPassword(this.auth, email, password);
      const credentials = GoogleAuthProvider.credentialFromResult(resp);
      return credentials
    } catch (err) {
      console.error(err)
      return null
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
