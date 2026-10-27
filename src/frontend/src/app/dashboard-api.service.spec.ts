import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from '../environments/environment';
import { DashboardApiService } from './dashboard-api.service';

describe('DashboardApiService', () => {
  let service: DashboardApiService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        DashboardApiService,
      ],
    });
    service = TestBed.inject(DashboardApiService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('requests five weather forecasts from the configured API', () => {
    service.getWeatherForecasts().subscribe();

    const request = http.expectOne(
      `${environment.apiBaseUrl}/api/weatherforecast?count=5`,
    );
    expect(request.request.method).toBe('GET');
    request.flush([]);
  });

  it('requests customers and products from the configured API', () => {
    service.getCustomers().subscribe();
    service.getProducts().subscribe();

    const customerRequest = http.expectOne(
      `${environment.apiBaseUrl}/api/customers`,
    );
    const productRequest = http.expectOne(
      `${environment.apiBaseUrl}/api/products`,
    );
    expect(customerRequest.request.method).toBe('GET');
    expect(productRequest.request.method).toBe('GET');
    customerRequest.flush([]);
    productRequest.flush([]);
  });
});
