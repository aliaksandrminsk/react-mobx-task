import React, { useEffect } from "react";
import Form, { FormProps } from "./Form";
import { runInAction } from "mobx";
import { useStore } from "../../store";
import { IFormStore } from "../../store/FormStore";

type LoginFormProps = {
  formStore: IFormStore;
};

const LoginForm =
  (FormComponent: React.FC<FormProps>) =>
  ({ formStore }: LoginFormProps) => {
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
      };
      runInAction(() => {
        formStore.formControls = formControls;
      });
    }, []);

    const loginHandler = () =>
      authStore
        .auth(
          formStore.formControls.email.value,
          formStore.formControls.password.value
        )
        .catch(({ response }) => {
          let serverErrorMessage = "";
          switch (response?.data?.error?.message) {
            case "EMAIL_NOT_FOUND":
              serverErrorMessage =
                "The email you entered is incorrect. Try again.";
              break;
            case "INVALID_PASSWORD":
              serverErrorMessage =
                "The password you entered is incorrect. Try again.";
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
        title="Sign in"
        formStore={formStore}
        authHandler={loginHandler}
      />
    );
  };

export default LoginForm(Form);
