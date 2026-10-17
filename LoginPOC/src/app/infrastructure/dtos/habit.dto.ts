export type HabitCodeDTO = 'exercise' | 'programming' | 'finance' | 'duolingo' | 'reading';

export interface HabitDashboardDTO {
  readonly as_of: string;
  readonly habits: readonly {
    readonly habit_code: HabitCodeDTO;
    readonly name: string;
    readonly daily_goal_minutes: number;
  }[];
  readonly logs: readonly {
    readonly habit_code: HabitCodeDTO;
    readonly logged_on: string;
    readonly minutes_spent: number;
    readonly minimum_reached: boolean;
  }[];
}
