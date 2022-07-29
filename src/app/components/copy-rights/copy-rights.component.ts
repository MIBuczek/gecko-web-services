import {Component} from '@angular/core';
import {copyRightsTextContent} from "text-content/copy-rights";
import {LandSwitcherService} from "services/lang-switcher/land-switcher.service";

@Component({
  selector: 'app-copy-rights',
  templateUrl: './copy-rights.component.html',
  styleUrls: ['./copy-rights.component.scss']
})
export class CopyRightsComponent {
  public currentYear = new Date().getFullYear()
  public textContent = copyRightsTextContent
  public currentLang: 'PL' | 'EN' = "PL"

  constructor(private ls: LandSwitcherService) {
    ls.getCurrentLang.subscribe((lang) => this.currentLang = lang)
  }

}
