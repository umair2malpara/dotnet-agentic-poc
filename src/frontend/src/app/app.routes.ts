import { Routes } from '@angular/router';
import { AppShellComponent } from './app-shell/app-shell.component';

export const appRoutes: Routes = [
  {
    path: '',
    component: AppShellComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard',
      },
      {
        path: 'dashboard',
        data: { breadcrumb: 'Dashboard' },
        loadComponent: () =>
          import('./features/dashboard/dashboard.component').then(
            (module) => module.DashboardComponent,
          ),
      },
      {
        path: 'customers',
        data: { breadcrumb: 'Customers' },
        loadComponent: () =>
          import('./features/customers/customers.component').then(
            (module) => module.CustomersComponent,
          ),
      },
      {
        path: 'products',
        data: { breadcrumb: 'Products' },
        loadComponent: () =>
          import('./features/products/products.component').then(
            (module) => module.ProductsComponent,
          ),
      },
      {
        path: '**',
        redirectTo: 'dashboard',
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'dashboard',
  },
];
