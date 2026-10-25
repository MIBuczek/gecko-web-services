import { ApplicationConfig, importProvidersFrom } from "@angular/core";
import { provideRouter, withHashLocation } from "@angular/router";
import { provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";
import { provideAnimations } from "@angular/platform-browser/animations";
import { provideFirebaseApp, initializeApp } from "@angular/fire/app";
import { getDatabase, provideDatabase } from "@angular/fire/database";
import { provideAuth, getAuth } from "@angular/fire/auth";
import { environment } from "environments/environment";
import { TranslateLangModule } from "app/modules/translate-lang/translate-lang.module";
import { routes } from "app/app.routes";

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withHashLocation()),
    provideHttpClient(withInterceptorsFromDi()),
    provideAnimations(),
    provideAuth(() => getAuth()),
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideDatabase(() => getDatabase()),
    importProvidersFrom(TranslateLangModule),
  ],
};
