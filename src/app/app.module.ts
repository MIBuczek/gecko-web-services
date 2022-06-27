import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FooterComponent } from './componets/footer/footer.component';
import { HeaderComponent } from './componets/header/header.component';
import { NavigationComponent } from './componets/navigation/navigation.component';
import {LoaderComponent} from "./componets/loader/loader.component";

@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    HeaderComponent,
    NavigationComponent,
    LoaderComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
