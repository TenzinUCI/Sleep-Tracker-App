import { CommonModule } from '@angular/common';
import { Component, EventEmitter, HostListener, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { StarRating } from '../../shared/star-rating/star-rating';

export interface SleepReview {
  rating: number;
  comment: string | null;
}

@Component({
  selector: 'app-sleep-review-modal',
  imports: [CommonModule, FormsModule, StarRating],
  templateUrl: './sleep-review-modal.html',
  styleUrl: './sleep-review-modal.css',
})
export class SleepReviewModal {
  @Output() reviewSubmitted = new EventEmitter<SleepReview>();
  @Output() reviewSkipped = new EventEmitter<void>();

  selectedRating = 5;
  sleepComment = '';

  submitReview(): void {
    const comment = this.sleepComment.trim();

    this.reviewSubmitted.emit({
      rating: this.selectedRating,
      comment: comment.length > 0 ? comment : null,
    });
  }

  skipReview(): void {
    this.reviewSkipped.emit();
  }

  @HostListener('document:keydown.escape')
  handleEscapeKey(): void {
    this.skipReview();
  }
}