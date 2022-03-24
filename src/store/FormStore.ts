import { makeAutoObservable } from "mobx";
import { IFormControls } from "../containers/Auth/IFormControls";

const FormStore = () =>
  makeAutoObservable({
    isFormValid: false,
    serverErrorMessage: "",
    formControls: {} as IFormControls,
  });

export default FormStore;
