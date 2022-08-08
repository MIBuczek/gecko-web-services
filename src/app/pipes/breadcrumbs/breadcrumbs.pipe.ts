import {Pipe, PipeTransform} from '@angular/core';
import {IAppRouts, TypeLang} from "models/general";

const INITIAL_ROUT_MAP: { [x: string]: IAppRouts } = {
  PL: {
    'main-page': 'Strona główna',
    'privacy-policy': 'Polityka Prywatności',
  },
  EN: {
    'main-page': 'Main page',
    'privacy-policy': 'Privacy policy',
  }
}

const pathGuard = (path: keyof IAppRouts | string, currentLang: TypeLang): path is keyof IAppRouts => {
  return !!INITIAL_ROUT_MAP[currentLang][path]
}

@Pipe({
  name: 'breadcrumbsTranslate'
})
export class BreadcrumbsPipe implements PipeTransform {

  transform(path: keyof IAppRouts | string, currentLang: TypeLang): string {
    if (pathGuard(path, currentLang)) {
      return INITIAL_ROUT_MAP[currentLang][path]
    }
    return path;
  }

}
