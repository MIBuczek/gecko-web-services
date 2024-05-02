import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { MainComponent } from 'modules/login/main/main.component';
import { CommonModule } from '@angular/common';
import { ComponentsModule } from 'app/components/components.module';

const routes: Route[] = [
  {
    path: '',
    pathMatch: 'full',
    component: MainComponent
  }
];

@NgModule({
  declarations: [MainComponent],
  imports: [
    CommonModule,
    ComponentsModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class LoginModule { }
