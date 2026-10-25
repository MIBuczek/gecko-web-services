import { ComponentFixture, inject, TestBed } from "@angular/core/testing";
import { provideRouter } from "@angular/router";
import { CookieComponent } from "./cookie.component";
import { By } from "@angular/platform-browser";
import { TranslateService } from "@ngx-translate/core";
import polishTranslation from "assets/i18n/pl.json";
import englishTranslation from "assets/i18n/en.json";
import { TranslateTestingModule } from "ngx-translate-testing";

const TRANSLATION: any = {
  pl: polishTranslation,
  en: englishTranslation,
};

describe("CookieComponent", () => {
  let component: CookieComponent;
  let fixture: ComponentFixture<CookieComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CookieComponent,
        TranslateTestingModule.withTranslations(
          TRANSLATION
        ).withDefaultLanguage("pl"),
      ],
      providers: [provideRouter([])],
    }).compileComponents();
    /* Initialization */
    fixture = TestBed.createComponent(CookieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    window.localStorage.clear();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("is cookies confirmation display if it is not accepted", () => {
    component.isCookiesAccepted = false;
    const cookie_wrapper = fixture.debugElement.query(
      By.css(".cookies-wrapper")
    );
    fixture.detectChanges();

    expect(cookie_wrapper).toBeTruthy();
  });

  it("is cookies confirmation is save on local storage", () => {
    component.acceptCookies();
    const local_storage = window.localStorage.getItem("cookies");
    expect(local_storage).toBeTruthy();

    fixture.detectChanges();
    const cookie_wrapper = fixture.debugElement.query(
      By.css(".cookies-wrapper")
    );
    expect(cookie_wrapper).toBeNull();
    window.localStorage.clear();
  });

  it("is cookies modal not visible if it is accepted already", () => {
    window.localStorage.setItem("cookies", String(true));
    component.ngOnInit();
    fixture.detectChanges();

    const cookie_wrapper = fixture.debugElement.query(
      By.css(".cookies-wrapper")
    );
    expect(cookie_wrapper).toBeNull();

    window.localStorage.clear();
  });

  it("is display header text correct after lang change", inject(
    [TranslateService],
    (translateService: TranslateService) => {
      const header = fixture.debugElement.query(By.css(".cookie-title"));
      expect(header.nativeElement["innerHTML"].trim()).toContain(
        polishTranslation.cookies.title.trim()
      );
      translateService.use("en");
      fixture.detectChanges();
      expect(header.nativeElement["innerHTML"].trim()).toContain(
        englishTranslation.cookies.title.trim()
      );
    }
  ));
});
