import { Injectable, signal } from "@angular/core";
import { BreadCrumbItem } from "classes/breadcrumbs-item.class";
import { IAppRouts } from "models/general";

@Injectable({
  providedIn: "root",
})
export class BreadcrumbsService {
  private readonly _breadcrumbsItems = signal<Array<BreadCrumbItem>>([]);

  /**
   * The current breadcrumb items.
   *
   * @return {Signal<Array<BreadCrumbItem>>} The current breadcrumb items.
   */
  readonly breadcrumbsItems = this._breadcrumbsItems.asReadonly();

  /**
   * Sets the current breadcrumbs path to the provided array of BreadCrumbItem objects.
   *
   * @param {Array<BreadCrumbItem>} newBreadcrumbs - The new array of breadcrumb items.
   */
  set updateBreadcrumbsPath(newBreadcrumbs: Array<BreadCrumbItem>) {
    this._breadcrumbsItems.set(newBreadcrumbs);
  }

  /**
   * Generate breadcrumbs based on the current path and active status.
   *
   * @param {Array<keyof IAppRouts>} currentPath - The current path for generating breadcrumbs.
   * @return {Array<BreadCrumbItem>} The generated array of breadcrumb items.
   */
  public generateBreadcrumbs(
    currentPath: Array<keyof IAppRouts>
  ): Array<BreadCrumbItem> {
    const activeMap = new Array(currentPath.length).fill(true);
    activeMap[activeMap.length - 1] = false;
    return currentPath.map(
      (path, index) => new BreadCrumbItem(path, activeMap[index])
    );
  }
}
