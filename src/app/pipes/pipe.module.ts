import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BreadcrumbsPipe} from './breadcrumbs/breadcrumbs.pipe';


@NgModule({
  declarations: [BreadcrumbsPipe],
  exports: [BreadcrumbsPipe],
  imports: [
    CommonModule
  ]
})
export class PipeModule {
}
