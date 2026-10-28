import { HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';
import { vi } from 'vitest';
import { ConfirmationService } from '../../core/services/confirmation.service';
import { CustomerApiService } from '../../core/services/customer-api.service';
import { NotificationService } from '../../core/services/notification.service';
import { CustomersComponent } from './customers.component';

describe('CustomersComponent', () => {
  const customers = [
    { id: 'customer-1', name: 'Alex Morgan', email: 'alex@example.test' },
    { id: 'customer-2', name: 'Jamie Lee', email: 'jamie@example.test' },
  ];
  let api: {
    getCustomers: ReturnType<typeof vi.fn>;
    deleteCustomers: ReturnType<typeof vi.fn>;
  };
  let confirmations: {
    confirm: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    confirmations = {
      confirm: vi.fn(() => Promise.resolve(true)),
    };
    api = {
      getCustomers: vi.fn(() => of(customers)),
      deleteCustomers: vi.fn(() => of(undefined)),
    };
    TestBed.configureTestingModule({
      imports: [CustomersComponent],
      providers: [
        provideRouter([]),
        { provide: ConfirmationService, useValue: confirmations },
        { provide: CustomerApiService, useValue: api },
      ],
    });
  });

  afterEach(() => {
    TestBed.inject(NotificationService).dismiss();
    vi.restoreAllMocks();
  });

  it('displays customer contact details and accessible selection controls', () => {
    const fixture = TestBed.createComponent(CustomersComponent);
    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelector('h1')).toBeNull();
    expect(element.textContent).toContain('Alex Morgan');
    expect(element.textContent).toContain('alex@example.test');
    expect(element.querySelector('[aria-label="Select customer-1"]')).toBeNull();
    expect(element.querySelector('[aria-label="Select Alex Morgan"]')).not.toBeNull();
  });

  it('enables Delete for any selection and Edit only for one selected row', () => {
    const fixture = TestBed.createComponent(CustomersComponent);
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;
    const actions = element.querySelectorAll<HTMLButtonElement>(
      '[aria-label="Page actions"] button',
    );
    const edit = actions[1];
    const deleteButton = actions[2];
    const checkboxes = element.querySelectorAll<HTMLInputElement>('tbody input[type="checkbox"]');

    expect(edit?.disabled).toBe(true);
    expect(deleteButton?.disabled).toBe(true);

    checkboxes[0].click();
    fixture.detectChanges();
    expect(edit?.disabled).toBe(false);
    expect(deleteButton?.disabled).toBe(false);

    checkboxes[1].click();
    fixture.detectChanges();
    expect(edit?.disabled).toBe(true);
    expect(deleteButton?.disabled).toBe(false);
  });

  it('requires modal confirmation and sends selected IDs in one delete request', async () => {
    const fixture = TestBed.createComponent(CustomersComponent);
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;
    const checkboxes = element.querySelectorAll<HTMLInputElement>('tbody input[type="checkbox"]');
    checkboxes[0].click();
    checkboxes[1].click();
    fixture.detectChanges();

    element.querySelector<HTMLButtonElement>('[aria-label="Page actions"] .danger')?.click();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(confirmations.confirm).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Delete 2 customers?',
        confirmLabel: 'Yes, delete',
        cancelLabel: 'No, keep them',
      }),
    );
    expect(api.deleteCustomers).toHaveBeenCalledWith(['customer-1', 'customer-2']);
    expect(element.textContent).not.toContain('Alex Morgan');
    expect(element.textContent).toContain('No customers found');
    expect(TestBed.inject(NotificationService).notification()?.message).toBe(
      '2 customers deleted successfully.',
    );
  });

  it('does not send a delete request when modal confirmation is cancelled', async () => {
    confirmations.confirm.mockResolvedValue(false);
    const fixture = TestBed.createComponent(CustomersComponent);
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;
    element.querySelector<HTMLInputElement>('tbody input[type="checkbox"]')?.click();
    fixture.detectChanges();
    element.querySelector<HTMLButtonElement>('[aria-label="Page actions"] .danger')?.click();
    await fixture.whenStable();

    expect(api.deleteCustomers).not.toHaveBeenCalled();
    expect(element.textContent).toContain('Alex Morgan');
  });

  it('keeps customer data and selection and shows an error toast when deletion fails', async () => {
    api.deleteCustomers.mockReturnValue(throwError(() => new Error('API unavailable')));
    const fixture = TestBed.createComponent(CustomersComponent);
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;
    const checkbox = element.querySelector<HTMLInputElement>('tbody input[type="checkbox"]');
    checkbox?.click();
    fixture.detectChanges();
    element.querySelector<HTMLButtonElement>('[aria-label="Page actions"] .danger')?.click();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(element.textContent).toContain('Alex Morgan');
    expect(checkbox?.checked).toBe(true);
    expect(element.querySelector('[role="alert"]')?.textContent).toContain(
      'Unable to confirm deletion',
    );
    expect(TestBed.inject(NotificationService).notification()?.kind).toBe('error');
  });

  it('offers retry when loading customers fails', () => {
    api.getCustomers.mockReturnValueOnce(throwError(() => new Error('API unavailable')));
    const fixture = TestBed.createComponent(CustomersComponent);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('[role="alert"]')?.textContent).toContain(
      'Unable to load customers',
    );

    api.getCustomers.mockReturnValueOnce(of(customers));
    fixture.nativeElement.querySelector('button')?.click();
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Alex Morgan');
  });

  it('explains stale IDs after an atomic delete fails without removing rows', async () => {
    api.deleteCustomers.mockReturnValue(throwError(() => new HttpErrorResponse({ status: 404 })));
    const fixture = TestBed.createComponent(CustomersComponent);
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;
    element.querySelector<HTMLInputElement>('tbody input[type="checkbox"]')?.click();
    fixture.detectChanges();
    element.querySelector<HTMLButtonElement>('[aria-label="Page actions"] .danger')?.click();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(element.textContent).toContain('No customers were deleted');
    expect(element.textContent).toContain('Refresh list');
    expect(element.textContent).toContain('Alex Morgan');
  });
});
