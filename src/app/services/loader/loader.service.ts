import { Injectable, signal } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class LoaderService {
  private readonly _loaderStatus = signal(false);

  /**
   * The current loading state.
   *
   * @return {Signal<boolean>} The current loading state.
   */
  readonly loaderStatus = this._loaderStatus.asReadonly();

  /**
   * Sets the new loading status.
   *
   * @param {boolean} new_status - the new loading status to set
   */
  set changeLoadingStatus(new_status: boolean) {
    this._loaderStatus.set(new_status);
  }
}
