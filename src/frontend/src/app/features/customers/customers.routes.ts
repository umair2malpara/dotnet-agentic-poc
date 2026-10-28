import { Routes } from '@angular/router';

export const customerRoutes: Routes = [
  {
    path: 'customers',
    data: {
      breadcrumb: 'Customers',
      pageTitle: 'Customers',
      pageDescription: 'View and manage customer contact details.',
    },
    children: [
      {
        path: '',
        pathMatch: 'full',
        loadComponent: () =>
          import('./customers.component').then((module) => module.CustomersComponent),
      },
      {
        path: 'new',
        data: {
          breadcrumb: 'Add New',
          pageTitle: 'Add Customer',
          pageDescription: 'Enter the new customer contact details.',
        },
        loadComponent: () =>
          import('./customer-form.component').then((module) => module.CustomerFormComponent),
      },
      {
        path: ':id/edit',
        data: {
          breadcrumb: 'Edit',
          pageTitle: 'Edit Customer',
          pageDescription: 'Update customer contact details.',
        },
        loadComponent: () =>
          import('./customer-form.component').then((module) => module.CustomerFormComponent),
      },
    ],
  },
];
