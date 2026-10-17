import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { TestScheduler } from 'rxjs/testing';

import { DashboardStats } from '../../domain/models/habit.model';
import { HabitMockAdapter } from './habit-mock.adapter';

describe('HabitMockAdapter', () => {
  let adapter: HabitMockAdapter;
  let scheduler: TestScheduler;
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] });
    adapter = TestBed.inject(HabitMockAdapter);
    scheduler = new TestScheduler((actual, expected) => expect(actual).toEqual(expected));
  });

  it('should delay the response, return five habits and complete after 650 ms', () => {
    scheduler.run(({ flush }) => {
      const next = jasmine.createSpy('next');
      const complete = jasmine.createSpy('complete');
      adapter.getDashboardStats().subscribe({ next, complete });
      scheduler.schedule(() => expect(next).not.toHaveBeenCalled(), 649);
      flush();

      expect(next).toHaveBeenCalledTimes(1);
      expect(complete).toHaveBeenCalledTimes(1);
      const stats: DashboardStats = next.calls.mostRecent().args[0];
      expect(stats.asOf).toBe('2026-10-17');
      expect(stats.currentStreak).toBe(2);
      expect(stats.week.habits.map((item) => item.habit.id)).toEqual([
        'exercise',
        'programming',
        'finance',
        'duolingo',
        'reading',
      ]);
      expect(stats.week.plannedActivities).toBe(30);
      expect(stats.month.plannedActivities).toBe(85);
      expect(stats.calendar).toHaveSize(31);
    });
  });

  it('should cancel the delayed response on unsubscription', () => {
    scheduler.run(({ expectObservable }) => {
      expectObservable(adapter.getDashboardStats(), '100ms !').toBe('');
    });
  });
});
