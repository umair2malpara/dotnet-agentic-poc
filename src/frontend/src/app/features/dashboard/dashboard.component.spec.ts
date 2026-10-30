import { TestBed } from '@angular/core/testing';
import { NEVER, of, throwError } from 'rxjs';
import { vi } from 'vitest';
import { CustomerApiService } from '../../core/services/customer-api.service';
import { ProductApiService } from '../../core/services/product-api.service';
import { WeatherForecastApiService } from '../../core/services/weather-forecast-api.service';
import { DashboardComponent } from './dashboard.component';

describe('DashboardComponent', () => {
  function configureDashboard(
    customers = of([{ id: 'customer-1', name: 'Alex Morgan', email: 'alex@example.test' }]),
    products = of([{ id: 'product-1', name: 'Starter Kit', price: 24.99 }]),
    weather = of([
      {
        date: '2026-10-27',
        temperatureC: 18,
        temperatureF: 64,
        summary: 'Mild',
      },
    ]),
  ) {
    const customerApi = { getCustomers: vi.fn(() => customers) };
    const productApi = { getProducts: vi.fn(() => products) };
    const weatherApi = { getWeatherForecasts: vi.fn(() => weather) };

    TestBed.configureTestingModule({
      imports: [DashboardComponent],
      providers: [
        { provide: CustomerApiService, useValue: customerApi },
        { provide: ProductApiService, useValue: productApi },
        { provide: WeatherForecastApiService, useValue: weatherApi },
      ],
    });

    return {
      fixture: TestBed.createComponent(DashboardComponent),
      customerApi,
      productApi,
      weatherApi,
    };
  }

  it('loads customer, product, and five weather forecasts from resource services', () => {
    const { fixture, customerApi, productApi, weatherApi } = configureDashboard();
    fixture.detectChanges();

    expect(customerApi.getCustomers).toHaveBeenCalledOnce();
    expect(productApi.getProducts).toHaveBeenCalledOnce();
    expect(weatherApi.getWeatherForecasts).toHaveBeenCalledOnce();
    expect(customerApi.getCustomers).toHaveBeenCalledWith({
      successMessage: undefined,
      suppressErrorNotification: true,
    });
    expect(fixture.nativeElement.textContent).toContain('Alex Morgan');
    expect(fixture.nativeElement.textContent).toContain('Starter Kit');
    expect(fixture.nativeElement.textContent).toContain('Mild');
  });

  it('announces loading state for each dataset independently', () => {
    const { fixture } = configureDashboard(NEVER, NEVER, NEVER);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelectorAll('[role="status"]')).toHaveLength(3);
  });

  it('shows an independent empty state for successful empty datasets', () => {
    const emptyFixture = configureDashboard(of([]), of([]), of([])).fixture;
    emptyFixture.detectChanges();
    expect(emptyFixture.nativeElement.textContent).toContain(
      'No forecast data is available right now.',
    );
    expect(emptyFixture.nativeElement.textContent).toContain('No customers found.');
    expect(emptyFixture.nativeElement.textContent).toContain('No products found.');
  });

  it('keeps other datasets visible when one request fails and retries only that dataset', () => {
    const products = vi
      .fn()
      .mockReturnValueOnce(throwError(() => new Error('API unavailable')))
      .mockReturnValue(of([{ id: 'product-1', name: 'Starter Kit', price: 24.99 }]));
    const customerApi = {
      getCustomers: vi.fn(() =>
        of([{ id: 'customer-1', name: 'Alex Morgan', email: 'alex@example.test' }]),
      ),
    };
    const weatherApi = {
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
      imports: [DashboardComponent],
      providers: [
        { provide: CustomerApiService, useValue: customerApi },
        { provide: ProductApiService, useValue: { getProducts: products } },
        { provide: WeatherForecastApiService, useValue: weatherApi },
      ],
    });
    const fixture = TestBed.createComponent(DashboardComponent);
    fixture.detectChanges();
    const root = fixture.nativeElement as HTMLElement;

    expect(root.textContent).toContain('Alex Morgan');
    expect(root.textContent).toContain('Mild');
    expect(root.querySelector('[role="alert"]')?.textContent).toContain('Unable to load data.');

    root.querySelector<HTMLButtonElement>('app-product-list button')?.click();
    fixture.detectChanges();

    expect(products).toHaveBeenCalledTimes(2);
    expect(products).toHaveBeenLastCalledWith({
      successMessage: 'Product data refreshed.',
      suppressErrorNotification: true,
    });
    expect(customerApi.getCustomers).toHaveBeenCalledOnce();
    expect(weatherApi.getWeatherForecasts).toHaveBeenCalledOnce();
  });
});
