import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { SleepLog } from '../../../data/sleep-log';

@Component({
  selector: 'app-recent-sleep-summary',
  imports: [CommonModule],
  templateUrl: './recent-sleep-summary.html',
  styleUrl: './recent-sleep-summary.css',
})
export class RecentSleepSummary {
  @Input() sleepLog: SleepLog | null = null;

  formatTime(dateString: string): string {
    return new Date(dateString).toLocaleTimeString([], {
      hour: 'numeric',
      minute: '2-digit',
    });
  }

  formatDuration(totalDuration: number): string {
    const hours = Math.floor(totalDuration / 60);
    const minutes = totalDuration % 60;

    if (hours === 0) {
      return `${minutes}m`;
    }

    if (minutes === 0) {
      return `${hours}h`;
    }

    return `${hours}h ${minutes}m`;
  }

  formatRating(rating: number | null): string {
    return rating === null ? 'N/A' : `${rating} / 5`;
  }
}