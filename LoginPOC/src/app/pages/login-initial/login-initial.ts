import { Component, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

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
  protected readonly isSubmitting = signal(false);
  protected readonly showPassword = signal(false);
  protected readonly submitted = signal(false);

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
    this.submitted.set(true);

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    const { username, password, rememberMe } = this.loginForm.getRawValue();

    setTimeout(() => {
      alert(JSON.stringify({ username, password, rememberMe }, null, 2));
      this.isSubmitting.set(false);
    });
  }
}
