import { Injectable } from "@angular/core";
import { FirebaseApp } from "@angular/fire/app";
import { AppCheck } from "@angular/fire/app-check";
import { environment } from "environments/environment";
import { initializeApp } from "firebase/app";
import {
  AppCheckTokenResult,
  getToken,
  initializeAppCheck,
  ReCaptchaEnterpriseProvider,
} from "firebase/app-check";

@Injectable({
  providedIn: "root",
})
export class AppCheckService {
  app: FirebaseApp;
  appCheck: AppCheck;

  constructor() {
    this.app = initializeApp(environment.firebase);
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
