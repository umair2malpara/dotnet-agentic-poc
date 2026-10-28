import { Routes } from '@angular/router';

export const dashboardRoutes: Routes = [
  {
    path: 'dashboard',
    data: {
      breadcrumb: 'Dashboard',
      pageTitle: 'Dashboard',
      pageDescription: 'A snapshot of your weather, customers, and products.',
    },
    loadComponent: () =>
      import('./dashboard.component').then((module) => module.DashboardComponent),
  },
];
