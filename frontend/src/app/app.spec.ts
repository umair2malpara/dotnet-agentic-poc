import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { of } from 'rxjs';
import { DashboardApiService } from './dashboard-api.service';
import { appRoutes } from './app.routes';

describe('application routing', () => {
  const api = {
    getWeatherForecasts: () =>
      of([
        {
          date: '2026-10-27',
          temperatureC: 18,
          temperatureF: 64,
          summary: 'Mild',
        },
      ]),
    getCustomers: () =>
      of([
        {
          id: 'customer-1',
          name: 'Alex Morgan',
          email: 'alex@example.test',
        },
      ]),
    getProducts: () =>
      of([{ id: 'product-1', name: 'Starter Kit', price: 24.99 }]),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter(appRoutes),
        { provide: DashboardApiService, useValue: api },
      ],
    });
  });

  it('redirects the default URL to the dashboard route', async () => {
    const harness = await RouterTestingHarness.create('/');

    expect(harness.routeNativeElement?.querySelector('h1')?.textContent).toContain(
      'Dashboard',
    );
    expect(harness.routeNativeElement?.textContent).toContain('Alex Morgan');
    expect(harness.routeNativeElement?.textContent).toContain('Starter Kit');
    expect(harness.routeNativeElement?.textContent).toContain('Mild');
  });

  it('redirects unknown URLs to the dashboard route', async () => {
    const harness = await RouterTestingHarness.create('/not-a-page');

    expect(harness.routeNativeElement?.querySelector('h1')?.textContent).toContain(
      'Dashboard',
    );
  });
});
