import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { Subject } from 'rxjs';

import { AuthSessionGateway } from '../../domain/gateways/auth-session.gateway';
import { User } from '../../domain/models/auth.model';
import { LoginUseCase } from '../../domain/use-cases/login.use-case';
import { LoginInitial } from './login-initial';

describe('LoginInitial', () => {
  let fixture: ComponentFixture<LoginInitial>;
  let element: HTMLElement;
  let useCase: jasmine.SpyObj<LoginUseCase>;
  let session: jasmine.SpyObj<AuthSessionGateway>;
  let router: Router;
  let response$: Subject<User>;

  const user: User = {
    id: 'user-1',
    username: 'demo',
    displayName: 'Demo User',
    email: 'demo@example.com',
  };

  function input(selector: string, value: string): void {
    const control = element.querySelector<HTMLInputElement>(selector)!;
    control.value = value;
    control.dispatchEvent(new Event('input', { bubbles: true }));
  }

  function fillValidForm(): void {
    input('#username', 'demo');
    input('#password', 'Login123!');
  }

  function submit(): void {
    element
      .querySelector('form')!
      .dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
  }

  function submitButton(): HTMLButtonElement {
    return element.querySelector<HTMLButtonElement>('button[type="submit"]')!;
  }

  beforeEach(async () => {
    response$ = new Subject<User>();
    useCase = jasmine.createSpyObj<LoginUseCase>('LoginUseCase', ['execute']);
    useCase.execute.and.returnValue(response$);
    session = jasmine.createSpyObj<AuthSessionGateway>('AuthSessionGateway', [
      'establish',
      'clear',
    ]);

    await TestBed.configureTestingModule({
      imports: [LoginInitial],
      providers: [
        provideZonelessChangeDetection(),
        provideRouter([]),
        { provide: LoginUseCase, useValue: useCase },
        { provide: AuthSessionGateway, useValue: session },
      ],
    }).compileComponents();

    router = TestBed.inject(Router);
    spyOn(router, 'navigateByUrl').and.resolveTo(true);

    fixture = TestBed.createComponent(LoginInitial);
    element = fixture.nativeElement as HTMLElement;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should show validation errors without calling the use case for an invalid form', async () => {
    submit();
    await fixture.whenStable();

    expect(useCase.execute).not.toHaveBeenCalled();
    expect(element.querySelector('#username-error')?.textContent).toContain(
      'Username is required.',
    );
    expect(element.querySelector('#password-error')?.textContent).toContain(
      'Password is required.',
    );
    expect(submitButton().disabled).toBeFalse();
  });

  it('should forward form values and prevent duplicate submissions while pending', async () => {
    fillValidForm();
    const rememberMe = element.querySelector<HTMLInputElement>('#rememberMe')!;
    rememberMe.checked = true;
    rememberMe.dispatchEvent(new Event('change', { bubbles: true }));

    submit();
    submit();
    await fixture.whenStable();

    expect(useCase.execute).toHaveBeenCalledOnceWith({
      username: 'demo',
      password: 'Login123!',
      rememberMe: true,
    });
    expect(submitButton().disabled).toBeTrue();
    expect(submitButton().textContent).toContain('Logging in...');
  });

  it('should store the session and open the dashboard after receiving a user', async () => {
    fillValidForm();
    submit();
    response$.next(user);
    await fixture.whenStable();

    expect(session.establish).toHaveBeenCalledOnceWith(user, false);
    expect(router.navigateByUrl).toHaveBeenCalledOnceWith('/dashboard');
    expect(element.querySelector('.alert-danger')).toBeNull();
    expect(submitButton().disabled).toBeTrue();
    expect(response$.observed).toBeFalse();
  });

  it('should remember the session when remember me is checked', async () => {
    fillValidForm();
    const rememberMe = element.querySelector<HTMLInputElement>('#rememberMe')!;
    rememberMe.checked = true;
    rememberMe.dispatchEvent(new Event('change', { bubbles: true }));

    submit();
    response$.next(user);
    await fixture.whenStable();

    expect(session.establish).toHaveBeenCalledOnceWith(user, true);
  });

  it('should stay on the login page when the dashboard cannot be opened', async () => {
    (router.navigateByUrl as jasmine.Spy).and.resolveTo(false);
    fillValidForm();
    submit();
    response$.next(user);
    await fixture.whenStable();

    expect(element.querySelector('.alert-danger')?.textContent).toContain(
      'Unable to open the dashboard. Please try again.',
    );
    expect(submitButton().disabled).toBeFalse();
  });

  it('should render the login error and allow a retry that clears it', async () => {
    fillValidForm();
    submit();
    response$.error(new Error('Invalid username or password.'));
    await fixture.whenStable();

    expect(element.querySelector('.alert-danger')?.textContent).toContain(
      'Invalid username or password.',
    );
    expect(submitButton().disabled).toBeFalse();

    response$ = new Subject<User>();
    useCase.execute.and.returnValue(response$);
    submit();
    await fixture.whenStable();

    expect(useCase.execute).toHaveBeenCalledTimes(2);
    expect(element.querySelector('.alert-danger')).toBeNull();
    expect(submitButton().disabled).toBeTrue();

    response$.next(user);
    await fixture.whenStable();
    expect(router.navigateByUrl).toHaveBeenCalledOnceWith('/dashboard');
  });

  it('should ignore another submit while the dashboard is opening', async () => {
    fillValidForm();
    submit();
    response$.next(user);
    await fixture.whenStable();

    submit();

    expect(useCase.execute).toHaveBeenCalledTimes(1);
  });

  it('should show a fallback message for an unknown error', async () => {
    fillValidForm();
    submit();
    response$.error('unexpected failure');
    await fixture.whenStable();

    expect(element.querySelector('.alert-danger')?.textContent).toContain(
      'Unable to log in. Please try again.',
    );
    expect(submitButton().disabled).toBeFalse();
  });

  it('should reset the pending state even if the use case throws synchronously', async () => {
    useCase.execute.and.throwError('Login unavailable.');
    fillValidForm();
    submit();
    await fixture.whenStable();

    expect(element.querySelector('.alert-danger')?.textContent).toContain('Login unavailable.');
    expect(submitButton().disabled).toBeFalse();
  });

  it('should reset the pending state if the observable completes without a user', async () => {
    fillValidForm();
    submit();
    response$.complete();
    await fixture.whenStable();

    expect(submitButton().disabled).toBeFalse();
    expect(element.querySelector('.alert-success')).toBeNull();
  });

  it('should unsubscribe from a pending login when the component is destroyed', () => {
    fillValidForm();
    submit();
    expect(response$.observed).toBeTrue();

    fixture.destroy();

    expect(response$.observed).toBeFalse();
  });
});
