import {ComponentFixture, TestBed} from '@angular/core/testing';

import {NavigationComponent} from './navigation.component';
import {LandSwitcherService} from "services/lang-switcher/land-switcher.service";

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
});
