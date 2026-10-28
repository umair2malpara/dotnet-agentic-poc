import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { WeatherForecast } from '../models/weather-forecast.model';
import { apiUrl } from './api-url';

@Injectable({ providedIn: 'root' })
export class WeatherForecastApiService {
  private readonly http = inject(HttpClient);

  getWeatherForecasts(): Observable<WeatherForecast[]> {
    return this.http.get<WeatherForecast[]>(
      apiUrl('api/weatherforecast'),
      { params: { count: 5 } },
    );
  }
}
