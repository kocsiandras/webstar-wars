import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { delay, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ILoginResponse } from '../interfaces/auth.interface';
import { ICharacter, ISimulationResponse } from '../interfaces/character.interface';
import dummyCharactersFile from '../../shared/dummy/dummy-characters.json';

/** Short-circuits selected HTTP calls when backend is unavailable (local dev). */
export const apiMockInterceptor: HttpInterceptorFn = (req, next) => {
  const loginResponse = tryMockLogin(req);
  if (loginResponse) {
    return loginResponse;
  }

  const charactersResponse = tryMockCharacters(req);
  if (charactersResponse) {
    return charactersResponse;
  }

  const simulateResponse = tryMockSimulate(req);
  if (simulateResponse) {
    return simulateResponse;
  }

  return next(req);
};

function tryMockLogin(req: Parameters<HttpInterceptorFn>[0]) {
  if (!environment.mockLogin) {
    return null;
  }

  const loginUrl = `${environment.baseUrl}authentication/`;
  if (req.method !== 'POST' || req.url !== loginUrl) {
    return null;
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
}

function tryMockCharacters(req: Parameters<HttpInterceptorFn>[0]) {
  if (!environment.mockCharacters) {
    return null;
  }

  const charactersUrl = `${environment.baseUrl}characters/`;
  if (req.method !== 'GET' || req.url !== charactersUrl) {
    return null;
  }

  const body = dummyCharactersFile.characters as ICharacter[];

  return of(new HttpResponse({ status: 200, body })).pipe(delay(400));
}

function tryMockSimulate(req: Parameters<HttpInterceptorFn>[0]) {
  if (!environment.mockSimulate) {
    return null;
  }

  const simulateUrl = `${environment.baseUrl}simulate/`;
  if (req.method !== 'POST' || req.url !== simulateUrl) {
    return null;
  }

  const body: ISimulationResponse = {
    simulationId: `mock-simulation-${Date.now()}`,
  };

  return of(new HttpResponse({ status: 200, body })).pipe(delay(400));
}
