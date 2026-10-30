import { Component, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs';
import { ConfirmationDialogComponent } from '../shared/components/confirmation-dialog/confirmation-dialog.component';
import { NotificationService } from '../core/services/notification.service';
import { FeatureNavigationComponent } from './feature-navigation.component';
import { FEATURE_NAVIGATION_ITEMS } from './feature-navigation.config';
import { BreadcrumbItem, PageContext, PageContextComponent } from './page-context.component';
import { TopNavigationComponent } from './top-navigation.component';

@Component({
  selector: 'app-shell',
  imports: [
    ConfirmationDialogComponent,
    FeatureNavigationComponent,
    PageContextComponent,
    RouterOutlet,
    TopNavigationComponent,
  ],
  styleUrl: './app-shell.component.scss',
  templateUrl: './app-shell.component.html',
})
export class AppShellComponent {
  private readonly router = inject(Router);
  protected readonly notifications = inject(NotificationService);

  protected readonly featureNavigationItems = FEATURE_NAVIGATION_ITEMS;
  protected readonly breadcrumbs = signal<BreadcrumbItem[]>([]);
  protected readonly pageContext = signal<PageContext>({
    title: 'Dashboard',
    description: 'A snapshot of your weather, customers, and products.',
  });
  protected readonly mobileNavigationOpen = signal(false);
  protected readonly desktopNavigationCollapsed = signal(false);

  constructor() {
    this.updateBreadcrumbs();
    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntilDestroyed(),
      )
      .subscribe(() => this.updateBreadcrumbs());
  }

  protected toggleMobileNavigation(): void {
    this.mobileNavigationOpen.update((open) => !open);
  }

  protected toggleDesktopNavigation(): void {
    this.desktopNavigationCollapsed.update((collapsed) => !collapsed);
  }

  protected closeMobileNavigation(): void {
    this.mobileNavigationOpen.set(false);
  }

  protected onPageActivated(): void {
    this.mobileNavigationOpen.set(false);
  }

  private updateBreadcrumbs(): void {
    const items: BreadcrumbItem[] = [];
    const segments: string[] = [];
    let title: string | null = null;
    let description: string | null = null;
    let activeRoute = this.router.routerState.snapshot.root;

    while (activeRoute) {
      segments.push(...activeRoute.url.map((segment) => segment.path));
      const label = activeRoute.data['breadcrumb'];
      const routeTitle = activeRoute.data['pageTitle'];
      const routeDescription = activeRoute.data['pageDescription'];
      if (typeof routeTitle === 'string') {
        title = routeTitle;
      }
      if (typeof routeDescription === 'string') {
        description = routeDescription;
      }
      if (typeof label === 'string') {
        const url = `/${segments.join('/')}`;
        const lastItem = items.at(-1);
        if (lastItem?.label !== label || lastItem.url !== url) {
          items.push({ label, url });
        }
      }

      if (!activeRoute.firstChild) {
        break;
      }
      activeRoute = activeRoute.firstChild;
    }

    this.breadcrumbs.set(items);
    this.pageContext.set({
      title: title ?? items.at(-1)?.label ?? 'Home',
      description: description ?? '',
    });
  }
}
