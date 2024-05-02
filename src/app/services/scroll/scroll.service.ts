import { Injectable, OnDestroy } from "@angular/core";
import { BehaviorSubject, fromEvent, Observable, Subscription } from "rxjs";

export type TypeContentId = "header" | "about" | "service" | "contact";

@Injectable({
  providedIn: "root",
})
export class ScrollService implements OnDestroy {
  private currentSection = new BehaviorSubject<TypeContentId>("header");
  readonly sections: TypeContentId[] = [
    "header",
    "about",
    "service",
    "contact",
  ];
  private subscription = new Subscription();

  constructor() {
    this.subscription.add(
      fromEvent(window, "scroll").subscribe(() => this.keepTrack())
    );
  }

  /**
   * Returns an observable of the current active section.
   *
   * @return {Observable<TypeContentId>} The observable of the current active section.
   */
  get getCurrentActiveSection(): Observable<TypeContentId> {
    return this.currentSection.asObservable();
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
        this.currentSection.next(section);
      }
    });
  }

  /**
   * end component life cycle.
   */
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
