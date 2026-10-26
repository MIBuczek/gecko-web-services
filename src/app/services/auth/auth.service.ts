import { DestroyRef, inject, Injectable, signal } from "@angular/core";
import { Router } from "@angular/router";
import {
  onIdTokenChanged,
  signInWithEmailAndPassword,
  signOut,
  User,
} from "firebase/auth";
import { FIREBASE_AUTH } from "utilities/firebase.tokens";
@Injectable({
  providedIn: "root",
})
export class AuthService {
  private router = inject(Router);

  private auth = inject(FIREBASE_AUTH);

  private readonly _currentUser = signal<User | null>(null);

  /**
   * The currently signed in user, or null.
   *
   * @return {Signal<User | null>} The currently signed in user, or null.
   */
  readonly currentUser = this._currentUser.asReadonly();

  private readonly _authError = signal<unknown>(null);

  /**
   * The last authentication error, cleared automatically after 10 seconds.
   *
   * @return {Signal<unknown>} The last authentication error.
   */
  readonly authError = this._authError.asReadonly();

  constructor() {
    /* Tracks the user the way @angular/fire's user() did, but into a signal.
       onIdTokenChanged fires once on subscribe, so the signal settles without
       needing an initial value. */
    const unsubscribe = onIdTokenChanged(this.auth, (user) =>
      this._currentUser.set(user)
    );
    inject(DestroyRef).onDestroy(unsubscribe);
  }

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
