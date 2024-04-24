import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IAppRouts } from 'models/general';
import { BreadcrumbsService } from 'services/breadcrumbs/breadcrumbs.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainComponent implements OnInit {

  constructor(
    private bc: BreadcrumbsService,
    private route: ActivatedRoute,
  ) {
  }

  ngOnInit() {
    this.bc.updateBreadcrumbsPath =
      this.bc.generateBreadcrumbs(this.route.snapshot.data['breadcrumbs'] as Array<keyof IAppRouts>)
  }
}