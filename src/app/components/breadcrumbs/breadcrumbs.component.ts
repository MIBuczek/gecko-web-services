import {Component} from '@angular/core';
import {BreadcrumbsService} from "services/breadcrumbs/breadcrumbs.service";
import {BreadCrumbItem} from "classes/breadcrumbs-item.class";
import {IAppRouts, TypeLang} from "models/general";

@Component({
  selector: 'app-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styleUrls: ['./breadcrumbs.component.scss']
})
export class BreadcrumbsComponent {
  public breadcrumbs: BreadCrumbItem[] = []
  public currentLang: TypeLang = 'PL'

  constructor(private bc: BreadcrumbsService) {
    this.bc.getBreadcrumbsItems.subscribe((curr) => this.breadcrumbs = curr);
  }

  /* Method to convert any value to string to be accepted by routerLink*/
  public convertToString(path: keyof IAppRouts | string | number): string {
    return String(path)
  }
}
