import { Reducer, useEffect, useMemo, useReducer, useState } from 'react';
import { FormControl } from '../api/form-control';
import { FormControlAction } from '../api/form-control-action';
import { FormControlDispatch } from '../api/form-control-dispatch';
import { FormControlState } from '../api/form-control-state';
import { ValidationRule } from '../api/validation-rule';

function controlReducer<T>(): Reducer<FormControlState<T>, FormControlDispatch<T>> {
    return (state: FormControlState<T>, dispatch: FormControlDispatch<T>): FormControlState<T> => {
        switch (dispatch.action) {
            case FormControlAction.FOCUS_LOST:
                return {
                    visited: true,
                    value: state?.value,
                    errors: state?.errors,
                };
            case FormControlAction.VALIDATION_COMPLETED:
                // console.log(state?.value, 'VALIDATION_COMPLETED', dispatch.errors);
                return {
                    visited: state?.visited,
                    value: state?.value,
                    errors: dispatch.errors,
                };
            case FormControlAction.VALIDATION_SCHEDULED:
                // console.log(state?.value, 'VALIDATION_SCHEDULED');
                return {
                    visited: state?.visited,
                    value: state?.value,
                };
            case FormControlAction.VALUE_CHANGED:
                return {
                    visited: state?.visited,
                    value: dispatch.value,
                };
            default:
                return state;
        }
    };
}

export const useControl = <T>(config?: {
    initialValue?: T;
    validationRules?: ValidationRule<T>[];
    validationDebounce?: number;
    // dependsOn?: FormControl<any>[]
}): FormControl<T> => {
    const [state, dispatcher] = useReducer(controlReducer<T>(), { value: config?.initialValue }, (arg) => arg);
    const [validationRules, setValidationRules] = useState(config?.validationRules);

    const control = useMemo(
        () => new FormControl([state, dispatcher], setValidationRules, validationRules),
        [state, validationRules],
    );

    useEffect(() => {
        const taskId = setTimeout(() => control.revalidate(), config?.validationDebounce || 0);
        return () => clearTimeout(taskId);
    }, [control.value, validationRules]); // ...(config?.dependsOn || []).map(it => it.value)
    return control;
};
