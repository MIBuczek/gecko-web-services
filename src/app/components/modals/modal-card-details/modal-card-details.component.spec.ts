import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ModalCardDetailsComponent } from "./modal-card-details.component";
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from "@angular/material/dialog";
import { TranslateTestingModule } from "ngx-translate-testing";
import polishTranslation from "assets/i18n/pl.json";
import englishTranslation from "assets/i18n/en.json";
import { By } from "@angular/platform-browser";

const TRANSLATION: any = {
  pl: polishTranslation,
  en: englishTranslation,
};

describe("ModalCardDetailsComponent", () => {
  let component: ModalCardDetailsComponent;
  let fixture: ComponentFixture<ModalCardDetailsComponent>;

  const getSelectedElementTextContent = (selector: string): string => {
    return fixture.debugElement
      .query(By.css(selector))
      .nativeElement.textContent.trim();
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        {
          provide: MatDialogRef,
          useValue: { card: polishTranslation["main-page"]["cards"][0] },
        },
        {
          provide: MAT_DIALOG_DATA,
          useValue: { card: polishTranslation["main-page"]["cards"][0] },
        },
      ],
      imports: [
        ModalCardDetailsComponent,
        MatDialogModule,
        TranslateTestingModule.withTranslations(
          TRANSLATION
        ).withDefaultLanguage("pl"),
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(ModalCardDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("is correct modal text content displayed", () => {
    fixture.detectChanges();
    expect(
      fixture.debugElement.query(By.css(".card-title")).nativeNode.textContent
    ).toEqual(polishTranslation["main-page"].cards[0].card_header.trim());
    expect(getSelectedElementTextContent("p")).toEqual(
      polishTranslation["main-page"].cards[0].card_full_description.trim()
    );
    expect(getSelectedElementTextContent("button")).toEqual(
      polishTranslation["main-page"].btn.hide.trim()
    );
  });

  it("is correct number of tag displayed", () => {
    const tag_wrapper = fixture.debugElement.query(By.css(".w-100"));
    const tags = tag_wrapper.children.filter((el) => el.classes["badge"]);
    expect(tags.length).toEqual(
      polishTranslation["main-page"]["cards"][0]["card_tags"].length
    );
  });

  it("is modal not display after click", () => {
    fixture.debugElement.query(By.css("button")).nativeElement.click();
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css("card-details"))).toBeFalsy();
  });
});
