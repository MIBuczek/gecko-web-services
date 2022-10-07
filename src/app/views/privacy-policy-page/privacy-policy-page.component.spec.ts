import {ComponentFixture, TestBed} from '@angular/core/testing';

import {PrivacyPolicyPageComponent} from './privacy-policy-page.component';
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {HttpLoaderFactory} from "../../app.module";
import {HttpClient} from "@angular/common/http";
import {RouterTestingModule} from "@angular/router/testing";
import {ActivatedRoute} from "@angular/router";

describe('PrivacyPolicyPageComponent', () => {
  let component: PrivacyPolicyPageComponent;
  let fixture: ComponentFixture<PrivacyPolicyPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PrivacyPolicyPageComponent],
      providers: [{
        provide: ActivatedRoute,
        useValue: {snapshot: {data: {breadcrumbs: ['main-page', 'privacy-policy']}}}
      }],
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        TranslateModule.forRoot(
          {
            defaultLanguage: 'pl',
            loader: {
              provide: TranslateLoader,
              useFactory: HttpLoaderFactory,
              deps: [HttpClient]
            }
          }
        )],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrivacyPolicyPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
