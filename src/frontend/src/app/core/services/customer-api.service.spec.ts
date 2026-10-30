import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from '../../../environments/environment';
import { CustomerApiService } from './customer-api.service';
import { apiResponseInterceptor } from '../interceptors/api-response.interceptor';

describe('CustomerApiService', () => {
  let service: CustomerApiService;
  let http: HttpTestingController;
  const customersUrl = `${environment.apiBaseUrl.replace(/\/+$/, '')}/api/customers`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([apiResponseInterceptor])),
        provideHttpClientTesting(),
        CustomerApiService,
      ],
    });
    service = TestBed.inject(CustomerApiService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('retrieves the customer list', () => {
    service.getCustomers().subscribe();

    const request = http.expectOne(customersUrl);
    expect(request.request.method).toBe('GET');
    request.flush({ data: [] });
  });

  it('retrieves a customer by ID', () => {
    service.getCustomer('customer-1').subscribe();

    const request = http.expectOne(`${customersUrl}/customer-1`);
    expect(request.request.method).toBe('GET');
    request.flush({
      data: { id: 'customer-1', name: 'Alex Morgan', email: 'alex@example.test' },
    });
  });

  it('creates a customer', () => {
    const customer = { name: 'New Customer', email: 'new@example.test' };
    service.createCustomer(customer).subscribe();

    const request = http.expectOne(customersUrl);
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual(customer);
    request.flush({ data: { id: 'customer-2', ...customer } });
  });

  it('updates a customer', () => {
    const customer = { name: 'Updated Customer', email: 'updated@example.test' };
    service.updateCustomer('customer-1', customer).subscribe();

    const request = http.expectOne(`${customersUrl}/customer-1`);
    expect(request.request.method).toBe('PUT');
    expect(request.request.body).toEqual(customer);
    request.flush({ data: null });
  });

  it('deletes multiple customers in one request', () => {
    const ids = ['customer-1', 'customer-2'];
    service.deleteCustomers(ids).subscribe();

    const request = http.expectOne(`${customersUrl}/bulk-delete`);
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({ ids });
    request.flush({ data: null });
  });
});
