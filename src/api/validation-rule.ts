export type ValidationRule<T> = (value: T) => string | Promise<string>;

export const required = (errorMessage?: string): ValidationRule<unknown> => {
    return (value) => {
        if (value === null || value === undefined || value === '') {
            return errorMessage || 'this field is required';
        }
    };
};

export const requiredArray = (errorMessage?: string): ValidationRule<unknown[]> => {
    return (value) => {
        if (value === null || value === undefined || !value?.length) {
            return errorMessage || 'this field is required';
        }
    };
};
