import {ComponentFixture, TestBed} from '@angular/core/testing';

import {LoaderComponent} from './loader.component';
import {LandSwitcherService} from "services/lang-switcher/land-switcher.service";

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
});
