import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ScrollTopComponent } from "./scroll-top.component";
import { By } from "@angular/platform-browser";
import { SpyLocation } from "@angular/common/testing";

describe("ScrollTopComponent", () => {
  let component: ScrollTopComponent;
  let fixture: ComponentFixture<ScrollTopComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ScrollTopComponent],
      providers: [SpyLocation],
    }).compileComponents();
    fixture = TestBed.createComponent(ScrollTopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("is scroll-top button not visible on top of the page", () => {
    const scroll_btn = fixture.debugElement.query(By.css(".scroll-top"));
    jest.spyOn(component, "checkPosition").mockReturnValue(false);
    component.checkPosition();
    fixture.detectChanges();
    expect(scroll_btn.classes["visible"]).toBeFalsy();
  });

  it("is scroll-top button visible if not on the top of page", () => {
    const scroll_btn = fixture.debugElement.query(By.css(".scroll-top"));
    jest.spyOn(component, "checkPosition").mockReturnValue(true);
    component.checkPosition();
    fixture.detectChanges();
    expect(scroll_btn.classes["visible"]).toBeTruthy();
  });

  it("is scrollTop method be called", () => {
    const scroll_top_fun = jest.spyOn(component, "scrollTop");
    fixture.debugElement.query(By.css(".scroll-top")).nativeElement.click();
    fixture.detectChanges();
    expect(scroll_top_fun).toHaveBeenCalled();
  });
});
