import { ComponentFixture, TestBed } from "@angular/core/testing";
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from "@angular/material/dialog";
import { By } from "@angular/platform-browser";
import { EmailActionAdmin, IAdminEmail } from "app/models/email-message";
import { ModalEmailDetailsComponent } from "./modal-email-details.component";

const EMAIL: IAdminEmail = {
  id: "mail-1",
  email: "client@example.com",
  message: "test message",
  createdAt: "2024-05-01T10:00:00.000Z",
  replay: false,
};

const buildComponent = async (
  data: IAdminEmail
): Promise<{
  fixture: ComponentFixture<ModalEmailDetailsComponent>;
  component: ModalEmailDetailsComponent;
  modalRef: { close: jest.Mock };
}> => {
  const modalRef = { close: jest.fn() };

  await TestBed.configureTestingModule({
    declarations: [ModalEmailDetailsComponent],
    providers: [
      { provide: MatDialogRef, useValue: modalRef },
      { provide: MAT_DIALOG_DATA, useValue: data },
    ],
    imports: [MatDialogModule],
  }).compileComponents();

  const fixture = TestBed.createComponent(ModalEmailDetailsComponent);
  fixture.detectChanges();
  return { fixture, component: fixture.componentInstance, modalRef };
};

describe("ModalEmailDetailsComponent", () => {
  let component: ModalEmailDetailsComponent;
  let fixture: ComponentFixture<ModalEmailDetailsComponent>;
  let modalRef: { close: jest.Mock };

  const getTextContent = (selector: string): string =>
    fixture.debugElement.query(By.css(selector)).nativeElement.textContent.trim();

  beforeEach(async () => {
    ({ fixture, component, modalRef } = await buildComponent(EMAIL));
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("is email address displayed", () => {
    expect(getTextContent(".email-title")).toContain(EMAIL.email);
  });

  it("is message displayed", () => {
    expect(getTextContent(".text-break")).toEqual(EMAIL.message);
  });

  it("is update button enabled for a not replayed email", () => {
    const updateBtn = fixture.debugElement.queryAll(By.css("button"))[0];
    expect(updateBtn.nativeElement.disabled).toBeFalsy();
  });

  it("is modal closed with ANSWERED action on update", () => {
    component.updateEmail();
    expect(modalRef.close).toHaveBeenCalledWith({
      id: EMAIL.id,
      action: EmailActionAdmin.ANSWERED,
    });
  });

  it("is modal closed with DELETE action on delete", () => {
    component.deleteEmail();
    expect(modalRef.close).toHaveBeenCalledWith({
      id: EMAIL.id,
      action: EmailActionAdmin.DELETE,
    });
  });

  it("is modal closed with CLOSE action on close", () => {
    component.closeModal();
    expect(modalRef.close).toHaveBeenCalledWith({
      id: EMAIL.id,
      action: EmailActionAdmin.CLOSE,
    });
  });

  it("is the matching action emitted after clicking each button", () => {
    const buttons = fixture.debugElement.queryAll(By.css("button"));
    buttons[1].nativeElement.click();
    buttons[2].nativeElement.click();
    expect(modalRef.close).toHaveBeenNthCalledWith(1, {
      id: EMAIL.id,
      action: EmailActionAdmin.DELETE,
    });
    expect(modalRef.close).toHaveBeenNthCalledWith(2, {
      id: EMAIL.id,
      action: EmailActionAdmin.CLOSE,
    });
  });
});

describe("ModalEmailDetailsComponent - replayed email", () => {
  let fixture: ComponentFixture<ModalEmailDetailsComponent>;

  beforeEach(async () => {
    ({ fixture } = await buildComponent({ ...EMAIL, replay: true }));
  });

  it("is update button disabled", () => {
    const updateBtn = fixture.debugElement.queryAll(By.css("button"))[0];
    expect(updateBtn.nativeElement.disabled).toBeTruthy();
  });

  it("is a check icon displayed next to the title", () => {
    expect(fixture.debugElement.query(By.css(".email-title i"))).toBeTruthy();
  });
});
