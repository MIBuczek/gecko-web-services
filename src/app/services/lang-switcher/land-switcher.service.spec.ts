import {fakeAsync, flush, TestBed} from '@angular/core/testing';

import {LandSwitcherService} from './land-switcher.service';
import {delay, first, last, take} from "rxjs";

describe('LandSwitcherService', () => {
  let service: LandSwitcherService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LandSwitcherService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('is check initial lang value correct', fakeAsync(() => {
    service.getCurrentLang.pipe(take(1)).subscribe((lang) => {
      expect(lang).toEqual('PL')
    })
    flush()
  }))

  it('is lang value change correctly', fakeAsync(() => {
    service.langToggle()
    service.getCurrentLang.pipe(last()).subscribe((lang) => {
      expect(lang).toEqual('EN')
    })
    flush()
  }))

  it('is toggled initial value correct', fakeAsync(() => {
    service.isToggling.pipe(first()).subscribe((toggled) => {
      expect(toggled).toBeFalsy()
    })
    flush()
  }))

  it('is toggled value change correctly', fakeAsync(() => {
    service.langToggle()
    service.isToggling.pipe(delay(500), take(1)).subscribe((toggled) => {
      expect(toggled).toBeTruthy()
    })
    flush()
  }))
});
