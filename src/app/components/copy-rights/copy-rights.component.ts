import {Component} from '@angular/core';
import copyRightsTextContent from "text-content/copy-rights/index.json";
import {LandSwitcherService} from "services/lang-switcher/land-switcher.service";
import {ICopyRightsTextContent} from "models/text-content";

@Component({
  selector: 'app-copy-rights',
  templateUrl: './copy-rights.component.html',
  styleUrls: ['./copy-rights.component.scss']
})
export class CopyRightsComponent {
  public textContent: ICopyRightsTextContent = copyRightsTextContent
  public currentYear = new Date().getFullYear()
  public currentLang: 'PL' | 'EN' = "PL"

  constructor(private ls: LandSwitcherService) {
    ls.getCurrentLang.subscribe((lang) => this.currentLang = lang)
  }

}
