import { HttpErrorResponse, HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, map, throwError } from 'rxjs';
import { ApiProblemDetails, ApiResponse } from '../models/api-response.model';
import { NotificationService } from '../services/notification.service';
import { API_REQUEST_OPTIONS } from '../http/api-request-options';

export const apiResponseInterceptor: HttpInterceptorFn = (request, next) => {
  const notifications = inject(NotificationService);
  const options = request.context.get(API_REQUEST_OPTIONS);

  return next(request).pipe(
    map((event) => {
      if (!(event instanceof HttpResponse) || !isApiRequest(request.url)) {
        return event;
      }

      if (!isApiResponse<unknown>(event.body)) {
        throw new HttpErrorResponse({
          error: 'The API returned an invalid success response.',
          status: event.status,
          statusText: 'Invalid API response',
          url: event.url ?? request.url,
        });
      }

      if (options.successMessage) {
        notifications.showSuccess(options.successMessage);
      }

      return event.clone({ body: event.body.data });
    }),
    catchError((error: unknown) => {
      if (
        isApiRequest(request.url) &&
        error instanceof HttpErrorResponse &&
        !options.suppressErrorNotification
      ) {
        notifications.showError(getProblemMessage(error));
      }

      return throwError(() => error);
    }),
  );
};

function isApiResponse<T>(value: unknown): value is ApiResponse<T> {
  return typeof value === 'object' && value !== null && Object.hasOwn(value, 'data');
}

function isApiRequest(url: string): boolean {
  try {
    return new URL(url, 'http://localhost').pathname.split('/').includes('api');
  } catch {
    return false;
  }
}

function getProblemMessage(error: HttpErrorResponse): string {
  const problem = error.error as ApiProblemDetails | null;
  if (typeof problem?.detail === 'string' && problem.detail.trim()) {
    return problem.detail;
  }
  if (typeof problem?.title === 'string' && problem.title.trim()) {
    return problem.title;
  }
  return error.status === 0
    ? 'Unable to connect to the API. Check the connection and try again.'
    : 'The request could not be completed. Please try again.';
}
