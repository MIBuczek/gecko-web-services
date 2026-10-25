import { setupZoneTestEnv } from "jest-preset-angular/setup-env/zone";

setupZoneTestEnv();

// Angular 20 stopped emitting the deprecated `ng-reflect-*` attributes unless
// `provideNgReflectAttributes()` is present. It has to be imported *after*
// `setupZoneTestEnv()` so zone.js/testing is registered before Angular's
// testing package loads; a static import at the top breaks `fakeAsync()`.
import { provideNgReflectAttributes } from "@angular/core";
import { TestBed } from "@angular/core/testing";

beforeEach(() => {
  TestBed.configureTestingModule({ providers: [provideNgReflectAttributes()] });
});
