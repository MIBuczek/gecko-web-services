import { NgIf } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { RouterLink } from "@angular/router";
import { TranslateModule } from "@ngx-translate/core";

@Component({
  selector: "app-cookie",
  templateUrl: "./cookie.component.html",
  styleUrls: ["./cookie.component.scss"],
  standalone: true,
  imports: [NgIf, RouterLink, TranslateModule],
})
export class CookieComponent implements OnInit {
  public isCookiesAccepted: boolean = false;

  /**
   * Sets the "cookies" value in the local storage to "true" and sets the `isCookiesAccepted` flag to `true`.
   *
   * @return {void} This function does not return anything.
   */ acceptCookies(): void {
    window.localStorage.setItem("cookies", String(true));
    this.isCookiesAccepted = true;
  }

  /**
   * Initializes the component by checking if cookies have been accepted and updating the `isCookiesAccepted` flag accordingly.
   *
   * @return {void} This function does not return anything.
   */
  ngOnInit(): void {
    this.isCookiesAccepted = !!window.localStorage.getItem("cookies");
  }
}
