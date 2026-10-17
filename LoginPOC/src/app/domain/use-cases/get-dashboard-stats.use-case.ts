import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { HabitGateway } from '../gateways/habit.gateway';
import { DashboardStats } from '../models/habit.model';

@Injectable()
export class GetDashboardStatsUseCase {
  private readonly habitGateway = inject(HabitGateway);

  execute(): Observable<DashboardStats> {
    return this.habitGateway.getDashboardStats();
  }
}
