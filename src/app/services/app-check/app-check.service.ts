import { inject, Injectable } from "@angular/core";
import type { FirebaseApp } from "firebase/app";
import {
  AppCheck,
  AppCheckTokenResult,
  getToken,
  initializeAppCheck,
  ReCaptchaEnterpriseProvider,
} from "firebase/app-check";
import { environment } from "environments/environment";
import { FIREBASE_APP } from "utilities/firebase.tokens";

@Injectable({
  providedIn: "root",
})
export class AppCheckService {
  app: FirebaseApp = inject(FIREBASE_APP);

  appCheck: AppCheck;

  constructor() {
    this.appCheck = initializeAppCheck(this.app, {
      provider: new ReCaptchaEnterpriseProvider(environment.recaptcha.siteKey),
      isTokenAutoRefreshEnabled: true, // Set to true to allow auto-refresh.
    });
  }

  /**
   * Asynchronously retrieves the AppCheck token.
   *
   * @return {Promise<AppCheckTokenResult | undefined>} The retrieved AppCheck token or undefined if not available.
   */
  async getToken(): Promise<AppCheckTokenResult | undefined> {
    let appCheckTokenResponse;
    try {
      appCheckTokenResponse = await getToken(this.appCheck);
    } catch (err) {
      // TODO: Handle any errors if the token was not retrieved.
      return;
    }
    return appCheckTokenResponse;
  }
}
