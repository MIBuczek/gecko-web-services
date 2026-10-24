import { Component } from "@angular/core";

@Component({
  selector: "app-copy-rights",
  templateUrl: "./copy-rights.component.html",
  styleUrls: ["./copy-rights.component.scss"],
  standalone: false
})
export class CopyRightsComponent {
  public currentYear = new Date().getFullYear();
  readonly isPrivacyPolicy: boolean = window.location.href.includes("privacy-policy");
}
