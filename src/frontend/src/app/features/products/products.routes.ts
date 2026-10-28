import { Routes } from '@angular/router';

export const productRoutes: Routes = [
  {
    path: 'products',
    data: {
      breadcrumb: 'Products',
      pageTitle: 'Products',
      pageDescription: 'Product management is under development.',
    },
    loadComponent: () => import('./products.component').then((module) => module.ProductsComponent),
  },
];
