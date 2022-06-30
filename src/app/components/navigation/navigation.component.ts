import {Component} from '@angular/core';
import {LandSwitcherService} from "services/lang-switcher/land-switcher.service";
import {Observable} from "rxjs";

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent {
  public isActive = false;
  public currentLang$ : Observable<'PL' | 'EN'>;

  constructor(public ls: LandSwitcherService) {
    this.currentLang$ = this.ls.getCurrentLang;
  }

  toggle(): void {
    this.isActive = !this.isActive;
  }

}
