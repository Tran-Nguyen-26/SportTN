import { AbstractControl, ValidationErrors } from '@angular/forms';

const PROVIDERS_BLOCK_LEADING_DIGIT = ['gmail.com', 'outlook.com', 'hotmail.com', 'yahoo.com'];

export function smartEmailValidator(control: AbstractControl): ValidationErrors | null {
  const value: string = control.value;
  if (!value) return null;

  const basicRegex = /^[a-zA-Z0-9._%+\-!#$&'*+/=?^_`{|}~]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!basicRegex.test(value)) {
    return { invalidEmail: true };
  }

  const [localPart, domain] = value.split('@');

  if (PROVIDERS_BLOCK_LEADING_DIGIT.includes(domain.toLowerCase())) {
    if (/^[0-9]/.test(localPart)) {
      return { leadingDigitNotAllowed: true };
    }
  }

  return null;
}
