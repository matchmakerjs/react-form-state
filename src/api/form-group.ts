import { FormControl } from './form-control';

export interface FormGroupDefinition {
    [key: string]: FormControl<unknown>;
}

export class FormGroup {
    constructor(private definition: FormGroupDefinition) {}

    get valid() {
        for (const control of Object.values(this.definition)) {
            if (control.errors === undefined || control.errors?.length) {
                return false;
            }
        }
        return true;
    }

    get value() {
        const value: { [key: string]: unknown } = {};
        for (const [key, control] of Object.entries(this.definition)) {
            control.markAsVisited();
            value[key] = control.value;
        }
        return value;
    }

    markAsVisited() {
        for (const control of Object.values(this.definition)) {
            control.markAsVisited();
        }
    }
}
