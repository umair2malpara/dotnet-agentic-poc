import { Component, input, output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { FeatureNavigationItem } from './feature-navigation.config';

@Component({
  selector: 'app-feature-navigation',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './feature-navigation.component.html',
  styleUrl: './feature-navigation.component.scss',
})
export class FeatureNavigationComponent {
  readonly items = input.required<readonly FeatureNavigationItem[]>();
  readonly mobileNavigationOpen = input.required<boolean>();
  readonly closeMobileNavigation = output<void>();
}
