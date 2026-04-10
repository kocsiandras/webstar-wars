import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthApiService } from '../../../services/auth/auth-api.service';
import { AuthStoreService } from '../../../services/auth/auth-store.service';
import { WebstarButtonComponent } from '../../../shared/components/webstar-button/webstar-button.component';
import { handleHttpError } from '../../../shared/utils/http-error.utils';

interface ILoginForm {
  username: string;
  password: string;
}

@Component({
  selector: 'app-login',
  imports: [WebstarButtonComponent, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  loginForm = new FormGroup<{ [K in keyof ILoginForm]: FormControl<ILoginForm[K]> }>({
    username: new FormControl<string>('', { nonNullable: true, validators: Validators.required }),
    password: new FormControl<string>('', { nonNullable: true, validators: Validators.required }),
  });

  errorMessage = signal<string | null>(null);

  private readonly authApiService = inject(AuthApiService);
  private readonly authStoreService = inject(AuthStoreService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  submit(): void {
    if (!this.loginForm.valid) return;

    this.errorMessage.set(null);

    this.authApiService.login(this.loginForm.value as ILoginForm)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.errorMessage.set(null);
          this.authStoreService.storeTokens(response);
          this.authStoreService.setIsLoggedIn(true);
          this.router.navigate(['/character-selector']);
        },
        error: (error: unknown) => {
          const serverMessage = handleHttpError(error, {
            returnServerMessageFor500: true,
          });
          if (serverMessage !== undefined) {
            this.errorMessage.set(serverMessage);
          }
        },
      });
  }
}
