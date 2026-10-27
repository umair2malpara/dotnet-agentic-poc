import { TestBed } from '@angular/core/testing';
import { CustomersComponent } from './customers.component';

describe('CustomersComponent', () => {
  it('displays the approved placeholder without CRUD controls', () => {
    const fixture = TestBed.createComponent(CustomersComponent);
    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelector('h1')?.textContent).toContain('Customers');
    expect(element.textContent).toContain('Customer management is under development.');
    expect(element.querySelector('button, form, input')).toBeNull();
  });
});
