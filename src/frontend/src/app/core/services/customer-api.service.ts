import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { apiRequestContext, ApiRequestOptions } from '../http/api-request-options';
import { Customer, CustomerWrite } from '../models/customer.model';
import { apiUrl } from './api-url';

@Injectable({ providedIn: 'root' })
export class CustomerApiService {
  private readonly http = inject(HttpClient);
  private readonly customersUrl = apiUrl('api/customers');

  getCustomers(options?: ApiRequestOptions): Observable<Customer[]> {
    return this.http.get<Customer[]>(this.customersUrl, {
      context: apiRequestContext(options),
    });
  }

  getCustomer(id: string, options?: ApiRequestOptions): Observable<Customer> {
    return this.http.get<Customer>(`${this.customersUrl}/${encodeURIComponent(id)}`, {
      context: apiRequestContext(options),
    });
  }

  createCustomer(customer: CustomerWrite, options?: ApiRequestOptions): Observable<Customer> {
    return this.http.post<Customer>(this.customersUrl, customer, {
      context: apiRequestContext(options),
    });
  }

  updateCustomer(
    id: string,
    customer: CustomerWrite,
    options?: ApiRequestOptions,
  ): Observable<void> {
    return this.http.put<void>(`${this.customersUrl}/${encodeURIComponent(id)}`, customer, {
      context: apiRequestContext(options),
    });
  }

  deleteCustomers(ids: readonly string[], options?: ApiRequestOptions): Observable<void> {
    return this.http.post<void>(
      `${this.customersUrl}/bulk-delete`,
      { ids },
      { context: apiRequestContext(options) },
    );
  }
}
