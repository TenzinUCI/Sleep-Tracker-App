import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { SleepLog } from '../../data/sleep-log';
import { SleepLogStorage } from '../../services/sleep-log-storage';
import { StatSummaryCard } from '../../components/stats/stat-summary-card/stat-summary-card';
import { SleepGraphWidget } from '../../components/stats/sleep-graph-widget/sleep-graph-widget';
import { SleepLogWidget } from '../../components/stats/sleep-log-widget/sleep-log-widget';
import {
  SleepLogModal,
  SleepLogFormData,
} from '../../components/stats/sleep-log-modal/sleep-log-modal';

@Component({
  selector: 'app-stats',
  imports: [
    CommonModule,
    StatSummaryCard,
    SleepGraphWidget,
    SleepLogWidget,
    SleepLogModal,
  ],
  templateUrl: './stats.html',
  styleUrl: './stats.css',
})
export class Stats {
  modalOpen = false;
  logToEdit: SleepLog | null = null;

  constructor(private sleepLogStorage: SleepLogStorage) {}

  get logs(): SleepLog[] {
    return [...this.sleepLogStorage.getLogs()].sort(
      (a, b) => new Date(b.endTime).getTime() - new Date(a.endTime).getTime(),
    );
  }

  get averageSleep(): string {
    if (this.logs.length === 0) {
      return '0.0h';
    }

    const totalMinutes = this.logs.reduce(
      (sum, log) => sum + log.totalDuration,
      0,
    );

    const averageHours = totalMinutes / this.logs.length / 60;

    return `${averageHours.toFixed(1)}h`;
  }

  get averageRating(): string {
    const ratedLogs = this.logs.filter((log) => log.rating !== null);

    if (ratedLogs.length === 0) {
      return 'N/A';
    }

    const ratingTotal = ratedLogs.reduce(
      (sum, log) => sum + (log.rating ?? 0),
      0,
    );

    return `${(ratingTotal / ratedLogs.length).toFixed(1)}/5`;
  }

  get totalLogs(): string {
    return this.logs.length.toString();
  }

  openAddModal(): void {
    this.logToEdit = null;
    this.modalOpen = true;
  }

  openEditModal(log: SleepLog): void {
    this.logToEdit = log;
    this.modalOpen = true;
  }

  closeModal(): void {
    this.modalOpen = false;
    this.logToEdit = null;
  }

  saveLog(data: SleepLogFormData): void {
    if (this.logToEdit) {
      const updatedLog: SleepLog = {
        ...this.logToEdit,
        startTime: data.startTime,
        endTime: data.endTime,
        totalDuration: data.totalDuration,
        rating: data.rating,
        comment: data.comment,
      };

      this.sleepLogStorage.updateLog(updatedLog);
      this.closeModal();
      return;
    }

    this.sleepLogStorage.addLog(
      data.startTime,
      data.endTime,
      data.totalDuration,
      data.rating,
      data.comment,
    );

    this.closeModal();
  }

  deleteLog(log: SleepLog): void {
    const shouldDelete = confirm('Delete this sleep log?');

    if (shouldDelete) {
      this.sleepLogStorage.deleteLog(log.id);
    }
  }
}