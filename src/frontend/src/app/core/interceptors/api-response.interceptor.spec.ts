import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { HttpClient, HttpContext } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { API_REQUEST_OPTIONS } from '../http/api-request-options';
import { NotificationService } from '../services/notification.service';
import { apiResponseInterceptor } from './api-response.interceptor';

describe('apiResponseInterceptor', () => {
  let http: HttpClient;
  let testingController: HttpTestingController;
  let notifications: NotificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([apiResponseInterceptor])),
        provideHttpClientTesting(),
      ],
    });
    http = TestBed.inject(HttpClient);
    testingController = TestBed.inject(HttpTestingController);
    notifications = TestBed.inject(NotificationService);
  });

  afterEach(() => {
    testingController.verify();
    notifications.dismiss();
  });

  it('unwraps success data and shows one opted-in success notification', () => {
    let response: unknown;
    http
      .get<unknown>('/api/customers', {
        context: new HttpContext().set(API_REQUEST_OPTIONS, {
          successMessage: 'Customer list refreshed.',
        }),
      })
      .subscribe((data) => (response = data));

    testingController.expectOne('/api/customers').flush({
      data: [{ id: 'customer-1' }],
    });

    expect(response).toEqual([{ id: 'customer-1' }]);
    expect(notifications.notification()).toEqual({
      kind: 'success',
      message: 'Customer list refreshed.',
    });
  });

  it('keeps successful background requests silent', () => {
    http.get<unknown>('/api/products').subscribe();
    testingController.expectOne('/api/products').flush({ data: [] });

    expect(notifications.notification()).toBeNull();
  });

  it('shows a problem detail for an unhandled API failure and rethrows the error', () => {
    let receivedError: unknown;
    http.get<unknown>('/api/products').subscribe({
      error: (error: unknown) => (receivedError = error),
    });

    testingController
      .expectOne('/api/products')
      .flush(
        { title: 'Unavailable', detail: 'The service is temporarily unavailable.' },
        { status: 503, statusText: 'Service Unavailable' },
      );

    expect(receivedError).toBeDefined();
    expect(notifications.notification()).toEqual({
      kind: 'error',
      message: 'The service is temporarily unavailable.',
    });
  });

  it('suppresses a global failure notification when the feature handles the error inline', () => {
    http
      .get<unknown>('/api/customers', {
        context: new HttpContext().set(API_REQUEST_OPTIONS, {
          suppressErrorNotification: true,
        }),
      })
      .subscribe({ error: () => undefined });

    testingController
      .expectOne('/api/customers')
      .flush({ title: 'Not found' }, { status: 404, statusText: 'Not Found' });

    expect(notifications.notification()).toBeNull();
  });

  it('rejects malformed success bodies instead of passing them through', () => {
    let receivedError: unknown;
    http.get<unknown>('/api/customers').subscribe({
      error: (error: unknown) => (receivedError = error),
    });

    testingController.expectOne('/api/customers').flush([{ id: 'customer-1' }]);

    expect(receivedError).toBeDefined();
    expect(notifications.notification()?.kind).toBe('error');
  });
});
