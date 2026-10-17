import { Injectable } from '@angular/core';
import { Observable, map, timer } from 'rxjs';

import { HabitGateway } from '../../domain/gateways/habit.gateway';
import { DashboardStats } from '../../domain/models/habit.model';
import { calculateDashboardStats } from '../../domain/services/dashboard-stats';
import { toHabitDataset } from '../../utils/mappers/habit.mapper';
import { HABIT_MOCK_DATA } from './habit-mock.data';

@Injectable({ providedIn: 'root' })
export class HabitMockAdapter implements HabitGateway {
  getDashboardStats(): Observable<DashboardStats> {
    return timer(650).pipe(map(() => calculateDashboardStats(toHabitDataset(HABIT_MOCK_DATA))));
  }
}
