import {Component} from '@angular/core';
import {LandSwitcherService} from "services/lang-switcher/land-switcher.service";

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent {
  public isLoading: null | boolean = null;

  constructor(public ls: LandSwitcherService) {
    this.ls.isToggling.subscribe((status) => {
      this.isLoading = status;
    });
  }
}
