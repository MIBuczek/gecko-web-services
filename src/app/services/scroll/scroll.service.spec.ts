import { TestBed } from "@angular/core/testing";

import { ScrollService, TypeContentId } from "./scroll.service";

const HALF_VIEWPORT = 300;

const stubSection = (id: TypeContentId, top: number): HTMLElement => {
  const element = document.createElement("div");
  element.id = id;
  jest
    .spyOn(element, "getBoundingClientRect")
    .mockReturnValue({ top } as DOMRect);
  document.body.appendChild(element);
  return element;
};

describe("ScrollService", () => {
  let service: ScrollService;
  let addEventListener: jest.SpyInstance;
  let scrollHandler: EventListenerOrEventListenerObject;

  beforeEach(() => {
    addEventListener = jest.spyOn(window, "addEventListener");
    TestBed.configureTestingModule({});
    service = TestBed.inject(ScrollService);
    scrollHandler = addEventListener.mock.calls.find(
      ([event]) => event === "scroll"
    )?.[1] as EventListenerOrEventListenerObject;
    /* jsdom defaults innerHeight to 768; pin it so the half-viewport threshold
       in keepTrack is explicit. */
    Object.defineProperty(window, "innerHeight", {
      writable: true,
      configurable: true,
      value: HALF_VIEWPORT * 2,
    });
  });

  afterEach(() => {
    document.body.innerHTML = "";
    jest.restoreAllMocks();
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("is the header the active section initially", () => {
    expect(service.currentActiveSection()).toEqual("header");
  });

  it("is the sections list the four tracked content ids", () => {
    expect(service.sections).toEqual(["header", "about", "service", "contact"]);
  });

  it("is a scroll listener registered on construction", () => {
    expect(scrollHandler).toEqual(expect.any(Function));
  });

  it("is the section in the upper half made active", () => {
    stubSection("about", HALF_VIEWPORT - 1);

    service.keepTrack();

    expect(service.currentActiveSection()).toEqual("about");
  });

  it("is a section below the half viewport ignored", () => {
    stubSection("service", HALF_VIEWPORT + 1);

    service.keepTrack();

    expect(service.currentActiveSection()).toEqual("header");
  });

  it("is a section scrolled above the viewport ignored", () => {
    stubSection("contact", -10);

    service.keepTrack();

    expect(service.currentActiveSection()).toEqual("header");
  });

  it("is a missing section element skipped without throwing", () => {
    /* No elements are in the document at all. */
    expect(() => service.keepTrack()).not.toThrow();
    expect(service.currentActiveSection()).toEqual("header");
  });

  it("is the lowest section in the upper half the active one", () => {
    stubSection("about", 10);
    stubSection("service", HALF_VIEWPORT - 1);

    service.keepTrack();

    /* keepTrack walks the list in order, so the last match wins. */
    expect(service.currentActiveSection()).toEqual("service");
  });

  it("is the scroll listener removed on destroy", () => {
    const removeEventListener = jest.spyOn(window, "removeEventListener");

    service.ngOnDestroy();

    expect(removeEventListener).toHaveBeenCalledWith("scroll", scrollHandler);
  });

  it("is keepTrack driven by the registered scroll handler", () => {
    stubSection("about", 10);

    (scrollHandler as EventListener)(new Event("scroll"));

    expect(service.currentActiveSection()).toEqual("about");
  });
});
