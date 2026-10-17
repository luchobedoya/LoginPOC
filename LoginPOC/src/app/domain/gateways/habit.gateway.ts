import { Observable } from 'rxjs';

import { DashboardStats } from '../models/habit.model';

export abstract class HabitGateway {
  abstract getDashboardStats(): Observable<DashboardStats>;
}
