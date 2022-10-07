import {ComponentFixture, TestBed} from '@angular/core/testing';
import {CopyRightsComponent} from './copy-rights.component';
import {By} from "@angular/platform-browser";
import polishTranslation from "assets/i18n/pl.json";
import englishTranslation from "assets/i18n/en.json";
import {TranslateTestingModule} from "ngx-translate-testing";

const TRANSLATION: any = {
    'pl': polishTranslation,
    'en': englishTranslation
}

describe('CopyRightsComponent', () => {
    let component: CopyRightsComponent;
    let fixture: ComponentFixture<CopyRightsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [CopyRightsComponent],
            imports: [TranslateTestingModule
                .withTranslations(TRANSLATION)
                .withDefaultLanguage('pl')],
        }).compileComponents();
        fixture = TestBed.createComponent(CopyRightsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should show correct year', () => {
        const element = fixture.debugElement.query(By.css('.credits'))
        expect(element.nativeNode['innerText']).toContain(String(new Date().getFullYear()))
    });

    it('should redirect to main page', () => {
        const element = fixture.debugElement.query(By.css('.redirect'))
        expect(element.nativeNode.href).toEqual('https://gecko-web-services.web.app/')
    });
});
