import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-stat-summary-card',
  imports: [],
  templateUrl: './stat-summary-card.html',
  styleUrl: './stat-summary-card.css',
})
export class StatSummaryCard {
  @Input() label = '';
  @Input() value = '';
}