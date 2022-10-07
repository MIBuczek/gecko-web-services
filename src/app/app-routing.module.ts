import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {MainPageComponent} from "views/main-page/main-page.component";
import {PrivacyPolicyPageComponent} from "views/privacy-policy-page/privacy-policy-page.component";
import {NotFoundPageComponent} from "views/not-found-page/not-found-page.component";

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'main-page'
  },
  {
    path: 'main-page',
    component: MainPageComponent,
    data: {breadcrumbs: ['main-page']},
  },
  {
    path: 'privacy-policy',
    component: PrivacyPolicyPageComponent,
    data: {breadcrumbs: ['main-page', 'privacy-policy']},
  },
  {
    path: '**',
    component: NotFoundPageComponent,
    data: {breadcrumbs: ['main-page']},
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
