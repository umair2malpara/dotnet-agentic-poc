import { Component, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-dashboard-stat-card',
  imports: [MatCardModule, MatIconModule],
  templateUrl: './dashboard-stat-card.component.html',
  styleUrl: './dashboard-stat-card.component.scss',
})
export class DashboardStatCardComponent {
  readonly label = input.required<string>();
  readonly icon = input.required<string>();
  readonly value = input.required<string>();
  readonly tone = input<'weather' | 'customers' | 'products'>('weather');
}
