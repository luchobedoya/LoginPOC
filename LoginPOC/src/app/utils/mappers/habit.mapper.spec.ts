import { HabitDashboardDTO } from '../../infrastructure/dtos/habit.dto';
import { toHabitDataset } from './habit.mapper';

describe('toHabitDataset', () => {
  it('should translate DTO fields without mutating the source', () => {
    const dto: HabitDashboardDTO = Object.freeze({
      as_of: '2026-10-17',
      habits: Object.freeze([
        Object.freeze({ habit_code: 'reading' as const, name: 'Lectura', daily_goal_minutes: 20 }),
      ]),
      logs: Object.freeze([
        Object.freeze({
          habit_code: 'reading' as const,
          logged_on: '2026-10-17',
          minutes_spent: 10,
          minimum_reached: false,
        }),
      ]),
    });
    const dataset = toHabitDataset(dto);

    expect(dataset).toEqual({
      asOf: '2026-10-17',
      habits: [{ id: 'reading', name: 'Lectura', dailyGoalMinutes: 20 }],
      logs: [{ habitId: 'reading', date: '2026-10-17', minutes: 10, minimumReached: false }],
    });
    expect(Object.is(dataset.habits, dto.habits)).toBeFalse();
    expect(Object.is(dataset.logs, dto.logs)).toBeFalse();
  });

  it('should support a response without habits or logs', () => {
    expect(toHabitDataset({ as_of: '2026-10-17', habits: [], logs: [] })).toEqual({
      asOf: '2026-10-17',
      habits: [],
      logs: [],
    });
  });
});
