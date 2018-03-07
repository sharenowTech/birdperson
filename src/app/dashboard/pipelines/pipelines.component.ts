import { Component, OnInit, OnDestroy } from '@angular/core';
import { compareDesc, differenceInWeeks } from 'date-fns';
import { uniqBy } from 'lodash';

import { GitlabApiService } from '../../gitlab-api/gitlab-api.service';
import { NotificationService } from '../../notification/notification.service';

@Component({
  selector: 'birdperson-pipelines',
  templateUrl: './pipelines.component.html',
  styleUrls: ['./pipelines.component.scss'],
})
export class PipelinesComponent implements OnInit, OnDestroy {
  public pipelines: Array<any>;
  public isLoading = false;
  private _subscriptions: Array<any> = [];

  constructor(
    private _api: GitlabApiService,
    private _notifSrv: NotificationService
  ) {}

  private _doStuff() {
    this.isLoading = true;
    console.info('refreshing pipelines');
    this.pipelines = [];
    const projects$ = this._api.projects.subscribe(
      projects => {
        this._subscriptions.push(projects$);
        projects.forEach(project => {
          const pipelines$ = this._api
            .fetchPipelines(project.id)
            .subscribe(pipelines => {
              this._subscriptions.push(pipelines$);
              // no empty pipelines, please
              if (pipelines.length > 0) {
                // I only want one pipeline for each ref (branch...)
                const tidyPipelines = uniqBy(pipelines, item => item.ref);
                tidyPipelines.forEach(pipeline => {
                  const pipeline$ = this._api
                    .fetchPipeline(project.id, pipeline.id)
                    .subscribe(pipelineDetails => {
                      this._notifSrv.activeNotification.next(null);
                      this.isLoading = false;
                      this._subscriptions.push(pipeline$);
                      // only add the pipelines that have run in the last week
                      if (
                        differenceInWeeks(
                          new Date(pipelineDetails['updated_at']),
                          new Date()
                        ) === 0
                      ) {
                        this.pipelines.push({
                          ...pipelineDetails,
                          ...{ project },
                        });
                        this.pipelines.sort((o1, o2) =>
                          compareDesc(o1.updated_at, o2.updated_at)
                        );
                      }
                    });
                });
              }
            });
        });
      },
      err => {
        this._notifSrv.activeNotification.next({ message: err.message });
      }
    );
  }

  private _clearSubscriptions() {
    this._subscriptions.forEach(sub => {
      sub.unsubscribe();
    });
  }

  ngOnInit() {
    this._doStuff();
    setInterval(() => {
      this._clearSubscriptions();
      this._doStuff();
    }, 30000);
  }

  ngOnDestroy() {
    this._clearSubscriptions();
  }
}
