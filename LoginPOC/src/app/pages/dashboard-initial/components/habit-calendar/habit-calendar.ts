import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';
import { DashboardStats } from '../../../../domain/models/habit.model';
import { HABIT_APPEARANCE, STATUS_LABELS } from '../../dashboard-presentation';
@Component({
  selector: 'app-habit-calendar',
  templateUrl: './habit-calendar.html',
  styleUrl: './habit-calendar.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HabitCalendar {
  readonly stats = input.required<DashboardStats>();
  private readonly dateSelection = signal<string | null>(null);
  protected readonly selectedDate = computed(() => this.dateSelection() ?? this.stats().asOf);
  protected readonly selectedDay = computed(() =>
    this.stats().calendar.find((day) => day.date === this.selectedDate()),
  );
  protected readonly weekdays = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
  protected readonly habitAppearance = HABIT_APPEARANCE;
  protected readonly statusLabels = STATUS_LABELS;
  protected readonly monthLabel = computed(() =>
    this.formatDate(this.stats().asOf, { day: undefined, month: 'long', year: 'numeric' }),
  );
  protected readonly calendarPadding = computed(() => {
    const first = this.stats().calendar[0];
    const count = first ? (new Date(`${first.date}T00:00:00Z`).getUTCDay() + 6) % 7 : 0;
    return Array.from({ length: count }, (_, index) => index);
  });
  protected selectDay(date: string): void {
    this.dateSelection.set(date);
  }
  protected formatDate(date: string, options: Intl.DateTimeFormatOptions = {}): string {
    return new Intl.DateTimeFormat('es-CO', {
      day: 'numeric',
      month: 'short',
      ...options,
      timeZone: 'UTC',
    }).format(new Date(`${date}T00:00:00Z`));
  }
}
