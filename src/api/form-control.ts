import { Dispatch } from 'react';
import { FormControlAction } from './form-control-action';
import { FormControlDispatch } from './form-control-dispatch';
import { FormControlState } from './form-control-state';
import { ValidationRule } from './validation-rule';
import { applyValidation } from './validator';

type ControlReducer<T> = [FormControlState<T>, Dispatch<FormControlDispatch<T>>];

export class FormControl<T> {
    constructor(
        private reducer: ControlReducer<T>,
        private validationRulesUpdater: (validationRules?: ValidationRule<T>[]) => void,
        private validationRules?: ValidationRule<T>[],
    ) {}

    get state(): FormControlState<T> {
        return this.reducer[0];
    }

    get value(): T {
        return this.reducer[0]?.value;
    }

    // setError(errors: string[]) {
    //     if (this.state?.errors && JSON.stringify(this.state.errors) === JSON.stringify(errors)) {
    //         return;
    //     }
    //     this.reducer[1]({
    //         action: FormControlAction.VALIDATION_COMPLETED, errors
    //     });
    // }

    async revalidate() {
        if (this.state.errors) {
            this.update(FormControlAction.VALIDATION_SCHEDULED);
        }
        // console.log('rules:', this.validationRules?.length);
        const errors = !this.validationRules?.length ? [] : await applyValidation(this.value, this.validationRules);
        // console.log(this.value, this.errors, errors);
        // if (this.errorChanged(errors)) {
        this.reducer[1]({
            action: FormControlAction.VALIDATION_COMPLETED,
            errors,
        });
        // }
    }

    setValue(value: T) {
        this.update(FormControlAction.VALUE_CHANGED, value);
    }

    markAsVisited() {
        if (this.state?.visited) {
            return;
        }
        this.update(FormControlAction.FOCUS_LOST);
    }

    private update(action: FormControlAction, value?: T) {
        this.reducer[1]({
            action,
            value,
        });
    }

    get errors() {
        return this.state?.errors;
    }

    get invalidAndVisited(): boolean {
        return this.state?.visited && !!this?.errors?.length;
    }

    get valid(): boolean {
        return !this.errors?.length;
    }

    errorChanged(errors: string[]) {
        return !this.errors || JSON.stringify(this.errors) !== JSON.stringify(errors);
    }

    setValidationRules(validationRules: ValidationRule<T>[]) {
        this.validationRulesUpdater(validationRules);
    }
}
