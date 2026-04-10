import { HttpErrorResponse } from '@angular/common/http';

export function getHttpServerErrorMessage(error: HttpErrorResponse): string {
  const body = error.error;
  if (typeof body === 'string' && body.trim()) {
    return body;
  }
  if (body && typeof body === 'object' && 'message' in body) {
    const m = (body as { message?: unknown }).message;
    if (typeof m === 'string' && m.trim()) {
      return m;
    }
  }
  return error.statusText || 'A szerver hibát jelzett. Próbáld újra később.';
}

export function isHttp500(error: unknown): error is HttpErrorResponse {
  return error instanceof HttpErrorResponse && error.status === 500;
}

export interface HandleHttpErrorOptions {
  /**
   * When `true`, HTTP **500** returns {@link getHttpServerErrorMessage} and does **not** log.
   * Use the return value for inline UI. Omit or `false` to only log 500s like any other error path.
   */
  returnServerMessageFor500?: boolean;
}

/**
 * Handles a failed HTTP call: for 500 either logs or returns the parsed message; for other HTTP errors
 * logs the same body-based message as {@link getHttpServerErrorMessage}
 *
 * @returns The server message string **only** when `returnServerMessageFor500` is `true` and status is 500; otherwise `undefined`.
 */
export function handleHttpError(
  error: unknown,
  options?: HandleHttpErrorOptions,
): string | undefined {
  if (isHttp500(error)) {
    const message = getHttpServerErrorMessage(error);
    if (options?.returnServerMessageFor500) {
      return message;
    }
    console.error(message);
    return undefined;
  }
  console.error(
    error instanceof HttpErrorResponse
      ? getHttpServerErrorMessage(error)
      : String(error),
  );
  return undefined;
}
