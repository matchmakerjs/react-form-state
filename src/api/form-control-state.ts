export interface FormControlState<T> {
    value: T;
    errors?: string[];
    visited?: boolean;
}
