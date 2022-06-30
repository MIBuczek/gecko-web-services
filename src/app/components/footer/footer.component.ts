import {Component} from '@angular/core';
import {footerTextContent} from "text-content/footer";
import {LandSwitcherService} from "services/lang-switcher/land-switcher.service";

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
  public currentYear = new Date().getFullYear()
  public currentLang : 'PL' | 'EN' = "PL"
  public textContent = footerTextContent;

  constructor(private ls: LandSwitcherService) {
    ls.getCurrentLang.subscribe((lang)=> this.currentLang = lang)
  }
}
