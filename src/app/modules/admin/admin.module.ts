import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { Route, RouterModule } from "@angular/router";
import { ComponentsModule } from "app/components/components.module";
import { MainComponent } from "modules/admin/main/main.component";
import { TranslateLangModule } from "../translate-lang/translate-lang.module";

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
        TranslateLangModule,
        RouterModule.forChild(routes),
    ]
})
export class AdminModule { }