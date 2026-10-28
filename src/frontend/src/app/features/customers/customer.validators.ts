import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const CUSTOMER_EMAIL_PATTERN =
  /^(?=.{1,254}$)(?=.{1,64}@)[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,63}$/;

export const customerEmailValidator: ValidatorFn = (
  control: AbstractControl<string>,
): ValidationErrors | null =>
  CUSTOMER_EMAIL_PATTERN.test(control.value.trim()) ? null : { email: true };
