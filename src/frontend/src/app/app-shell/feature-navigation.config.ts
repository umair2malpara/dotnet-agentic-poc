export interface FeatureNavigationItem {
  readonly label: string;
  readonly route: string;
  readonly exact: boolean;
}

export const FEATURE_NAVIGATION_ITEMS: readonly FeatureNavigationItem[] = [
  { label: 'Customers', route: '/customers', exact: false },
  { label: 'Products', route: '/products', exact: true },
];
