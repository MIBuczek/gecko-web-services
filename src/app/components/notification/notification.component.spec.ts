import { ComponentFixture, TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { NotificationType } from "models/general";
import { NotificationComponent } from "./notification.component";

describe("NotificationComponent", () => {
  let component: NotificationComponent;
  let fixture: ComponentFixture<NotificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotificationComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(NotificationComponent);
    component = fixture.componentInstance;
  });

  it("should create", () => {
    component.variant = "info";
    component.title = "test";
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it("is variant applied to the wrapper class", () => {
    component.variant = "warning";
    component.title = "test";
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css(".bd-callout")).classes).toHaveProperty(
      "warning"
    );
  });

  it("is title displayed", () => {
    component.variant = "info";
    component.title = "Notification title";
    fixture.detectChanges();
    expect(
      fixture.debugElement.query(By.css("strong")).nativeElement.textContent.trim()
    ).toEqual("Notification title");
  });

  it.each<NotificationType>(["warning", "error", "success"])(
    "is %s variant icon displayed",
    (variant) => {
      component.variant = variant;
      component.title = "test";
      fixture.detectChanges();
      expect(fixture.debugElement.query(By.css("i"))).toBeTruthy();
    }
  );

  it("is default icon displayed for unknown variant", () => {
    component.variant = "info";
    component.title = "test";
    fixture.detectChanges();
    const icon = fixture.debugElement.query(By.css("i"));
    expect(icon.classes["fa-circle-info"]).toBeTruthy();
  });
});
