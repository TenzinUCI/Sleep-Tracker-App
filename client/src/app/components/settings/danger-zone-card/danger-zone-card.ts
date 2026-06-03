import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { SleepLogStorage } from '../../../services/sleep-log-storage';
import { ConfirmModal } from '../../shared/confirm-modal/confirm-modal';

@Component({
  selector: 'app-danger-zone-card',
  imports: [CommonModule, ConfirmModal],
  templateUrl: './danger-zone-card.html',
  styleUrl: './danger-zone-card.css',
})
export class DangerZoneCard {
  confirmOpen = false;
  deletedMessageOpen = false;

  constructor(private sleepLogStorage: SleepLogStorage) {}

  openConfirm(): void {
    this.confirmOpen = true;
  }

  closeConfirm(): void {
    this.confirmOpen = false;
  }

  deleteData(): void {
    this.sleepLogStorage.deleteAll();
    this.confirmOpen = false;
    this.deletedMessageOpen = true;
  }

  closeDeletedMessage(): void {
    this.deletedMessageOpen = false;
  }
}