import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';

import {PipeModule} from "pipes/pipe.module";
import {ComponentsModule} from "components/components.module";
import { MainPageComponent } from 'views/main-page/main-page.component';
import { PrivacyPolicyPageComponent } from 'views/privacy-policy-page/privacy-policy-page.component';
import { NotFoundPageComponent } from 'views/not-found-page/not-found-page.component';


@NgModule({
  declarations: [
    AppComponent,
    MainPageComponent,
    PrivacyPolicyPageComponent,
    NotFoundPageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    PipeModule,
    ComponentsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
