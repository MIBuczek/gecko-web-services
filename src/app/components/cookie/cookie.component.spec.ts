import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CookieComponent} from './cookie.component';
import {LandSwitcherService} from "../../services/lang-switcher/land-switcher.service";

describe('CookieComponent', () => {
  let component: CookieComponent;
  let fixture: ComponentFixture<CookieComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CookieComponent],
      providers: [LandSwitcherService]
    })
      .compileComponents();
    fixture = TestBed.createComponent(CookieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
