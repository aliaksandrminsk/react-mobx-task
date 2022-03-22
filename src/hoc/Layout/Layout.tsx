import React, { Component, ReactChild, ReactChildren } from "react";
import Menu from "../../components/Menu/Menu";
import { AuthStore } from "../../store/AuthStore";
import { inject, observer } from "mobx-react";

type StoreProps = {
  authStore: AuthStore;
};

interface Props extends StoreProps {
  children: ReactChild | ReactChildren;
}

@inject("authStore")
@observer
class Layout extends Component<Props> {
  static defaultProps = {} as StoreProps;
  render() {
    return (
      <>
        <Menu
          isAuthenticated={this.props.authStore.isAuthenticated}
          userName={this.props.authStore.userName}
        />
        <main>{this.props.children}</main>
      </>
    );
  }
}

export default Layout;
