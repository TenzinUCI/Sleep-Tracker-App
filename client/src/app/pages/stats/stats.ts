import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SleepLog } from '../../data/sleep-log';
import { SleepLogStorage } from '../../services/sleep-log-storage';

type GraphView = 'week' | 'month' | 'year';

interface GraphBar {
  label: string;
  totalDuration: number;
}

@Component({
  selector: 'app-stats',
  imports: [CommonModule, FormsModule],
  templateUrl: './stats.html',
  styleUrl: './stats.css',
})
export class Stats {
  graphView: GraphView = 'week';

  editingLogId: string | null = null;

  manualStartTime = '';
  manualEndTime = '';
  manualRating: number | null = null;
  manualComment = '';

  ratings = [1, 2, 3, 4, 5];

  constructor(private sleepLogStorage: SleepLogStorage) {}

  get sleepLogs(): SleepLog[] {
    return [...this.sleepLogStorage.getLogs()].sort(
      (a, b) => new Date(b.endTime).getTime() - new Date(a.endTime).getTime(),
    );
  }

  get totalLoggedSleep(): number {
    return this.sleepLogs.length;
  }

  get averageSleepHours(): string {
    if (this.sleepLogs.length === 0) {
      return '0h';
    }

    const totalMinutes = this.sleepLogs.reduce(
      (sum, log) => sum + log.totalDuration,
      0,
    );

    return `${(totalMinutes / this.sleepLogs.length / 60).toFixed(1)}h`;
  }

  get averageRating(): string {
    const ratedLogs = this.sleepLogs.filter((log) => log.rating !== null);

    if (ratedLogs.length === 0) {
      return 'N/A';
    }

    const totalRating = ratedLogs.reduce(
      (sum, log) => sum + (log.rating ?? 0),
      0,
    );

    return `${(totalRating / ratedLogs.length).toFixed(1)} / 5`;
  }

  get recentLogs(): SleepLog[] {
    return this.sleepLogs.slice(0, 7);
  }

  get graphData(): GraphBar[] {
    if (this.graphView === 'month') {
      return this.getCurrentMonthData();
    }

    if (this.graphView === 'year') {
      return this.getCurrentYearData();
    }

    return this.getCurrentWeekData();
  }

  get maxGraphDuration(): number {
    const highestDuration = Math.max(
      ...this.graphData.map((bar) => bar.totalDuration),
      480,
    );

    return highestDuration;
  }

  get manualFormTitle(): string {
    return this.editingLogId ? 'Edit Sleep Log' : 'Add Sleep Log';
  }

  saveManualLog(): void {
    if (!this.manualStartTime || !this.manualEndTime) {
      return;
    }

    const startDate = new Date(this.manualStartTime);
    const endDate = new Date(this.manualEndTime);
    const totalDuration = this.getDurationMinutes(startDate, endDate);

    if (totalDuration <= 0) {
      return;
    }

    const comment = this.manualComment.trim();
    const savedComment = comment.length > 0 ? comment : null;

    if (this.editingLogId) {
      const currentLog = this.sleepLogs.find((log) => log.id === this.editingLogId);

      if (!currentLog) {
        return;
      }

      const updatedLog: SleepLog = {
        ...currentLog,
        startTime: startDate.toISOString(),
        endTime: endDate.toISOString(),
        totalDuration,
        rating: this.manualRating,
        comment: savedComment,
      };

      this.sleepLogStorage.updateLog(updatedLog);
    } else {
      this.sleepLogStorage.addLog(
        startDate.toISOString(),
        endDate.toISOString(),
        totalDuration,
        this.manualRating,
        savedComment,
      );
    }

    this.clearManualForm();
  }

  editLog(log: SleepLog): void {
    this.editingLogId = log.id;
    this.manualStartTime = this.toDateTimeInputValue(log.startTime);
    this.manualEndTime = this.toDateTimeInputValue(log.endTime);
    this.manualRating = log.rating;
    this.manualComment = log.comment ?? '';
  }

  deleteLog(id: string): void {
    const shouldDelete = confirm('Delete this sleep log?');

    if (shouldDelete) {
      this.sleepLogStorage.deleteLog(id);
    }
  }

  clearManualForm(): void {
    this.editingLogId = null;
    this.manualStartTime = '';
    this.manualEndTime = '';
    this.manualRating = null;
    this.manualComment = '';
  }

  canSaveManualLog(): boolean {
    if (!this.manualStartTime || !this.manualEndTime) {
      return false;
    }

    return this.getDurationMinutes(
      new Date(this.manualStartTime),
      new Date(this.manualEndTime),
    ) > 0;
  }

  formatTime(dateString: string): string {
    return new Date(dateString).toLocaleTimeString([], {
      hour: 'numeric',
      minute: '2-digit',
    });
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString([], {
      month: 'short',
      day: 'numeric',
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

  getBarHeight(totalDuration: number): string {
    if (totalDuration === 0) {
      return '6px';
    }

    return `${Math.max(8, (totalDuration / this.maxGraphDuration) * 100)}%`;
  }

  private getCurrentWeekData(): GraphBar[] {
    const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const weekStart = this.getStartOfWeek(new Date());

    return labels.map((label, index) => {
      const day = new Date(weekStart);
      day.setDate(weekStart.getDate() + index);

      return {
        label,
        totalDuration: this.getTotalDurationForDay(day),
      };
    });
  }

  private getCurrentMonthData(): GraphBar[] {
    const weeks: GraphBar[] = [
      { label: 'W1', totalDuration: 0 },
      { label: 'W2', totalDuration: 0 },
      { label: 'W3', totalDuration: 0 },
      { label: 'W4', totalDuration: 0 },
      { label: 'W5', totalDuration: 0 },
    ];

    const now = new Date();

    this.sleepLogs.forEach((log) => {
      const date = new Date(log.endTime);

      if (date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()) {
        const weekIndex = Math.min(4, Math.floor((date.getDate() - 1) / 7));
        weeks[weekIndex].totalDuration += log.totalDuration;
      }
    });

    return weeks;
  }

  private getCurrentYearData(): GraphBar[] {
    const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const months = labels.map((label) => ({
      label,
      totalDuration: 0,
    }));

    const currentYear = new Date().getFullYear();

    this.sleepLogs.forEach((log) => {
      const date = new Date(log.endTime);

      if (date.getFullYear() === currentYear) {
        months[date.getMonth()].totalDuration += log.totalDuration;
      }
    });

    return months;
  }

  private getTotalDurationForDay(day: Date): number {
    return this.sleepLogs
      .filter((log) => this.isSameDay(new Date(log.endTime), day))
      .reduce((sum, log) => sum + log.totalDuration, 0);
  }

  private getStartOfWeek(date: Date): Date {
    const start = new Date(date);
    const day = start.getDay();
    const difference = day === 0 ? -6 : 1 - day;

    start.setDate(start.getDate() + difference);
    start.setHours(0, 0, 0, 0);

    return start;
  }

  private isSameDay(firstDate: Date, secondDate: Date): boolean {
    return (
      firstDate.getFullYear() === secondDate.getFullYear() &&
      firstDate.getMonth() === secondDate.getMonth() &&
      firstDate.getDate() === secondDate.getDate()
    );
  }

  private getDurationMinutes(startDate: Date, endDate: Date): number {
    return Math.round((endDate.getTime() - startDate.getTime()) / 60000);
  }

  private toDateTimeInputValue(dateString: string): string {
    const date = new Date(dateString);
    const offsetDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);

    return offsetDate.toISOString().slice(0, 16);
  }
}