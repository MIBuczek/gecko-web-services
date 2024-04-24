import { ComponentFixture, inject, TestBed } from '@angular/core/testing';

import { MainComponent } from 'modules/privacy-policy/main/main.component';
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import { TranslateTestingModule } from "ngx-translate-testing";
import polishTranslation from "assets/i18n/pl.json";
import englishTranslation from "assets/i18n/en.json";
import { By } from "@angular/platform-browser";
import { Location } from "@angular/common";
import { TranslateService } from "@ngx-translate/core";
import { routes } from 'app/app.module';

const TRANSLATION: any = {
    'pl': polishTranslation,
    'en': englishTranslation
}

describe('Main Component - Privacy Policy Rout', () => {
    let component: MainComponent;
    let fixture: ComponentFixture<MainComponent>;
    let location: Location;
    let router: Router;

    const convertString = (s: string): string => {
        return s.toUpperCase().trim()
    }

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [MainComponent],
            providers: [{
                provide: ActivatedRoute,
                useValue: { snapshot: { data: { breadcrumbs: ['main-page', 'privacy-policy'] } } }
            }],
            imports: [
                TranslateTestingModule
                    .withTranslations(TRANSLATION)
                    .withDefaultLanguage('pl'),
                RouterModule.forRoot(routes)
            ],
        }).compileComponents();
        /* Initialization */
        fixture = TestBed.createComponent(MainComponent);
        component = fixture.componentInstance;
        router = TestBed.inject(Router);
        location = TestBed.inject(Location);
        router.initialNavigation()
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('is display correct initial text content', () => {
        fixture.detectChanges()
        const header = convertString(fixture.debugElement.query(By.css('.policy-header')).nativeElement['textContent'])
        const description = convertString(fixture.debugElement.query(By.css('p')).nativeElement['textContent'])
        expect(header).toEqual(convertString(polishTranslation["privacy-policy-page"].main_header))
        expect(description).toEqual(convertString(polishTranslation["privacy-policy-page"].main_description))
    });

    it('is display correct text content after lang switching', inject(
        [TranslateService], (translateService: TranslateService) => {
            translateService.use('en')
            fixture.detectChanges()
            const header = convertString(fixture.debugElement.query(By.css('.policy-header')).nativeElement['textContent'])
            const description = convertString(fixture.debugElement.query(By.css('p')).nativeElement['textContent'])
            expect(header).toEqual(convertString(englishTranslation["privacy-policy-page"].main_header))
            expect(description).toEqual(convertString(englishTranslation["privacy-policy-page"].main_description))
        })
    );

    it('is display correct number of part policy content', () => {
        const part_container = fixture.debugElement.query(By.css('.row'))
        expect(part_container.children.length).toEqual(polishTranslation["privacy-policy-page"].parts.length)
    })

    it('is redirect link work correctly', () => {
        fixture.detectChanges()
        const redirect_btn = fixture.debugElement.query(By.css('a'))
        expect(convertString(redirect_btn.nativeElement['textContent'])).toEqual(convertString(polishTranslation["privacy-policy-page"].redirect))
        expect(redirect_btn.nativeElement['href']).toEqual(`${window.location.origin}/main-page`)
        redirect_btn.nativeElement.click()
        fixture.detectChanges()
        expect(location.path()).toBe('/main-page')
    })
});
