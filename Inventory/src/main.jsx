import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import store from "./store.js";
import { Provider } from "react-redux";
import { WebSocketProvider } from "./CustomProvider/useWebSocket.jsx";
// if ("serviceWorker" in navigator) {
//   navigator.serviceWorker.register("/firebase-messaging-sw.js")
//     .then((registration) => {
//       console.log("Service worker registered:", registration);
//     })
//     .catch((error) => {
//       console.error("Service worker registration failed:", error);
//     });
// }

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <React.StrictMode>
      <BrowserRouter>
        <WebSocketProvider>
          <App />
        </WebSocketProvider>
      </BrowserRouter>
    </React.StrictMode>
  </Provider>
);
