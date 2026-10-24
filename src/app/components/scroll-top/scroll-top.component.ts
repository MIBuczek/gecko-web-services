import { Component, HostListener } from "@angular/core";
import { ViewportScroller } from "@angular/common";

@Component({
  selector: "app-scroll-top",
  templateUrl: "./scroll-top.component.html",
  styleUrls: ["./scroll-top.component.scss"],
  standalone: false
})
export class ScrollTopComponent {
  constructor(private viewportScroller: ViewportScroller) {}

  /**
   * Checks the position of the window and returns a boolean indicating whether the scroll position is greater than 200.
   *
   * @return {boolean} A boolean indicating whether the scroll position is greater than 200.
   */
  @HostListener("window:scroll", ["$event"])
  checkPosition(): boolean {
    return window.scrollY > 200;
  }

  /**
   * Scrolls the viewport to the top position.
   *
   * @return {void} This function does not return anything.
   */
  public scrollTop(): void {
    this.viewportScroller.scrollToPosition([0, 0]);
  }
}
