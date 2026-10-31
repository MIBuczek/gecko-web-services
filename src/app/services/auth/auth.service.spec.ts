import { createEnvironmentInjector, EnvironmentInjector } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { Router } from "@angular/router";
import {
  onIdTokenChanged,
  signInWithEmailAndPassword,
  signOut,
  User,
} from "firebase/auth";
import { FIREBASE_AUTH } from "utilities/firebase.tokens";
import { AuthService } from "./auth.service";

jest.mock("firebase/auth", () => ({
  onIdTokenChanged: jest.fn(),
  signInWithEmailAndPassword: jest.fn(),
  signOut: jest.fn(),
}));

const mockOnIdTokenChanged = onIdTokenChanged as jest.Mock;
const mockSignIn = signInWithEmailAndPassword as jest.Mock;
const mockSignOut = signOut as jest.Mock;

describe("AuthService", () => {
  let service: AuthService;
  let router: { navigate: jest.Mock };
  let unsubscribe: jest.Mock;
  let auth: { authStateReady: jest.Mock };

  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    /* The service reports failures with console.error; keep the run output clean. */
    jest.spyOn(console, "error").mockImplementation(() => undefined);
    unsubscribe = jest.fn();
    auth = { authStateReady: jest.fn().mockResolvedValue(undefined) };
    /* Capture the observer so a test can drive the signal the way Firebase does. */
    mockOnIdTokenChanged.mockReturnValue(unsubscribe);
    mockSignIn.mockResolvedValue({ user: { email: "admin@example.com" } });
    mockSignOut.mockResolvedValue(undefined);
    router = { navigate: jest.fn().mockResolvedValue(true) };

    TestBed.configureTestingModule({
      providers: [
        { provide: FIREBASE_AUTH, useValue: auth },
        { provide: Router, useValue: router },
      ],
    });
    service = TestBed.inject(AuthService);
  });

  const emitUser = (user: User | null): void => {
    const observer = mockOnIdTokenChanged.mock.calls[0][1] as (
      user: User | null
    ) => void;
    observer(user);
  };

  it("is the service created", () => {
    expect(service).toBeTruthy();
  });

  it("is the current user null until Firebase emits", () => {
    expect(service.currentUser()).toBeNull();
  });

  it("is the current user set when Firebase emits a user", () => {
    const user = { email: "admin@example.com" } as User;

    emitUser(user);

    expect(service.currentUser()).toBe(user);
  });

  it("is the current user cleared when Firebase emits a sign-out", () => {
    emitUser({ email: "admin@example.com" } as User);

    emitUser(null);

    expect(service.currentUser()).toBeNull();
  });

  it("is the auth listener detached when the injector is destroyed", () => {
    const parent = TestBed.inject(EnvironmentInjector);
    const child = createEnvironmentInjector([AuthService], parent);
    child.get(AuthService);

    child.destroy();

    expect(unsubscribe).toHaveBeenCalled();
  });

  it("is whenReady resolved once Firebase has restored the session", async () => {
    await service.whenReady();

    expect(auth.authStateReady).toHaveBeenCalled();
  });

  it("is login storing the last login and redirecting to admin", async () => {
    await service.login("admin@example.com", "secret");

    expect(mockSignIn).toHaveBeenCalledWith(
      auth,
      "admin@example.com",
      "secret"
    );
    expect(localStorage.getItem("lastLogin")).not.toBeNull();
    expect(router.navigate).toHaveBeenCalledWith(["/admin"]);
  });

  it("is login not redirecting when the sign in fails", async () => {
    const err = new Error("wrong password");
    mockSignIn.mockRejectedValue(err);

    await service.login("admin@example.com", "wrong");

    expect(router.navigate).not.toHaveBeenCalled();
    expect(service.authError()).toBe(err);
  });

  it("is logout clearing local storage", async () => {
    localStorage.setItem("lastLogin", "123");

    await service.logout();

    expect(mockSignOut).toHaveBeenCalledWith(auth);
    expect(localStorage.getItem("lastLogin")).toBeNull();
  });

  it("is the auth error reported when logout fails", async () => {
    const err = new Error("network");
    mockSignOut.mockRejectedValue(err);

    await service.logout();

    expect(service.authError()).toBe(err);
  });

  it("is the auth error cleared automatically after ten seconds", async () => {
    jest.useFakeTimers();
    mockSignIn.mockRejectedValue(new Error("wrong password"));

    await service.login("admin@example.com", "wrong");
    expect(service.authError()).not.toBeNull();

    jest.advanceTimersByTime(10000);

    expect(service.authError()).toBeNull();
    jest.useRealTimers();
  });
});
