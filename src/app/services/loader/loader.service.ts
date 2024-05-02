import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class LoaderService {
  private loadingState = new BehaviorSubject(false);

  /**
   * Returns an observable of the current loading state.
   *
   * @return {Observable<boolean>} An observable of the current loading state.
   */
  get loaderStatus(): Observable<boolean> {
    return this.loadingState.asObservable();
  }

  /**
   * A description of the entire function.
   *
   * @param {boolean} new_status - the new loading status to set
   */
  set changeLoadingStatus(new_status: boolean) {
    this.loadingState.next(new_status);
  }
}
