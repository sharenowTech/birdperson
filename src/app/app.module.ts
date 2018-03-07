import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

import { DateFnsModule } from 'ngx-date-fns';

import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { GitlabApiService } from './gitlab-api/gitlab-api.service';
import { GitLabApiInterceptor } from './gitlab-api/gitlab-api.interceptor';
import { MergeRequestsComponent } from './dashboard/merge-requests/merge-requests.component';
import { PipelinesComponent } from './dashboard/pipelines/pipelines.component';
import { LoadingComponent } from './loading/loading.component';
import { SettingsComponent } from './settings/settings.component';
import { SettingsService } from './settings/settings.service';
import { NotificationComponent } from './notification/notification.component';
import { NotificationService } from './notification/notification.service';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    MergeRequestsComponent,
    PipelinesComponent,
    LoadingComponent,
    SettingsComponent,
    NotificationComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    DateFnsModule,
    ReactiveFormsModule,
  ],
  providers: [
    NotificationService,
    SettingsService,
    GitlabApiService,
    { provide: HTTP_INTERCEPTORS, useClass: GitLabApiInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
