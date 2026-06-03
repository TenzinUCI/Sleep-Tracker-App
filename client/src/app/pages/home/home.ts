import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { SleepLog } from '../../data/sleep-log';
import { SleepLogStorage } from '../../services/sleep-log-storage';
import { RecentSleepSummary } from '../../components/sleep/recent-sleep-summary/recent-sleep-summary';
import { SleepTimer, SleepSession } from '../../components/sleep/sleep-timer/sleep-timer';
import { SleepReviewModal, SleepReview } from '../../components/sleep/sleep-review-modal/sleep-review-modal';
import { SleepSuggestionCard } from '../../components/sleep/sleep-suggestion-card/sleep-suggestion-card';

@Component({
  selector: 'app-home',
  imports: [
    CommonModule,
    RecentSleepSummary,
    SleepTimer,
    SleepReviewModal,
    SleepSuggestionCard,
  ],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  showReviewModal = false;

  private pendingSession: SleepSession | null = null;

  constructor(private sleepLogStorage: SleepLogStorage) {}

  get logs(): SleepLog[] {
    return this.sleepLogStorage.getLogs();
  } 

  get recentSleepLog(): SleepLog | null {
    const logs = this.sleepLogStorage.getLogs();

    if (logs.length === 0) {
      return null;
    }

    return [...logs].sort(
      (a, b) => new Date(b.endTime).getTime() - new Date(a.endTime).getTime(),
    )[0];
  }

  handleSleepEnded(session: SleepSession): void {
    this.pendingSession = session;
    this.showReviewModal = true;
  }

  handleReviewSubmitted(review: SleepReview): void {
    if (!this.pendingSession) {
      return;
    }

    this.sleepLogStorage.addLog(
      this.pendingSession.startTime,
      this.pendingSession.endTime,
      this.pendingSession.totalDuration,
      review.rating,
      review.comment,
    );

    this.pendingSession = null;
    this.showReviewModal = false;
  }

  handleReviewSkipped(): void {
    if (!this.pendingSession) {
      return;
    }

    this.sleepLogStorage.addLog(
      this.pendingSession.startTime,
      this.pendingSession.endTime,
      this.pendingSession.totalDuration,
      null,
      null,
    );

    this.pendingSession = null;
    this.showReviewModal = false;
  }
}