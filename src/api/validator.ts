import { ValidationRule } from './validation-rule';

export async function applyValidation<T>(value: T, rules: ValidationRule<T>[]): Promise<string[]> {
    const errors: string[] = [];
    for (const validator of rules) {
        const error: string | Promise<string> = validator(value);
        if (error?.constructor === Promise) {
            if (error) errors.unshift(await error);
        } else if (typeof error === 'string') {
            if (error) errors.unshift(error);
        }
    }
    return errors;
}
