import {Component} from '@angular/core';
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent {
  public selectedLang: 'pl' | 'en' = 'pl';

  constructor(private translate: TranslateService) {
  }

  public langToggle(event : Event) {
    event.stopPropagation()
    const currentLang = this.selectedLang.includes('pl') ? 'en' : 'pl'
    this.translate.use(currentLang)
    this.selectedLang = currentLang
  }
}
