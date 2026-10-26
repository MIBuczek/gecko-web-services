import { NgClass, NgIf } from "@angular/common";
import {
  Component,
  computed,
  HostListener,
  inject,
  linkedSignal,
} from "@angular/core";
import { RouterLink } from "@angular/router";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { ViewportScroller } from "@angular/common";
import { BreadcrumbsService } from "services/breadcrumbs/breadcrumbs.service";
import { LoaderService } from "services/loader/loader.service";
import { ScrollService, TypeContentId } from "services/scroll/scroll.service";

type TypeLang = "pl" | "en";

@Component({
  selector: "app-navigation",
  templateUrl: "./navigation.component.html",
  styleUrls: ["./navigation.component.scss"],
  standalone: true,
  imports: [NgClass, NgIf, RouterLink, TranslateModule],
})
export class NavigationComponent {
  private translate = inject(TranslateService);
  private viewportScroller = inject(ViewportScroller);
  private bc = inject(BreadcrumbsService);
  private ls = inject(LoaderService);
  private ss = inject(ScrollService);

  public selectedLang: TypeLang = "pl";
  public isNavbarOpen: boolean = false;

  /* Tracks the section in view, but a click overrides it until the next scroll. */
  public selectedContentId = linkedSignal<TypeContentId>(
    () => this.ss.currentActiveSection()
  );

  /* Logic to check are we on main page to display full or replacement navigation */
  public isMainPage = computed(() => {
    const bci = this.bc.breadcrumbsItems();
    return bci.length === 1 && bci[0].rout === "main-page";
  });

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
    this.selectedContentId.set(contentId);
    this.viewportScroller.scrollToAnchor(contentId);
  }
}
