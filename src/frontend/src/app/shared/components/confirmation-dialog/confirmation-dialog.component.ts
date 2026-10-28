import { Component, ElementRef, effect, inject, viewChild } from '@angular/core';
import { ConfirmationService } from '../../../core/services/confirmation.service';

@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrl: './confirmation-dialog.component.scss',
})
export class ConfirmationDialogComponent {
  protected readonly confirmations = inject(ConfirmationService);
  private readonly dialog = viewChild<ElementRef<HTMLDialogElement>>('dialog');

  constructor() {
    effect(() => {
      const dialog = this.dialog()?.nativeElement;
      if (!dialog) {
        return;
      }

      if (this.confirmations.request() && !dialog.open) {
        dialog.showModal();
      } else if (!this.confirmations.request() && dialog.open) {
        dialog.close();
      }
    });
  }

  protected cancel(): void {
    this.confirmations.resolve(false);
  }

  protected confirm(): void {
    this.confirmations.resolve(true);
  }

  protected onCancel(event: Event): void {
    event.preventDefault();
    this.cancel();
  }
}
