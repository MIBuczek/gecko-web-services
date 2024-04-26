import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from "./footer/footer.component";
import { NavigationComponent } from "./navigation/navigation.component";
import { LoaderComponent } from "./loader/loader.component";
import { CookieComponent } from './cookie/cookie.component';
import { ErrorMessageComponent } from './error-message/error-message.component';
import { ReactiveFormsModule } from "@angular/forms";
import { CopyRightsComponent } from './copy-rights/copy-rights.component';
import { BreadcrumbsComponent } from './breadcrumbs/breadcrumbs.component';
import { ServiceCardComponent } from './service-card/service-card.component';
import { ModalCardDetailsComponent } from './modals/modal-card-details/modal-card-details.component';
import { TranslateModule } from "@ngx-translate/core";
import { ScrollTopComponent } from './scroll-top/scroll-top.component';
import { RouterModule } from '@angular/router';
import { FormErrorMessagePipe } from 'app/pipes/form-error-message.pipe';
import { NotificationComponent } from './notification/notification.component';


@NgModule({
  declarations: [
    FooterComponent,
    NavigationComponent,
    LoaderComponent,
    CookieComponent,
    ErrorMessageComponent,
    CopyRightsComponent,
    BreadcrumbsComponent,
    ServiceCardComponent,
    ModalCardDetailsComponent,
    ScrollTopComponent,
    NotificationComponent,
  ],
  exports: [
    FooterComponent,
    NavigationComponent,
    LoaderComponent,
    CookieComponent,
    CopyRightsComponent,
    BreadcrumbsComponent,
    ServiceCardComponent,
    ModalCardDetailsComponent,
    ScrollTopComponent,
    ErrorMessageComponent,
    NotificationComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    TranslateModule,
    FormErrorMessagePipe
  ]
})
export class ComponentsModule {
}
