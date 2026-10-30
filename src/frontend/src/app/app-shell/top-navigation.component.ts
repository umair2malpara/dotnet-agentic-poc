import { Component, ElementRef, effect, input, output, viewChild } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-top-navigation',
  imports: [RouterLink],
  templateUrl: './top-navigation.component.html',
  styleUrl: './top-navigation.component.scss',
})
export class TopNavigationComponent {
  readonly mobileNavigationOpen = input.required<boolean>();
  readonly desktopNavigationCollapsed = input.required<boolean>();
  readonly mobileNavigationToggle = output<void>();
  readonly desktopNavigationToggle = output<void>();
  readonly closeMobileNavigation = output<void>();

  private readonly menuButton = viewChild<ElementRef<HTMLButtonElement>>('menuButton');
  private wasMobileNavigationOpen = false;

  constructor() {
    effect(() => {
      const isOpen = this.mobileNavigationOpen();
      if (this.wasMobileNavigationOpen && !isOpen) {
        this.menuButton()?.nativeElement.focus();
      }
      this.wasMobileNavigationOpen = isOpen;
    });
  }
}
