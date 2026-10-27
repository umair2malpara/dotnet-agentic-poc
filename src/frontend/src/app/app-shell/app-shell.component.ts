import { Component, ElementRef, ViewChild, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs';

@Component({
  selector: 'app-shell',
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  styleUrl: './app-shell.component.scss',
  templateUrl: './app-shell.component.html',
})
export class AppShellComponent {
  private readonly router = inject(Router);

  @ViewChild('menuButton') private menuButton?: ElementRef<HTMLButtonElement>;

  protected readonly breadcrumb = signal('Dashboard');
  protected readonly mobileNavigationOpen = signal(false);

  constructor() {
    this.updateBreadcrumb();
    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntilDestroyed(),
      )
      .subscribe(() => this.updateBreadcrumb());
  }

  protected toggleMobileNavigation(): void {
    this.mobileNavigationOpen.update((open) => !open);
  }

  protected closeMobileNavigation(): void {
    if (!this.mobileNavigationOpen()) {
      return;
    }

    this.mobileNavigationOpen.set(false);
    this.menuButton?.nativeElement.focus();
  }

  protected onNavigationKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      event.preventDefault();
      this.closeMobileNavigation();
    }
  }

  protected onPageActivated(): void {
    this.mobileNavigationOpen.set(false);
  }

  private updateBreadcrumb(): void {
    let activeRoute = this.router.routerState.snapshot.root;
    while (activeRoute.firstChild) {
      activeRoute = activeRoute.firstChild;
    }

    const label = activeRoute.data['breadcrumb'];
    this.breadcrumb.set(typeof label === 'string' ? label : 'Dashboard');
  }
}
