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

  startTime = '';
  endTime = '';
  rating = 5;
  comment = '';

  get title(): string {
    return this.log ? 'Edit sleep log' : 'Add sleep log';
  }

  ngOnInit(): void {
    if (!this.log) {
      return;
    }

    this.startTime = this.toInputValue(this.log.startTime);
    this.endTime = this.toInputValue(this.log.endTime);
    this.rating = this.log.rating ?? 5;
    this.comment = this.log.comment ?? '';
  }

  save(): void {
    if (!this.canSave()) {
      return;
    }

    const startDate = new Date(this.startTime);
    const endDate = new Date(this.endTime);
    const totalDuration = Math.round(
      (endDate.getTime() - startDate.getTime()) / 60000,
    );

    const cleanedComment = this.comment.trim();

    this.saveClicked.emit({
      startTime: startDate.toISOString(),
      endTime: endDate.toISOString(),
      totalDuration,
      rating: this.rating,
      comment: cleanedComment.length > 0 ? cleanedComment : null,
    });
  }

  close(): void {
    this.closeClicked.emit();
  }

  canSave(): boolean {
    if (!this.startTime || !this.endTime) {
      return false;
    }

    return new Date(this.endTime).getTime() > new Date(this.startTime).getTime();
  }

  @HostListener('document:keydown.escape')
  handleEscapeKey(): void {
    this.close();
  }

  private toInputValue(dateString: string): string {
    const date = new Date(dateString);
    const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);

    return localDate.toISOString().slice(0, 16);
  }
}