import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthApiService } from '../../../services/auth/auth-api.service';
import { AuthStoreService } from '../../../services/auth/auth-store.service';
import { WebstarButtonComponent } from '../../../shared/components/webstar-button/webstar-button.component';

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

  private readonly authApiService = inject(AuthApiService);
  private readonly authStoreService = inject(AuthStoreService);
  private readonly destroyRef = inject(DestroyRef);

  loginForm = new FormGroup<{ [K in keyof ILoginForm]: FormControl<ILoginForm[K]> }>({
    username: new FormControl<string>('', { nonNullable: true, validators: Validators.required }),
    password: new FormControl<string>('', { nonNullable: true, validators: Validators.required }),
  });

  submit(): void {
    if (!this.loginForm.valid) return;

    this.authApiService.login(this.loginForm.value as ILoginForm)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.authStoreService.storeTokens(response);
          this.authStoreService.setIsLoggedIn(true);
        },
        error: (error) => {
          console.error(error);
        }
      })
  }
}
