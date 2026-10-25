import { HttpErrorResponse } from "@angular/common/http";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { EmailActionAdmin, IAdminEmail } from "app/models/email-message";
import { ModalEmailDetailsComponent } from "app/components/modals/modal-email-details/modal-email-details.component";
import { RecaptchaService } from "app/services/recaptcha/recaptcha.service";
import { of } from "rxjs";
import { AuthService } from "app/services/auth/auth.service";
import { MailingService } from "app/services/mailing/mailing.service";
import packageInfo from "../../../../../package.json";
import { MainComponent } from "./main.component";

const POSTS_PER_PAGE = 10;

const buildEmail = (index: number, replay = false): IAdminEmail => ({
  id: `mail-${index}`,
  email: `client${index}@example.com`,
  message: `message ${index}`,
  createdAt: "2024-05-01T10:00:00.000Z",
  replay,
});

const buildEmails = (count: number): IAdminEmail[] =>
  Array.from({ length: count }, (_, i) => buildEmail(i + 1));

const flushPromises = (): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, 0));

const buildComponent = async (
  emails: IAdminEmail[],
  options: {
    action?: EmailActionAdmin | null;
    token?: string | null;
    emailsError?: boolean;
  } = {}
): Promise<{
  fixture: ComponentFixture<MainComponent>;
  component: MainComponent;
  auth: { currentUser: unknown; logout: jest.Mock };
  router: { navigate: jest.Mock };
  mailing: {
    getAllEmails: jest.Mock;
    updateEmail: jest.Mock;
    deleteEmail: jest.Mock;
  };
  dialog: { open: jest.Mock };
  recaptcha: { getToken: jest.Mock };
}> => {
  const auth = {
    currentUser: of({ email: "admin@example.com", metadata: {} }),
    logout: jest.fn().mockResolvedValue(undefined),
  };
  const router = { navigate: jest.fn() };
  const mailing = {
    getAllEmails: jest.fn().mockResolvedValue(
      options.emailsError
        ? new HttpErrorResponse({ status: 500 })
        : Object.fromEntries(emails.map(({ id, ...rest }) => [id, rest]))
    ),
    updateEmail: jest.fn().mockResolvedValue(undefined),
    deleteEmail: jest.fn().mockResolvedValue(undefined),
  };
  const dialog = {
    open: jest.fn().mockReturnValue({
      afterClosed: () =>
        of(
          options.action === null
            ? undefined
            : { id: emails[0]?.id ?? "mail-1", action: options.action }
        ),
    }),
  };
  const recaptcha = {
    getToken: jest
      .fn()
      .mockReturnValue(of(options.token === undefined ? "token" : options.token)),
  };

  await TestBed.configureTestingModule({
    imports: [MainComponent],
    providers: [
      { provide: AuthService, useValue: auth },
      { provide: Router, useValue: router },
      { provide: MailingService, useValue: mailing },
      { provide: MatDialog, useValue: dialog },
      { provide: RecaptchaService, useValue: recaptcha },
    ],
  }).compileComponents();

  const fixture = TestBed.createComponent(MainComponent);
  fixture.detectChanges();
  await flushPromises();
  fixture.detectChanges();
  return {
    fixture,
    component: fixture.componentInstance,
    auth,
    router,
    mailing,
    dialog,
    recaptcha,
  };
};

describe("AdminMainComponent", () => {
  let component: MainComponent;
  let fixture: ComponentFixture<MainComponent>;
  let auth: { currentUser: unknown; logout: jest.Mock };
  let router: { navigate: jest.Mock };
  let mailing: {
    getAllEmails: jest.Mock;
    updateEmail: jest.Mock;
    deleteEmail: jest.Mock;
  };
  let dialog: { open: jest.Mock };
  let recaptcha: { getToken: jest.Mock };

  beforeEach(async () => {
    ({ fixture, component, auth, router, mailing, dialog, recaptcha } =
      await buildComponent(buildEmails(3)));
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("is the app name and version taken from package.json", () => {
    expect(component.appName).toEqual(packageInfo.name);
    expect(component.appVersion).toEqual(packageInfo.version);
  });

  it("is the email list loaded on init", () => {
    expect(mailing.getAllEmails).toHaveBeenCalled();
    expect(recaptcha.getToken).toHaveBeenCalledWith("loadEmails");
    expect(component.displayedEmails().length).toEqual(3);
  });

  it("is every loaded email displayed", () => {
    const rows = fixture.debugElement.nativeElement.querySelectorAll(
      "section.emails li.list-group-item"
    );
    /* The header row is the first list item. */
    expect(rows.length).toEqual(4);
  });

  it("is the email content displayed in the row", () => {
    const rowText = fixture.debugElement.nativeElement
      .querySelectorAll("section.emails li.list-group-item")[1]
      .textContent.replace(/\s+/g, " ");
    expect(rowText).toContain("client1@example.com");
    expect(rowText).toContain("message 1");
  });

  it("is the current user exposed to the template", () => {
    expect(component.currentUser).toBeDefined();
  });

  it("is no error reported before a failure", () => {
    expect(component.httpError).toBeNull();
  });

  it("is the selected page exposed as a writable signal", () => {
    expect(component.selectedPage()).toEqual(1);
  });

  it("is the current user read from the auth service", () => {
    expect(auth.currentUser).toBeDefined();
  });

  it("is a scroll below the threshold not reported as sticky", () => {
    expect(component.checkPosition()).toBeFalsy();
  });

  it("is a scroll past the threshold reported as sticky", () => {
    Object.defineProperty(window, "scrollY", { value: 100, configurable: true });
    expect(component.checkPosition()).toBeTruthy();
    Object.defineProperty(window, "scrollY", { value: 0, configurable: true });
  });

  it("is the email modal opened with the selected email", () => {
    component.openEmailModal(buildEmail(2));
    expect(dialog.open).toHaveBeenCalledWith(ModalEmailDetailsComponent, {
      data: buildEmail(2),
    });
  });

  it("is the logout action requested before signing out", async () => {
    component.logOut();
    await flushPromises();
    expect(recaptcha.getToken).toHaveBeenCalledWith("logOut");
    expect(auth.logout).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(["main-page"]);
  });

  it("is sign out skipped when no logout token is returned", async () => {
    recaptcha.getToken.mockReturnValue(of(null));
    component.logOut();
    await flushPromises();
    expect(auth.logout).not.toHaveBeenCalled();
  });

  it("is an http error stored and cleared after the timeout", () => {
    jest.useFakeTimers();
    const error = new HttpErrorResponse({ status: 500 });
    component.handleError(error);
    expect(component.httpError).toEqual(error);
    jest.advanceTimersByTime(10000);
    expect(component.httpError).toBeNull();
    jest.useRealTimers();
  });
});

describe("AdminMainComponent - email actions", () => {
  it("is an email marked as answered after the ANSWERED action", async () => {
    const { component, mailing, fixture } = await buildComponent(
      [buildEmail(1), buildEmail(2)],
      { action: EmailActionAdmin.ANSWERED }
    );
    component.openEmailModal(buildEmail(1));
    await flushPromises();
    fixture.detectChanges();
    expect(mailing.updateEmail).toHaveBeenCalledWith("mail-1");
    expect(
      component.displayedEmails().find((email) => email.id === "mail-1")?.replay
    ).toBeTruthy();
  });

  it("is an email removed after the DELETE action", async () => {
    const { component, mailing, fixture } = await buildComponent(
      [buildEmail(1), buildEmail(2)],
      { action: EmailActionAdmin.DELETE }
    );
    component.openEmailModal(buildEmail(1));
    await flushPromises();
    fixture.detectChanges();
    expect(mailing.deleteEmail).toHaveBeenCalledWith("mail-1");
    expect(
      component.displayedEmails().some((email) => email.id === "mail-1")
    ).toBeFalsy();
  });

  it("is no action performed when the modal is dismissed without a result", async () => {
    const { component, mailing, recaptcha } = await buildComponent(
      [buildEmail(1)],
      { action: null }
    );
    component.openEmailModal(buildEmail(1));
    await flushPromises();
    expect(recaptcha.getToken).not.toHaveBeenCalledWith(EmailActionAdmin.DELETE);
    expect(mailing.updateEmail).not.toHaveBeenCalled();
    expect(mailing.deleteEmail).not.toHaveBeenCalled();
  });

  it("is no action performed when no recaptcha token is returned", async () => {
    const { component, mailing } = await buildComponent([buildEmail(1)], {
      action: EmailActionAdmin.DELETE,
      token: null,
    });
    component.openEmailModal(buildEmail(1));
    await flushPromises();
    expect(mailing.deleteEmail).not.toHaveBeenCalled();
  });
});

describe("AdminMainComponent - pagination", () => {
  let component: MainComponent;

  beforeEach(async () => {
    ({ component } = await buildComponent(buildEmails(12)));
  });

  it("is the first page limited to ten emails", () => {
    expect(component.displayedEmails().length).toEqual(POSTS_PER_PAGE);
  });

  it("is the page count derived from the email total", () => {
    expect(component.allPages()).toEqual([1, 2]);
    expect(component.lastPage).toEqual(2);
  });

  it("is the remaining emails displayed on the last page", () => {
    component.changePage(2);
    expect(component.selectedPage()).toEqual(2);
    expect(component.displayedEmails().length).toEqual(2);
  });

  it("is the row index calculated across pages", () => {
    expect(component.calcIndex(0)).toEqual(1);
    component.changePage(2);
    expect(component.calcIndex(0)).toEqual(11);
  });
});

describe("AdminMainComponent - no emails", () => {
  it("is the empty state displayed when the database is empty", async () => {
    const { fixture } = await buildComponent([]);
    expect(
      fixture.debugElement.nativeElement.querySelector(".no-emails")
    ).toBeTruthy();
    expect(
      fixture.debugElement.nativeElement.querySelectorAll(
        "section.emails li.list-group-item"
      ).length
    ).toEqual(2);
  });
});

describe("AdminMainComponent - load failure", () => {
  it("is the http error displayed when loading emails fails", async () => {
    const { component } = await buildComponent([], { emailsError: true });
    expect(component.httpError).toBeInstanceOf(HttpErrorResponse);
  });
});
