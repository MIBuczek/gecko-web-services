import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-admin-main',
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainComponent { }
