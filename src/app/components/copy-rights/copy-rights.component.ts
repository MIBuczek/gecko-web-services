
import { Component, ChangeDetectionStrategy } from "@angular/core";
import { RouterLink } from "@angular/router";
import { TranslateModule } from "@ngx-translate/core";

@Component({
  selector: "app-copy-rights",
  templateUrl: "./copy-rights.component.html",
  styleUrls: ["./copy-rights.component.scss"],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [RouterLink, TranslateModule],
})
export class CopyRightsComponent {
  public currentYear = new Date().getFullYear();
  readonly isPrivacyPolicy: boolean =
    window.location.href.includes("privacy-policy");
}
