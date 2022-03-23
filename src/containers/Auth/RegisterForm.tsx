import React from "react";
import classes from "./Auth.module.css";
import Button from "../../components/UI/Button/Button";
import { Form } from "./Form";
import { inject, observer } from "mobx-react";

@inject("authStore")
@observer
class RegisterForm extends Form {
  componentDidMount() {
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
    this.props.formStore.formControls = formControls;
  }

  registerHandler = () =>
    this.props.authStore
      .auth(
        this.props.formStore.formControls.email.value,
        this.props.formStore.formControls.password.value,
        this.props.formStore.formControls.name.value,
        this.props.formStore.formControls.surname.value
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
        this.props.formStore.serverErrorMessage = serverErrorMessage;
        console.error("An unexpected error happened:", response?.data);
      });

  render() {
    return (
      <div className="d-flex justify-content-center flex-grow-1 pt-5">
        <div className="w-100 px-1" style={{ maxWidth: "600px" }}>
          <h2 className="text-center mb-5">Create account</h2>

          <form onSubmit={this.submitHandler} className={classes.AuthForm}>
            {this.renderInputs()}
            <Button
              onClick={this.registerHandler}
              disabled={!this.props.formStore.isFormValid}
            >
              Next
            </Button>
            {this.props.formStore.serverErrorMessage.trim().length > 0 ? (
              <div className={classes.Error}>
                {this.props.formStore.serverErrorMessage}
              </div>
            ) : null}
          </form>
        </div>
      </div>
    );
  }
}

export default RegisterForm;
