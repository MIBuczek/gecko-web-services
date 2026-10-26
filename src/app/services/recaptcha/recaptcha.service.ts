import { Injectable } from "@angular/core";
import { environment } from "environments/environment";

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

const SCRIPT_ID = "recaptcha-enterprise-script";
const SCRIPT_SRC = "https://www.google.com/recaptcha/enterprise.js";

const getGrecaptcha = (): GrecaptchaGlobal | undefined =>
  (globalThis as unknown as { grecaptcha?: GrecaptchaGlobal }).grecaptcha;

/**
 * Loads the reCAPTCHA Enterprise script once and exposes the v3 API.
 *
 * Replaces `ng-recaptcha`, whose last release predates Angular 18 and therefore
 * blocks the framework upgrade. Only `execute` is used by this project.
 *
 * The Enterprise build is loaded deliberately: Firebase App Check initialises
 * its provider with `grecaptcha.enterprise`, and the non-Enterprise `api.js`
 * overwrites `window.grecaptcha` with an object that has no `.enterprise`
 * property. Using one script type for both consumers keeps them consistent.
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
   * @return {Promise<string | null>} The token, or null if retrieval fails.
   */
  public async getToken(action: string): Promise<string | null> {
    try {
      await this.loadScript();
      return await this.execute(action);
    } catch {
      // A blocked or failed reCAPTCHA must not break the caller's flow;
      // callers treat a null token as "do not proceed".
      return null;
    }
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

    RecaptchaService.scriptPromise = this.createScriptPromise();

    return RecaptchaService.scriptPromise;
  }

  private createScriptPromise(): Promise<void> {
    if (typeof document === "undefined") return Promise.resolve();

    // Already available (App Check, or a previous load): nothing to do.
    if (getGrecaptcha()) return Promise.resolve();

    // App Check injects this same script itself, and it may still be in flight.
    // Wait for the global instead of adding a duplicate copy.
    if (document.querySelector('script[src*="recaptcha"]')) {
      return this.waitForGrecaptcha();
    }

    return new Promise<void>((resolve, reject) => {
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
  }

  private waitForGrecaptcha(timeoutMs = 10000): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const startedAt = Date.now();
      const poll = (): void => {
        if (getGrecaptcha()) {
          resolve();
          return;
        }
        if (Date.now() - startedAt > timeoutMs) {
          reject(new Error("reCAPTCHA script did not initialise"));
          return;
        }
        setTimeout(poll, 100);
      };
      poll();
    });
  }
}
