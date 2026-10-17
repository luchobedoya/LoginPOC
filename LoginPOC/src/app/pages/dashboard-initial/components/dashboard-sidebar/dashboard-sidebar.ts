import { ChangeDetectionStrategy, Component, inject, input, output, signal } from '@angular/core';
import { Router } from '@angular/router';

import { AuthSessionGateway } from '../../../../domain/gateways/auth-session.gateway';

@Component({
  selector: 'app-dashboard-sidebar',
  templateUrl: './dashboard-sidebar.html',
  styleUrl: './dashboard-sidebar.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardSidebar {
  private readonly session = inject(AuthSessionGateway);
  private readonly router = inject(Router);

  readonly open = input(false);
  readonly navigated = output<void>();
  protected readonly activeSection = signal('overview');
  protected readonly navigation = [
    {
      id: 'overview',
      label: 'Dashboard',
      icon: 'M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z',
    },
    {
      id: 'time-targets',
      label: 'Target',
      icon: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10M12 1v4M12 19v4M1 12h4M19 12h4',
    },
    { id: 'consistency', label: 'Charts', icon: 'M4 20V10M12 20V4M20 20v-7' },
    { id: 'calendar', label: 'Calendar', icon: 'M4 5h16v16H4zM8 2v6M16 2v6M4 11h16' },
  ];

  protected selectSection(id: string): void {
    this.activeSection.set(id);
    this.navigated.emit();
  }

  protected logout(): void {
    this.session.clear();
    this.navigated.emit();
    void this.router.navigateByUrl('/');
  }
}
