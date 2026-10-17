import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { defer, take } from 'rxjs';

import { AuthSessionGateway } from '../../domain/gateways/auth-session.gateway';
import { LoginUseCase } from '../../domain/use-cases/login.use-case';

interface LoginFormControls {
  username: FormControl<string>;
  password: FormControl<string>;
  rememberMe: FormControl<boolean>;
}

type LoginField = 'username' | 'password';

@Component({
  selector: 'app-login-initial',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login-initial.html',
  styleUrl: './login-initial.scss',
})
export class LoginInitial {
  private readonly loginUseCase = inject(LoginUseCase);
  private readonly session = inject(AuthSessionGateway);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly isSubmitting = signal(false);
  protected readonly showPassword = signal(false);
  protected readonly submitted = signal(false);
  protected readonly loginError = signal('');

  protected readonly loginForm = new FormGroup<LoginFormControls>({
    username: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(32),
        Validators.pattern(/^[A-Za-z0-9._-]+$/),
      ],
    }),
    password: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d).+$/),
      ],
    }),
    rememberMe: new FormControl(false, { nonNullable: true }),
  });

  private readonly errorCopy: Record<LoginField, Record<string, string>> = {
    username: {
      required: 'Username is required.',
      minlength: 'Username must be at least 3 characters.',
      maxlength: 'Username must be at most 32 characters.',
      pattern: 'Use letters, numbers, dots, hyphens or underscores.',
    },
    password: {
      required: 'Password is required.',
      minlength: 'Password must be at least 8 characters.',
      pattern: 'Include at least one letter and one number.',
    },
  };

  protected togglePassword(): void {
    this.showPassword.update((visible) => !visible);
  }

  protected goBack(): void {
    history.back();
  }

  protected showError(field: LoginField): boolean {
    const control = this.loginForm.controls[field];
    return control.invalid && (control.touched || this.submitted());
  }

  protected errorMessage(field: LoginField): string {
    const errors = this.loginForm.controls[field].errors;
    if (!errors) {
      return '';
    }

    const priority = ['required', 'minlength', 'maxlength', 'pattern'];
    const key = priority.find((name) => errors[name]);
    return (key && this.errorCopy[field][key]) || 'Invalid value.';
  }

  protected onSubmit(): void {
    if (this.isSubmitting()) {
      return;
    }

    this.submitted.set(true);
    this.loginError.set('');

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    const credentials = this.loginForm.getRawValue();
    let authenticated = false;

    defer(() => this.loginUseCase.execute(credentials))
      .pipe(take(1), takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (user) => {
          authenticated = true;
          this.session.establish(user, credentials.rememberMe);
          void this.router.navigateByUrl('/dashboard').then((navigated) => {
            if (navigated) {
              return;
            }

            this.isSubmitting.set(false);
            this.loginError.set('Unable to open the dashboard. Please try again.');
          });
        },
        error: (error: unknown) => {
          this.isSubmitting.set(false);
          this.loginError.set(
            error instanceof Error ? error.message : 'Unable to log in. Please try again.',
          );
        },
        complete: () => {
          if (!authenticated) {
            this.isSubmitting.set(false);
          }
        },
      });
  }
}
