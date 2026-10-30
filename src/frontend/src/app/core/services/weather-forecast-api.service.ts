import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { apiRequestContext, ApiRequestOptions } from '../http/api-request-options';
import { WeatherForecast } from '../models/weather-forecast.model';
import { apiUrl } from './api-url';

@Injectable({ providedIn: 'root' })
export class WeatherForecastApiService {
  private readonly http = inject(HttpClient);

  getWeatherForecasts(options?: ApiRequestOptions): Observable<WeatherForecast[]> {
    return this.http.get<WeatherForecast[]>(apiUrl('api/weatherforecast'), {
      params: { count: 5 },
      context: apiRequestContext(options),
    });
  }
}
