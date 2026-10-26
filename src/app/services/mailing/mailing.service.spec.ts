import { TestBed } from "@angular/core/testing";

import { DB_MESSAGE_ACTIONS, MailingService } from "./mailing.service";
import { EmailMessage } from "classes/email-message.class";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { FIREBASE_DATABASE } from "utilities/firebase.tokens";

/* Mock function to overwrite possibility of emission value*/
const mockSendEmail = (em: EmailMessage): Promise<DB_MESSAGE_ACTIONS> => {
  if (em.email) {
    return Promise.resolve(DB_MESSAGE_ACTIONS.SUCCESS);
  } else {
    return Promise.reject(DB_MESSAGE_ACTIONS.ERROR);
  }
};

describe("MailingService", () => {
  let service: MailingService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: FIREBASE_DATABASE, useValue: {} },
      ],
    });
    service = TestBed.inject(MailingService);
    service.sendEmailMessage = mockSendEmail;
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("has email services emit success message", async () => {
    jest
      .spyOn(service, "sendEmailMessage")
      .mockReturnValue(Promise.resolve(DB_MESSAGE_ACTIONS.SUCCESS));
    try {
      const resp = await service.sendEmailMessage(
        new EmailMessage("test@example.com", "test message")
      );
      expect(resp).toEqual(DB_MESSAGE_ACTIONS.SUCCESS);
    } catch (err) {
      expect(err).toBeUndefined();
    }
  });

  it("has email services emit error message", async () => {
    jest
      .spyOn(service, "sendEmailMessage")
      .mockReturnValue(Promise.reject(DB_MESSAGE_ACTIONS.ERROR));
    try {
      await service.sendEmailMessage(new EmailMessage("", "test message"));
    } catch (err) {
      expect(err).toEqual(DB_MESSAGE_ACTIONS.ERROR);
    }
  });
});
