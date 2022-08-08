import {Component} from '@angular/core';
import {BreadcrumbsService} from "services/breadcrumbs/breadcrumbs.service";
import {BreadCrumbItem} from "classes/breadcrumbs-item.class";
import {IAppRouts, TypeLang} from "models/general";
import {LandSwitcherService} from "services/lang-switcher/land-switcher.service";

@Component({
  selector: 'app-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styleUrls: ['./breadcrumbs.component.scss']
})
export class BreadcrumbsComponent {
  public breadcrumbs: BreadCrumbItem[] = []
  public currentLang: TypeLang = 'PL';


  constructor(private bc: BreadcrumbsService, private ls: LandSwitcherService) {
    this.bc.getBreadcrumbsItems.subscribe((curr) => this.breadcrumbs = curr);
    this.ls.getCurrentLang.subscribe((lang) => this.currentLang = lang)
  }

  /* Method to convert any value to string to be accepted by routerLink*/
  public convertToString(path: keyof IAppRouts | string | number): string {
    return String(path)
  }
}
