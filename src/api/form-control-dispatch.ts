import { FormControlAction } from './form-control-action';

export interface FormControlDispatch<T> {
    action: FormControlAction;
    value?: T;
    errors?: string[];
}
