import { Injectable } from '@angular/core';
import { SleepLog } from '../data/sleep-log';

@Injectable({
  providedIn: 'root',
})
export class SleepLogStorage {
  private readonly storageKey = 'sleep-logs';

  getLogs(): SleepLog[] {
    const savedLogs = localStorage.getItem(this.storageKey);

    if (!savedLogs) {
      return [];
    }

    return JSON.parse(savedLogs);
  }

  addLog(
    startTime: string,
    endTime: string,
    totalDuration: number,
    rating: number | null,
    comment: string | null,
  ): void {
    const logs = this.getLogs();

    const newLog: SleepLog = {
      id: crypto.randomUUID(),
      startTime,
      endTime,
      totalDuration,
      rating,
      comment,
      createdAt: new Date().toISOString(),
    };

    logs.push(newLog);
    this.saveLogs(logs);
  }

  updateLog(updatedLog: SleepLog): void {
    const logs = this.getLogs();

    const updatedLogs = logs.map((log) =>
      log.id === updatedLog.id
        ? {
            ...updatedLog,
            updatedAt: new Date().toISOString(),
          }
        : log,
    );

    this.saveLogs(updatedLogs);
  }

  deleteLog(id: string): void {
    const logs = this.getLogs();

    const updatedLogs = logs.filter((log) => log.id !== id);

    this.saveLogs(updatedLogs);
  }

  deleteAll(): void {
    localStorage.removeItem(this.storageKey);
  }

  private saveLogs(logs: SleepLog[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(logs));
  }
}