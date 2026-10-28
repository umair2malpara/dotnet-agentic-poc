import { Component, input, output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Customer } from '../../core/models/customer.model';
import { DatasetState } from '../../core/models/dataset-state.model';
import { DatasetStatusComponent } from '../dataset-status/dataset-status.component';

@Component({
  selector: 'app-customer-list',
  imports: [DatasetStatusComponent, MatIconModule],
  templateUrl: './customer-list.component.html',
  styleUrl: './customer-list.component.scss',
})
export class CustomerListComponent {
  readonly state = input.required<DatasetState<Customer>>();
  readonly retry = output<void>();

  protected initials(name: string): string {
    return name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0].toUpperCase())
      .join('');
  }
}
