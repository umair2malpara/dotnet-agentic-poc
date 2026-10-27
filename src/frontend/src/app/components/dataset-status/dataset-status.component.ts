import { Component, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-dataset-status',
  imports: [MatButtonModule, MatIconModule, MatProgressSpinnerModule],
  templateUrl: './dataset-status.component.html',
  styleUrl: './dataset-status.component.scss',
})
export class DatasetStatusComponent {
  readonly status = input.required<'loading' | 'error'>();
  readonly loadingMessage = input.required<string>();
  readonly errorMessage = input.required<string>();
  readonly compact = input(false);
  readonly retry = output<void>();
}
