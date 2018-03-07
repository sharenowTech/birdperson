import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChanges,
  SimpleChange,
  ChangeDetectionStrategy,
  Output,
  EventEmitter,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { SettingsService } from './settings.service';
import { NotificationService } from '../notification/notification.service';

@Component({
  selector: 'birdperson-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsComponent implements OnInit {
  private _isVisible: boolean;
  settingsForm: FormGroup;

  constructor(
    private _fb: FormBuilder,
    private _settingsSrv: SettingsService,
    private _notifSrv: NotificationService
  ) {}

  @Input()
  get isVisible() {
    return this._isVisible;
  }

  @Output() isVisibleChange = new EventEmitter();

  set isVisible(value: boolean) {
    this._isVisible = value;
    this.isVisibleChange.emit(this._isVisible);
  }

  ngOnInit() {
    this._createForm();
  }

  private _createForm() {
    const savedConfig = this._settingsSrv.settings;
    this.settingsForm = this._fb.group({
      isGitlabDotCom: [
        !!savedConfig ? savedConfig.isGitlabDotCom : true,
        Validators.required,
      ],
      gitlabAddress: !!savedConfig ? savedConfig.gitlabAddress : '',
      accessToken: [
        !!savedConfig ? savedConfig.accessToken : '',
        Validators.required,
      ],
      namespace: !!savedConfig ? savedConfig.namespace : '',
    });
  }

  onSubmit() {
    this._settingsSrv.settings = this.settingsForm.value;
    this.hide();
    this._notifSrv.activeNotification.next({
      message: 'Please wait a few seconds...',
      level: 'is-warning',
    });
  }

  onCancel() {}

  hide() {
    this.isVisible = false;
  }
}
