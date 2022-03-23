import { makeObservable, observable } from "mobx";
import { IFormControls } from "../containers/Auth/IFormControls";

export class FormStore {
  isFormValid = false;
  serverErrorMessage = "";
  formControls: IFormControls = {};

  constructor() {
    makeObservable(this, {
      formControls: observable,
      isFormValid: observable,
      serverErrorMessage: observable,
    });
  }
}
