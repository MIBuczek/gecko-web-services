import { AsyncPipe } from "@angular/common";
import { Component, inject } from "@angular/core";
import { LoaderService } from "services/loader/loader.service";

@Component({
  selector: "app-loader",
  templateUrl: "./loader.component.html",
  styleUrls: ["./loader.component.scss"],
  standalone: true,
  imports: [AsyncPipe],
})
export class LoaderComponent {
  ls = inject(LoaderService);
}
