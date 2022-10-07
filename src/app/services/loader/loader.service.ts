import {Injectable} from '@angular/core';
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  private loadingState = new BehaviorSubject(false)

  get loaderStatus() {
    return this.loadingState.asObservable()
  }

  set changeLoadingStatus(new_status: boolean) {
    this.loadingState.next(new_status)
  }
}
