import {ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';

import {CookieComponent} from './cookie.component';
import {LandSwitcherService} from "services/lang-switcher/land-switcher.service";
import {By} from "@angular/platform-browser";
import {cookiesTextContent} from "text-content/cookies/index.json";

describe('CookieComponent', () => {
  let component: CookieComponent;
  let langSwitcher: LandSwitcherService
  let fixture: ComponentFixture<CookieComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CookieComponent],
      providers: [LandSwitcherService]
    })
      .compileComponents();
    fixture = TestBed.createComponent(CookieComponent);
    component = fixture.componentInstance;
    langSwitcher = TestBed.inject(LandSwitcherService)
    fixture.detectChanges();
    window.localStorage.clear()
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('is correct initial inner text in h1', () => {
    const contact_header = fixture.debugElement.query(By.css('h1'))

    /* Check if UI show correct text initially  */
    expect(contact_header.nativeElement['innerText'])
      .toContain(cookiesTextContent[component.currentLang].title)
  })

  it('is h1 inner text change after changing lang', fakeAsync(() => {
    /* Create test action */
    const contact_header = fixture.debugElement.query(By.css('h1'))
    langSwitcher.langToggle()
    tick(1000)
    fixture.detectChanges()

    /* Check if UI show correct text after lang change */
    expect(contact_header.nativeElement['innerText'])
      .toContain(cookiesTextContent[component.currentLang].title)
  }))

  it('is cookies confirmation display if it is not accepted', () => {
    /* Create test action */
    component.isCookiesAccepted = false
    const cookie_wrapper = fixture.debugElement.query(By.css('.cookies-wrapper'))
    fixture.detectChanges()

    /* Check if cookie modal display properly if cookie is not accepted */
    expect(cookie_wrapper).toBeTruthy()
  })

  it('is cookies confirmation is save on local storage', () => {
    /* Create test action */
    component.acceptCookies()
    const local_storage = window.localStorage.getItem('cookies')

    /* Check local storage is value saved */
    expect(local_storage).toBeTruthy()

    fixture.detectChanges()
    /* Check is content hide after accept */
    const cookie_wrapper = fixture.debugElement.query(By.css('.cookies-wrapper'))
    expect(cookie_wrapper).toBeNull()

    window.localStorage.clear()
  })

  it('is cookies modal not visible if it is accepted already', () => {
    /* Create test action */
    window.localStorage.setItem('cookies', String(true))
    component.ngOnInit()
    fixture.detectChanges()

    /* Check if content is hidden */
    const cookie_wrapper = fixture.debugElement.query(By.css('.cookies-wrapper'))
    expect(cookie_wrapper).toBeNull()

    window.localStorage.clear()
  })
});
