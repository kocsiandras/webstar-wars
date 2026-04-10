import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { AuthStoreService } from "../../services/auth/auth-store.service";


export const authGuard: CanActivateFn = () => {

    const authService = inject(AuthStoreService);
    const router = inject(Router);

    return authService.isLoggedIn()
        ? true
        : router.createUrlTree(['/auth/login']);
}