import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { apiRequestContext, ApiRequestOptions } from '../http/api-request-options';
import { Product } from '../models/product.model';
import { apiUrl } from './api-url';

@Injectable({ providedIn: 'root' })
export class ProductApiService {
  private readonly http = inject(HttpClient);

  getProducts(options?: ApiRequestOptions): Observable<Product[]> {
    return this.http.get<Product[]>(apiUrl('api/products'), {
      context: apiRequestContext(options),
    });
  }
}
