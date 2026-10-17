import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { Subject } from 'rxjs';

import { AuthSessionGateway } from '../../domain/gateways/auth-session.gateway';
import { DashboardStats } from '../../domain/models/habit.model';
import { calculateDashboardStats } from '../../domain/services/dashboard-stats';
import { GetDashboardStatsUseCase } from '../../domain/use-cases/get-dashboard-stats.use-case';
import { HABIT_MOCK_DATA } from '../../infrastructure/driver-adapters/habit-mock.data';
import { AuthSessionAdapter } from '../../infrastructure/driver-adapters/auth-session.adapter';
import { toHabitDataset } from '../../utils/mappers/habit.mapper';
import { DashboardInitial } from './dashboard-initial';

describe('DashboardInitial', () => {
  let fixture: ComponentFixture<DashboardInitial>;
  let element: HTMLElement;
  let useCase: jasmine.SpyObj<GetDashboardStatsUseCase>;
  let response$: Subject<DashboardStats>;
  const stats = calculateDashboardStats(toHabitDataset(HABIT_MOCK_DATA));

  beforeEach(async () => {
    response$ = new Subject<DashboardStats>();
    useCase = jasmine.createSpyObj<GetDashboardStatsUseCase>('GetDashboardStatsUseCase', [
      'execute',
    ]);
    useCase.execute.and.returnValue(response$);
    await TestBed.configureTestingModule({
      imports: [DashboardInitial],
      providers: [
        provideZonelessChangeDetection(),
        provideRouter([]),
        { provide: AuthSessionGateway, useExisting: AuthSessionAdapter },
        { provide: GetDashboardStatsUseCase, useValue: useCase },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(DashboardInitial);
    element = fixture.nativeElement as HTMLElement;
    await fixture.whenStable();
  });

  async function receiveStats(): Promise<void> {
    response$.next(stats);
    await fixture.whenStable();
  }

  it('should request statistics once and show a loading state', () => {
    expect(useCase.execute).toHaveBeenCalledTimes(1);
    expect(element.querySelector('[role="status"]')?.textContent).toContain(
      'Preparando tu progreso',
    );
    expect(element.querySelectorAll('.summary-grid')).toHaveSize(0);
  });

  it('should render the five habits, three metrics, time bars and complete calendar', async () => {
    await receiveStats();
    expect(element.querySelectorAll('app-summary-card')).toHaveSize(3);
    expect(element.querySelector('.streak .metric-value')?.textContent).toMatch(/2\s*días/);
    expect(element.querySelector('.activities .metric-value')?.textContent).toContain('/ 30');
    expect(element.querySelectorAll('.donut')).toHaveSize(5);
    expect(element.querySelectorAll('[role="progressbar"]')).toHaveSize(5);
    expect(element.querySelectorAll('.calendar-day')).toHaveSize(31);
    expect(element.querySelectorAll('[role="status"]')).toHaveSize(0);
  });

  it('should update the metrics and goals when switching to the month view', async () => {
    await receiveStats();
    const month = element.querySelectorAll<HTMLButtonElement>('.period-control button')[1];
    month.click();
    await fixture.whenStable();

    expect(month.getAttribute('aria-pressed')).toBe('true');
    expect(element.querySelector('.activities .metric-value')?.textContent).toContain('/ 85');
    expect(element.querySelector('.habit-donut p')?.textContent).toContain('de 17 días');
    expect(element.querySelector('.time-footnote')?.textContent).toContain('17 días');
    expect(useCase.execute).toHaveBeenCalledTimes(1);
  });

  it('should select a completed or future day and show its actual habit details', async () => {
    await receiveStats();
    const completedDay = element.querySelector<HTMLButtonElement>('.calendar-day.completed')!;
    completedDay.click();
    await fixture.whenStable();

    expect(completedDay.getAttribute('aria-pressed')).toBe('true');
    expect(element.querySelectorAll('.habit-check.done')).toHaveSize(5);

    const futureDay = element.querySelector<HTMLButtonElement>('.calendar-day.upcoming')!;
    futureDay.click();
    await fixture.whenStable();

    expect(futureDay.getAttribute('aria-pressed')).toBe('true');
    expect(completedDay.getAttribute('aria-pressed')).toBe('false');
    expect(element.querySelectorAll('.habit-check.done')).toHaveSize(0);
    expect(element.querySelector('.day-note')?.textContent).toContain('Una nueva oportunidad');
  });

  it('should display an error and successfully retry the request', async () => {
    response$.error(new Error('Network unavailable'));
    await fixture.whenStable();
    expect(element.querySelector('[role="alert"]')?.textContent).toContain('No pudimos cargar');

    response$ = new Subject<DashboardStats>();
    useCase.execute.and.returnValue(response$);
    element.querySelector<HTMLButtonElement>('.action-button')!.click();
    await fixture.whenStable();
    expect(useCase.execute).toHaveBeenCalledTimes(2);
    await receiveStats();
    expect(element.querySelectorAll('[role="alert"]')).toHaveSize(0);
    expect(element.querySelector('.summary-grid')).not.toBeNull();
  });

  it('should report an empty response instead of leaving the loading state active', async () => {
    response$.complete();
    await fixture.whenStable();
    expect(element.querySelector('[role="alert"]')?.textContent).toContain(
      'No hay datos disponibles',
    );
  });

  it('should close the mobile menu after navigating to a dashboard section', async () => {
    const toggle = element.querySelector<HTMLButtonElement>('.menu-toggle')!;
    toggle.click();
    await fixture.whenStable();
    expect(toggle.getAttribute('aria-expanded')).toBe('true');

    const link = element.querySelector<HTMLAnchorElement>('.sidebar-nav a[href="#calendar"]')!;
    link.addEventListener('click', (event) => event.preventDefault());
    link.click();
    await fixture.whenStable();

    expect(toggle.getAttribute('aria-expanded')).toBe('false');
    expect(link.getAttribute('aria-current')).toBe('location');
  });

  it('should unsubscribe when destroyed during loading', () => {
    expect(response$.observed).toBeTrue();
    fixture.destroy();
    expect(response$.observed).toBeFalse();
  });

  it('should clear the session before returning to login from the sidebar', () => {
    const clear = spyOn(TestBed.inject(AuthSessionGateway), 'clear').and.callThrough();
    const navigate = spyOn(TestBed.inject(Router), 'navigateByUrl').and.resolveTo(true);
    const button = element.querySelector<HTMLButtonElement>('.logout-button')!;

    expect(button.textContent).toContain('Cerrar sesión');
    button.click();

    expect(clear).toHaveBeenCalledTimes(1);
    expect(navigate).toHaveBeenCalledOnceWith('/');
    expect(clear).toHaveBeenCalledBefore(navigate);
  });
});
