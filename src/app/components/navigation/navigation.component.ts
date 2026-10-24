import { Component, HostListener } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { ViewportScroller } from "@angular/common";
import { BreadcrumbsService } from "services/breadcrumbs/breadcrumbs.service";
import { LoaderService } from "services/loader/loader.service";
import { ScrollService, TypeContentId } from "services/scroll/scroll.service";

type TypeLang = "pl" | "en";

@Component({
  selector: "app-navigation",
  templateUrl: "./navigation.component.html",
  styleUrls: ["./navigation.component.scss"],
  standalone: false
})
export class NavigationComponent {
  public selectedLang: TypeLang = "pl";
  public isNavbarOpen: boolean = false;
  public selectedContentId: TypeContentId = "header";
  public isMainPage = true;

  constructor(
    private translate: TranslateService,
    private viewportScroller: ViewportScroller,
    private bc: BreadcrumbsService,
    private ls: LoaderService,
    private ss: ScrollService
  ) {
    /* Logic to check are we on main page to display full or replacement navigation */
    this.bc.getBreadcrumbsItems.subscribe(
      (bci) =>
        (this.isMainPage = bci.length === 1 && bci[0].rout === "main-page")
    );
    this.ss.getCurrentActiveSection.subscribe(
      (section) => (this.selectedContentId = section)
    );
  }

  /* Listener to tract vertical and horizontal pixels */
  @HostListener("window:scroll", ["$event"])
  checkPosition(vertical: boolean): boolean {
    if (vertical) return window.scrollY > 60;
    else return window.innerWidth < 650;
  }

  /* Method to change page language */
  public langToggle(event: Event) {
    event.stopPropagation();
    const currentLang = this.selectedLang.includes("pl") ? "en" : "pl";
    this.ls.changeLoadingStatus = true;
    this.translate.use(currentLang);
    this.selectedLang = currentLang;
    setTimeout(() => (this.ls.changeLoadingStatus = false), 1500);
  }

  /* Method to hide and show navigation if width is lower then 650px */
  public navbarToggle(): void {
    this.isNavbarOpen = !this.isNavbarOpen;
  }

  /* Method to smooth scroll to the selected element on page */
  public scrollToElement(contentId: TypeContentId): void {
    this.selectedContentId = contentId;
    this.viewportScroller.scrollToAnchor(contentId);
  }
}
