import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class LandSwitcherService {

  private currentLang = new BehaviorSubject<'PL' | 'EN'>('PL');
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

  get getCurrentLang(): Observable<'PL' | 'EN'> {
    return this.currentLang.asObservable();
  }
}
