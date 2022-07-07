import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FooterComponent} from "./footer/footer.component";
import {HeaderComponent} from "./header/header.component";
import {NavigationComponent} from "./navigation/navigation.component";
import {LoaderComponent} from "./loader/loader.component";
import {PipeModule} from "pipes/pipe.module";
import { CookieComponent } from './cookie/cookie.component';
import { ErrorMessageComponent } from './error-message/error-message.component';
import {ReactiveFormsModule} from "@angular/forms";



@NgModule({
  declarations: [
    FooterComponent,
    HeaderComponent,
    NavigationComponent,
    LoaderComponent,
    CookieComponent,
    ErrorMessageComponent,
  ],
  exports: [
    FooterComponent,
    HeaderComponent,
    NavigationComponent,
    LoaderComponent,
    CookieComponent
  ],
    imports: [
        CommonModule,
        PipeModule,
        ReactiveFormsModule
    ]
})
export class ComponentsModule {
}
