import { Injectable, signal } from '@angular/core';

export interface ConfirmationRequest {
  readonly title: string;
  readonly message: string;
  readonly confirmLabel: string;
  readonly cancelLabel: string;
  readonly variant: 'primary' | 'danger';
}

@Injectable({ providedIn: 'root' })
export class ConfirmationService {
  readonly request = signal<ConfirmationRequest | null>(null);

  private resolveRequest: ((confirmed: boolean) => void) | null = null;

  confirm(request: ConfirmationRequest): Promise<boolean> {
    if (this.resolveRequest) {
      throw new Error('A confirmation dialog is already open.');
    }

    this.request.set(request);
    return new Promise<boolean>((resolve) => {
      this.resolveRequest = resolve;
    });
  }

  resolve(confirmed: boolean): void {
    const resolveRequest = this.resolveRequest;
    if (!resolveRequest) {
      return;
    }

    this.resolveRequest = null;
    this.request.set(null);
    resolveRequest(confirmed);
  }
}
