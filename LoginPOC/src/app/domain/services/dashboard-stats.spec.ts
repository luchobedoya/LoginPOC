import { Habit, HabitDataset, HabitLog } from '../models/habit.model';
import { calculateDashboardStats } from './dashboard-stats';

describe('calculateDashboardStats', () => {
  const habits: readonly Habit[] = [
    { id: 'exercise', name: 'Ejercicio', dailyGoalMinutes: 10 },
    { id: 'reading', name: 'Lectura', dailyGoalMinutes: 20 },
  ];
  const logs: readonly HabitLog[] = [
    { habitId: 'exercise', date: '2026-10-05', minutes: 15, minimumReached: true },
    { habitId: 'reading', date: '2026-10-05', minutes: 20, minimumReached: true },
    { habitId: 'exercise', date: '2026-10-06', minutes: 5, minimumReached: false },
    { habitId: 'reading', date: '2026-10-06', minutes: 25, minimumReached: true },
  ];
  const dataset: HabitDataset = { asOf: '2026-10-07', habits, logs };

  function completeDay(date: string): HabitLog[] {
    return habits.map((habit) => ({
      habitId: habit.id,
      date,
      minutes: habit.dailyGoalMinutes,
      minimumReached: true,
    }));
  }

  it('should calculate completion and time goals through the cutoff, starting weeks on Monday', () => {
    const stats = calculateDashboardStats(dataset);

    expect(stats.week.startDate).toBe('2026-10-05');
    expect(stats.week.elapsedDays).toBe(3);
    expect(stats.week.completedActivities).toBe(3);
    expect(stats.week.plannedActivities).toBe(6);
    expect(stats.week.completionPercent).toBe(50);
    expect(stats.month.elapsedDays).toBe(7);
    expect(stats.month.plannedActivities).toBe(14);
    expect(stats.month.completionPercent).toBe(21);
    expect(stats.week.habits[0]).toEqual({
      habit: habits[0],
      completedDays: 1,
      plannedDays: 3,
      consistencyPercent: 33,
      totalMinutes: 20,
      goalMinutes: 30,
    });
    expect(stats.week.habits[1].totalMinutes).toBe(45);
  });

  it('should distinguish completed, partial, pending and future dates', () => {
    const calendar = calculateDashboardStats(dataset).calendar;

    expect(calendar).toHaveSize(31);
    expect(calendar[4].status).toBe('completed');
    expect(calendar[5].status).toBe('partial');
    expect(calendar[6].status).toBe('pending');
    expect(calendar[7].status).toBe('upcoming');
    expect(calendar[6].habits[0].minutes).toBe(0);
    expect(calendar[6].habits[0].minimumReached).toBeFalse();
  });

  it('should preserve a streak through yesterday when today is unfinished', () => {
    const stats = calculateDashboardStats({
      ...dataset,
      logs: [...completeDay('2026-10-05'), ...completeDay('2026-10-06')],
    });
    expect(stats.currentStreak).toBe(2);
  });

  it('should include today when all daily minimums were reached', () => {
    const stats = calculateDashboardStats({
      ...dataset,
      logs: [
        ...completeDay('2026-10-05'),
        ...completeDay('2026-10-06'),
        ...completeDay('2026-10-07'),
      ],
    });
    expect(stats.currentStreak).toBe(3);
  });

  it('should break the streak on a missing or incomplete day', () => {
    expect(calculateDashboardStats(dataset).currentStreak).toBe(0);
    expect(
      calculateDashboardStats({ ...dataset, logs: completeDay('2026-10-05') }).currentStreak,
    ).toBe(0);
  });

  it('should handle weeks and streaks that span different months', () => {
    const stats = calculateDashboardStats({
      asOf: '2026-11-01',
      habits,
      logs: [...completeDay('2026-10-31'), ...completeDay('2026-11-01')],
    });
    expect(stats.week.startDate).toBe('2026-10-26');
    expect(stats.week.completedActivities).toBe(4);
    expect(stats.week.plannedActivities).toBe(14);
    expect(stats.month.completedActivities).toBe(2);
    expect(stats.month.plannedActivities).toBe(2);
    expect(stats.month.completionPercent).toBe(100);
    expect(stats.currentStreak).toBe(2);
    expect(stats.calendar).toHaveSize(30);
  });

  it('should include leap days and ignore future or unknown-habit records', () => {
    const stats = calculateDashboardStats({
      asOf: '2024-02-28',
      habits,
      logs: [
        ...completeDay('2024-02-29'),
        { habitId: 'finance', date: '2024-02-28', minutes: 90, minimumReached: true },
      ],
    });
    expect(stats.calendar).toHaveSize(29);
    expect(stats.calendar[28].status).toBe('upcoming');
    expect(stats.calendar[28].completedActivities).toBe(0);
    expect(stats.month.completedActivities).toBe(0);
    expect(stats.month.habits[0].totalMinutes).toBe(0);
  });

  it('should return zero completion and streak for an empty plan', () => {
    const stats = calculateDashboardStats({ ...dataset, habits: [], logs: [] });
    expect(stats.week.completionPercent).toBe(0);
    expect(stats.month.completionPercent).toBe(0);
    expect(stats.currentStreak).toBe(0);
    expect(stats.week.plannedActivities).toBe(0);
  });
});
