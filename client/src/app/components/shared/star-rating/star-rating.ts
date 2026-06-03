import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-star-rating',
  imports: [CommonModule],
  templateUrl: './star-rating.html',
  styleUrl: './star-rating.css',
})
export class StarRating {
  @Input() rating = 5;
  @Output() ratingChange = new EventEmitter<number>();

  stars = [1, 2, 3, 4, 5];

  selectRating(value: number): void {
    this.rating = value;
    this.ratingChange.emit(value);
  }
}