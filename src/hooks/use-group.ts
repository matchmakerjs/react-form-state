import { FormGroup, FormGroupDefinition } from '../api/form-group';

export const useGroup = (definition: FormGroupDefinition): FormGroup => {
    return new FormGroup(definition);
};
