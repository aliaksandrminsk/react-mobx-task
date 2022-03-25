import React, { useLayoutEffect } from "react";
import classes from "./Auth.module.css";
import Button from "../../components/UI/Button/Button";
import { renderInputs, submitFormHandler } from "./Form";
import { observer } from "mobx-react-lite";
import { runInAction } from "mobx";
import { IFormStore } from "../../store/FormStore";
import { useStore } from "../../store";

const RegisterForm = (props: { formStore: IFormStore }) => {
  const { authStore } = useStore();

  useLayoutEffect(() => {
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
      props.formStore.formControls = formControls;
    });
  }, []);

  const registerHandler = () =>
    authStore
      .auth(
        props.formStore.formControls.email.value,
        props.formStore.formControls.password.value,
        props.formStore.formControls.name.value,
        props.formStore.formControls.surname.value
      )
      .catch(({ response }) => {
        let serverErrorMessage = "";
        switch (response?.data?.error?.message) {
          case "EMAIL_EXISTS":
            serverErrorMessage = "Email already exists. Try with another one.";
            break;
          default:
            serverErrorMessage = "Something went wrong. Try again.";
        }
        runInAction(() => {
          props.formStore.serverErrorMessage = serverErrorMessage;
        });
        console.error("An unexpected error happened:", response?.data);
      });

  return (
    <div className="d-flex justify-content-center flex-grow-1 pt-5">
      <div className="w-100 px-1" style={{ maxWidth: "600px" }}>
        <h2 className="text-center mb-5">Create account</h2>

        <form onSubmit={submitFormHandler} className={classes.AuthForm}>
          {renderInputs(props.formStore)}
          <Button
            onClick={registerHandler}
            disabled={!props.formStore.isFormValid}
          >
            Next
          </Button>
          {props.formStore.serverErrorMessage.trim().length > 0 ? (
            <div className={classes.Error}>
              {props.formStore.serverErrorMessage}
            </div>
          ) : null}
        </form>
      </div>
    </div>
  );
};

export default observer(RegisterForm);
