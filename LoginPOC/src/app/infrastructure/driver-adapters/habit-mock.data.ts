import { HabitDashboardDTO } from '../dtos/habit.dto';

const habits: HabitDashboardDTO['habits'] = [
  { habit_code: 'exercise', name: 'Ejercicio', daily_goal_minutes: 30 },
  { habit_code: 'programming', name: 'Programación', daily_goal_minutes: 60 },
  { habit_code: 'finance', name: 'Finanzas', daily_goal_minutes: 30 },
  { habit_code: 'duolingo', name: 'Duolingo', daily_goal_minutes: 15 },
  { habit_code: 'reading', name: 'Lectura', daily_goal_minutes: 20 },
];

// Fixed demo snapshot: identical data on the server and during hydration.
export const HABIT_MOCK_DATA: HabitDashboardDTO = {
  as_of: '2026-10-17',
  habits,
  logs: Array.from({ length: 47 }, (_, dayIndex) => {
    const date = new Date(Date.UTC(2026, 8, dayIndex + 1)).toISOString().slice(0, 10);
    return habits.map((habit, habitIndex) => {
      const ratio =
        dayIndex === 44 || dayIndex === 45
          ? 1.2
          : dayIndex === 46
            ? [1.1, 1.2, 0, 1, 0.5][habitIndex]
            : (dayIndex + habitIndex * 3) % 11 < 3
              ? 0.4
              : 1 + ((dayIndex + habitIndex) % 4) * 0.15;
      const minutes = Math.round(habit.daily_goal_minutes * ratio);
      return {
        habit_code: habit.habit_code,
        logged_on: date,
        minutes_spent: minutes,
        minimum_reached: minutes >= habit.daily_goal_minutes,
      };
    });
  }).flat(),
};
