import { HttpErrorResponse } from "@angular/common/http";
import { TestBed } from "@angular/core/testing";
import { get, ref, set, update } from "firebase/database";
import { EmailMessage } from "classes/email-message.class";
import { FIREBASE_DATABASE } from "utilities/firebase.tokens";
import { DB_MESSAGE_ACTIONS, MailingService } from "./mailing.service";

jest.mock("firebase/database", () => ({
  ref: jest.fn((_db: unknown, path: string) => ({ path })),
  get: jest.fn(),
  set: jest.fn(),
  update: jest.fn(),
}));

jest.mock("uuid", () => ({ v4: jest.fn(() => "generated-uuid") }));

const mockRef = ref as jest.Mock;
const mockGet = get as jest.Mock;
const mockSet = set as jest.Mock;
const mockUpdate = update as jest.Mock;

describe("MailingService", () => {
  let service: MailingService;
  const database = { type: "database" };

  beforeEach(() => {
    jest.clearAllMocks();
    TestBed.configureTestingModule({
      providers: [{ provide: FIREBASE_DATABASE, useValue: database }],
    });
    service = TestBed.inject(MailingService);
  });

  it("is the service created", () => {
    expect(service).toBeTruthy();
  });

  it("is every email returned from the messages node", async () => {
    const messages = {
      "mail-1": { email: "client@example.com", replay: false },
    };
    mockGet.mockResolvedValue({ val: () => messages });

    await expect(service.getAllEmails()).resolves.toEqual(messages);
    expect(mockRef).toHaveBeenCalledWith(database, "messages");
  });

  it("is an HttpErrorResponse returned when reading emails fails", async () => {
    const err = new Error("permission denied");
    mockGet.mockRejectedValue(err);

    const resp = await service.getAllEmails();

    expect(resp).toBeInstanceOf(HttpErrorResponse);
    expect((resp as HttpErrorResponse).error).toBe(err);
  });

  it("is an email marked as replayed at its own node", async () => {
    mockUpdate.mockResolvedValue(undefined);

    await expect(service.updateEmail("mail-1")).resolves.toBeUndefined();

    expect(mockRef).toHaveBeenCalledWith(database, "messages/mail-1");
    expect(mockUpdate).toHaveBeenCalledWith(
      { path: "messages/mail-1" },
      { replay: true }
    );
  });

  it("is an HttpErrorResponse returned when the update fails", async () => {
    const err = new Error("offline");
    mockUpdate.mockRejectedValue(err);

    const resp = await service.updateEmail("mail-1");

    expect(resp).toBeInstanceOf(HttpErrorResponse);
    expect((resp as HttpErrorResponse).error).toBe(err);
  });

  it("is an email removed by writing null to its node", async () => {
    mockSet.mockResolvedValue(undefined);

    await expect(service.deleteEmail("mail-1")).resolves.toBeUndefined();

    expect(mockRef).toHaveBeenCalledWith(database, "messages/mail-1");
    expect(mockSet).toHaveBeenCalledWith({ path: "messages/mail-1" }, null);
  });

  it("is an HttpErrorResponse returned when the delete fails", async () => {
    const err = new Error("offline");
    mockSet.mockRejectedValue(err);

    const resp = await service.deleteEmail("mail-1");

    expect(resp).toBeInstanceOf(HttpErrorResponse);
    expect((resp as HttpErrorResponse).error).toBe(err);
  });

  it("is a sent email written under a generated id", async () => {
    mockSet.mockResolvedValue(undefined);
    const message = new EmailMessage("client@example.com", "a message");

    await expect(service.sendEmailMessage(message)).resolves.toBe(
      DB_MESSAGE_ACTIONS.SUCCESS
    );

    expect(mockRef).toHaveBeenCalledWith(database, "messages/generated-uuid");
    expect(mockSet).toHaveBeenCalledWith(
      { path: "messages/generated-uuid" },
      message
    );
  });

  it("is the error action returned when sending fails", async () => {
    mockSet.mockRejectedValue(new Error("offline"));
    jest.spyOn(console, "error").mockImplementation(() => undefined);

    await expect(
      service.sendEmailMessage(
        new EmailMessage("client@example.com", "a message")
      )
    ).resolves.toBe(DB_MESSAGE_ACTIONS.ERROR);
  });
});
