import { Route } from "@angular/router";
import { routes } from "./app.routes";

const routeFor = (path: string): Route => {
  const route = routes.find((r) => r.path === path);
  if (!route) throw new Error(`No route registered for "${path}"`);
  return route;
};

describe("app routes", () => {
  it("is the empty path redirecting to the main page", () => {
    const route = routeFor("");

    expect(route.redirectTo).toEqual("main-page");
    expect(route.pathMatch).toEqual("full");
  });

  it("is the wildcard route the last one so it only catches unknown paths", () => {
    expect(routes[routes.length - 1].path).toEqual("**");
  });

  it("is the admin route the only one behind the admin guard", () => {
    const guarded = routes.filter((route) => route.canActivate?.length);

    expect(guarded.map((route) => route.path)).toEqual(["admin"]);
  });

  it("is the breadcrumb data declared for every lazy route", () => {
    for (const route of routes.filter((r) => r.loadComponent)) {
      expect(route.data?.["breadcrumbs"]).toBeDefined();
    }
  });

  const lazyPaths = ["main-page", "login", "admin", "privacy-policy", "**"];

  it.each(lazyPaths)("is the %s route lazily loading a component", async (path) => {
    const loaded = await routeFor(path).loadComponent?.();

    expect(loaded).toBeDefined();
    expect((loaded as { name: string }).name).toEqual("MainComponent");
  });

  it("is the login breadcrumb nested under the main page", () => {
    expect(routeFor("login").data?.["breadcrumbs"]).toEqual([
      "main-page",
      "login",
    ]);
  });
});
