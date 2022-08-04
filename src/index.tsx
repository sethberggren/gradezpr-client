import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
// import reportWebVitals from './reportWebVitals';
import App from "./App";

import { ChakraProvider, Heading } from "@chakra-ui/react";
import { AppContextProvider } from "./controllers/context";
import Theme from "./theme/Theme";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { GOOGLE_CLIENT_ID } from "./envVars";

ReactDOM.render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <ChakraProvider theme={Theme}>
        <AppContextProvider>
          <App />
        </AppContextProvider>
      </ChakraProvider>
    </GoogleOAuthProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
