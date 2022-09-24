import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalCardDetailsComponent } from './modal-card-details.component';

describe('ServiceCardDetailsComponent', () => {
  let component: ModalCardDetailsComponent;
  let fixture: ComponentFixture<ModalCardDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalCardDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalCardDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
