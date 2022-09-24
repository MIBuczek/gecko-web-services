import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceCardDetailsComponent } from './service-card-details.component';

describe('ServiceCardDetailsComponent', () => {
  let component: ServiceCardDetailsComponent;
  let fixture: ComponentFixture<ServiceCardDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ServiceCardDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceCardDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
