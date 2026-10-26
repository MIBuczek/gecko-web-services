import { Injectable, OnDestroy, signal } from "@angular/core";

export type TypeContentId = "header" | "about" | "service" | "contact";

@Injectable({
  providedIn: "root",
})
export class ScrollService implements OnDestroy {
  private readonly _currentActiveSection = signal<TypeContentId>("header");

  /**
   * The section currently in view.
   *
   * @return {Signal<TypeContentId>} The section currently in view.
   */
  readonly currentActiveSection = this._currentActiveSection.asReadonly();

  readonly sections: TypeContentId[] = [
    "header",
    "about",
    "service",
    "contact",
  ];

  /* Bound once so the same reference can be removed again. */
  private readonly onScroll = (): void => this.keepTrack();

  constructor() {
    window.addEventListener("scroll", this.onScroll);
  }

  /**
   * Tracks the sections and sets the active one based on the position on the viewport.
   */
  keepTrack(): void {
    this.sections.forEach((section): void => {
      const element = document.getElementById(section);
      if (!element) return;
      const { top } = element.getBoundingClientRect();
      if (top >= 0 && top <= window.innerHeight / 2) {
        this._currentActiveSection.set(section);
      }
    });
  }

  /**
   * end component life cycle.
   */
  ngOnDestroy(): void {
    window.removeEventListener("scroll", this.onScroll);
  }
}
