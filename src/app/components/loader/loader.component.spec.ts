import {ComponentFixture, fakeAsync, flush, TestBed, tick} from '@angular/core/testing';

import {LoaderComponent} from './loader.component';
import {LandSwitcherService} from "services/lang-switcher/land-switcher.service";
import {By} from "@angular/platform-browser";

describe('LoaderComponent', () => {
  let component: LoaderComponent;
  let fixture: ComponentFixture<LoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoaderComponent],
      providers: [LandSwitcherService]
    }).compileComponents();
    fixture = TestBed.createComponent(LoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('is loading start correctly', () => {
    component.ls.langToggle()
    /* Check if loading variable change state correctly */
    expect(component.isLoading).toBeTruthy()
  })

  it('is loading end correctly', fakeAsync(() => {
    /* Create test action */
    component.ls.langToggle()
    tick(1000)
    fixture.detectChanges()

    /* Check if loading variable change state correctly after 1s */
    expect(component.isLoading).toBeFalsy()
  }))

  it('is spinner show on interface', fakeAsync(() => {
    /* Create test action */
    component.ls.langToggle()
    tick()
    fixture.detectChanges()

    /* Check does spinner show on UI */
    const spinner = fixture.debugElement.query(By.css('.loader'))
    expect(spinner.classes['show']).toBeTruthy()
    flush()
  }))

  it('is spinner hidde after 1 second', fakeAsync(() => {
    /* Create test action */
    component.ls.langToggle()
    tick(1000)
    fixture.detectChanges()

    /* Check does spinner hide on UI */
    const spinner = fixture.debugElement.query(By.css('.loader'))
    expect(spinner.classes['show']).toBeFalsy()
    flush()
  }))
});
