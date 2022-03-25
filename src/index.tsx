import React from "react";
import ReactDOM from "react-dom";
import "./index";
import "./scss/styles";
import App from "./App";
import store, { StoreContext } from "./store";
import { BrowserRouter } from "react-router-dom";

ReactDOM.render(
  <React.StrictMode>
    <StoreContext.Provider value={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </StoreContext.Provider>
  </React.StrictMode>,
  document.getElementById("root")
);
