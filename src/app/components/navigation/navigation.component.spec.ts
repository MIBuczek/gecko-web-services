import {ComponentFixture, fakeAsync, inject, TestBed, tick} from '@angular/core/testing';
import {NavigationComponent} from './navigation.component';
import {By} from "@angular/platform-browser";
import polishTranslation from "assets/i18n/pl.json";
import englishTranslation from "assets/i18n/en.json";
import {TranslateTestingModule} from "ngx-translate-testing";
import {TranslateService} from "@ngx-translate/core";
import {BreadcrumbsService} from "services/breadcrumbs/breadcrumbs.service";
import {LoaderService} from "services/loader/loader.service";
import {Location, ViewportScroller} from "@angular/common";
import {RouterTestingModule} from "@angular/router/testing";
import {routes} from "../../app-routing.module";


const TRANSLATION: any = {
    'pl': polishTranslation,
    'en': englishTranslation
}

describe('NavigationComponent', () => {
    let component: NavigationComponent;
    let fixture: ComponentFixture<NavigationComponent>;
    let breadcrumbsService: BreadcrumbsService;
    let loaderService: LoaderService;
    let viewportScroller: ViewportScroller

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [NavigationComponent],
            providers: [BreadcrumbsService, LoaderService, ViewportScroller],
            imports: [
                TranslateTestingModule
                    .withTranslations(TRANSLATION)
                    .withDefaultLanguage('pl'),
                RouterTestingModule.withRoutes(routes)
            ],
        }).compileComponents();
        fixture = TestBed.createComponent(NavigationComponent);
        component = fixture.componentInstance;
        breadcrumbsService = TestBed.inject(BreadcrumbsService)
        loaderService = TestBed.inject(LoaderService)
        viewportScroller = TestBed.inject(ViewportScroller)
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('initial PL lang emission',
        inject([TranslateService], (translateService: TranslateService) => {
            expect(translateService.getDefaultLang()).toEqual('pl')
        })
    )

    it('is lang switcher change lang',
        inject([TranslateService], (translateService: TranslateService) => {
            const toggle_btn = fixture.debugElement.query(By.css('.lang-switcher'))
            toggle_btn.nativeElement.click()
            fixture.detectChanges()
            expect(translateService.currentLang).toEqual('en')
        })
    )

    it('is initial PL flag loaded', () => {
        const img_flag = fixture.debugElement.query(By.css('.img-fluid'))
        expect(img_flag.attributes['src']).toContain('PL.png')
    })

    it('is flag changes after click', fakeAsync(() => {
        /* Create test action */
        const toggle_btn = fixture.debugElement.query(By.css('.lang-switcher'))
        toggle_btn.nativeElement.click()
        tick(1600);
        fixture.detectChanges();
        const img_flag = fixture.debugElement.query(By.css('.img-fluid'))
        expect(img_flag.attributes['src']).toContain('EN.png')
    }))

    it('is correct number of navbar items display on UI if is [main-page]',
        fakeAsync(inject([Location], (location: Location) => {
            const navbar = fixture.debugElement.query(By.css('.navbar-nav'))
            location.go('main-page')
            component.isMainPage = location.path().includes('main-page')
            fixture.detectChanges()
            expect(navbar.children.length).toEqual(5)
        }))
    );

    it('is correct number of navbar items display on UI if is [private-policy]',
        fakeAsync(inject([Location], (location: Location) => {
            const navbar = fixture.debugElement.query(By.css('.navbar-nav'))
            location.go('private-policy')
            component.isMainPage = location.path().includes('main-page')
            fixture.detectChanges()
            expect(navbar.children.length).toEqual(2)
        }))
    )

    it('is correct style display on nav active item',
        fakeAsync(inject([Location], (location: Location) => {
            const navbar = fixture.debugElement.query(By.css('.navbar-nav'))
            location.go('main-page')
            component.isMainPage = location.path().includes('main-page')
            fixture.detectChanges()

            expect(navbar.children[0].classes['active']).toBeTruthy()

            const active_nav_items = navbar.children.filter((el) => el.classes['active'])
            expect(active_nav_items.length).toEqual(1)

            navbar.children[1].children[0].nativeElement.click()
            fixture.detectChanges()
            expect(navbar.children[1].classes['active']).toBeTruthy()
        }))
    )

    it('is toggle-button not display if width is more then 650', () => {
        const toggle_button = fixture.debugElement.query(By.css('.navbar-toggler'))
        expect(toggle_button).toBeNull()
    })

    it('is toggle-button display on UI if width is less then 650', () => {
        spyOn(component, 'checkPosition').and.returnValue(true)
        component.checkPosition(false)
        fixture.detectChanges()
        const toggle_button = fixture.debugElement.query(By.css('.navbar-toggler'))
        expect(toggle_button).toBeTruthy()
    })

    it('has navigation contain class sticky on scroll', () => {
        spyOn(component, 'checkPosition').and.returnValue(true)
        component.checkPosition(true)
        fixture.detectChanges()
        const navbar_container = fixture.debugElement.query(By.css('.fixed-top'))
        expect(navbar_container.classes['sticky']).toBeTruthy()
    })

    it('is correct redirect to main page if are on subpage',
        fakeAsync(inject([Location], (location: Location) => {
            location.go('private-policy')
            fixture.debugElement.query(By.css('.nav-link')).nativeElement.click()
            fixture.whenStable().then(() => {
                expect(location.path()).toEqual('/main-page')
            })
        }))
    )
});
