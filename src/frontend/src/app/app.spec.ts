import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { NEVER, of, throwError } from 'rxjs';
import { vi } from 'vitest';
import { DashboardApiService } from './dashboard-api.service';
import { appRoutes } from './app.routes';

describe('application routing', () => {
  let api: {
    getWeatherForecasts: ReturnType<typeof vi.fn>;
    getCustomers: ReturnType<typeof vi.fn>;
    getProducts: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    api = {
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
      getCustomers: vi.fn(() =>
        of([
          {
            id: 'customer-1',
            name: 'Alex Morgan',
            email: 'alex@example.test',
          },
        ]),
      ),
      getProducts: vi.fn(() => of([{ id: 'product-1', name: 'Starter Kit', price: 24.99 }])),
    };
    TestBed.configureTestingModule({
      providers: [provideRouter(appRoutes), { provide: DashboardApiService, useValue: api }],
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
    expect(shell.querySelector('h1')?.textContent).toContain('Customers');
    expect(shell.textContent).toContain('Customer management is under development.');

    await harness.navigateByUrl('/products');
    expect(shell.querySelector('[aria-label="Breadcrumb"]')?.textContent).toContain('Products');
    expect(shell.querySelector('h1')?.textContent).toContain('Products');
    expect(shell.textContent).toContain('Product management is under development.');

    shell.querySelector<HTMLAnchorElement>('.breadcrumbs a')?.click();
    await harness.fixture.whenStable();
    harness.detectChanges();

    expect(TestBed.inject(Router).url).toBe('/dashboard');
    expect(shell.querySelector('h1')?.textContent).toContain('Dashboard');
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

  it('announces each dataset while it is loading', async () => {
    api.getWeatherForecasts.mockReturnValue(NEVER);
    api.getCustomers.mockReturnValue(NEVER);
    api.getProducts.mockReturnValue(NEVER);

    const harness = await RouterTestingHarness.create('/dashboard');

    expect(harness.routeNativeElement?.querySelectorAll('[role="status"]').length).toBe(3);
  });

  it('shows an independent empty state for successful empty datasets', async () => {
    api.getWeatherForecasts.mockReturnValue(of([]));
    api.getCustomers.mockReturnValue(of([]));
    api.getProducts.mockReturnValue(of([]));

    const harness = await RouterTestingHarness.create('/dashboard');

    expect(harness.routeNativeElement?.textContent).toContain(
      'No forecast data is available right now.',
    );
    expect(harness.routeNativeElement?.textContent).toContain('No customers found.');
    expect(harness.routeNativeElement?.textContent).toContain('No products found.');
    expect(harness.routeNativeElement?.querySelector('[role="alert"]')).toBeNull();
  });

  it('keeps successful datasets visible when another dataset fails and retries only that dataset', async () => {
    api.getProducts.mockReturnValue(throwError(() => new Error('API unavailable')));
    const harness = await RouterTestingHarness.create('/dashboard');
    const root = harness.routeNativeElement as HTMLElement;

    expect(root.textContent).toContain('Alex Morgan');
    expect(root.textContent).toContain('Mild');
    expect(root.querySelector('[role="alert"]')?.textContent).toContain('Unable to load data.');

    root.querySelector<HTMLButtonElement>('app-product-list button')?.click();
    harness.detectChanges();

    expect(api.getProducts).toHaveBeenCalledTimes(2);
    expect(api.getCustomers).toHaveBeenCalledTimes(1);
    expect(api.getWeatherForecasts).toHaveBeenCalledTimes(1);
  });
});
