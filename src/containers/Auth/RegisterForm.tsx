import React, { useEffect } from "react";
import Form, { FormProps } from "./Form";
import { runInAction } from "mobx";
import { IFormStore } from "../../store/FormStore";
import { useStore } from "../../store";

type RegisterFormProps = {
  formStore: IFormStore;
};

const RegisterForm =
  (FormComponent: React.FC<FormProps>) =>
  ({ formStore }: RegisterFormProps) => {
    const { authStore } = useStore();

    useEffect(() => {
      const formControls = {
        email: {
          value: "",
          type: "email",
          label: "Email",
          errorMessage: "Please enter a valid email address",
          valid: false,
          touched: false,
          validation: {
            required: true,
            email: true,
          },
        },
        password: {
          value: "",
          type: "password",
          label: "Password",
          errorMessage: "Please enter a correct password",
          valid: false,
          touched: false,
          validation: {
            required: true,
            minLength: 6,
          },
        },
        name: {
          value: "",
          type: "input",
          label: "Name",
          errorMessage: "Please enter your name",
          valid: false,
          touched: false,
          validation: {
            required: true,
            minLength: 2,
          },
        },
        surname: {
          value: "",
          type: "input",
          label: "Surname",
        },
      };
      runInAction(() => {
        formStore.formControls = formControls;
      });
    }, []);

    const registerHandler = () =>
      authStore
        .auth(
          formStore.formControls.email.value,
          formStore.formControls.password.value,
          formStore.formControls.name.value,
          formStore.formControls.surname.value
        )
        .catch(({ response }) => {
          let serverErrorMessage = "";
          switch (response?.data?.error?.message) {
            case "EMAIL_EXISTS":
              serverErrorMessage =
                "Email already exists. Try with another one.";
              break;
            default:
              serverErrorMessage = "Something went wrong. Try again.";
          }
          runInAction(() => {
            formStore.serverErrorMessage = serverErrorMessage;
          });
          console.error("An unexpected error happened:", response?.data);
        });

    return (
      <FormComponent
        title="Create account"
        formStore={formStore}
        authHandler={registerHandler}
      />
    );
  };

export default RegisterForm(Form);
