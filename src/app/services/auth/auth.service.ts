import { inject, Injectable, signal } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { Auth, signInWithEmailAndPassword, user } from "@angular/fire/auth";
import { Router } from "@angular/router";
import { signOut, User } from "firebase/auth";
@Injectable({
  providedIn: "root",
})
export class AuthService {
  private router = inject(Router);

  private auth: Auth = inject(Auth);
  private readonly user$ = user(this.auth);

  /**
   * The currently signed in user, or null.
   *
   * @return {Signal<User | null>} The currently signed in user, or null.
   */
  readonly currentUser = toSignal(this.user$, { initialValue: null });

  private readonly _authError = signal<unknown>(null);

  /**
   * The last authentication error, cleared automatically after 10 seconds.
   *
   * @return {Signal<unknown>} The last authentication error.
   */
  readonly authError = this._authError.asReadonly();

  /**
   * Resolves once Firebase has restored the persisted session. Awaited by the
   * admin guard, which needs a settled answer rather than a stream.
   *
   * @return {Promise<void>} A promise that resolves when the state is ready.
   */
  async whenReady(): Promise<void> {
    await this.auth.authStateReady();
  }

  /**
   * A function to login with the provided email and password.
   *
   * @param {string} email - The email of the user.
   * @param {string} password - The password of the user.
   * @return {Promise<void>} Redirect user do admin panel.
   */
  async login(email: string, password: string): Promise<void> {
    try {
      const resp = await signInWithEmailAndPassword(this.auth, email, password);
      localStorage.setItem("lastLogin", new Date().getTime().toString());
      if (resp) {
        await this.router.navigate(["/admin"]);
      }
    } catch (err) {
      this.reportError(err);
    }
  }

  /**
   * Logs out the user by signing them out of the authentication service.
   *
   * @return {Promise<void>} A promise that resolves when the user is successfully logged out.
   */
  async logout(): Promise<void> {
    try {
      await signOut(this.auth).then(() => localStorage.clear());
      console.log("logged out");
    } catch (err) {
      this.reportError(err);
    }
  }

  private reportError(err: unknown): void {
    this._authError.set(err);
    setTimeout(() => this._authError.set(null), 10000);
    console.error(err);
  }
}
