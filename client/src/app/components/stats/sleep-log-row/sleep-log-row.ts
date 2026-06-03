import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SleepLog } from '../../../data/sleep-log';

@Component({
  selector: 'app-sleep-log-row',
  imports: [CommonModule],
  templateUrl: './sleep-log-row.html',
  styleUrl: './sleep-log-row.css',
})
export class SleepLogRow {
  @Input() log!: SleepLog;

  @Output() editClicked = new EventEmitter<SleepLog>();
  @Output() deleteClicked = new EventEmitter<SleepLog>();

  stars = [1, 2, 3, 4, 5];

  editLog(event: MouseEvent): void {
    event.stopPropagation();
    this.editClicked.emit(this.log);
  }

  deleteLog(event: MouseEvent): void {
    event.stopPropagation();
    this.deleteClicked.emit(this.log);
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString([], {
      month: 'short',
      day: 'numeric',
    });
  }

  formatTime(dateString: string): string {
    return new Date(dateString).toLocaleTimeString([], {
      hour: 'numeric',
      minute: '2-digit',
    });
  }

  formatDuration(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    if (hours === 0) {
      return `${remainingMinutes}m`;
    }

    if (remainingMinutes === 0) {
      return `${hours}h`;
    }

    return `${hours}h ${remainingMinutes}m`;
  }
}