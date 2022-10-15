import {ComponentFixture, inject, TestBed} from '@angular/core/testing';
import {ServiceCardComponent} from './service-card.component';
import {TranslateTestingModule} from "ngx-translate-testing";
import polishTranslation from "assets/i18n/pl.json";
import englishTranslation from "assets/i18n/en.json";
import {By} from "@angular/platform-browser";
import {TranslateService} from "@ngx-translate/core";

const TRANSLATION: any = {
    'pl': polishTranslation,
    'en': englishTranslation
}

describe('ServiceCardComponent', () => {
    let component: ServiceCardComponent;
    let fixture: ComponentFixture<ServiceCardComponent>;

    const getSelectedElementInnerText = (selector: string): string => {
        return fixture.debugElement.query(By.css(selector)).nativeElement.innerText.trim()
    }

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ServiceCardComponent],
            imports: [TranslateTestingModule
                .withTranslations(TRANSLATION)
                .withDefaultLanguage('pl')]
        }).compileComponents();
        fixture = TestBed.createComponent(ServiceCardComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    beforeEach(() => {
        component.cardContent = polishTranslation["main-page"].cards[0]
        component.cardIndex = 0
        component.cardBtn = polishTranslation["main-page"].btn.more
        fixture.detectChanges()
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('is not displayed when no input cardContent', () => {
        component.cardContent = undefined
        fixture.detectChanges()
        const card = fixture.debugElement.query(By.css('.card'))
        expect(card).toBeFalsy()
    })

    it('is display when all @Input comes', () => {
        fixture.detectChanges()
        const card = fixture.debugElement.query(By.css('.card'))
        expect(card).toBeTruthy()
    })

    it('is correct text content displayed', () => {
        expect(getSelectedElementInnerText('h3')).toEqual(
            polishTranslation["main-page"].cards[0].card_header.trim())
        expect(getSelectedElementInnerText('p')).toEqual(
            polishTranslation["main-page"].cards[0].card_short_description.trim())
        expect(getSelectedElementInnerText('button')).toEqual(
            polishTranslation["main-page"].btn.more.trim())
    })

    it('is translation work correctly', inject(
        [TranslateService], (translateService: TranslateService) => {
            translateService.use('en')
            component.cardContent = translateService.translations['en']['main-page']['cards'][0]
            component.cardBtn = translateService.translations['en']['main-page']['btn']['more']

            fixture.detectChanges()

            expect(getSelectedElementInnerText('h3')).toEqual(
                englishTranslation["main-page"].cards[0].card_header.trim())
            expect(getSelectedElementInnerText('p')).toEqual(
                englishTranslation["main-page"].cards[0].card_short_description.trim())
            expect(getSelectedElementInnerText('button')).toEqual(
                englishTranslation["main-page"].btn.more.trim())
        }))

    it('it emmit card index after click', () => {
        spyOn(component.emitIsOpen, 'emit')
        fixture.detectChanges()
        fixture.debugElement.query(By.css('button')).nativeElement.click()
        fixture.detectChanges()

        expect(component.emitIsOpen.emit).toHaveBeenCalled()
        expect(component.emitIsOpen.emit).toHaveBeenCalledWith(component.cardIndex)
    });
});
