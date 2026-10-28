import { Injectable, signal } from '@angular/core';

export interface ToastNotification {
  readonly kind: 'success' | 'warning' | 'error';
  readonly message: string;
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
  readonly notification = signal<ToastNotification | null>(null);

  private timeout?: ReturnType<typeof setTimeout>;
  private pendingCustomerSaveMessage: string | null = null;

  showSuccess(message: string): void {
    this.show({ kind: 'success', message });
  }

  showWarning(message: string): void {
    this.show({ kind: 'warning', message });
  }

  showError(message: string): void {
    this.show({ kind: 'error', message });
  }

  setPendingCustomerSave(message: string): void {
    this.pendingCustomerSaveMessage = message;
  }

  takePendingCustomerSave(): string | null {
    const message = this.pendingCustomerSaveMessage;
    this.pendingCustomerSaveMessage = null;
    return message;
  }

  clearPendingCustomerSave(): void {
    this.pendingCustomerSaveMessage = null;
  }

  dismiss(): void {
    if (this.timeout !== undefined) {
      clearTimeout(this.timeout);
      this.timeout = undefined;
    }
    this.notification.set(null);
  }

  private show(notification: ToastNotification): void {
    this.dismiss();
    this.notification.set(notification);
    this.timeout = setTimeout(() => {
      this.notification.set(null);
      this.timeout = undefined;
    }, 6000);
  }
}
