import { HabitDayStatus, HabitId } from '../../domain/models/habit.model';

export const HABIT_APPEARANCE: Record<HabitId, { color: string; symbol: string }> = {
  exercise: { color: '#40e0be', symbol: '↗' },
  programming: { color: '#b891ff', symbol: '</>' },
  finance: { color: '#ffb763', symbol: '$' },
  duolingo: { color: '#c5e87a', symbol: 'D' },
  reading: { color: '#f28bc4', symbol: '▤' },
};
export const STATUS_LABELS: Record<HabitDayStatus, string> = {
  completed: 'Cumplido',
  partial: 'En progreso',
  pending: 'Pendiente',
  upcoming: 'Próximo',
};
