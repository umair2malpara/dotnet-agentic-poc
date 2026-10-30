import { Component, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

export interface BreadcrumbItem {
  readonly label: string;
  readonly url: string;
}

export interface PageContext {
  readonly title: string;
  readonly description: string;
}

@Component({
  selector: 'app-page-context',
  imports: [RouterLink],
  templateUrl: './page-context.component.html',
  styleUrl: './page-context.component.scss',
})
export class PageContextComponent {
  readonly breadcrumbs = input.required<readonly BreadcrumbItem[]>();
  readonly context = input.required<PageContext>();
  protected readonly visible = signal(true);
}
