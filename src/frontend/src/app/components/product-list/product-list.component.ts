import { CurrencyPipe } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { DatasetState } from '../../core/models/dataset-state.model';
import { Product } from '../../core/models/product.model';
import { DatasetStatusComponent } from '../dataset-status/dataset-status.component';

@Component({
  selector: 'app-product-list',
  imports: [CurrencyPipe, DatasetStatusComponent, MatIconModule],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss',
})
export class ProductListComponent {
  readonly state = input.required<DatasetState<Product>>();
  readonly retry = output<void>();
}
