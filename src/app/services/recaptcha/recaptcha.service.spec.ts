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

  it("emits the token returned by grecaptcha.execute", async () => {
    stubGrecaptcha(readyApi(jest.fn().mockResolvedValue("a-token")));

    await expect(service.getToken("loginAction")).resolves.toBe("a-token");
  });

  it("passes the environment site key and the requested action through", async () => {
    const execute = jest.fn().mockResolvedValue("a-token");
    stubGrecaptcha(readyApi(execute));

    await service.getToken("sendEmailMessage");
    expect(execute).toHaveBeenCalledWith(SITE_KEY, {
      action: "sendEmailMessage",
    });
  });

  it("uses the enterprise namespace when that is where execute lives", async () => {
    // `index.html` loads enterprise.js, which exposes execute under
    // `grecaptcha.enterprise` rather than on the root object.
    const execute = jest.fn().mockResolvedValue("enterprise-token");
    stubGrecaptcha({
      ready: (cb: () => void) => cb(),
      enterprise: { execute },
    });

    await expect(service.getToken("loginAction")).resolves.toBe(
      "enterprise-token"
    );
    expect(execute).toHaveBeenCalledWith(SITE_KEY, { action: "loginAction" });
  });

  it("emits null and completes when execute rejects", async () => {
    stubGrecaptcha(readyApi(jest.fn().mockRejectedValue(new Error("blocked"))));

    await expect(service.getToken("loginAction")).resolves.toBeNull();
  });

  it("emits null when the grecaptcha global is missing entirely", async () => {
    // No API present, so the loader injects a script. Make it fail to load.
    jest.spyOn(document.head, "appendChild").mockImplementation((node) => {
      (node as HTMLScriptElement).onerror?.(new Event("error"));
      return node;
    });

    await expect(service.getToken("loginAction")).resolves.toBeNull();
  });

  it("emits null when neither namespace exposes execute", async () => {
    stubGrecaptcha({ ready: (cb: () => void) => cb() });

    await expect(service.getToken("loginAction")).resolves.toBeNull();
  });

  it("emits null rather than throwing when the script fails to load", async () => {
    const appendChild = jest
      .spyOn(document.head, "appendChild")
      .mockImplementation((node) => {
        (node as HTMLScriptElement).onerror?.(new Event("error"));
        return node;
      });

    await expect(service.getToken("loginAction")).resolves.toBeNull();
    expect(appendChild).toHaveBeenCalled();
  });

  it("injects the script only once across repeated calls", async () => {
    stubGrecaptcha(readyApi(jest.fn().mockResolvedValue("a-token")));
    const appendChild = jest.spyOn(document.head, "appendChild");

    await service.getToken("first");
    await service.getToken("second");
    expect(appendChild).not.toHaveBeenCalled();
  });

  it("loads the enterprise build, matching what App Check uses", async () => {
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

    await expect(service.getToken("loginAction")).resolves.toBeNull();
    expect(appendChild).toHaveBeenCalled();
  });

  it("waits for an in-flight recaptcha script instead of duplicating it", async () => {
    // Simulate App Check having already injected the script.
    const existing = document.createElement("script");
    existing.src = "https://www.google.com/recaptcha/enterprise.js";
    document.head.appendChild(existing);
    const appendChild = jest.spyOn(document.head, "appendChild");

    setTimeout(() => {
      stubGrecaptcha(readyApi(jest.fn().mockResolvedValue("late-token")));
    }, 150);

    await expect(service.getToken("loginAction")).resolves.toBe("late-token");
    expect(appendChild).not.toHaveBeenCalled();
  });
});
