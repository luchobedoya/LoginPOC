import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { PeriodStats } from '../../../../domain/models/habit.model';
import { HABIT_APPEARANCE } from '../../dashboard-presentation';
@Component({
  selector: 'app-habit-progress',
  templateUrl: './habit-progress.html',
  styleUrl: './habit-progress.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HabitProgressPanel {
  readonly progress = input.required<PeriodStats>();
  readonly periodLabel = input.required<string>();
  protected readonly habitAppearance = HABIT_APPEARANCE;
  protected formatMinutes(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const remainder = minutes % 60;
    return hours ? `${hours} h${remainder ? ` ${remainder} min` : ''}` : `${remainder} min`;
  }

  protected timeProgress(minutes: number, goal: number): number {
    return goal > 0 ? Math.min(100, Math.round((minutes / goal) * 100)) : 0;
  }
}
