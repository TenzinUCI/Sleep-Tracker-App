import { Component } from '@angular/core';
import { SleepLogStorage } from '../../../services/sleep-log-storage';

@Component({
  selector: 'app-data-export-card',
  imports: [],
  templateUrl: './data-export-card.html',
  styleUrl: './data-export-card.css',
})
export class DataExportCard {
  constructor(private sleepLogStorage: SleepLogStorage) {}

  exportData(): void {
    const logs = this.sleepLogStorage.getLogs();
    const data = JSON.stringify(logs, null, 2);

    const file = new Blob([data], {
      type: 'application/json',
    });

    const url = URL.createObjectURL(file);
    const link = document.createElement('a');

    link.href = url;
    link.download = 'sleep-tracker-data.json';
    link.click();

    URL.revokeObjectURL(url);
  }
}