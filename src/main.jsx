import React from "react";
import ReactDOM from "react-dom/client";
import "./styles/index.css";
import App from "./App.jsx";
import { Provider } from "react-redux";
import { store } from "./app/store";
import { BrowserRouter } from "react-router-dom";
import { ConfirmProvider } from "./components/ui/ConfirmProvider";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <Provider store={store}>
      <ConfirmProvider>
        <App />
      </ConfirmProvider>
    </Provider>
  </BrowserRouter>,
);
