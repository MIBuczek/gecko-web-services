import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { Route, RouterModule } from "@angular/router";
import { MainComponent } from "modules/admin/main/main.component";

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
        RouterModule.forChild(routes),
    ]
})
export class AdminModule { }