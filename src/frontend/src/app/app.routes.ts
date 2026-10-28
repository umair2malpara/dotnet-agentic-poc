import { Routes } from '@angular/router';
import { AppShellComponent } from './app-shell/app-shell.component';
import { customerRoutes } from './features/customers/customers.routes';
import { dashboardRoutes } from './features/dashboard/dashboard.routes';
import { productRoutes } from './features/products/products.routes';

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
      ...dashboardRoutes,
      ...customerRoutes,
      ...productRoutes,
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
