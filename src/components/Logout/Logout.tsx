import React, { Component } from "react";
import { Navigate } from "react-router-dom";
import { inject, observer } from "mobx-react";
import { AuthStore } from "../../store/AuthStore";

type StoreProps = {
  authStore: AuthStore;
};

@inject("authStore")
@observer
class Logout extends Component<StoreProps> {
  static defaultProps = {} as StoreProps;
  componentDidMount() {
    return this.props.authStore.logout();
  }

  render() {
    return <Navigate to="/login" replace />;
  }
}

export default Logout;
