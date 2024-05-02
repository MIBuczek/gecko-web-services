import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { TranslateModule } from "@ngx-translate/core";
import { ComponentsModule } from "components/components.module";
import { MainComponent } from "modules/main/main/main.component";
import { TranslateLangModule } from "modules/translate-lang/translate-lang.module";

export const routes: Routes = [
  {
    path: "",
    component: MainComponent,
  },
];

@NgModule({
  declarations: [MainComponent],
  imports: [
    CommonModule,
    ComponentsModule,
    RouterModule.forChild(routes),
    ComponentsModule,
    TranslateModule,
    TranslateLangModule,
  ],
})
export class MainModule {}
