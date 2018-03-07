import { Component, OnInit } from '@angular/core';

import { SettingsService } from '../settings/settings.service';
@Component({
  selector: 'birdperson-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  public isSettingsVisible = false;

  constructor(private _settingsSrv: SettingsService) {}

  ngOnInit() {
    this.isSettingsVisible = this._settingsSrv.settings === null;
  }

  showSettings() {
    this.isSettingsVisible = true;
  }
}
