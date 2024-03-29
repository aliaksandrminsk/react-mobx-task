export interface IFormControls {
  [key: string]: IFormControl;
}

export interface IFormControl {
  value: string;
  type: string;
  label: string;
  errorMessage?: string;
  valid?: boolean;
  touched?: boolean;
  validation?: IValidation;
}

export interface IValidation {
  required?: boolean;
  email?: boolean;
  minLength?: number;
}
