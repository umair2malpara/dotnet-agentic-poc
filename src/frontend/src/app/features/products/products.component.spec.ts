import { TestBed } from '@angular/core/testing';
import { ProductsComponent } from './products.component';

describe('ProductsComponent', () => {
  it('displays the approved placeholder without CRUD controls', () => {
    const fixture = TestBed.createComponent(ProductsComponent);
    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelector('h1')).toBeNull();
    expect(element.textContent).toContain('Product management is under development.');
    expect(element.querySelector('button, form, input')).toBeNull();
  });
});
