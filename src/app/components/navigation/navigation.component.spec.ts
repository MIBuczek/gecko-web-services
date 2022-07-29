import {ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';

import {NavigationComponent} from './navigation.component';
import {LandSwitcherService} from "services/lang-switcher/land-switcher.service";
import {By} from "@angular/platform-browser";
import {skip} from "rxjs";

describe('NavigationComponent', () => {
  let component: NavigationComponent;
  let fixture: ComponentFixture<NavigationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NavigationComponent],
      providers: [LandSwitcherService]
    }).compileComponents();
    fixture = TestBed.createComponent(NavigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('initial PL lang emission', (done) => {
    /* Check does current lang is emitted correctly initially */
    component.currentLang$.subscribe((lang) => {
      expect(lang).toEqual('PL')
      done()
    })
  })

  it('is lang switcher works', (done) => {
    /* Create test action */
    const toggle_btn = fixture.debugElement.query(By.css('.lang-switcher'))
    toggle_btn.nativeElement.click()

    /* Check does current lang is emitted correctly after change */
    component.currentLang$.pipe(skip(1)).subscribe((lang) => {
      expect(lang).toEqual('EN')
      done()
    })
  })

  it('is initial PL flag loaded', () => {
    const img_flag = fixture.debugElement.query(By.css('.img-fluid'))

    /* Check does current img flag is show correctly initially */
    expect(img_flag.attributes['src']).toContain('PL.png')
  })

  it('is flag changes after click', fakeAsync(() => {
    /* Create test action */
    const toggle_btn = fixture.debugElement.query(By.css('.lang-switcher'))
    toggle_btn.nativeElement.click()
    tick(1000);
    fixture.detectChanges();

    /* Check does current img flag is show correctly after change */
    const img_flag = fixture.debugElement.query(By.css('.img-fluid'))
    expect(img_flag.attributes['src']).toContain('EN.png')
  }))
});
