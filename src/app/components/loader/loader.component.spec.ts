import {ComponentFixture, fakeAsync, TestBed,} from '@angular/core/testing';
import {LoaderComponent} from './loader.component';
import {By} from "@angular/platform-browser";
import {LoaderService} from "services/loader/loader.service";

describe('LoaderComponent', () => {
  let component: LoaderComponent;
  let fixture: ComponentFixture<LoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoaderComponent],
      providers: [LoaderService]
    }).compileComponents();
    fixture = TestBed.createComponent(LoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('is loading show correctly', () => {
    const element = fixture.debugElement.query(By.css('.loader'))
    component.ls.changeLoadingStatus = true
    fixture.detectChanges()
    expect(element.classes['show']).toBeTruthy()
  })

  it('is loading hide correctly', fakeAsync(() => {
    const element = fixture.debugElement.query(By.css('.loader'))
    component.ls.changeLoadingStatus = false
    fixture.detectChanges()
    expect(element.classes['show']).toBeFalsy()
  }))
});
