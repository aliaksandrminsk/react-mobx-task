import React from "react";
import ReactDOM from "react-dom";
import "./index";
import "./scss/styles";
import App from "./App";
import rootStore from "./store";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "mobx-react";

const stores = {
  authStore: rootStore.authStore,
  noteStore: rootStore.noteStore,
};

ReactDOM.render(
  <React.StrictMode>
    <Provider {...stores}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);
