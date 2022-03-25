import React, { ReactChild, ReactChildren } from "react";
import Menu from "../../components/Menu/Menu";
import { observer } from "mobx-react-lite";
import { useStore } from "../../store";

interface Props {
  children: ReactChild | ReactChildren;
}

const Layout = (props: Props) => {
  const { authStore } = useStore();
  return (
    <>
      <Menu
        isAuthenticated={authStore.isAuthenticated}
        userName={authStore.userName}
      />
      <main>{props.children}</main>
    </>
  );
};

export default observer(Layout);
