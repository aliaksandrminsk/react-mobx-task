import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { useStore } from "../../store";

const Logout = () => {
  const { authStore } = useStore();

  useEffect(() => {
    authStore.logout();
  }, []);

  return <Navigate to="/login" replace />;
};

export default observer(Logout);
