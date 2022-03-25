import React, { useEffect } from "react";
import Layout from "./hoc/Layout/Layout";
import { Route, Routes } from "react-router-dom";
import LoginForm from "./containers/Auth/LoginForm";
import RegisterForm from "./containers/Auth/RegisterForm";
import Notes from "./containers/Notes/Notes";
import { Navigate } from "react-router-dom";
import { observer } from "mobx-react-lite";
import Logout from "./components/Logout/Logout";
import { useStore } from "./store";

const App = () => {
  const { authStore } = useStore();

  useEffect(() => {
    authStore.autoLogin();
  }, []);

  let routes = (
    <Routes>
      <Route
        path="register"
        element={<RegisterForm formStore={authStore.registerFormStore} />}
      />
      <Route
        path="login"
        element={<LoginForm formStore={authStore.loginFormStore} />}
      />
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );

  if (authStore.isAuthenticated) {
    routes = (
      <Routes>
        <Route path="list" element={<Notes />} />
        <Route path="logout" element={<Logout />} />
        <Route path="*" element={<Navigate to="/list" />} />
      </Routes>
    );
  }
  return <Layout>{routes}</Layout>;
};

export default observer(App);
