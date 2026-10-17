import { HabitDataset } from '../../domain/models/habit.model';
import { HabitDashboardDTO } from '../../infrastructure/dtos/habit.dto';

export function toHabitDataset(dto: HabitDashboardDTO): HabitDataset {
  return {
    asOf: dto.as_of,
    habits: dto.habits.map((habit) => ({
      id: habit.habit_code,
      name: habit.name,
      dailyGoalMinutes: habit.daily_goal_minutes,
    })),
    logs: dto.logs.map((log) => ({
      habitId: log.habit_code,
      date: log.logged_on,
      minutes: log.minutes_spent,
      minimumReached: log.minimum_reached,
    })),
  };
}
