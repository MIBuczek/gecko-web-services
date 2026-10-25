import { fakeAsync, TestBed, tick } from "@angular/core/testing";

import { BreadcrumbsService } from "./breadcrumbs.service";
import { BreadCrumbItem } from "../../classes/breadcrumbs-item.class";

describe("BreadcrumbsService", () => {
  let service: BreadcrumbsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BreadcrumbsService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("service should emit empty array when is no value", () => {
    expect(service.breadcrumbsItems().length).toEqual(0);
  });

  it("generateBreadcrumbs return Array of BreadCrumbItem type", fakeAsync(() => {
    jest
      .spyOn(service, "generateBreadcrumbs")
      .mockReturnValue([new BreadCrumbItem("main-page", false)]);
    const result = service.generateBreadcrumbs(["main-page"]);
    tick(1000);
    expect(service.generateBreadcrumbs).toHaveBeenCalled();
    expect(service.generateBreadcrumbs).toHaveBeenCalledWith(["main-page"]);
    expect(result[0]).toBeInstanceOf(BreadCrumbItem);
  }));

  it("service should expose the updated breadcrumbs", () => {
    service.updateBreadcrumbsPath = service.generateBreadcrumbs(["main-page"]);
    expect(service.breadcrumbsItems().length).toEqual(1);
  });
});
