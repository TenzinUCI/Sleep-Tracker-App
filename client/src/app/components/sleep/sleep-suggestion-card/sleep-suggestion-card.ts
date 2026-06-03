import { Component, Input } from '@angular/core';
import { SleepLog } from '../../../data/sleep-log';

@Component({
  selector: 'app-sleep-suggestion-card',
  imports: [],
  templateUrl: './sleep-suggestion-card.html',
  styleUrl: './sleep-suggestion-card.css',
})
export class SleepSuggestionCard {
  @Input() sleepLog: SleepLog | null = null;

  get suggestion(): string {
    if (!this.sleepLog) {
      return 'Log your first sleep session to receive a sleep suggestion.';
    }

    if (this.sleepLog.totalDuration < 360) {
      return 'You slept less than 6 hours. Try getting more rest tonight.';
    }

    if (this.sleepLog.totalDuration <= 540) {
      return 'Your sleep duration looks healthy. Keep your routine consistent.';
    }

    return 'You slept more than 9 hours. Pay attention to your energy level during the day.';
  }
}