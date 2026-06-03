import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SleepLog } from '../../../data/sleep-log';
import { SleepLogRow } from '../sleep-log-row/sleep-log-row';

@Component({
  selector: 'app-sleep-log-widget',
  imports: [CommonModule, SleepLogRow],
  templateUrl: './sleep-log-widget.html',
  styleUrl: './sleep-log-widget.css',
})
export class SleepLogWidget {
  @Input() logs: SleepLog[] = [];

  @Output() addClicked = new EventEmitter<void>();
  @Output() editClicked = new EventEmitter<SleepLog>();
  @Output() deleteClicked = new EventEmitter<SleepLog>();

  get recentLogs(): SleepLog[] {
    return this.logs.slice(0, 7);
  }
}