import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SleepLog } from '../../../data/sleep-log';

type GraphView = 'week' | 'month' | 'year';

interface GraphBar {
  id: string;
  label: string;
  minutes: number;
  detail: string;
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
  selectedId = '';

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

  get selectedBar(): GraphBar | null {
    return this.graphBars.find((bar) => bar.id === this.selectedId) ?? null;
  }

  changeGraphView(): void {
    this.selectedId = '';
  }

  selectBar(bar: GraphBar): void {
    this.selectedId = bar.id;
  }

  isSelected(bar: GraphBar): boolean {
    return this.selectedId === bar.id;
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
    const days = [
      { id: 'mon', label: 'M' },
      { id: 'tue', label: 'T' },
      { id: 'wed', label: 'W' },
      { id: 'thu', label: 'T' },
      { id: 'fri', label: 'F' },
      { id: 'sat', label: 'S' },
      { id: 'sun', label: 'S' },
    ];

    const weekStart = this.getWeekStart(new Date());

    return days.map((day, index) => {
      const date = new Date(weekStart);
      date.setDate(weekStart.getDate() + index);

      return {
        id: day.id,
        label: day.label,
        minutes: this.getMinutesForDay(date),
        detail: date.toLocaleDateString([], {
          weekday: 'long',
          month: 'short',
          day: 'numeric',
        }),
      };
    });
  }

  private getMonthBars(): GraphBar[] {
    const bars: GraphBar[] = [
      { id: 'week-1', label: 'W1', minutes: 0, detail: 'Week 1' },
      { id: 'week-2', label: 'W2', minutes: 0, detail: 'Week 2' },
      { id: 'week-3', label: 'W3', minutes: 0, detail: 'Week 3' },
      { id: 'week-4', label: 'W4', minutes: 0, detail: 'Week 4' },
      { id: 'week-5', label: 'W5', minutes: 0, detail: 'Week 5' },
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
    const months = [
      { id: 'jan', label: 'J', detail: 'January' },
      { id: 'feb', label: 'F', detail: 'February' },
      { id: 'mar', label: 'M', detail: 'March' },
      { id: 'apr', label: 'A', detail: 'April' },
      { id: 'may', label: 'M', detail: 'May' },
      { id: 'jun', label: 'J', detail: 'June' },
      { id: 'jul', label: 'J', detail: 'July' },
      { id: 'aug', label: 'A', detail: 'August' },
      { id: 'sep', label: 'S', detail: 'September' },
      { id: 'oct', label: 'O', detail: 'October' },
      { id: 'nov', label: 'N', detail: 'November' },
      { id: 'dec', label: 'D', detail: 'December' },
    ];

    const bars = months.map((month) => ({
      ...month,
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