import { DatePipe } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { DatasetState, WeatherForecast } from '../../api.models';
import { DatasetStatusComponent } from '../dataset-status/dataset-status.component';

@Component({
  selector: 'app-weather-forecast',
  imports: [
    DatePipe,
    DatasetStatusComponent,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
  ],
  templateUrl: './weather-forecast.component.html',
  styleUrl: './weather-forecast.component.scss',
})
export class WeatherForecastComponent {
  readonly state = input.required<DatasetState<WeatherForecast>>();
  readonly retry = output<void>();
}
