import {IAppRouts} from "models/general";

export class BreadCrumbItem {
  constructor(readonly rout: keyof IAppRouts, readonly active: boolean) {
  }
}
