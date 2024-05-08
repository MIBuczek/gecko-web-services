import { Injectable } from "@angular/core";
import { ReCaptchaV3Service } from "ng-recaptcha";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class RecaptchaService {
  constructor(private recaptchaV3Service: ReCaptchaV3Service) {}

  /**
   * Retrieves a token for the specified action.
   *
   * @param {string} action - The action for which to retrieve the token.
   * @return {Observable<string | null>} An observable that emits the token or null if the token retrieval fails.
   */
  public getToken(action: string): Observable<string | null> {
    return this.recaptchaV3Service.execute(action);
  }
}
