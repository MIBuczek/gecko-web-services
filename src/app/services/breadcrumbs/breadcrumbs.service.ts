import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";
import {BreadCrumbItem} from "classes/breadcrumbs-item.class";
import {IAppRouts} from "models/general";

@Injectable({
  providedIn: 'root'
})
export class BreadcrumbsService {
  private currentPaths$ = new BehaviorSubject<Array<BreadCrumbItem>>([])

  constructor() {
  }

  get getBreadcrumbsItems(): Observable<Array<BreadCrumbItem>> {
    return this.currentPaths$.asObservable()
  }

  set updateBreadcrumbsPath(newBreadcrumbs: Array<BreadCrumbItem>) {
    this.currentPaths$.next(newBreadcrumbs)
  }

  public generateBreadcrumbs(currentPath: Array<keyof IAppRouts>): Array<BreadCrumbItem> {
    const activeMap = new Array(currentPath.length).fill(true)
    activeMap[activeMap.length - 1] = false
    return currentPath.map((path, index) => new BreadCrumbItem(path, activeMap[index]))
  }
}
