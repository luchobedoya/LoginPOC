import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { defer, finalize, take } from 'rxjs';

import { DashboardPeriod, DashboardStats } from '../../domain/models/habit.model';
import { GetDashboardStatsUseCase } from '../../domain/use-cases/get-dashboard-stats.use-case';

import { DashboardSidebar } from './components/dashboard-sidebar/dashboard-sidebar';
import { HabitCalendar } from './components/habit-calendar/habit-calendar';
import { HabitProgressPanel } from './components/habit-progress/habit-progress';
import { SummaryCard } from './components/summary-card/summary-card';

@Component({
  selector: 'app-dashboard-initial',
  imports: [DashboardSidebar, HabitCalendar, HabitProgressPanel, SummaryCard],
  templateUrl: './dashboard-initial.html',
  styleUrl: './dashboard-initial.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardInitial implements OnInit {
  private readonly useCase = inject(GetDashboardStatsUseCase);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly stats = signal<DashboardStats | null>(null);
  protected readonly loading = signal(false);
  protected readonly error = signal('');
  protected readonly period = signal<DashboardPeriod>('week');
  protected readonly mobileMenuOpen = signal(false);
  protected readonly currentPeriod = computed(() => this.stats()?.[this.period()] ?? null);
  protected readonly periodLabel = computed(() =>
    this.period() === 'week' ? 'Esta semana' : 'Este mes',
  );
  protected readonly summaryCards = computed(() => {
    const stats = this.stats();
    const period = this.currentPeriod();
    if (!stats || !period) return [];

    return [
      {
        id: 'completion',
        title: 'Cumplimiento',
        value: `${period.completionPercent}`,
        unit: '%',
        detail: `Semana ${stats.week.completionPercent}% · Mes ${stats.month.completionPercent}%`,
        footer: 'Cada pequeño paso cuenta',
        path: this.chartPath(
          period.days.map((day) => day.completionPercent),
          100,
        ),
      },
      {
        id: 'streak',
        title: 'Racha actual',
        value: `${stats.currentStreak}`,
        unit: 'días',
        detail: 'Con los cinco mínimos alcanzados',
        footer: 'Tu constancia hace la diferencia',
        path: this.chartPath(
          period.days.map((day) => (day.status === 'completed' ? 1 : 0)),
          1,
        ),
      },
      {
        id: 'activities',
        title: 'Actividades completadas',
        value: `${period.completedActivities}`,
        unit: `/ ${period.plannedActivities}`,
        detail: `${period.elapsedDays} días · ${period.habits.length} hábitos diarios`,
        footer: `${period.plannedActivities - period.completedActivities} actividades por completar`,
        path: this.chartPath(
          period.days.map((day) => day.completedActivities),
          Math.max(1, period.habits.length),
        ),
      },
    ];
  });

  ngOnInit(): void {
    this.loadStats();
  }

  protected loadStats(): void {
    if (this.loading()) return;
    this.loading.set(true);
    this.error.set('');

    defer(() => this.useCase.execute())
      .pipe(
        take(1),
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.loading.set(false)),
      )
      .subscribe({
        next: (stats) => {
          this.stats.set(stats);
        },
        error: () => this.error.set('No pudimos cargar tus hábitos. Inténtalo de nuevo.'),
        complete: () => {
          if (!this.stats()) this.error.set('No hay datos disponibles. Inténtalo de nuevo.');
        },
      });
  }

  protected toggleMenu(): void {
    this.mobileMenuOpen.update((open) => !open);
  }

  protected formatDate(date: string, options: Intl.DateTimeFormatOptions = {}): string {
    return new Intl.DateTimeFormat('es-CO', {
      day: 'numeric',
      month: 'short',
      ...options,
      timeZone: 'UTC',
    }).format(new Date(`${date}T00:00:00Z`));
  }

  private chartPath(values: readonly number[], max: number): string {
    return values
      .map((value, index) => {
        const x = 8 + (index / Math.max(1, values.length - 1)) * 284;
        const y = 84 - (value / max) * 65;
        return `${index ? 'L' : 'M'}${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(' ');
  }
}
