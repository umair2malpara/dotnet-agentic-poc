import { Component, input, signal } from '@angular/core';

export interface ActionBarAction {
  readonly id: string;
  readonly label: string;
  readonly variant: 'primary' | 'secondary' | 'danger';
  readonly disabled: boolean;
  readonly busy?: boolean;
  readonly type?: 'button' | 'submit';
  readonly form?: string;
  readonly onClick?: () => void;
}

@Component({
  selector: 'app-action-bar',
  templateUrl: './action-bar.component.html',
  styleUrl: './action-bar.component.scss',
})
export class ActionBarComponent {
  readonly actions = input.required<readonly ActionBarAction[]>();
  protected readonly visible = signal(true);

  protected hide(): void {
    this.visible.set(false);
  }

  protected show(): void {
    this.visible.set(true);
  }
}
