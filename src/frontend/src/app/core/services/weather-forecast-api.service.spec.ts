import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from '../../../environments/environment';
import { WeatherForecastApiService } from './weather-forecast-api.service';

describe('WeatherForecastApiService', () => {
  let service: WeatherForecastApiService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        WeatherForecastApiService,
      ],
    });
    service = TestBed.inject(WeatherForecastApiService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('requests five weather forecasts from the configured API', () => {
    service.getWeatherForecasts().subscribe();

    const request = http.expectOne(
      `${environment.apiBaseUrl.replace(/\/+$/, '')}/api/weatherforecast?count=5`,
    );
    expect(request.request.method).toBe('GET');
    request.flush([]);
  });
});
