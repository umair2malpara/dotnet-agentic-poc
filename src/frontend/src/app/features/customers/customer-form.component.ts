import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CustomerWrite } from '../../core/models/customer.model';
import { ConfirmationService } from '../../core/services/confirmation.service';
import { CustomerApiService } from '../../core/services/customer-api.service';
import { NotificationService } from '../../core/services/notification.service';
import {
  ActionBarAction,
  ActionBarComponent,
} from '../../shared/components/action-bar/action-bar.component';
import { customerEmailValidator } from './customer.validators';

@Component({
  selector: 'app-customer-form',
  imports: [ActionBarComponent, ReactiveFormsModule, RouterLink],
  templateUrl: './customer-form.component.html',
  styleUrl: './customer-form.component.scss',
})
export class CustomerFormComponent {
  private readonly api = inject(CustomerApiService);
  private readonly confirmations = inject(ConfirmationService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly notifications = inject(NotificationService);
  private readonly formBuilder = inject(FormBuilder).nonNullable;
  protected readonly customerId = this.route.snapshot.paramMap.get('id');
  protected readonly editMode = this.customerId !== null;
  protected readonly loading = signal(this.editMode);
  protected readonly customerLoaded = signal(!this.editMode);
  protected readonly submitting = signal(false);
  protected readonly saved = signal(false);
  protected readonly errorMessage = signal<string | null>(null);
  protected readonly form = this.formBuilder.group({
    name: ['', [Validators.required, Validators.pattern(/\S/)]],
    email: ['', [Validators.required, customerEmailValidator]],
  });

  constructor() {
    if (this.customerId) {
      this.loadCustomer(this.customerId);
    }
  }

  protected get actionBarActions(): readonly ActionBarAction[] {
    return [
      {
        id: 'cancel',
        label: 'Cancel',
        variant: 'secondary',
        disabled: this.submitting(),
        onClick: () => void this.router.navigate(['/customers']),
      },
      {
        id: 'save',
        label: this.submitting() ? 'Saving…' : 'Save',
        variant: 'primary',
        disabled: this.form.invalid || this.submitting() || (this.saved() && !this.form.dirty),
        busy: this.submitting(),
        type: 'submit',
        form: 'customer-form',
      },
    ];
  }

  protected loadCustomer(id: string): void {
    this.loading.set(true);
    this.errorMessage.set(null);
    this.api.getCustomer(id, { suppressErrorNotification: true }).subscribe({
      next: (customer) => {
        this.form.setValue({ name: customer.name, email: customer.email });
        this.customerLoaded.set(true);
        this.loading.set(false);
      },
      error: (error: unknown) => {
        this.customerLoaded.set(false);
        this.errorMessage.set(
          error instanceof HttpErrorResponse && error.status === 404
            ? 'This customer no longer exists. Return to the customer list.'
            : 'Unable to load this customer. Check the API connection and try again.',
        );
        this.loading.set(false);
      },
    });
  }

  protected submit(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid || this.submitting()) {
      return;
    }

    const customer: CustomerWrite = {
      name: this.form.controls.name.value.trim(),
      email: this.form.controls.email.value.trim(),
    };
    this.errorMessage.set(null);
    this.submitting.set(true);

    if (this.customerId) {
      this.api
        .updateCustomer(this.customerId, customer, {
          successMessage: 'Customer updated successfully.',
          suppressErrorNotification: true,
        })
        .subscribe({
          next: () => void this.completeSave('Customer updated successfully.'),
          error: (error: unknown) => {
            const message =
              error instanceof HttpErrorResponse && error.status === 404
                ? 'This customer no longer exists. Return to the customer list.'
                : 'Unable to save changes. Please try again.';
            this.errorMessage.set(message);
            this.submitting.set(false);
          },
        });
      return;
    }

    this.api
      .createCustomer(customer, {
        successMessage: 'Customer created successfully.',
        suppressErrorNotification: true,
      })
      .subscribe({
        next: () => void this.completeSave('Customer created successfully.'),
        error: () => {
          const message = 'Unable to create the customer. Please try again.';
          this.errorMessage.set(message);
          this.submitting.set(false);
        },
      });
  }

  private async completeSave(successMessage: string): Promise<void> {
    this.saved.set(true);
    this.form.markAsPristine();
    this.submitting.set(false);
    await new Promise<void>((resolve) => setTimeout(resolve, 600));

    const shouldReturn = await this.confirmations.confirm({
      title: 'Customer saved',
      message: `${successMessage} Would you like to return to the customer list?`,
      confirmLabel: 'Yes, return',
      cancelLabel: 'No, stay here',
      variant: 'primary',
    });

    if (!shouldReturn) {
      if (!this.editMode) {
        this.form.reset({ name: '', email: '' });
      }
      return;
    }

    this.notifications.setPendingCustomerSave(successMessage);
    try {
      const navigated = await this.router.navigate(['/customers']);
      if (navigated) {
        return;
      }

      this.notifications.clearPendingCustomerSave();
      this.notifications.showWarning(
        `${successMessage} Return to Customers to view the updated list.`,
      );
    } catch {
      this.notifications.clearPendingCustomerSave();
      this.notifications.showError(
        `${successMessage} The customer list could not be opened. Please use the Customers navigation link.`,
      );
    }
  }
}
