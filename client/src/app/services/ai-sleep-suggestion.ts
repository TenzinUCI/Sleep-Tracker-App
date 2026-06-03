import { Injectable } from '@angular/core';
import { SleepLog } from '../data/sleep-log';

@Injectable({
  providedIn: 'root',
})
export class AiSleepSuggestion {
  private readonly apiUrl = 'http://localhost:3000/api/sleep-suggestion';

  async getSuggestion(logs: SleepLog[]): Promise<string> {
    const controller = new AbortController();

    const timeoutId = setTimeout(() => {
      controller.abort();
    }, 20000);

    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ logs }),
        signal: controller.signal,
      });

      if (!response.ok) {
        return 'The AI suggestion server returned an error.';
      }

      const data = await response.json();

      return data.suggestion || 'No AI suggestion was returned.';
    } catch {
      return 'Could not reach the AI suggestion server.';
    } finally {
      clearTimeout(timeoutId);
    }
  }
}