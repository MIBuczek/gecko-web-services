import { ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import polishTranslation from "assets/i18n/pl.json";
import englishTranslation from "assets/i18n/en.json";
import { TranslateTestingModule } from "ngx-translate-testing";
import { Location } from "@angular/common";
import { By } from "@angular/platform-browser";
import { TranslateService } from "@ngx-translate/core";
import { MainComponent } from 'modules/not-found/main/main.component';
import { routes } from 'app/app.module';


const TRANSLATION: any = {
    'pl': polishTranslation,
    'en': englishTranslation
}

describe('MainComponent - Not Found Module', () => {
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
                useValue: { snapshot: { data: { breadcrumbs: ['main-page'] } } }
            }],
            imports: [
                TranslateTestingModule
                    .withTranslations(TRANSLATION)
                    .withDefaultLanguage('pl'),
                RouterModule.forRoot(routes)
            ],

        }).compileComponents();
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
        const header = convertString(fixture.debugElement.query(By.css('.not-found-header')).nativeElement['textContent'])
        const description = convertString(fixture.debugElement.query(By.css('p')).nativeElement['textContent'])
        expect(header).toContain(convertString(polishTranslation["not-found-page"].header))
        expect(description).toContain(convertString(polishTranslation["not-found-page"].description))
    });

    it('is display correct text content after lang switching', inject(
        [TranslateService], (translateService: TranslateService) => {
            translateService.use('en')
            fixture.detectChanges()
            const header = convertString(fixture.debugElement.query(By.css('.not-found-header')).nativeElement['textContent'])
            const description = convertString(fixture.debugElement.query(By.css('p')).nativeElement['textContent'])
            expect(header).toContain(convertString(englishTranslation["not-found-page"].header))
            expect(description).toContain(convertString(englishTranslation["not-found-page"].description))
        }));

    it('is redirect link work correctly', () => {
        fixture.detectChanges()
        const redirect_btn = fixture.debugElement.query(By.css('a'))
        expect(convertString(redirect_btn.nativeElement['textContent'])).toEqual(convertString(polishTranslation["not-found-page"].redirect))
        expect(redirect_btn.nativeElement['href']).toEqual(`${window.location.origin}/main-page`)
        redirect_btn.nativeElement.click()
        fixture.detectChanges()
        expect(location.path()).toBe('/main-page')
    })
});
