import { ComponentFixture, fakeAsync, inject, TestBed } from '@angular/core/testing';

import { MainPageComponent } from './main-page.component';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { ActivatedRoute, RouterModule } from "@angular/router";
import polishTranslation from "assets/i18n/pl.json";
import englishTranslation from "assets/i18n/en.json";
import { TranslateTestingModule } from "ngx-translate-testing";
import { routes } from "../../app-routing.module";
import { By } from "@angular/platform-browser";
import { TranslateService } from "@ngx-translate/core";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ModalCardDetailsComponent } from 'components/modals/modal-card-details/modal-card-details.component';


const TRANSLATION: any = {
    'pl': polishTranslation,
    'en': englishTranslation
}

describe('MainPageComponent', () => {
    let component: MainPageComponent;
    let fixture: ComponentFixture<MainPageComponent>;
    let modalRef: MatDialog

    const convertString = (s: string): string => {
        return s.toUpperCase().trim()
    }

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [MainPageComponent, ModalCardDetailsComponent],
            providers: [
                {
                    provide: ActivatedRoute,
                    useValue: { snapshot: { data: { breadcrumbs: ['main-page'] } } },
                }
            ],
            imports: [
                MatDialogModule,
                BrowserAnimationsModule,
                TranslateTestingModule
                    .withTranslations(TRANSLATION)
                    .withDefaultLanguage('pl'),
                RouterModule.forRoot(routes)
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();
        fixture = TestBed.createComponent(MainPageComponent);
        modalRef = TestBed.inject(MatDialog)
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    //6.Is modal open after click on card
    //7.Is correct number of technologies icons

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('is display correct initial text content', () => {
        fixture.detectChanges()
        const about_section = fixture.debugElement.query(By.css('#about'))
        const about_main_header = convertString(about_section.children[0].children[0].children[0].nativeElement['textContent'])
        const about_second_header = convertString(about_section.children[0].children[0].children[1].nativeElement['textContent'])

        const service_section = fixture.debugElement.query(By.css('.service-title '))
        const service_main_header = convertString(service_section.children[1].nativeElement['textContent'])
        const service_second_header = convertString(service_section.children[2].nativeElement['textContent'])

        expect(about_main_header).toContain(convertString(polishTranslation['main-page'].about_header))
        expect(about_second_header).toContain(convertString(polishTranslation['main-page'].about_intro))
        expect(service_main_header).toContain(convertString(polishTranslation['main-page'].service_header))
        expect(service_second_header).toContain(convertString(polishTranslation['main-page'].service_intro))

    })


    it('is display correct text content after lang switching',
        inject([TranslateService], (translateService: TranslateService) => {
            translateService.use('en')
            fixture.detectChanges()
            const about_section = fixture.debugElement.query(By.css('#about'))
            const about_main_header = convertString(about_section.children[0].children[0].children[0].nativeElement['textContent'])
            const about_second_header = convertString(about_section.children[0].children[0].children[1].nativeElement['textContent'])

            const service_section = fixture.debugElement.query(By.css('.service-title '))
            const service_main_header = convertString(service_section.children[1].nativeElement['textContent'])
            const service_second_header = convertString(service_section.children[2].nativeElement['textContent'])

            expect(about_main_header).toContain(convertString(englishTranslation['main-page'].about_header))
            expect(about_second_header).toContain(convertString(englishTranslation['main-page'].about_intro))
            expect(service_main_header).toContain(convertString(englishTranslation['main-page'].service_header))
            expect(service_second_header).toContain(convertString(englishTranslation['main-page'].service_intro))
        })
    );

    it('is display all sections necessary for [main-page]', () => {
        expect(fixture.debugElement.children.length).toEqual(5)
    })

    it('is display correct number service cards', () => {
        expect(fixture.debugElement.query(By.css('.card-container')).children.length).toEqual(polishTranslation["main-page"].cards.length)
    })

    it('is single card container correct content', () => {
        const single_card = fixture.debugElement.query(By.css('app-service-card')).nativeElement
        expect(single_card['cardBtn']).toEqual(polishTranslation["main-page"].btn.more)
        expect(single_card['cardContent'].card_header).toEqual(polishTranslation["main-page"]['cards'][0].card_header)
        expect(single_card['cardContent'].card_short_description).toEqual(polishTranslation["main-page"]['cards'][0].card_short_description)
        expect(single_card['cardContent'].card_tags.length).toEqual(polishTranslation["main-page"]['cards'][0]['card_tags'].length)
        expect(single_card['cardContent'].card_icon).toEqual(polishTranslation["main-page"]['cards'][0].card_icon)
    })

    it('is modal open after click on card',
        inject([TranslateService], (translateService: TranslateService) => {
            translateService.use('en')
            jest.spyOn(component, 'setCardStatus')
            component.setCardStatus(polishTranslation["main-page"]['cards'][0])
            fixture.detectChanges()
            fixture.whenStable().then(() => {
                expect(component.setCardStatus).toHaveBeenCalled()
            })
        })
    )

    it('is correct number of technologies icons', () => {
        const tech_container = fixture.debugElement.query(By.css('.technologies')).children[0]
        expect(tech_container.children.length).toEqual(component.tech_icons.length)
    })

});

