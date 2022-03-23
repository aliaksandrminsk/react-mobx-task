import { IFormControls, IFormControl, IValidation } from "./IFormControls";
import is from "is_js";
import React, { Component } from "react";
import Input, { InputProps } from "../../components/UI/Input/Input";
import { AuthStore } from "../../store/AuthStore";
import { runInAction } from "mobx";
import { FormStore } from "../../store/FormStore";

type StoreProps = {
  authStore: AuthStore;
  formStore: FormStore;
};

export class Form extends Component<StoreProps> {
  static defaultProps = {} as StoreProps;

  submitHandler = (event: React.FormEvent) => {
    event.preventDefault();
  };

  validateControl(value: string, validation: IValidation) {
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
  }

  onChangeHandler = (
    event: React.ChangeEvent<HTMLInputElement>,
    controlName: string
  ) => {
    const formControls: IFormControls = {
      ...this.props.formStore.formControls,
    };

    const control: IFormControl = { ...formControls[controlName] };

    control.value = event.target.value;

    if (control.validation) {
      control.touched = true;
      control.valid = this.validateControl(control.value, control.validation);
    }

    formControls[controlName] = control;

    let isFormValid = true;

    Object.keys(formControls).forEach((name) => {
      const valid = formControls[name].valid;
      if (valid != null) {
        isFormValid = valid && isFormValid;
      }
    });

    // this.setState({
    //...this.state,
    //serverErrorMessage: "",
    //formControls,
    //isFormValid,
    //});
    runInAction(() => {
      this.props.formStore.isFormValid = isFormValid;
      this.props.formStore.serverErrorMessage = "";
      this.props.formStore.formControls = formControls;
    });
  };

  renderInputs() {
    const formControls = this.props.formStore.formControls;
    return Object.keys(formControls).map((controlName, index) => {
      const control: IFormControl = formControls[controlName];

      const attributes: InputProps = {
        type: control.type,
        value: control.value,
        label: control.label,
        shouldValidate: !!control.validation,
        onChange: (event: React.ChangeEvent<HTMLInputElement>) =>
          this.onChangeHandler(event, controlName),
      };

      if (control.validation) {
        attributes.valid = control.valid;
        attributes.touched = control.touched;
        attributes.errorMessage = control.errorMessage;
      }

      return <Input key={controlName + index} {...attributes} />;
    });
  }
}
