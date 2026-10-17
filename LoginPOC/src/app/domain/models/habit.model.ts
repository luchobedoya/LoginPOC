export type HabitId = 'exercise' | 'programming' | 'finance' | 'duolingo' | 'reading';
export type DashboardPeriod = 'week' | 'month';
export type HabitDayStatus = 'completed' | 'partial' | 'pending' | 'upcoming';

export interface Habit {
  readonly id: HabitId;
  readonly name: string;
  readonly dailyGoalMinutes: number;
}

export interface HabitLog {
  readonly habitId: HabitId;
  /** Calendar date in YYYY-MM-DD format, without a time zone. */
  readonly date: string;
  readonly minutes: number;
  readonly minimumReached: boolean;
}

export interface HabitDataset {
  readonly asOf: string;
  readonly habits: readonly Habit[];
  readonly logs: readonly HabitLog[];
}

export interface HabitProgress {
  readonly habit: Habit;
  readonly completedDays: number;
  readonly plannedDays: number;
  readonly consistencyPercent: number;
  readonly totalMinutes: number;
  readonly goalMinutes: number;
}

export interface DailyHabitProgress {
  readonly habit: Habit;
  readonly minutes: number;
  readonly minimumReached: boolean;
}

export interface HabitDay {
  readonly date: string;
  readonly dayOfMonth: number;
  readonly status: HabitDayStatus;
  readonly completedActivities: number;
  readonly plannedActivities: number;
  readonly completionPercent: number;
  readonly habits: readonly DailyHabitProgress[];
}

export interface PeriodStats {
  readonly startDate: string;
  readonly endDate: string;
  readonly elapsedDays: number;
  readonly completionPercent: number;
  readonly completedActivities: number;
  readonly plannedActivities: number;
  readonly habits: readonly HabitProgress[];
  readonly days: readonly HabitDay[];
}

export interface DashboardStats {
  readonly asOf: string;
  readonly currentStreak: number;
  readonly week: PeriodStats;
  readonly month: PeriodStats;
  readonly calendar: readonly HabitDay[];
}
