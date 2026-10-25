import { Routes } from "@angular/router";
import { adminGuard } from "guards/admin/admin.guard";

export const routes: Routes = [
  {
    path: "",
    redirectTo: "main-page",
    pathMatch: "full",
  },
  {
    path: "main-page",
    loadComponent: () =>
      import("modules/main/main/main.component").then((m) => m.MainComponent),
    data: { breadcrumbs: ["main-page"] },
  },
  {
    path: "login",
    loadComponent: () =>
      import("modules/login/main/main.component").then((m) => m.MainComponent),
    data: { breadcrumbs: ["main-page", "login"] },
  },
  {
    path: "admin",
    loadComponent: () =>
      import("modules/admin/main/main.component").then((m) => m.MainComponent),
    canActivate: [adminGuard],
    data: { breadcrumbs: ["main-page", "admin"] },
  },
  {
    path: "privacy-policy",
    loadComponent: () =>
      import("modules/privacy-policy/main/main.component").then(
        (m) => m.MainComponent
      ),
    data: { breadcrumbs: ["main-page", "privacy-policy"] },
  },
  {
    path: "**",
    loadComponent: () =>
      import("modules/not-found/main/main.component").then(
        (m) => m.MainComponent
      ),
    data: { breadcrumbs: ["main-page"] },
  },
];
