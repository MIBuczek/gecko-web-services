import {ComponentFixture, TestBed} from '@angular/core/testing';
import {HeaderComponent} from './header.component';
import {By} from "@angular/platform-browser";

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HeaderComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('is logo alt display correctly', () => {
    /* Check if logo has correct path */
    const logo = fixture.debugElement.query(By.css('.h-logo')).children
    expect(logo[0].attributes['src']).toEqual('./assets/images/logo-gws.png')
  })

  it('is logo alt display correctly', () => {
    /* Check if logo display correct alt text */
    const logo = fixture.debugElement.query(By.css('.h-logo')).children
    expect(logo[0].nativeElement['alt']).toEqual('Logo Gecko Web Services')
  })
});
