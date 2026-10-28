import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Customer, CustomerWrite } from '../models/customer.model';
import { apiUrl } from './api-url';

@Injectable({ providedIn: 'root' })
export class CustomerApiService {
  private readonly http = inject(HttpClient);
  private readonly customersUrl = apiUrl('api/customers');

  getCustomers(): Observable<Customer[]> {
    return this.http.get<Customer[]>(this.customersUrl);
  }

  getCustomer(id: string): Observable<Customer> {
    return this.http.get<Customer>(`${this.customersUrl}/${encodeURIComponent(id)}`);
  }

  createCustomer(customer: CustomerWrite): Observable<Customer> {
    return this.http.post<Customer>(this.customersUrl, customer);
  }

  updateCustomer(id: string, customer: CustomerWrite): Observable<void> {
    return this.http.put<void>(
      `${this.customersUrl}/${encodeURIComponent(id)}`,
      customer,
    );
  }

  deleteCustomers(ids: readonly string[]): Observable<void> {
    return this.http.post<void>(`${this.customersUrl}/bulk-delete`, { ids });
  }
}
