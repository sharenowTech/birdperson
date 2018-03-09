import { Component, OnInit, OnDestroy } from '@angular/core';

import { GitlabApiService } from '../../gitlab-api/gitlab-api.service';
import { SettingsService } from '../../settings/settings.service';
import { NotificationService } from '../../notification/notification.service';

@Component({
  selector: 'birdperson-merge-requests',
  templateUrl: './merge-requests.component.html',
  styleUrls: ['./merge-requests.component.scss'],
})
export class MergeRequestsComponent implements OnInit, OnDestroy {
  public mergeRequests: Array<any>;
  public isLoading = false;
  private _subscriptions: Array<any> = [];

  constructor(
    private _api: GitlabApiService,
    private _settingsSrv: SettingsService,
    private _notifSrv: NotificationService
  ) {}

  private _doStuff() {
    // TODO refactor to an async pipe?
    this.isLoading = true;
    console.info('refreshing MRs');
    this.mergeRequests = [];
    const mergeReqs$ = this._api.mergeRequests.subscribe(
      mergeRequests => {
        this._subscriptions.push(mergeReqs$);
        mergeRequests.forEach(mergeRequest => {
          const project$ = this._api
            .fetchProject(mergeRequest.project_id)
            .subscribe(project => {
              this._subscriptions.push(project$);
              if (
                project['namespace'].name ===
                this._settingsSrv.settings.namespace
              ) {
                const lastPipeline$ = this._api
                  .fetchLastPipelineByRef(
                    project.id,
                    mergeRequest.source_branch
                  )
                  .subscribe(lastPipeline => {
                    this._notifSrv.activeNotification.next(null);
                    this.isLoading = false;
                    this._subscriptions.push(lastPipeline$);
                    this.mergeRequests.push({
                      ...mergeRequest,
                      ...{ project },
                      ...{
                        ci_status:
                          lastPipeline.length > 0
                            ? lastPipeline[0].status
                            : 'unknown',
                      },
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
    }, 60000);
  }

  ngOnDestroy() {
    this._clearSubscriptions();
  }
}
