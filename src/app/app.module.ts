import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { ComponentsModule } from "components/components.module";
import { HttpClientModule } from '@angular/common/http';
import { environment } from 'environments/environment';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { getDatabase, provideDatabase, } from '@angular/fire/database';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { FIREBASE_OPTIONS } from '@angular/fire/compat';
import { RouterModule, Routes } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { adminGuard } from 'guards/admin/admin.guard';


export const routes: Routes = [
  {
    path: '',
    redirectTo: 'main-page',
    pathMatch: 'full',
  },
  {
    path: 'main-page',
    loadChildren: () => import('modules/main/main.module').then(m => m.MainModule),
    data: { breadcrumbs: ['main-page'] },
  },
  {
    path: 'login',
    loadChildren: () => import('modules/login/login.module').then(m => m.LoginModule),
    data: { breadcrumbs: ['main-page', 'login'] },
  },
  {
    path: 'admin',
    loadChildren: () => import('modules/admin/admin.module').then(m => m.AdminModule),
    canActivate: [adminGuard],
    data: { breadcrumbs: ['main-page', 'admin'] },
  },
  {
    path: 'privacy-policy',
    loadChildren: () => import('modules/privacy-policy/privacy-policy.module').then(m => m.PrivacyPolicyModule),
    data: { breadcrumbs: ['main-page', 'privacy-policy'] },
  },
  {
    path: '**',
    loadChildren: () => import('modules/not-found/not-found.module').then(m => m.NotFoundModule),
    data: { breadcrumbs: ['main-page'] },
  }
];

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ComponentsModule,
    HttpClientModule,
    RouterModule.forRoot(routes, {
      useHash: true
    }),
    provideAuth(() => getAuth()),
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideDatabase(() => getDatabase())
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    { provide: FIREBASE_OPTIONS, useValue: environment.firebase }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
