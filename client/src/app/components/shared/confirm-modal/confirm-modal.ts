import { CommonModule } from '@angular/common';
import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';

@Component({
  selector: 'app-confirm-modal',
  imports: [CommonModule],
  templateUrl: './confirm-modal.html',
  styleUrl: './confirm-modal.css',
})
export class ConfirmModal {
  @Input() title = 'Confirm';
  @Input() message = '';
  @Input() confirmText = 'Confirm';
  @Input() cancelText = 'Cancel';
  @Input() showCancel = true;

  @Output() confirmClicked = new EventEmitter<void>();
  @Output() cancelClicked = new EventEmitter<void>();

  @HostListener('document:keydown.escape')
  handleEscapeKey(): void {
    this.cancelClicked.emit();
  }
}