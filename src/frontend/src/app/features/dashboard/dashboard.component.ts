import { Component, inject, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Observable } from 'rxjs';
import { Customer, DatasetState, Product, WeatherForecast } from '../../api.models';
import {
  CustomerListComponent,
  DashboardStatCardComponent,
  ProductListComponent,
  WeatherForecastComponent,
} from '../../components';
import { DashboardApiService } from '../../dashboard-api.service';

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
  private readonly api = inject(DashboardApiService);
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

  protected loadWeather(): void {
    this.loadDataset(this.api.getWeatherForecasts(), this.weather);
  }

  protected loadCustomers(): void {
    this.loadDataset(this.api.getCustomers(), this.customers);
  }

  protected loadProducts(): void {
    this.loadDataset(this.api.getProducts(), this.products);
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
