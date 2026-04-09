import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, CanActivateFn, GuardResult, MaybeAsync, Router, RouterStateSnapshot } from "@angular/router";
import { AuthStoreService } from "../../services/auth/auth-store.service";


export const noAuthGuard: CanActivateFn = () => {
    const authService = inject(AuthStoreService);
    const router = inject(Router);
  
    return !authService.isLoggedIn()
      ? true
      : router.createUrlTree(['/dashboard']);
  };