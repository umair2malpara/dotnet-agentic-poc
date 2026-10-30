import { HttpContext, HttpContextToken } from '@angular/common/http';

export interface ApiRequestOptions {
  readonly successMessage?: string;
  readonly suppressErrorNotification?: boolean;
}

export const API_REQUEST_OPTIONS = new HttpContextToken<ApiRequestOptions>(() => ({}));

export function apiRequestContext(options: ApiRequestOptions = {}): HttpContext {
  return new HttpContext().set(API_REQUEST_OPTIONS, options);
}
