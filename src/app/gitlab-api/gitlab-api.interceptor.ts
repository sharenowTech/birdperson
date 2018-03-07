import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { SettingsService } from '../settings/settings.service';

@Injectable()
export class GitLabApiInterceptor implements HttpInterceptor {
  constructor(private _settingsSrv: SettingsService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const gitlabUrl =
      this._settingsSrv.settings.isGitlabDotCom === 'true'
        ? 'https://gitlab.com'
        : this._settingsSrv.settings.gitlabAddress;
    const apiReq = req.clone({
      url: `${gitlabUrl}/api/v4/${req.url}`,
      setHeaders: {
        'Private-Token': this._settingsSrv.settings.accessToken,
      },
    });
    return next.handle(apiReq);
  }
}
