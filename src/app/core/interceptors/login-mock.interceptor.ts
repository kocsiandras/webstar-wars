import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { delay, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ILoginResponse } from '../interfaces/auth.interface';

/** Short-circuits login POST when `environment.mockLogin` is true (local dev). */
export const loginMockInterceptor: HttpInterceptorFn = (req, next) => {
  if (!environment.mockLogin) {
    return next(req);
  }

  const loginUrl = `${environment.baseUrl}frontend-felveteli/v2/authentication/`;
  if (req.method !== 'POST' || req.url !== loginUrl) {
    return next(req);
  }

  const body: ILoginResponse = {
    token: 'mock-access-token',
    refreshToken: 'mock-refresh-token',
    user: {
      email: 'mock@example.com',
      firstName: 'Mock',
      lastName: 'User',
    },
  };

  return of(new HttpResponse({ status: 200, body })).pipe(delay(400));
};
