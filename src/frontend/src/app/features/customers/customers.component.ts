import { HttpErrorResponse } from '@angular/common/http';
import { Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Customer } from '../../core/models/customer.model';
import { ConfirmationService } from '../../core/services/confirmation.service';
import { DatasetState } from '../../core/models/dataset-state.model';
import { CustomerApiService } from '../../core/services/customer-api.service';
import { NotificationService } from '../../core/services/notification.service';
import {
  ActionBarAction,
  ActionBarComponent,
} from '../../shared/components/action-bar/action-bar.component';

@Component({
  selector: 'app-customers',
  imports: [ActionBarComponent],
  templateUrl: './customers.component.html',
  styleUrl: './customers.component.scss',
})
export class CustomersComponent {
  private readonly api = inject(CustomerApiService);
  private readonly confirmations = inject(ConfirmationService);
  private readonly router = inject(Router);
  private readonly notifications = inject(NotificationService);
  private pendingCustomerSaveMessage = this.notifications.takePendingCustomerSave();
  private saveRefreshFailed = false;

  protected readonly customers = signal<DatasetState<Customer>>({
    status: 'loading',
  });
  protected readonly selectedIds = signal<ReadonlySet<string>>(new Set());
  protected readonly selectedCount = computed(() => this.selectedIds().size);
  protected readonly selectedCustomerId = computed(() => {
    const [id] = this.selectedIds();
    return this.selectedIds().size === 1 ? id : null;
  });
  protected readonly allSelected = computed(() => {
    const current = this.customers();
    return (
      current.status === 'success' &&
      current.data.length > 0 &&
      current.data.every((customer) => this.selectedIds().has(customer.id))
    );
  });
  protected readonly deleteInProgress = signal(false);
  protected readonly deleteError = signal<string | null>(null);

  protected get actionBarActions(): readonly ActionBarAction[] {
    return [
      {
        id: 'add',
        label: 'Add New',
        variant: 'primary',
        disabled: false,
        onClick: () => void this.router.navigate(['/customers/new']),
      },
      {
        id: 'edit',
        label: 'Edit',
        variant: 'secondary',
        disabled: this.selectedCustomerId() === null || this.deleteInProgress(),
        onClick: () => this.editSelected(),
      },
      {
        id: 'delete',
        label: this.deleteInProgress() ? 'Deleting…' : 'Delete',
        variant: 'danger',
        disabled: this.selectedCount() === 0 || this.deleteInProgress(),
        busy: this.deleteInProgress(),
        onClick: () => void this.deleteSelected(),
      },
    ];
  }

  constructor() {
    this.loadCustomers();
  }

  protected loadCustomers(): void {
    this.customers.set({ status: 'loading' });
    this.api.getCustomers().subscribe({
      next: (data) => {
        this.customers.set({ status: 'success', data });
        const availableIds = new Set(data.map((customer) => customer.id));
        this.selectedIds.update(
          (selected) => new Set([...selected].filter((id) => availableIds.has(id))),
        );
        this.deleteError.set(null);
        this.pendingCustomerSaveMessage = null;
        if (this.saveRefreshFailed) {
          this.notifications.showSuccess('Customer list refreshed.');
          this.saveRefreshFailed = false;
        }
      },
      error: () => {
        this.customers.set({
          status: 'error',
          message: 'Unable to load customers. Check the API connection and try again.',
        });
        if (this.pendingCustomerSaveMessage) {
          this.notifications.showWarning(
            `${this.pendingCustomerSaveMessage} However, the customer list could not be refreshed. Retry to load the latest data.`,
          );
          this.pendingCustomerSaveMessage = null;
          this.saveRefreshFailed = true;
        } else if (this.saveRefreshFailed) {
          this.notifications.showWarning(
            'The customer was saved, but the list is still unavailable. Retry to load the latest data.',
          );
        }
      },
    });
  }

  protected isSelected(id: string): boolean {
    return this.selectedIds().has(id);
  }

  protected toggleCustomer(id: string, selected: boolean): void {
    this.selectedIds.update((current) => {
      const next = new Set(current);
      if (selected) {
        next.add(id);
      } else {
        next.delete(id);
      }
      return next;
    });
    this.deleteError.set(null);
  }

  protected onCustomerSelectionChange(id: string, event: Event): void {
    const target = event.target;
    if (target instanceof HTMLInputElement) {
      this.toggleCustomer(id, target.checked);
    }
  }

  protected onSelectAllChange(event: Event): void {
    const target = event.target;
    if (target instanceof HTMLInputElement) {
      this.toggleAll(target.checked);
    }
  }

  protected toggleAll(selected: boolean): void {
    const current = this.customers();
    if (current.status !== 'success') {
      return;
    }

    this.selectedIds.set(
      selected ? new Set(current.data.map((customer) => customer.id)) : new Set(),
    );
    this.deleteError.set(null);
  }

  protected editSelected(): void {
    const id = this.selectedCustomerId();
    if (id) {
      void this.router.navigate(['/customers', id, 'edit']);
    }
  }

  protected async deleteSelected(): Promise<void> {
    const ids = [...this.selectedIds()];
    if (ids.length === 0 || this.deleteInProgress()) {
      return;
    }

    const confirmed = await this.confirmations.confirm({
      title: ids.length === 1 ? 'Delete customer?' : `Delete ${ids.length} customers?`,
      message:
        ids.length === 1
          ? 'This customer will be permanently deleted. This action cannot be undone.'
          : `These ${ids.length} customers will be permanently deleted. This action cannot be undone.`,
      confirmLabel: 'Yes, delete',
      cancelLabel: 'No, keep them',
      variant: 'danger',
    });
    if (!confirmed) {
      return;
    }

    this.deleteError.set(null);
    this.deleteInProgress.set(true);
    this.api.deleteCustomers(ids).subscribe({
      next: () => {
        this.customers.update((current) =>
          current.status === 'success'
            ? {
                status: 'success',
                data: current.data.filter((customer) => !ids.includes(customer.id)),
              }
            : current,
        );
        this.selectedIds.set(new Set());
        this.deleteInProgress.set(false);
        this.notifications.showSuccess(
          ids.length === 1
            ? 'Customer deleted successfully.'
            : `${ids.length} customers deleted successfully.`,
        );
      },
      error: (error: unknown) => {
        const message =
          error instanceof HttpErrorResponse && error.status === 404
            ? 'No customers were deleted because one or more no longer exist. Refresh the list before trying again.'
            : 'Unable to confirm deletion. The list and selection were kept. Refresh the list or retry.';
        this.deleteError.set(message);
        this.notifications.showError(message);
        this.deleteInProgress.set(false);
      },
    });
  }
}
