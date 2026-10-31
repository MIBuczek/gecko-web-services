import { TestBed } from "@angular/core/testing";
import {
  getToken,
  initializeAppCheck,
  ReCaptchaEnterpriseProvider,
} from "firebase/app-check";
import { environment } from "environments/environment";
import { FIREBASE_APP } from "utilities/firebase.tokens";
import { AppCheckService } from "./app-check.service";

jest.mock("firebase/app-check", () => ({
  initializeAppCheck: jest.fn(),
  getToken: jest.fn(),
  ReCaptchaEnterpriseProvider: jest.fn(),
}));

const mockInitializeAppCheck = initializeAppCheck as jest.Mock;
const mockGetToken = getToken as jest.Mock;
const MockProvider = ReCaptchaEnterpriseProvider as unknown as jest.Mock;

describe("AppCheckService", () => {
  let service: AppCheckService;
  const firebaseApp = { name: "[DEFAULT]" };
  const appCheck = { type: "app-check" };

  beforeEach(() => {
    jest.clearAllMocks();
    mockInitializeAppCheck.mockReturnValue(appCheck);
    TestBed.configureTestingModule({
      providers: [{ provide: FIREBASE_APP, useValue: firebaseApp }],
    });
    service = TestBed.inject(AppCheckService);
  });

  it("is the service created", () => {
    expect(service).toBeTruthy();
  });

  it("initialises App Check against the injected Firebase app", () => {
    expect(service.app).toBe(firebaseApp);
    expect(service.appCheck).toBe(appCheck);
    expect(mockInitializeAppCheck).toHaveBeenCalledWith(firebaseApp, {
      provider: MockProvider.mock.instances[0],
      isTokenAutoRefreshEnabled: true,
    });
  });

  it("builds the enterprise provider with the environment site key", () => {
    expect(MockProvider).toHaveBeenCalledWith(environment.recaptcha.siteKey);
  });

  it("is the token Firebase issued returned", async () => {
    const result = { token: "app-check-token" };
    mockGetToken.mockResolvedValue(result);

    await expect(service.getToken()).resolves.toBe(result);
    expect(mockGetToken).toHaveBeenCalledWith(appCheck);
  });

  it("is undefined returned when the token cannot be retrieved", async () => {
    mockGetToken.mockRejectedValue(new Error("app check unavailable"));

    await expect(service.getToken()).resolves.toBeUndefined();
  });
});
