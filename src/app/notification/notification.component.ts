import { Component, OnInit } from '@angular/core';

import { NotificationService } from './notification.service';

@Component({
  selector: 'birdperson-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss'],
})
export class NotificationComponent implements OnInit {
  public notification: {
    message: string;
    level?: 'is-danger' | 'is-warning' | 'is-success';
  } = null;

  constructor(private _notifSrv: NotificationService) {}

  ngOnInit() {
    this._notifSrv.activeNotification.subscribe(notif => {
      this.notification = notif;
    });
  }
}
