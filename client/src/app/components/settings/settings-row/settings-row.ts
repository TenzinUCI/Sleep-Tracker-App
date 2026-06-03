import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-settings-row',
  imports: [],
  templateUrl: './settings-row.html',
  styleUrl: './settings-row.css',
})
export class SettingsRow {
  @Input() title = '';
  @Input() description = '';
  @Input() checked = false;
  @Input() disabled = false;

  @Output() checkedChange = new EventEmitter<boolean>();

  toggleSetting(): void {
    if (this.disabled) {
      return;
    }

    this.checked = !this.checked;
    this.checkedChange.emit(this.checked);
  }
}