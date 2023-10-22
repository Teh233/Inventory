import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import "animate.css";
import store from "./store.js";
import { Provider } from "react-redux";
import { WebSocketProvider } from "./CustomProvider/useWebSocket.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <React.StrictMode>
      <BrowserRouter>
        <WebSocketProvider>
          {" "}
          <App />
        </WebSocketProvider>
      </BrowserRouter>
    </React.StrictMode>
  </Provider>
);
