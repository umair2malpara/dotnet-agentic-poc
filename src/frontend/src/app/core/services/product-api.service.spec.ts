import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from '../../../environments/environment';
import { ProductApiService } from './product-api.service';

describe('ProductApiService', () => {
  let service: ProductApiService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        ProductApiService,
      ],
    });
    service = TestBed.inject(ProductApiService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('requests products from the configured API', () => {
    service.getProducts().subscribe();

    const request = http.expectOne(
      `${environment.apiBaseUrl.replace(/\/+$/, '')}/api/products`,
    );
    expect(request.request.method).toBe('GET');
    request.flush([]);
  });
});
