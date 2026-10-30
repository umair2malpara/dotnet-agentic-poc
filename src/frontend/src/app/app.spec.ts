import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { vi } from 'vitest';
import { CustomerApiService } from './core/services/customer-api.service';
import { ProductApiService } from './core/services/product-api.service';
import { NotificationService } from './core/services/notification.service';
import { WeatherForecastApiService } from './core/services/weather-forecast-api.service';
import { appRoutes } from './app.routes';

describe('application routing', () => {
  let customerApi: {
    getCustomers: ReturnType<typeof vi.fn>;
    getCustomer: ReturnType<typeof vi.fn>;
    createCustomer: ReturnType<typeof vi.fn>;
    updateCustomer: ReturnType<typeof vi.fn>;
    deleteCustomers: ReturnType<typeof vi.fn>;
  };
  let productApi: {
    getProducts: ReturnType<typeof vi.fn>;
  };
  let weatherApi: {
    getWeatherForecasts: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    if (!HTMLDialogElement.prototype.showModal) {
      Object.defineProperty(HTMLDialogElement.prototype, 'showModal', {
        configurable: true,
        value(this: HTMLDialogElement) {
          this.setAttribute('open', '');
        },
      });

      afterEach(() => TestBed.inject(NotificationService).dismiss());
      Object.defineProperty(HTMLDialogElement.prototype, 'close', {
        configurable: true,
        value(this: HTMLDialogElement) {
          this.removeAttribute('open');
        },
      });
    }

    customerApi = {
      getCustomers: vi.fn(() =>
        of([
          {
            id: 'customer-1',
            name: 'Alex Morgan',
            email: 'alex@example.test',
          },
        ]),
      ),
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
          name: 'Taylor Chen',
          email: 'taylor@example.test',
        }),
      ),
      updateCustomer: vi.fn(() => of(undefined)),
      deleteCustomers: vi.fn(() => of(undefined)),
    };
    productApi = {
      getProducts: vi.fn(() => of([{ id: 'product-1', name: 'Starter Kit', price: 24.99 }])),
    };
    weatherApi = {
      getWeatherForecasts: vi.fn(() =>
        of([
          {
            date: '2026-10-27',
            temperatureC: 18,
            temperatureF: 64,
            summary: 'Mild',
          },
        ]),
      ),
    };
    TestBed.configureTestingModule({
      providers: [
        provideRouter(appRoutes),
        { provide: CustomerApiService, useValue: customerApi },
        { provide: ProductApiService, useValue: productApi },
        { provide: WeatherForecastApiService, useValue: weatherApi },
      ],
    });
  });

  it('redirects the root URL to the dashboard route', async () => {
    const harness = await RouterTestingHarness.create('/');

    expect(TestBed.inject(Router).url).toBe('/dashboard');
    expect(harness.routeNativeElement?.querySelector('h1')?.textContent).toContain('Dashboard');
    expect(harness.routeNativeElement?.textContent).toContain('Alex Morgan');
    expect(harness.routeNativeElement?.textContent).toContain('Starter Kit');
    expect(harness.routeNativeElement?.textContent).toContain('Mild');
  });

  it('redirects unknown URLs to the dashboard route', async () => {
    const harness = await RouterTestingHarness.create('/not-a-page');

    expect(TestBed.inject(Router).url).toBe('/dashboard');
    expect(harness.routeNativeElement?.querySelector('h1')?.textContent).toContain('Dashboard');
  });

  it('renders the shared shell and breadcrumbs on direct feature routes', async () => {
    const harness = await RouterTestingHarness.create('/customers');
    const shell = harness.routeNativeElement as HTMLElement;

    expect(shell.querySelector('.brand')?.textContent).toContain('Dotnet Agentic POC');
    expect(shell.querySelector('[aria-label="Breadcrumb"]')?.textContent).toContain('Home');
    expect(shell.querySelector('[aria-label="Breadcrumb"]')?.textContent).toContain('Customers');
    expect(shell.querySelector('[aria-label="Breadcrumb"] [aria-live="polite"]')).not.toBeNull();
    expect(shell.querySelectorAll('[aria-label="Breadcrumb"] li')).toHaveLength(2);
    expect(shell.querySelector('h1')?.textContent).toContain('Customers');
    expect(shell.textContent).toContain('Alex Morgan');
    expect(shell.textContent).toContain('alex@example.test');
    expect(
      shell.querySelector('[aria-label="Page actions"] button.primary')?.textContent,
    ).toContain('Add New');

    shell.querySelector<HTMLButtonElement>('[aria-label="Page actions"] button.primary')?.click();
    await harness.fixture.whenStable();
    harness.detectChanges();
    expect(TestBed.inject(Router).url).toBe('/customers/new');

    await harness.navigateByUrl('/customers');
    harness.detectChanges();
    await harness.navigateByUrl('/products');
    expect(shell.querySelector('[aria-label="Breadcrumb"]')?.textContent).toContain('Products');
    expect(shell.querySelector('h1')?.textContent).toContain('Products');
    expect(shell.textContent).toContain('Product management is under development.');
  });

  it('shows only Customers and Products as feature navigation links and routes', async () => {
    const harness = await RouterTestingHarness.create('/dashboard');
    const shell = harness.routeNativeElement as HTMLElement;
    const links = Array.from(shell.querySelectorAll('#feature-navigation nav a'));

    expect(links).toHaveLength(2);
    expect(links.map((link) => link.querySelector('span')?.textContent?.trim())).toEqual([
      'Customers',
      'Products',
    ]);

    (links[1] as HTMLAnchorElement).click();
    await harness.fixture.whenStable();
    harness.detectChanges();

    expect(TestBed.inject(Router).url).toBe('/products');
    expect(
      shell.querySelector('#feature-navigation a[aria-current="page"] span')?.textContent,
    ).toContain('Products');
  });

  it('hides and restores the page context and action bars independently', async () => {
    const harness = await RouterTestingHarness.create('/customers');
    const shell = harness.routeNativeElement as HTMLElement;

    shell.querySelector<HTMLButtonElement>('.context-hide-toggle')?.click();
    harness.detectChanges();
    shell.querySelector<HTMLButtonElement>('.bar-hide-toggle')?.click();
    harness.detectChanges();

    expect(shell.querySelector('.page-context')).toBeNull();
    expect(shell.querySelector('[aria-label="Show page context bar"]')).not.toBeNull();
    expect(shell.querySelector('.action-bar-shell')).toBeNull();
    expect(shell.querySelector('[aria-label="Show actions"]')).not.toBeNull();
    expect(shell.querySelector('[aria-label="Show page context bar"] svg')).not.toBeNull();

    shell.querySelector<HTMLButtonElement>('[aria-label="Show page context bar"]')?.click();
    harness.detectChanges();
    expect(shell.querySelector('.page-context')).not.toBeNull();
    expect(shell.querySelector('[aria-label="Show actions"]')).not.toBeNull();

    shell.querySelector<HTMLButtonElement>('[aria-label="Show actions"]')?.click();
    harness.detectChanges();
    expect(shell.querySelector('.action-bar-shell')).not.toBeNull();
    expect(shell.querySelector('.bar-hide-toggle svg')).not.toBeNull();
  });

  it('collapses and restores desktop navigation independently of page bars', async () => {
    const harness = await RouterTestingHarness.create('/customers');
    const shell = harness.routeNativeElement as HTMLElement;
    const toggle = shell.querySelector<HTMLButtonElement>('.desktop-navigation-toggle');

    expect(toggle?.getAttribute('aria-expanded')).toBe('true');
    toggle?.click();
    harness.detectChanges();

    expect(toggle?.getAttribute('aria-expanded')).toBe('false');
    expect(shell.querySelector('.layout.navigation-collapsed')).not.toBeNull();
    expect(shell.querySelector('.sidebar-collapsed')).not.toBeNull();
    expect(shell.querySelector('.page-context')).not.toBeNull();
    expect(shell.querySelector('[aria-label="Page actions"]')).not.toBeNull();

    toggle?.click();
    harness.detectChanges();

    expect(toggle?.getAttribute('aria-expanded')).toBe('true');
    expect(shell.querySelector('.layout.navigation-collapsed')).toBeNull();
  });

  it('renders dedicated customer create and edit routes', async () => {
    const harness = await RouterTestingHarness.create('/customers/new');
    let shell = harness.routeNativeElement as HTMLElement;

    expect(shell.querySelector('h1')?.textContent).toContain('Add Customer');
    const breadcrumb = shell.querySelector('[aria-label="Breadcrumb"]') as HTMLElement;
    expect(breadcrumb.textContent).toContain('Home');
    expect(breadcrumb.textContent).toContain('Customers');
    expect(breadcrumb.textContent).toContain('Add New');
    expect(breadcrumb.querySelector('a[href="/customers"]')?.textContent).toContain('Customers');

    breadcrumb.querySelector<HTMLAnchorElement>('a[href="/customers"]')?.click();
    await harness.fixture.whenStable();
    harness.detectChanges();

    expect(TestBed.inject(Router).url).toBe('/customers');
    expect(shell.querySelector('h1')?.textContent).toContain('Customers');

    await harness.navigateByUrl('/customers/customer-1/edit');
    shell = harness.routeNativeElement as HTMLElement;

    expect(shell.querySelector('h1')?.textContent).toContain('Edit Customer');
    expect(shell.querySelector<HTMLInputElement>('#customer-name')?.value).toBe('Alex Morgan');
    expect(shell.querySelector<HTMLInputElement>('#customer-email')?.value).toBe(
      'alex@example.test',
    );
    const editBreadcrumb = shell.querySelector('[aria-label="Breadcrumb"]') as HTMLElement;
    expect(editBreadcrumb.textContent).toContain('Home');
    expect(editBreadcrumb.textContent).toContain('Customers');
    expect(editBreadcrumb.textContent).toContain('Edit');
  });

  it('distinguishes a successful save from a failed customer-list refresh', async () => {
    customerApi.getCustomers.mockReturnValueOnce(throwError(() => new Error('API unavailable')));
    const harness = await RouterTestingHarness.create('/customers/new');
    const shell = harness.routeNativeElement as HTMLElement;
    const name = shell.querySelector<HTMLInputElement>('#customer-name');
    const email = shell.querySelector<HTMLInputElement>('#customer-email');

    name!.value = 'Taylor Chen';
    name!.dispatchEvent(new Event('input'));
    email!.value = 'taylor@example.test';
    email!.dispatchEvent(new Event('input'));
    harness.detectChanges();
    shell.querySelector<HTMLButtonElement>('[aria-label="Page actions"] .primary')?.click();
    await harness.fixture.whenStable();
    await new Promise((resolve) => setTimeout(resolve, 650));
    harness.detectChanges();

    expect(customerApi.createCustomer).toHaveBeenCalledWith(
      {
        name: 'Taylor Chen',
        email: 'taylor@example.test',
      },
      {
        successMessage: 'Customer created successfully.',
        suppressErrorNotification: true,
      },
    );
    expect(TestBed.inject(Router).url).toBe('/customers/new');
    expect(shell.querySelector('dialog[open]')?.textContent).toContain(
      'Would you like to return to the customer list?',
    );

    shell.querySelector<HTMLButtonElement>('.confirm-button')?.click();
    await harness.fixture.whenStable();
    harness.detectChanges();

    expect(TestBed.inject(Router).url).toBe('/customers');
    expect(shell.querySelector('[role="alert"].toast')?.textContent).toContain(
      'customer list could not be refreshed',
    );
    expect(shell.querySelector('.error-state')?.textContent).toContain('Unable to load customers');

    shell.querySelector<HTMLButtonElement>('.error-state button')?.click();
    await harness.fixture.whenStable();
    harness.detectChanges();

    expect(shell.textContent).toContain('Alex Morgan');
    expect(customerApi.getCustomers).toHaveBeenLastCalledWith({
      successMessage: 'Customer list refreshed.',
      suppressErrorNotification: true,
    });
    shell.querySelector<HTMLButtonElement>('.toast button')?.click();
    harness.detectChanges();
    expect(shell.querySelector('.toast')).toBeNull();
  });

  it('clears the create form for another customer when the user declines to return', async () => {
    const harness = await RouterTestingHarness.create('/customers/new');
    const shell = harness.routeNativeElement as HTMLElement;
    const name = shell.querySelector<HTMLInputElement>('#customer-name');
    const email = shell.querySelector<HTMLInputElement>('#customer-email');

    name!.value = 'Taylor Chen';
    name!.dispatchEvent(new Event('input'));
    email!.value = 'taylor@example.test';
    email!.dispatchEvent(new Event('input'));
    harness.detectChanges();
    shell.querySelector<HTMLButtonElement>('[aria-label="Page actions"] .primary')?.click();
    await harness.fixture.whenStable();
    await new Promise((resolve) => setTimeout(resolve, 650));
    harness.detectChanges();

    expect(shell.querySelector('dialog[open]')).not.toBeNull();
    shell.querySelector<HTMLButtonElement>('.cancel-button')?.click();
    await harness.fixture.whenStable();
    harness.detectChanges();

    expect(TestBed.inject(Router).url).toBe('/customers/new');
    expect(shell.querySelector<HTMLInputElement>('#customer-name')?.value).toBe('');
    expect(shell.querySelector<HTMLInputElement>('#customer-email')?.value).toBe('');
    expect(
      shell.querySelector<HTMLButtonElement>('[aria-label="Page actions"] .primary')?.disabled,
    ).toBe(true);
  });

  it('uses the blocking modal for delete confirmation and cancellation', async () => {
    const harness = await RouterTestingHarness.create('/customers');
    const shell = harness.routeNativeElement as HTMLElement;
    const selection = shell.querySelector<HTMLInputElement>('tbody input[type="checkbox"]');
    selection?.click();
    harness.detectChanges();

    shell.querySelector<HTMLButtonElement>('[aria-label="Page actions"] .danger')?.click();
    await harness.fixture.whenStable();
    harness.detectChanges();

    expect(shell.querySelector('dialog[open]')?.textContent).toContain(
      'This customer will be permanently deleted',
    );
    expect(customerApi.deleteCustomers).not.toHaveBeenCalled();
    shell.querySelector<HTMLButtonElement>('.cancel-button')?.click();
    await harness.fixture.whenStable();
    harness.detectChanges();
    expect(customerApi.deleteCustomers).not.toHaveBeenCalled();
    expect(selection?.checked).toBe(true);

    shell.querySelector<HTMLButtonElement>('[aria-label="Page actions"] .danger')?.click();
    await harness.fixture.whenStable();
    shell
      .querySelector('dialog[open]')
      ?.dispatchEvent(new Event('cancel', { bubbles: false, cancelable: true }));
    await harness.fixture.whenStable();
    harness.detectChanges();
    expect(customerApi.deleteCustomers).not.toHaveBeenCalled();
    expect(selection?.checked).toBe(true);

    shell.querySelector<HTMLButtonElement>('[aria-label="Page actions"] .danger')?.click();
    await harness.fixture.whenStable();
    shell.querySelector<HTMLButtonElement>('.confirm-button')?.click();
    await harness.fixture.whenStable();
    harness.detectChanges();

    expect(customerApi.deleteCustomers).toHaveBeenCalledWith(['customer-1'], {
      successMessage: 'Customer deleted successfully.',
      suppressErrorNotification: true,
    });
  });

  it('navigates through the wordmark without a document reload', async () => {
    const harness = await RouterTestingHarness.create('/products');
    const shell = harness.routeNativeElement as HTMLElement;
    const wordmark = shell.querySelector<HTMLAnchorElement>('.brand');

    wordmark?.click();
    await harness.fixture.whenStable();
    harness.detectChanges();

    expect(TestBed.inject(Router).url).toBe('/dashboard');
    expect(shell.querySelector('h1')?.textContent).toContain('Dashboard');
  });

  it('opens and dismisses the compact navigation with Escape', async () => {
    const harness = await RouterTestingHarness.create('/customers');
    const shell = harness.routeNativeElement as HTMLElement;
    const toggle = shell.querySelector<HTMLButtonElement>('.menu-toggle');
    const navigation = shell.querySelector<HTMLElement>('#feature-navigation');

    toggle?.click();
    harness.detectChanges();

    expect(toggle?.getAttribute('aria-expanded')).toBe('true');
    expect(navigation?.classList.contains('mobile-open')).toBe(true);

    toggle?.focus();
    navigation?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    harness.detectChanges();

    expect(toggle?.getAttribute('aria-expanded')).toBe('false');
  });
});
