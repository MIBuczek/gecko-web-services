import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { BreadCrumbItem } from "classes/breadcrumbs-item.class";
import { IAppRouts } from "models/general";

@Injectable({
  providedIn: "root",
})
export class BreadcrumbsService {
  private currentPaths$ = new BehaviorSubject<Array<BreadCrumbItem>>([]);

  /**
   * Returns an observable of an array of BreadCrumbItem objects.
   *
   * @return {Observable<Array<BreadCrumbItem>>} The observable of the array of BreadCrumbItem objects.
   */
  get getBreadcrumbsItems(): Observable<Array<BreadCrumbItem>> {
    return this.currentPaths$.asObservable();
  }

  /**
   * Sets the current breadcrumbs path to the provided array of BreadCrumbItem objects.
   *
   * @param {Array<BreadCrumbItem>} newBreadcrumbs - The new array of breadcrumb items.
   */
  set updateBreadcrumbsPath(newBreadcrumbs: Array<BreadCrumbItem>) {
    this.currentPaths$.next(newBreadcrumbs);
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
