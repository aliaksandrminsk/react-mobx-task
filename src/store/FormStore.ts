import { makeAutoObservable } from "mobx";
import { IFormControls } from "../containers/Auth/IFormControls";

export interface IFormStore {
  isFormValid: boolean;
  serverErrorMessage: string;
  formControls: IFormControls;
}

const FormStore = () =>
  makeAutoObservable<IFormStore>({
    isFormValid: false,
    serverErrorMessage: "",
    formControls: {} as IFormControls,
  });

export default FormStore;
