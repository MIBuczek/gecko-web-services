import {ComponentFixture, TestBed} from '@angular/core/testing';
import {ErrorMessageComponent} from './error-message.component';
import {By} from "@angular/platform-browser";

describe('ErrorMessageComponent', () => {
    let component: ErrorMessageComponent;
    let fixture: ComponentFixture<ErrorMessageComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ErrorMessageComponent]
        }).compileComponents();
        fixture = TestBed.createComponent(ErrorMessageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });


    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('is @Input message is display on UI', () => {
        component.message = 'To pole jest wymagane'
        const html_tag = fixture.debugElement.query(By.css('.text-danger'))
        fixture.detectChanges()
        expect(html_tag.nativeElement['innerText'].trim()).toEqual("To pole jest wymagane".trim())
    })
});
