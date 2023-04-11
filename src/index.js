import React from "react";
import ReactDOM from "react-dom";
import "./assets/animated.css";
import "../node_modules/font-awesome/css/font-awesome.min.css";
import "../node_modules/elegant-icons/style.css";
import "../node_modules/et-line/style.css";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "../node_modules/bootstrap/dist/js/bootstrap.js";
import "./assets/style.scss";
import App from "./components/app";
import * as serviceWorker from "./serviceWorker";
import { MoralisProvider } from "react-moralis";

ReactDOM.render(
  <MoralisProvider
    appId="HrU19YeOOBdTvZZl7PJSfX2hAa9K7m2cqkmWiqsx"
    serverUrl="https://v8t6g5sbg1rz.usemoralis.com:2053/server"
  >
    <App />
  </MoralisProvider>,
  document.getElementById("root")
);
serviceWorker.unregister();
