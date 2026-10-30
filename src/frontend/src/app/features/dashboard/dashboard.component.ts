import { Component, inject, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Observable } from 'rxjs';
import { Customer } from '../../core/models/customer.model';
import { DatasetState } from '../../core/models/dataset-state.model';
import { Product } from '../../core/models/product.model';
import { WeatherForecast } from '../../core/models/weather-forecast.model';
import {
  CustomerListComponent,
  DashboardStatCardComponent,
  ProductListComponent,
  WeatherForecastComponent,
} from '../../components';
import { CustomerApiService } from '../../core/services/customer-api.service';
import { ProductApiService } from '../../core/services/product-api.service';
import { WeatherForecastApiService } from '../../core/services/weather-forecast-api.service';

@Component({
  selector: 'app-dashboard',
  imports: [
    CustomerListComponent,
    DashboardStatCardComponent,
    MatIconModule,
    ProductListComponent,
    WeatherForecastComponent,
  ],
  styleUrl: './dashboard.component.scss',
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent {
  private readonly customerApi = inject(CustomerApiService);
  private readonly productApi = inject(ProductApiService);
  private readonly weatherApi = inject(WeatherForecastApiService);
  protected readonly today = new Intl.DateTimeFormat('en', {
    dateStyle: 'full',
  }).format(new Date());
  protected readonly weather = signal<DatasetState<WeatherForecast>>({
    status: 'loading',
  });
  protected readonly customers = signal<DatasetState<Customer>>({
    status: 'loading',
  });
  protected readonly products = signal<DatasetState<Product>>({
    status: 'loading',
  });

  constructor() {
    this.loadWeather();
    this.loadCustomers();
    this.loadProducts();
  }

  protected loadWeather(explicitRefresh = false): void {
    this.loadDataset(
      this.weatherApi.getWeatherForecasts({
        successMessage: explicitRefresh ? 'Weather forecast refreshed.' : undefined,
        suppressErrorNotification: true,
      }),
      this.weather,
    );
  }

  protected loadCustomers(explicitRefresh = false): void {
    this.loadDataset(
      this.customerApi.getCustomers({
        successMessage: explicitRefresh ? 'Customer data refreshed.' : undefined,
        suppressErrorNotification: true,
      }),
      this.customers,
    );
  }

  protected loadProducts(explicitRefresh = false): void {
    this.loadDataset(
      this.productApi.getProducts({
        successMessage: explicitRefresh ? 'Product data refreshed.' : undefined,
        suppressErrorNotification: true,
      }),
      this.products,
    );
  }

  protected count<T>(state: DatasetState<T>): string {
    return state.status === 'success' ? String(state.data.length) : '—';
  }

  private loadDataset<T>(
    request: Observable<T[]>,
    state: ReturnType<typeof signal<DatasetState<T>>>,
  ): void {
    state.set({ status: 'loading' });
    request.subscribe({
      next: (data) => state.set({ status: 'success', data }),
      error: () =>
        state.set({
          status: 'error',
          message: 'Unable to load data. Check the API connection and try again.',
        }),
    });
  }
}
