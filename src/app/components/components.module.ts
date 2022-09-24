import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FooterComponent} from "./footer/footer.component";
import {HeaderComponent} from "./header/header.component";
import {NavigationComponent} from "./navigation/navigation.component";
import {LoaderComponent} from "./loader/loader.component";
import {PipeModule} from "pipes/pipe.module";
import {CookieComponent} from './cookie/cookie.component';
import {ErrorMessageComponent} from './error-message/error-message.component';
import {ReactiveFormsModule} from "@angular/forms";
import {CopyRightsComponent} from './copy-rights/copy-rights.component';
import {AppRoutingModule} from "../app-routing.module";
import {BreadcrumbsComponent} from './breadcrumbs/breadcrumbs.component';
import {ServiceCardComponent} from './service-card/service-card.component';
import { ModalCardDetailsComponent } from './modals/modal-card-details/modal-card-details.component';


@NgModule({
  declarations: [
    FooterComponent,
    HeaderComponent,
    NavigationComponent,
    LoaderComponent,
    CookieComponent,
    ErrorMessageComponent,
    CopyRightsComponent,
    BreadcrumbsComponent,
    ServiceCardComponent,
    ModalCardDetailsComponent,
  ],
  exports: [
    FooterComponent,
    HeaderComponent,
    NavigationComponent,
    LoaderComponent,
    CookieComponent,
    CopyRightsComponent,
    BreadcrumbsComponent,
    ServiceCardComponent,
    ModalCardDetailsComponent
  ],
  imports: [
    CommonModule,
    PipeModule,
    ReactiveFormsModule,
    AppRoutingModule
  ]
})
export class ComponentsModule {
}
