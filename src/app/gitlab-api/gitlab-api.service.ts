import { Injectable } from '@angular/core';
import { from } from 'rxjs/observable/from';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/map';
import { retryWhen, delay, take, concat } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw';

import { NotificationService } from '../notification/notification.service';
import { SettingsService } from '../settings/settings.service';

@Injectable()
export class GitlabApiService {
  constructor(
    private _http: HttpClient,
    private _notifSrv: NotificationService,
    private _settingsSrv: SettingsService
  ) {}

  get mergeRequests() {
    return this._http
      .get<any[]>('merge_requests?state=opened&scope=all&per_page=100')
      .pipe(
        retryWhen(err => {
          return err.pipe(
            delay(5000),
            take(3),
            concat(
              Observable.throw(
                new Error(
                  'Something is going really wrong... Please review your settings!'
                )
              )
            )
          );
        })
      );
  }

  get projects() {
    return this._http
      .get<any[]>(
        `projects?search=${
          this._settingsSrv.settings.namespace
        }&order_by=last_activity_at&per_page=100`
      )
      .map(projects => {
        return projects.filter(
          project =>
            project.namespace.name === this._settingsSrv.settings.namespace
        );
      })
      .pipe(
        retryWhen(err => {
          return err.pipe(
            delay(5000),
            take(3),
            concat(
              Observable.throw(
                new Error(
                  'Something is going really wrong... Please review your settings!'
                )
              )
            )
          );
        })
      );
  }

  fetchPipelines(projectId) {
    return this._http
      .get<any[]>(`projects/${projectId}/pipelines?per_page=5`)
      .pipe(
        retryWhen(err => {
          return err.pipe(
            delay(5000),
            take(3),
            concat(
              Observable.throw(
                new Error(
                  'Something is going really wrong... Please review your settings!'
                )
              )
            )
          );
        })
      );
  }

  fetchLastPipelineByRef(projectId, ref) {
    return this._http
      .get<any[]>(`projects/${projectId}/pipelines?ref=${ref}&per_page=1`)
      .pipe(
        retryWhen(err => {
          return err.pipe(
            delay(5000),
            take(3),
            concat(
              Observable.throw(
                new Error(
                  'Something is going really wrong... Please review your settings!'
                )
              )
            )
          );
        })
      );
  }

  fetchPipeline(projectId, pipelineId) {
    return this._http
      .get<any>(`projects/${projectId}/pipelines/${pipelineId}`)
      .pipe(
        retryWhen(err => {
          return err.pipe(
            delay(5000),
            take(3),
            concat(
              Observable.throw(
                new Error(
                  'Something is going really wrong... Please review your settings!'
                )
              )
            )
          );
        })
      );
  }

  fetchProject(id) {
    return this._http.get<any>(`projects/${id}`).pipe(
      retryWhen(err => {
        return err.pipe(
          delay(5000),
          take(3),
          concat(
            Observable.throw(
              new Error(
                'Something is going really wrong... Please review your settings!'
              )
            )
          )
        );
      })
    );
  }
}
