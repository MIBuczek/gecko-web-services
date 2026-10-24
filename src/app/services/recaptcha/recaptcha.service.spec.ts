import { environment } from "environments/environment";
import { RecaptchaService } from "./recaptcha.service";

describe("RecaptchaService", () => {
  const SITE_KEY = environment.recaptcha.siteKey;
  let service: RecaptchaService;

  const stubGrecaptcha = (api: unknown): void => {
    (globalThis as unknown as { grecaptcha: unknown }).grecaptcha = api;
  };

  const readyApi = (execute: jest.Mock) => ({
    ready: (cb: () => void) => cb(),
    execute,
  });

  beforeEach(() => {
    // The loaded-script promise is cached statically, so reset it per test.
    (
      RecaptchaService as unknown as { scriptPromise?: Promise<void> }
    ).scriptPromise = undefined;
    service = new RecaptchaService();
    jest.restoreAllMocks();
  });

  afterEach(() => {
    delete (globalThis as unknown as { grecaptcha?: unknown }).grecaptcha;
    document
      .querySelectorAll("#recaptcha-enterprise-script")
      .forEach((el) => el.remove());
    document
      .querySelectorAll('script[src*="recaptcha"]')
      .forEach((el) => el.remove());
  });

  it("emits the token returned by grecaptcha.execute", (done) => {
    stubGrecaptcha(readyApi(jest.fn().mockResolvedValue("a-token")));

    service.getToken("loginAction").subscribe((token) => {
      expect(token).toBe("a-token");
      done();
    });
  });

  it("passes the environment site key and the requested action through", (done) => {
    const execute = jest.fn().mockResolvedValue("a-token");
    stubGrecaptcha(readyApi(execute));

    service.getToken("sendEmailMessage").subscribe(() => {
      expect(execute).toHaveBeenCalledWith(SITE_KEY, {
        action: "sendEmailMessage",
      });
      done();
    });
  });

  it("uses the enterprise namespace when that is where execute lives", (done) => {
    // `index.html` loads enterprise.js, which exposes execute under
    // `grecaptcha.enterprise` rather than on the root object.
    const execute = jest.fn().mockResolvedValue("enterprise-token");
    stubGrecaptcha({
      ready: (cb: () => void) => cb(),
      enterprise: { execute },
    });

    service.getToken("loginAction").subscribe((token) => {
      expect(token).toBe("enterprise-token");
      expect(execute).toHaveBeenCalledWith(SITE_KEY, { action: "loginAction" });
      done();
    });
  });

  it("emits null and completes when execute rejects", (done) => {
    stubGrecaptcha(readyApi(jest.fn().mockRejectedValue(new Error("blocked"))));

    service.getToken("loginAction").subscribe((token) => {
      expect(token).toBeNull();
      done();
    });
  });

  it("emits null when the grecaptcha global is missing entirely", (done) => {
    // No API present, so the loader injects a script. Make it fail to load.
    jest.spyOn(document.head, "appendChild").mockImplementation((node) => {
      (node as HTMLScriptElement).onerror?.(new Event("error"));
      return node;
    });

    service.getToken("loginAction").subscribe((token) => {
      expect(token).toBeNull();
      done();
    });
  });

  it("emits null when neither namespace exposes execute", (done) => {
    stubGrecaptcha({ ready: (cb: () => void) => cb() });

    service.getToken("loginAction").subscribe((token) => {
      expect(token).toBeNull();
      done();
    });
  });

  it("emits null rather than throwing when the script fails to load", (done) => {
    const appendChild = jest
      .spyOn(document.head, "appendChild")
      .mockImplementation((node) => {
        (node as HTMLScriptElement).onerror?.(new Event("error"));
        return node;
      });

    service.getToken("loginAction").subscribe((token) => {
      expect(token).toBeNull();
      expect(appendChild).toHaveBeenCalled();
      done();
    });
  });

  it("injects the script only once across repeated calls", (done) => {
    stubGrecaptcha(readyApi(jest.fn().mockResolvedValue("a-token")));
    const appendChild = jest.spyOn(document.head, "appendChild");

    service.getToken("first").subscribe(() => {
      service.getToken("second").subscribe(() => {
        expect(appendChild).not.toHaveBeenCalled();
        done();
      });
    });
  });

  it("loads the enterprise build, matching what App Check uses", (done) => {
    const appendChild = jest
      .spyOn(document.head, "appendChild")
      .mockImplementation((node) => {
        const script = node as HTMLScriptElement;
        expect(script.src).toContain("recaptcha/enterprise.js");
        expect(script.src).toContain(`render=${SITE_KEY}`);
        // Fail the load so the flow completes; the URL assertions above are
        // what this test is about.
        script.onerror?.(new Event("error"));
        return node;
      });

    service.getToken("loginAction").subscribe((token) => {
      expect(token).toBeNull();
      expect(appendChild).toHaveBeenCalled();
      done();
    });
  });

  it("waits for an in-flight recaptcha script instead of duplicating it", (done) => {
    // Simulate App Check having already injected the script.
    const existing = document.createElement("script");
    existing.src = "https://www.google.com/recaptcha/enterprise.js";
    document.head.appendChild(existing);
    const appendChild = jest.spyOn(document.head, "appendChild");

    setTimeout(() => {
      stubGrecaptcha(readyApi(jest.fn().mockResolvedValue("late-token")));
    }, 150);

    service.getToken("loginAction").subscribe((token) => {
      expect(token).toBe("late-token");
      expect(appendChild).not.toHaveBeenCalled();
      done();
    });
  });
});
