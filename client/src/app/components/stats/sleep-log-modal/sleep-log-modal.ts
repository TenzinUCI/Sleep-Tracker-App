import { CommonModule } from '@angular/common';
import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SleepLog } from '../../../data/sleep-log';
import { StarRating } from '../../shared/star-rating/star-rating';

export interface SleepLogFormData {
  startTime: string;
  endTime: string;
  totalDuration: number;
  rating: number | null;
  comment: string | null;
}

@Component({
  selector: 'app-sleep-log-modal',
  imports: [CommonModule, FormsModule, StarRating],
  templateUrl: './sleep-log-modal.html',
  styleUrl: './sleep-log-modal.css',
})
export class SleepLogModal implements OnInit {
  @Input() log: SleepLog | null = null;

  @Output() saveClicked = new EventEmitter<SleepLogFormData>();
  @Output() closeClicked = new EventEmitter<void>();

  startDate = '';
  startTime = '';
  endDate = '';
  endTime = '';

  rating = 5;
  comment = '';

  get title(): string {
    return this.log ? 'Edit sleep log' : 'Add sleep log';
  }

  get durationText(): string {
    if (!this.canSave()) {
      return 'Select a valid start and end time';
    }

    const duration = this.getDuration();

    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;

    if (hours === 0) {
      return `${minutes}m`;
    }

    if (minutes === 0) {
      return `${hours}h`;
    }

    return `${hours}h ${minutes}m`;
  }

  ngOnInit(): void {
    if (!this.log) {
      return;
    }

    const start = new Date(this.log.startTime);
    const end = new Date(this.log.endTime);

    this.startDate = this.getDateValue(start);
    this.startTime = this.getTimeValue(start);
    this.endDate = this.getDateValue(end);
    this.endTime = this.getTimeValue(end);

    this.rating = this.log.rating ?? 5;
    this.comment = this.log.comment ?? '';
  }

  save(): void {
    if (!this.canSave()) {
      return;
    }

    const start = this.getStartDate();
    const end = this.getEndDate();
    const totalDuration = this.getDuration();
    const cleanedComment = this.comment.trim();

    this.saveClicked.emit({
      startTime: start.toISOString(),
      endTime: end.toISOString(),
      totalDuration,
      rating: this.rating,
      comment: cleanedComment.length > 0 ? cleanedComment : null,
    });
  }

  close(): void {
    this.closeClicked.emit();
  }

  canSave(): boolean {
    if (!this.startDate || !this.startTime || !this.endDate || !this.endTime) {
      return false;
    }

    return this.getEndDate().getTime() > this.getStartDate().getTime();
  }

  @HostListener('document:keydown.escape')
  handleEscapeKey(): void {
    this.close();
  }

  private getStartDate(): Date {
    return new Date(`${this.startDate}T${this.startTime}`);
  }

  private getEndDate(): Date {
    return new Date(`${this.endDate}T${this.endTime}`);
  }

  private getDuration(): number {
    return Math.round(
      (this.getEndDate().getTime() - this.getStartDate().getTime()) / 60000,
    );
  }

  private getDateValue(date: Date): string {
    const year = date.getFullYear();
    const month = this.pad(date.getMonth() + 1);
    const day = this.pad(date.getDate());

    return `${year}-${month}-${day}`;
  }

  private getTimeValue(date: Date): string {
    const hours = this.pad(date.getHours());
    const minutes = this.pad(date.getMinutes());

    return `${hours}:${minutes}`;
  }

  private pad(value: number): string {
    return value.toString().padStart(2, '0');
  }
}