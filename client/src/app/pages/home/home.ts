import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SleepLog } from '../../data/sleep-log';
import { SleepLogStorage } from '../../services/sleep-log-storage';

@Component({
  selector: 'app-home',
  imports: [CommonModule, FormsModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnDestroy {
  @ViewChild('reviewHeading') reviewHeading?: ElementRef<HTMLElement>;
  @ViewChild('startSleepButton') startSleepButton?: ElementRef<HTMLButtonElement>;

  isTracking = false;
  elapsedSeconds = 0;

  showReviewModal = false;
  selectedRating = 5;
  sleepComment = '';

  stars = [1, 2, 3, 4, 5];

  private timerId: ReturnType<typeof setInterval> | null = null;
  private startTime: Date | null = null;

  private pendingStartTime = '';
  private pendingEndTime = '';
  private pendingTotalDuration = 0;

  constructor(
    private sleepLogStorage: SleepLogStorage,
    private changeDetector: ChangeDetectorRef,
  ) {}

  get recentSleepLog(): SleepLog | null {
    const logs = this.sleepLogStorage.getLogs();

    if (logs.length === 0) {
      return null;
    }

    return [...logs].sort(
      (a, b) => new Date(b.endTime).getTime() - new Date(a.endTime).getTime(),
    )[0];
  }

  get hours(): string {
    return this.pad(Math.floor(this.elapsedSeconds / 3600));
  }

  get minutes(): string {
    return this.pad(Math.floor((this.elapsedSeconds % 3600) / 60));
  }

  get seconds(): string {
    return this.pad(this.elapsedSeconds % 60);
  }

  startSleep(): void {
    if (this.isTracking) {
      return;
    }

    this.startTime = new Date();
    this.elapsedSeconds = 0;
    this.isTracking = true;

    this.timerId = setInterval(() => {
      this.elapsedSeconds++;
      this.changeDetector.detectChanges();
    }, 1000);
  }

  endSleep(): void {
    if (!this.isTracking || !this.startTime) {
      return;
    }

    const endTime = new Date();

    this.stopTimer();

    this.pendingStartTime = this.startTime.toISOString();
    this.pendingEndTime = endTime.toISOString();
    this.pendingTotalDuration = Math.max(1, Math.round(this.elapsedSeconds / 60));

    this.isTracking = false;
    this.startTime = null;
    this.selectedRating = 5;
    this.sleepComment = '';
    this.showReviewModal = true;

    setTimeout(() => {
      this.reviewHeading?.nativeElement.focus();
    });
  }

  submitReview(): void {
    const comment = this.sleepComment.trim();

    this.saveSleepLog(
      this.selectedRating,
      comment.length > 0 ? comment : null,
    );
  }

  skipReview(): void {
    this.saveSleepLog(null, null);
  }

  selectRating(rating: number): void {
    this.selectedRating = rating;
  }

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

  getSleepSuggestion(): string {
    const log = this.recentSleepLog;

    if (!log) {
      return 'Log your first sleep session to receive a sleep suggestion.';
    }

    if (log.totalDuration < 360) {
      return 'You slept less than 6 hours. Try getting more rest tonight.';
    }

    if (log.totalDuration <= 540) {
      return 'Your sleep duration looks healthy. Keep your routine consistent.';
    }

    return 'You slept more than 9 hours. Pay attention to your energy level during the day.';
  }

  @HostListener('document:keydown.escape')
  handleEscapeKey(): void {
    if (this.showReviewModal) {
      this.skipReview();
    }
  }

  ngOnDestroy(): void {
    this.stopTimer();
  }

  private saveSleepLog(rating: number | null, comment: string | null): void {
    this.sleepLogStorage.addLog(
      this.pendingStartTime,
      this.pendingEndTime,
      this.pendingTotalDuration,
      rating,
      comment,
    );

    this.elapsedSeconds = 0;
    this.showReviewModal = false;

    this.pendingStartTime = '';
    this.pendingEndTime = '';
    this.pendingTotalDuration = 0;

    setTimeout(() => {
      this.startSleepButton?.nativeElement.focus();
    });
  }

  private stopTimer(): void {
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
  }

  private pad(value: number): string {
    return value.toString().padStart(2, '0');
  }
}