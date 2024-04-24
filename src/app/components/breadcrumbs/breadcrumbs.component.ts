import { Component } from '@angular/core';
import { BreadcrumbsService } from "services/breadcrumbs/breadcrumbs.service";
import { BreadCrumbItem } from "classes/breadcrumbs-item.class";
import { IAppRouts } from "models/general";
import { Observable } from "rxjs";

@Component({
    selector: 'app-breadcrumbs',
    templateUrl: './breadcrumbs.component.html',
    styleUrls: ['./breadcrumbs.component.scss']
})
export class BreadcrumbsComponent {
    readonly availableRouts: Array<keyof IAppRouts> = ['main-page', 'privacy-policy']
    public breadcrumbs$: Observable<BreadCrumbItem[]>;

    constructor(private bc: BreadcrumbsService) {
        this.breadcrumbs$ = this.bc.getBreadcrumbsItems;
    }

    /* Method to convert any value to string to be accepted by routerLink*/
    public convertToString(path: keyof IAppRouts | string | number): string {
        return String(path)
    }
}
