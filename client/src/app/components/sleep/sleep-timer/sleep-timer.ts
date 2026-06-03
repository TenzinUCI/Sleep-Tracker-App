import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, OnDestroy, Output } from '@angular/core';

export interface SleepSession {
  startTime: string;
  endTime: string;
  totalDuration: number;
}

@Component({
  selector: 'app-sleep-timer',
  imports: [CommonModule],
  templateUrl: './sleep-timer.html',
  styleUrl: './sleep-timer.css',
})
export class SleepTimer implements OnDestroy {
  @Output() sleepEnded = new EventEmitter<SleepSession>();

  isTracking = false;
  elapsedSeconds = 0;

  private timerId: ReturnType<typeof setInterval> | null = null;
  private startTime: Date | null = null;

  constructor(private changeDetector: ChangeDetectorRef) {}

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

    this.sleepEnded.emit({
      startTime: this.startTime.toISOString(),
      endTime: endTime.toISOString(),
      totalDuration: Math.max(1, Math.round(this.elapsedSeconds / 60)),
    });

    this.isTracking = false;
    this.startTime = null;
    this.elapsedSeconds = 0;
  }

  ngOnDestroy(): void {
    this.stopTimer();
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