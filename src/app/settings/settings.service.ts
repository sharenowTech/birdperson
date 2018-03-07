import { Injectable } from '@angular/core';
import { Settings } from './settings.interface';

@Injectable()
export class SettingsService {
  private _savedSettings: Settings = null;
  public isVisible = this.settings === null;

  get settings(): Settings {
    if (this._savedSettings === null) {
      this._savedSettings = JSON.parse(
        localStorage.getItem('birdperson_settings')
      );
    }
    return this._savedSettings;
  }

  set settings(settings: Settings) {
    this._savedSettings = settings;
    localStorage.setItem('birdperson_settings', JSON.stringify(settings));
  }
}
