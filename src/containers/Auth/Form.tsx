import { IFormControl, IValidation } from "./IFormControls";
import is from "is_js";
import React from "react";
import Input, { InputProps } from "../../components/UI/Input/Input";
import { runInAction } from "mobx";
import { IFormStore } from "../../store/FormStore";

const validateControl = (value: string, validation: IValidation) => {
  if (!validation) {
    return true;
  }

  let isValid = true;

  if (validation.required) {
    isValid = value.trim() !== "" && isValid;
  }

  if (validation.email) {
    isValid = is.email(value) && isValid;
  }

  if (validation.minLength) {
    isValid = value.length >= validation.minLength && isValid;
  }

  return isValid;
};

const onChangeHandler = (
  event: React.ChangeEvent<HTMLInputElement>,
  controlName: string,
  formStore: IFormStore
) => {
  const formControls = formStore.formControls;
  const control: IFormControl = formControls[controlName];
  runInAction(() => {
    control.value = event.target.value;
    if (control.validation) {
      control.touched = true;
      control.valid = validateControl(control.value, control.validation);
    }

    let isFormValid = true;

    Object.keys(formControls).forEach((name) => {
      const valid = formControls[name].valid;
      if (valid != null) {
        isFormValid = valid && isFormValid;
      }
    });
    formStore.isFormValid = isFormValid;
    formStore.serverErrorMessage = "";
  });
};

export const renderInputs = (formStore: IFormStore) => {
  const formControls = formStore.formControls;

  return Object.keys(formControls).map((controlName, index) => {
    const control: IFormControl = formControls[controlName];

    const attributes: InputProps = {
      type: control.type,
      value: control.value,
      label: control.label,
      shouldValidate: !!control.validation,
      onChange: (event: React.ChangeEvent<HTMLInputElement>) =>
        onChangeHandler(event, controlName, formStore),
    };

    if (control.validation) {
      attributes.valid = control.valid;
      attributes.touched = control.touched;
      attributes.errorMessage = control.errorMessage;
    }

    return <Input key={controlName + index} {...attributes} />;
  });
};

export const submitFormHandler = (event: React.FormEvent) => {
  event.preventDefault();
};
