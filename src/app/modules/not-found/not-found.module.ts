import { NgModule } from "@angular/core";
import { Route, RouterModule } from "@angular/router";
import { MainComponent } from "modules/not-found/main/main.component";
import { TranslateModule } from "@ngx-translate/core";
import { TranslateLangModule } from "modules/translate-lang/translate-lang.module";
import { CommonModule } from "@angular/common";
import { ComponentsModule } from "components/components.module";

const routes: Route[] = [
    {
        path: '',
        component: MainComponent
    }
];

@NgModule({
    declarations: [MainComponent],
    imports: [CommonModule, ComponentsModule, TranslateModule, TranslateLangModule, RouterModule.forChild(routes)]
})
export class NotFoundModule { }