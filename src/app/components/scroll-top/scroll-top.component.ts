import {Component, HostListener} from '@angular/core';
import {ViewportScroller} from "@angular/common";

@Component({
  selector: 'app-scroll-top',
  templateUrl: './scroll-top.component.html',
  styleUrls: ['./scroll-top.component.scss']
})
export class ScrollTopComponent {

  constructor(private viewportScroller: ViewportScroller) {
  }

  @HostListener('window:scroll', ['$event'])
  checkPosition(): boolean {
    return window.scrollY > 200
  }

  public scrollTop(): void {
    this.viewportScroller.scrollToPosition([0, 0])
  }
}
