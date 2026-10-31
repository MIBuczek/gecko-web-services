import { InjectionToken } from "@angular/core";
import type { FirebaseApp } from "firebase/app";
import type { Auth } from "firebase/auth";
import type { Database } from "firebase/database";

/**
 * The Firebase instances the app injects. They replace the tokens `@angular/fire`
 * used to provide, so the services depend on an interface the app owns rather than
 * on that package. `app.config.ts` supplies the implementations.
 */
export const FIREBASE_APP = new InjectionToken<FirebaseApp>("FIREBASE_APP");
export const FIREBASE_AUTH = new InjectionToken<Auth>("FIREBASE_AUTH");
export const FIREBASE_DATABASE = new InjectionToken<Database>("FIREBASE_DATABASE");
