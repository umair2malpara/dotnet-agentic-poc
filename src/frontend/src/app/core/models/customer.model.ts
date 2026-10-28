export interface Customer {
  id: string;
  name: string;
  email: string;
}

export type CustomerWrite = Pick<Customer, 'name' | 'email'>;
