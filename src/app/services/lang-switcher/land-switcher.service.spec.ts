import { TestBed } from '@angular/core/testing';

import { LandSwitcherService } from './land-switcher.service';

describe('LandSwitcherService', () => {
  let service: LandSwitcherService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LandSwitcherService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
