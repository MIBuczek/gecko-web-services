import { ApplicationConfig, importProvidersFrom } from "@angular/core";
import { provideRouter, withHashLocation } from "@angular/router";
import { provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";
import { provideAnimations } from "@angular/platform-browser/animations";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { initializeApp } from "firebase/app";
import { environment } from "environments/environment";
import { TranslateLangModule } from "app/modules/translate-lang/translate-lang.module";
import { routes } from "app/app.routes";
import {
  FIREBASE_APP,
  FIREBASE_AUTH,
  FIREBASE_DATABASE,
} from "utilities/firebase.tokens";

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withHashLocation()),
    provideHttpClient(withInterceptorsFromDi()),
    provideAnimations(),
    {
      provide: FIREBASE_APP,
      useFactory: () => initializeApp(environment.firebase),
    },
    { provide: FIREBASE_AUTH, useFactory: getAuth, deps: [FIREBASE_APP] },
    { provide: FIREBASE_DATABASE, useFactory: getDatabase, deps: [FIREBASE_APP] },
    importProvidersFrom(TranslateLangModule),
  ],
};
