import {
  DashboardStats,
  HabitDataset,
  HabitDay,
  HabitDayStatus,
  PeriodStats,
} from '../models/habit.model';

const DAY_MS = 86_400_000;

function timestamp(date: string): number {
  return Date.parse(`${date}T00:00:00Z`);
}

function dateKey(time: number): string {
  return new Date(time).toISOString().slice(0, 10);
}

function percent(completed: number, planned: number): number {
  return planned > 0 ? Math.round((completed / planned) * 100) : 0;
}

/** Daily habits are planned every day. Future dates never enter the denominators. */
export function calculateDashboardStats(dataset: HabitDataset): DashboardStats {
  const asOfTime = timestamp(dataset.asOf);
  const asOf = new Date(asOfTime);
  const monthStart = Date.UTC(asOf.getUTCFullYear(), asOf.getUTCMonth(), 1);
  const nextMonth = Date.UTC(asOf.getUTCFullYear(), asOf.getUTCMonth() + 1, 1);
  const weekStart = asOfTime - ((asOf.getUTCDay() + 6) % 7) * DAY_MS;
  const logs = new Map(dataset.logs.map((log) => [`${log.date}:${log.habitId}`, log]));

  function day(time: number): HabitDay {
    const date = dateKey(time);
    const upcoming = time > asOfTime;
    const habits = dataset.habits.map((habit) => {
      const log = upcoming ? undefined : logs.get(`${date}:${habit.id}`);
      return {
        habit,
        minutes: log?.minutes ?? 0,
        minimumReached: log?.minimumReached ?? false,
      };
    });
    const completedActivities = habits.filter((habit) => habit.minimumReached).length;
    const plannedActivities = habits.length;
    const status: HabitDayStatus = upcoming
      ? 'upcoming'
      : plannedActivities > 0 && completedActivities === plannedActivities
        ? 'completed'
        : completedActivities > 0
          ? 'partial'
          : 'pending';

    return {
      date,
      dayOfMonth: new Date(time).getUTCDate(),
      status,
      completedActivities,
      plannedActivities,
      completionPercent: percent(completedActivities, plannedActivities),
      habits,
    };
  }

  function daysBetween(start: number, end: number): HabitDay[] {
    return Array.from({ length: (end - start) / DAY_MS + 1 }, (_, index) =>
      day(start + index * DAY_MS),
    );
  }

  function period(start: number): PeriodStats {
    const days = daysBetween(start, asOfTime);
    const elapsedDays = days.length;
    const completedActivities = days.reduce((total, item) => total + item.completedActivities, 0);
    const plannedActivities = elapsedDays * dataset.habits.length;
    const habits = dataset.habits.map((habit, index) => {
      const completedDays = days.filter((item) => item.habits[index].minimumReached).length;
      return {
        habit,
        completedDays,
        plannedDays: elapsedDays,
        consistencyPercent: percent(completedDays, elapsedDays),
        totalMinutes: days.reduce((total, item) => total + item.habits[index].minutes, 0),
        goalMinutes: habit.dailyGoalMinutes * elapsedDays,
      };
    });

    return {
      startDate: dateKey(start),
      endDate: dataset.asOf,
      elapsedDays,
      completionPercent: percent(completedActivities, plannedActivities),
      completedActivities,
      plannedActivities,
      habits,
      days,
    };
  }

  // An unfinished current day does not break the streak until the day has ended.
  let cursor = day(asOfTime).status === 'completed' ? asOfTime : asOfTime - DAY_MS;
  let currentStreak = 0;
  const recordedDays = new Set(dataset.logs.map((log) => log.date));
  while (recordedDays.has(dateKey(cursor)) && day(cursor).status === 'completed') {
    currentStreak++;
    cursor -= DAY_MS;
  }

  return {
    asOf: dataset.asOf,
    currentStreak,
    week: period(weekStart),
    month: period(monthStart),
    calendar: daysBetween(monthStart, nextMonth - DAY_MS),
  };
}
