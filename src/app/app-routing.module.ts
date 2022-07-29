import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {MainPageComponent} from "views/main-page/main-page.component";
import {PrivacyPolicyPageComponent} from "views/privacy-policy-page/privacy-policy-page.component";
import {NotFoundPageComponent} from "views/not-found-page/not-found-page.component";

const routes: Routes = [
  {
    path: '',
    pathMatch : 'full',
    redirectTo: 'main-page'
  },
  {
    path: 'main-page',
    component: MainPageComponent
  },
  {
    path: 'privacy-policy',
    component: PrivacyPolicyPageComponent
  },
  {
    path: '**',
    component: NotFoundPageComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
