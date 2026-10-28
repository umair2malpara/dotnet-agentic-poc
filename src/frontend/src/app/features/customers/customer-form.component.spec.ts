import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';
import { vi } from 'vitest';
import { ConfirmationService } from '../../core/services/confirmation.service';
import { CustomerApiService } from '../../core/services/customer-api.service';
import { NotificationService } from '../../core/services/notification.service';
import { CustomerFormComponent } from './customer-form.component';

@Component({ standalone: true, template: '' })
class CustomerListTestComponent {}

describe('CustomerFormComponent', () => {
  let api: {
    getCustomer: ReturnType<typeof vi.fn>;
    createCustomer: ReturnType<typeof vi.fn>;
    updateCustomer: ReturnType<typeof vi.fn>;
  };
  let confirmations: {
    confirm: ReturnType<typeof vi.fn>;
  };

  afterEach(() => TestBed.inject(NotificationService).dismiss());

  function configureRoute(customerId: string | null = null): void {
    confirmations = {
      confirm: vi.fn(() => Promise.resolve(false)),
    };
    api = {
      getCustomer: vi.fn(() =>
        of({
          id: 'customer-1',
          name: 'Alex Morgan',
          email: 'alex@example.test',
        }),
      ),
      createCustomer: vi.fn(() =>
        of({
          id: 'customer-2',
          name: 'New Customer',
          email: 'new@example.test',
        }),
      ),
      updateCustomer: vi.fn(() => of(undefined)),
    };
    TestBed.configureTestingModule({
      imports: [CustomerFormComponent],
      providers: [
        provideRouter([{ path: 'customers', component: CustomerListTestComponent }]),
        { provide: ConfirmationService, useValue: confirmations },
        { provide: CustomerApiService, useValue: api },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: { get: (name: string) => (name === 'id' ? customerId : null) },
            },
          },
        },
      ],
    });
  }

  it('validates required fields and rejects whitespace-only names', () => {
    configureRoute();
    const fixture = TestBed.createComponent(CustomerFormComponent);
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;
    const save = element.querySelector<HTMLButtonElement>('[aria-label="Page actions"] .primary');
    expect(save?.disabled).toBe(true);
    element
      .querySelector('form')
      ?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    fixture.detectChanges();

    expect(api.createCustomer).not.toHaveBeenCalled();
    expect(element.textContent).toContain('non-whitespace character');

    const name = element.querySelector<HTMLInputElement>('#customer-name');
    const email = element.querySelector<HTMLInputElement>('#customer-email');
    name!.value = '   ';
    name!.dispatchEvent(new Event('input'));
    email!.value = 'invalid-email';
    email!.dispatchEvent(new Event('input'));
    element
      .querySelector('form')
      ?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    fixture.detectChanges();

    expect(api.createCustomer).not.toHaveBeenCalled();
    expect(element.textContent).toContain('valid email address');

    email!.value = '   ';
    email!.dispatchEvent(new Event('input'));
    element
      .querySelector('form')
      ?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    fixture.detectChanges();
    expect(api.createCustomer).not.toHaveBeenCalled();
  });

  it.each([
    'a..b@example.test',
    '.a@example.test',
    'a.@example.test',
    'a@localhost',
    '"person"@example.test',
    `person@example.${'a'.repeat(64)}`,
  ])('rejects email %s using the same API validation rules', (invalidEmail) => {
    configureRoute();
    const fixture = TestBed.createComponent(CustomerFormComponent);
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;
    const name = element.querySelector<HTMLInputElement>('#customer-name');
    const email = element.querySelector<HTMLInputElement>('#customer-email');
    name!.value = 'Test Customer';
    name!.dispatchEvent(new Event('input'));
    email!.value = invalidEmail;
    email!.dispatchEvent(new Event('input'));
    element
      .querySelector('form')
      ?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    fixture.detectChanges();

    expect(api.createCustomer).not.toHaveBeenCalled();
    expect(email?.getAttribute('aria-invalid')).toBe('true');
  });

  it('trims submitted values before creating a customer', () => {
    configureRoute();
    const fixture = TestBed.createComponent(CustomerFormComponent);
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;
    const name = element.querySelector<HTMLInputElement>('#customer-name');
    const email = element.querySelector<HTMLInputElement>('#customer-email');
    name!.value = '  New Customer  ';
    name!.dispatchEvent(new Event('input'));
    email!.value = '  new@example.test  ';
    email!.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(
      element.querySelector<HTMLButtonElement>('[aria-label="Page actions"] .primary')?.disabled,
    ).toBe(false);
    element
      .querySelector('form')
      ?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    fixture.detectChanges();

    expect(api.createCustomer).toHaveBeenCalledWith({
      name: 'New Customer',
      email: 'new@example.test',
    });
    expect(TestBed.inject(NotificationService).notification()).toEqual({
      kind: 'success',
      message: 'Customer created successfully.',
    });
  });

  it('loads customer values and updates the selected customer', () => {
    configureRoute('customer-1');
    const fixture = TestBed.createComponent(CustomerFormComponent);
    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;
    const name = element.querySelector<HTMLInputElement>('#customer-name');
    const email = element.querySelector<HTMLInputElement>('#customer-email');
    expect(name?.value).toBe('Alex Morgan');
    expect(email?.value).toBe('alex@example.test');

    name!.value = 'Updated Name';
    name!.dispatchEvent(new Event('input'));
    element
      .querySelector('form')
      ?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));

    expect(api.updateCustomer).toHaveBeenCalledWith('customer-1', {
      name: 'Updated Name',
      email: 'alex@example.test',
    });
  });

  it('clears the create form for another customer when the user declines navigation', async () => {
    configureRoute();
    const fixture = TestBed.createComponent(CustomerFormComponent);
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;
    const name = element.querySelector<HTMLInputElement>('#customer-name');
    const email = element.querySelector<HTMLInputElement>('#customer-email');
    name!.value = 'New Customer';
    name!.dispatchEvent(new Event('input'));
    email!.value = 'new@example.test';
    email!.dispatchEvent(new Event('input'));
    element
      .querySelector('form')
      ?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    await fixture.whenStable();
    await new Promise((resolve) => setTimeout(resolve, 650));
    fixture.detectChanges();

    expect(confirmations.confirm).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Customer saved',
        confirmLabel: 'Yes, return',
        cancelLabel: 'No, stay here',
      }),
    );
    expect(element.querySelector<HTMLInputElement>('#customer-name')?.value).toBe('');
    expect(element.querySelector<HTMLInputElement>('#customer-email')?.value).toBe('');
    expect(
      element.querySelector<HTMLButtonElement>('[aria-label="Page actions"] .primary')?.disabled,
    ).toBe(true);
    expect(TestBed.inject(NotificationService).notification()?.kind).toBe('success');
  });

  it('keeps saved edit values when the user declines navigation', async () => {
    configureRoute('customer-1');
    const fixture = TestBed.createComponent(CustomerFormComponent);
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;
    const name = element.querySelector<HTMLInputElement>('#customer-name');
    name!.value = 'Updated Name';
    name!.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    element
      .querySelector('form')
      ?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    await fixture.whenStable();
    await new Promise((resolve) => setTimeout(resolve, 650));
    fixture.detectChanges();
    expect(confirmations.confirm).toHaveBeenCalledOnce();

    expect(name?.value).toBe('Updated Name');
    expect(element.querySelector<HTMLInputElement>('#customer-email')?.value).toBe(
      'alex@example.test',
    );
    expect(
      element.querySelector<HTMLButtonElement>('[aria-label="Page actions"] .primary')?.disabled,
    ).toBe(true);
  });

  it('shows API failures without navigating away', () => {
    configureRoute();
    api.createCustomer.mockReturnValue(throwError(() => new HttpErrorResponse({ status: 500 })));
    const fixture = TestBed.createComponent(CustomerFormComponent);
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;
    const name = element.querySelector<HTMLInputElement>('#customer-name');
    const email = element.querySelector<HTMLInputElement>('#customer-email');
    name!.value = 'New Customer';
    name!.dispatchEvent(new Event('input'));
    email!.value = 'new@example.test';
    email!.dispatchEvent(new Event('input'));
    element
      .querySelector('form')
      ?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    fixture.detectChanges();

    expect(element.querySelector('[role="alert"]')?.textContent).toContain(
      'Unable to create the customer',
    );
    expect(element.querySelector('form')).not.toBeNull();
    expect(TestBed.inject(NotificationService).notification()?.kind).toBe('error');
  });

  it('offers a return link when the edited customer no longer exists', () => {
    configureRoute('missing-customer');
    api.getCustomer.mockReturnValue(throwError(() => new HttpErrorResponse({ status: 404 })));
    const fixture = TestBed.createComponent(CustomerFormComponent);
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;

    expect(element.querySelector('[role="alert"]')?.textContent).toContain('no longer exists');
    expect(element.querySelector('a[href="/customers"]')).not.toBeNull();
  });
});
