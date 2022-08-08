import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";
import {TypeLang} from "models/general";

@Injectable({
  providedIn: 'root'
})
export class LandSwitcherService {

  private currentLang = new BehaviorSubject<TypeLang>('PL');
  public isToggling = new BehaviorSubject(false);

  constructor() {
  }

  langToggle(): void {
    this.isToggling.next(true);
    if (this.currentLang.getValue() === 'PL') {
      setTimeout(() => {
        this.currentLang.next('EN');
        this.isToggling.next(false);
      }, 800);
    } else {
      setTimeout(() => {
        this.currentLang.next('PL');
        this.isToggling.next(false);
      }, 800);
    }
  }

  get getCurrentLang(): Observable<TypeLang> {
    return this.currentLang.asObservable();
  }
}
