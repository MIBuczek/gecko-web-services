import { signal } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { AuthService } from "app/services/auth/auth.service";
import { adminGuard } from "./admin.guard";

const ONE_HOUR = 3600000;

const buildAuth = (
  user: unknown,
  whenReady: () => Promise<void> = () => Promise.resolve()
) => ({
  currentUser: signal(user),
  whenReady: jest.fn(whenReady),
  logout: jest.fn().mockResolvedValue(undefined),
});

const runGuard = (auth: ReturnType<typeof buildAuth>): Promise<boolean> => {
  TestBed.configureTestingModule({
    providers: [{ provide: AuthService, useValue: auth }],
  });
  return TestBed.runInInjectionContext(() =>
    adminGuard({} as never, {} as never)
  ) as Promise<boolean>;
};

describe("adminGuard", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("is access granted when a user is signed in", async () => {
    const auth = buildAuth({ email: "admin@example.com" });

    await expect(runGuard(auth)).resolves.toBe(true);
  });

  it("is access denied when no user is signed in", async () => {
    const auth = buildAuth(null);

    await expect(runGuard(auth)).resolves.toBe(false);
  });

  it("waits for the session to settle before reading the user", async () => {
    let settle: () => void = () => undefined;
    const whenReady = (): Promise<void> =>
      new Promise<void>((resolve) => {
        settle = resolve;
      });
    const auth = buildAuth(null, whenReady);
    /* Sign the user in only once the session restore resolves, which is what
       Firebase does: the signal is null until authStateReady() completes. */
    const guard = runGuard(auth).then((granted) => granted);
    auth.currentUser.set({ email: "admin@example.com" });

    settle();

    await expect(guard).resolves.toBe(true);
    expect(auth.whenReady).toHaveBeenCalled();
  });

  it("is access denied and the session cleared when last login is stale", async () => {
    const auth = buildAuth({ email: "admin@example.com" });
    localStorage.setItem("lastLogin", `${Date.now() - ONE_HOUR - 1}`);

    await expect(runGuard(auth)).resolves.toBe(false);

    expect(localStorage.getItem("lastLogin")).toBeNull();
    expect(auth.logout).toHaveBeenCalled();
  });

  it("is access granted when last login is within the hour", async () => {
    const auth = buildAuth({ email: "admin@example.com" });
    localStorage.setItem("lastLogin", `${Date.now() - 1000}`);

    await expect(runGuard(auth)).resolves.toBe(true);

    expect(auth.logout).not.toHaveBeenCalled();
  });

  it("does not read the user when the stale session already denied access", async () => {
    const auth = buildAuth({ email: "admin@example.com" });
    localStorage.setItem("lastLogin", `${Date.now() - ONE_HOUR - 1}`);

    await runGuard(auth);

    expect(auth.whenReady).not.toHaveBeenCalled();
  });
});
