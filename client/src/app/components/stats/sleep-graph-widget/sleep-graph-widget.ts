import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SleepLog } from '../../../data/sleep-log';

type GraphView = 'week' | 'month' | 'year';

interface GraphBar {
  label: string;
  minutes: number;
}

@Component({
  selector: 'app-sleep-graph-widget',
  imports: [CommonModule, FormsModule],
  templateUrl: './sleep-graph-widget.html',
  styleUrl: './sleep-graph-widget.css',
})
export class SleepGraphWidget {
  @Input() logs: SleepLog[] = [];

  graphView: GraphView = 'week';

  get graphBars(): GraphBar[] {
    if (this.graphView === 'month') {
      return this.getMonthBars();
    }

    if (this.graphView === 'year') {
      return this.getYearBars();
    }

    return this.getWeekBars();
  }

  get maxMinutes(): number {
    return Math.max(...this.graphBars.map((bar) => bar.minutes), 600);
  }

  get peakLabel(): string {
    const hours = Math.round(this.maxMinutes / 60);
    return `${hours}h peak`;
  }

  getBarHeight(minutes: number): string {
    if (minutes <= 0) {
      return '3px';
    }

    return `${Math.max(4, (minutes / this.maxMinutes) * 100)}%`;
  }

  formatDuration(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    if (hours === 0) {
      return `${remainingMinutes}m`;
    }

    if (remainingMinutes === 0) {
      return `${hours}h`;
    }

    return `${hours}h ${remainingMinutes}m`;
  }

  private getWeekBars(): GraphBar[] {
    const labels = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
    const weekStart = this.getWeekStart(new Date());

    return labels.map((label, index) => {
      const date = new Date(weekStart);
      date.setDate(weekStart.getDate() + index);

      return {
        label,
        minutes: this.getMinutesForDay(date),
      };
    });
  }

  private getMonthBars(): GraphBar[] {
    const bars: GraphBar[] = [
      { label: 'W1', minutes: 0 },
      { label: 'W2', minutes: 0 },
      { label: 'W3', minutes: 0 },
      { label: 'W4', minutes: 0 },
      { label: 'W5', minutes: 0 },
    ];

    const now = new Date();

    this.logs.forEach((log) => {
      const date = new Date(log.endTime);

      if (
        date.getMonth() === now.getMonth() &&
        date.getFullYear() === now.getFullYear()
      ) {
        const weekIndex = Math.min(4, Math.floor((date.getDate() - 1) / 7));
        bars[weekIndex].minutes += log.totalDuration;
      }
    });

    return bars;
  }

  private getYearBars(): GraphBar[] {
    const labels = [
      'J',
      'F',
      'M',
      'A',
      'M',
      'J',
      'J',
      'A',
      'S',
      'O',
      'N',
      'D',
    ];

    const bars = labels.map((label) => ({
      label,
      minutes: 0,
    }));

    const year = new Date().getFullYear();

    this.logs.forEach((log) => {
      const date = new Date(log.endTime);

      if (date.getFullYear() === year) {
        bars[date.getMonth()].minutes += log.totalDuration;
      }
    });

    return bars;
  }

  private getMinutesForDay(day: Date): number {
    return this.logs
      .filter((log) => this.isSameDay(new Date(log.endTime), day))
      .reduce((sum, log) => sum + log.totalDuration, 0);
  }

  private getWeekStart(date: Date): Date {
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
}