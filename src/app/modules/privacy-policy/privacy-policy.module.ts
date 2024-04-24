import { Route, RouterModule } from "@angular/router";
import { MainComponent } from "modules/privacy-policy/main/main.component";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ComponentsModule } from "components/components.module";
import { TranslateModule } from "@ngx-translate/core";
import { TranslateLangModule } from "modules/translate-lang/translate-lang.module";

const routes: Route[] = [
    {
        path: '',
        pathMatch: 'full',
        component: MainComponent
    }
];

@NgModule({
    declarations: [MainComponent],
    imports: [CommonModule, ComponentsModule, TranslateModule, TranslateLangModule, RouterModule.forChild(routes)]
})
export class PrivacyPolicyModule { }