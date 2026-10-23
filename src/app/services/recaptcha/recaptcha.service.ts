import { Injectable } from "@angular/core";
import { environment } from "environments/environment";
import { Observable, Subject } from "rxjs";

/**
 * Minimal ambient shape of the reCAPTCHA globals used here.
 *
 * `@types/grecaptcha` only types the v2 widget API, so the v3 `execute` call is
 * declared locally rather than pulled in as a dependency.
 */
type RecaptchaApi = {
  ready(callback: () => void): void;
  execute(siteKey: string, options: { action: string }): Promise<string>;
};

type GrecaptchaGlobal = Partial<RecaptchaApi> & {
  enterprise?: Partial<RecaptchaApi>;
};

const SCRIPT_ID = "recaptcha-v3-script";
const SCRIPT_SRC = "https://www.google.com/recaptcha/api.js";

const getGrecaptcha = (): GrecaptchaGlobal | undefined =>
  (globalThis as unknown as { grecaptcha?: GrecaptchaGlobal }).grecaptcha;

/**
 * Loads the reCAPTCHA v3 script once and exposes the v3 API.
 *
 * Replaces `ng-recaptcha`, whose last release predates Angular 18 and therefore
 * blocks the framework upgrade. Only `execute` is used by this project.
 */
@Injectable({
  providedIn: "root",
})
export class RecaptchaService {
  private static scriptPromise?: Promise<void>;

  /**
   * Retrieves a token for the specified action.
   *
   * @param {string} action - The action for which to retrieve the token.
   * @return {Observable<string | null>} An observable that emits the token, or
   * null if token retrieval fails.
   */
  public getToken(action: string): Observable<string | null> {
    const subject = new Subject<string | null>();

    this.loadScript()
      .then(() => this.execute(action))
      .then(
        (token) => {
          subject.next(token);
          subject.complete();
        },
        () => {
          // A blocked or failed reCAPTCHA must not break the caller's flow;
          // callers treat a null token as "do not proceed".
          subject.next(null);
          subject.complete();
        }
      );

    return subject.asObservable();
  }

  private get siteKey(): string {
    return environment.recaptcha.siteKey;
  }

  private execute(action: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      const api = getGrecaptcha();

      if (!api || typeof api.ready !== "function") {
        reject(new Error("reCAPTCHA API is unavailable"));
        return;
      }

      api.ready(() => {
        // `index.html` loads the Enterprise build, which exposes the API under
        // `grecaptcha.enterprise` and is also what Firebase App Check reads.
        // Prefer whichever namespace actually carries `execute`.
        const target =
          typeof api.execute === "function" ? api : api.enterprise;

        if (!target || typeof target.execute !== "function") {
          reject(new Error("reCAPTCHA execute is unavailable"));
          return;
        }

        target.execute(this.siteKey, { action }).then(resolve, reject);
      });
    });
  }

  private loadScript(): Promise<void> {
    if (RecaptchaService.scriptPromise) return RecaptchaService.scriptPromise;

    RecaptchaService.scriptPromise = new Promise<void>((resolve, reject) => {
      if (typeof document === "undefined") {
        resolve();
        return;
      }
      // If the API is already present there is nothing to load. `index.html`
      // loads the Enterprise build and Firebase App Check may load one too, so
      // this is the common path in the browser.
      if (getGrecaptcha()) {
        resolve();
        return;
      }
      // Guard against a second injection; the static promise already makes this
      // once-per-app.
      if (document.getElementById(SCRIPT_ID)) {
        resolve();
        return;
      }
      const script = document.createElement("script");
      script.id = SCRIPT_ID;
      script.src = `${SCRIPT_SRC}?render=${this.siteKey}`;
      script.async = true;
      script.defer = true;
      script.onload = () => resolve();
      script.onerror = () =>
        reject(new Error("reCAPTCHA script failed to load"));
      document.head.appendChild(script);
    });

    return RecaptchaService.scriptPromise;
  }
}
