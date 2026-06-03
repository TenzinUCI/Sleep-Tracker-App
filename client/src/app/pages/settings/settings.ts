import { Component } from '@angular/core';
import { SettingsRow } from '../../components/settings/settings-row/settings-row';
import { DataExportCard } from '../../components/settings/data-export-card/data-export-card';
import { DangerZoneCard } from '../../components/settings/danger-zone-card/danger-zone-card';

@Component({
  selector: 'app-settings',
  imports: [SettingsRow, DataExportCard, DangerZoneCard],
  templateUrl: './settings.html',
  styleUrl: './settings.css',
})
export class Settings {
  highContrast = false;
  notifications = false;
  textToSpeech = false;

  toggleHighContrast(value: boolean): void {
    this.highContrast = value;
    document.body.classList.toggle('high-contrast', value);
  }

  toggleNotifications(value: boolean): void {
    this.notifications = value;
  }

  toggleTextToSpeech(value: boolean): void {
    this.textToSpeech = value;
  }
}