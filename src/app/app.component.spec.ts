import { ComponentFixture, TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { AppComponent } from "./app.component";
import { RouterModule } from "@angular/router";

describe("AppComponent", () => {
  let fixture: ComponentFixture<AppComponent>;
  let app: AppComponent;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterModule],
      declarations: [AppComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(AppComponent);
    app = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create the app", () => {
    expect(app).toBeTruthy();
  });

  it("is all component loaded successfully ", () => {
    const app_components = fixture.debugElement.children.map(
      (el) => el.nativeElement["localName"]
    );
    expect(app_components).toEqual(["router-outlet"]);
  });

  // Navigation
  // 1. is display on view
  // 2. is show active item as should
  // 3. is active item change on scroll
  // Breadcrumbs
  // 1. is display on view
  // 2. is not display if on main-page
  // Services
  // 1. is display on view
  // 2. is display modal after click
  // 3. is hide modal after click
  // Footer
  // 1. is display on view
  // 2. is hide if on error on policy page
  // Loaded
  // 1. is display if lang change
  // Cookies
  // 1. is display if not set on local storage
  // 2. is not display if set on local storage
});
