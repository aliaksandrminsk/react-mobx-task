import React, { Component } from "react";
import Layout from "./hoc/Layout/Layout";
import { Route, Routes } from "react-router-dom";
import LoginForm from "./containers/Auth/LoginForm";
import RegisterForm from "./containers/Auth/RegisterForm";
import Notes from "./containers/Notes/Notes";
import { Navigate } from "react-router-dom";
import { inject, IWrappedComponent, observer } from "mobx-react";
import { AuthStore } from "./store/AuthStore";
import Logout from "./components/Logout/Logout";

/*
interface DispatchProps {
  autoLogin: () => Promise<void>;
}

interface StateProps {
  isAuthenticated: boolean;
  email: string;
}

function mapStateToProps(state: ApplicationState): StateProps {
  return {
    isAuthenticated: !!state.auth.token,
    email: state.auth.email,
  };
}

function mapDispatchToProps(
  dispatch: ThunkDispatch<ApplicationState, unknown, AnyAction>
): DispatchProps {
  return {
    autoLogin: () => dispatch(autoLogin()),
  };
}*/

type StoreProps = {
  authStore: AuthStore;
};

@inject("authStore")
@observer
class App extends Component<StoreProps> {
  static defaultProps = {} as StoreProps;

  componentDidMount() {
    this.props.authStore.autoLogin();
  }

  render() {
    let routes = (
      <Routes>
        <Route
          path="register"
          element={
            <RegisterForm formStore={this.props.authStore.registerFormStore} />
          }
        />
        <Route
          path="login"
          element={
            <LoginForm formStore={this.props.authStore.loginFormStore} />
          }
        />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    );

    if (this.props.authStore.isAuthenticated) {
      routes = (
        <Routes>
          <Route path="list" element={<Notes />} />
          <Route path="logout" element={<Logout />} />
          <Route path="*" element={<Navigate to="/list" />} />
        </Routes>
      );
    }
    return <Layout>{routes}</Layout>;
  }
}

export default App as typeof App & IWrappedComponent<StoreProps>;
