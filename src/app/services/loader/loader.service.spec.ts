import { TestBed } from "@angular/core/testing";

import { LoaderService } from "./loader.service";

describe("LoaderService", () => {
  let service: LoaderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoaderService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("it should initial return false ", () => {
    expect(service.loaderStatus()).toBeFalsy();
  });

  it("is return truthy status when changeLoadingStatus is called", () => {
    service.changeLoadingStatus = true;
    expect(service.loaderStatus()).toBeTruthy();
  });
});
