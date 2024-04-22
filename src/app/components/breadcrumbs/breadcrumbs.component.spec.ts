import { ComponentFixture, fakeAsync, inject, TestBed } from '@angular/core/testing';
import { BreadcrumbsComponent } from './breadcrumbs.component';
import { By } from "@angular/platform-browser";
import { BreadcrumbsService } from "services/breadcrumbs/breadcrumbs.service";
import { RouterTestingModule } from "@angular/router/testing";
import { routes } from "../../app-routing.module";
import { Router, RouterModule } from "@angular/router";
import { Location } from "@angular/common";
import polishTranslation from "assets/i18n/pl.json";
import englishTranslation from "assets/i18n/en.json";
import { TranslateTestingModule } from "ngx-translate-testing";
import { TranslateService } from "@ngx-translate/core";
import { describe, expect, it } from '@jest/globals';



const TRANSLATION: any = {
    'pl': polishTranslation,
    'en': englishTranslation
}

const mock_bc_items = ['main-page', 'privacy-policy']

describe('BreadcrumbsComponent', () => {
    let component: BreadcrumbsComponent;
    let breadcrumbsService: BreadcrumbsService;
    let location: Location;
    let router: Router;
    let fixture: ComponentFixture<BreadcrumbsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [BreadcrumbsComponent],
            imports: [
                TranslateTestingModule
                    .withTranslations(TRANSLATION)
                    .withDefaultLanguage('pl'),
                RouterModule.forRoot(routes)
            ],
            providers: [BreadcrumbsService]
        }).compileComponents();
        /* Initialization */
        fixture = TestBed.createComponent(BreadcrumbsComponent);
        breadcrumbsService = TestBed.inject(BreadcrumbsService)
        router = TestBed.inject(Router);
        location = TestBed.inject(Location);
        router.initialNavigation();
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    const updatedBreadcrumbs = () => {
        breadcrumbsService.updateBreadcrumbsPath = breadcrumbsService.generateBreadcrumbs(mock_bc_items)
        component.breadcrumbs$ = breadcrumbsService.getBreadcrumbsItems
        fixture.detectChanges()
    }
    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should not display breadcrumbs  when breadcrumbs items are less then 1', () => {
        breadcrumbsService.updateBreadcrumbsPath = breadcrumbsService.generateBreadcrumbs([mock_bc_items[0]])
        component.breadcrumbs$ = breadcrumbsService.getBreadcrumbsItems
        const bc_container = fixture.debugElement.query(By.css('.container'))
        expect(bc_container).toBeNull()
    });

    it('should display breadcrumbs when breadcrumbs items are more then 1', () => {
        updatedBreadcrumbs()
        const bc_container = fixture.debugElement.query(By.css('.container'))
        expect(bc_container).toBeTruthy()
    });

    it('should display breadcrumbs items on UI', () => {
        updatedBreadcrumbs()
        const bc_list_item = fixture.debugElement.query(By.css('.breadcrumb'))
        const bc_items = bc_list_item.children.filter((el) => el.classes['breadcrumb-item'])
        expect(bc_items.length).toEqual(2)
    });

    it('should disabled last item on breadcrumbs', () => {
        updatedBreadcrumbs()
        const bc_list_item = fixture.debugElement.query(By.css('.breadcrumb'))
        const bc_last_item = bc_list_item.children[bc_list_item.children.length - 1]
        expect(bc_last_item.children[0].classes['disabled']).toBeTruthy()
    });

    it('should display one chevron icon', () => {
        updatedBreadcrumbs()
        const bc_list_item = fixture.debugElement.query(By.css('.breadcrumb'))
        const bc_chevron_icon = bc_list_item.children.filter((el) => el.classes['fa-chevron-right'])
        expect(bc_chevron_icon.length).toEqual(1)
    });

    it('should router link redirect after click to main-page', () => {
        updatedBreadcrumbs()
        const bc_item = fixture.debugElement.query(By.css('.breadcrumb-item'))
        bc_item.children[0].nativeElement.click()
        fixture.detectChanges()
        expect(location.path()).toBe('/main-page')
    })

    it('is display right text content in breadcrumbs navigation', inject(
        [TranslateService], (translateService: TranslateService) => {
            translateService.use('pl')
            updatedBreadcrumbs()
            fixture.detectChanges()
            const bc_list_item = fixture.debugElement.query(By.css('.breadcrumb'))
            const bc_items = bc_list_item.children.filter((el) => el.classes['breadcrumb-item'])
            expect(bc_items[0].nativeElement.textContent.trim()).toEqual(polishTranslation.breadcrumbs["main-page"])
            expect(bc_items[1].nativeElement.textContent.trim()).toEqual(polishTranslation.breadcrumbs["privacy-policy"])

            translateService.use('en')
            fixture.detectChanges()
            expect(bc_items[0].nativeElement.textContent.trim()).toEqual(englishTranslation.breadcrumbs["main-page"])
            expect(bc_items[1].nativeElement.textContent.trim()).toEqual(englishTranslation.breadcrumbs["privacy-policy"])
        }))
});
