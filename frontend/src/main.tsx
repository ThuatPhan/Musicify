import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { Auth0Provider } from "@auth0/auth0-react";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Auth0Provider
      domain="anhbao001.us.auth0.com"
      clientId="ysEZOisQFf3hX4HvlZAKgYBIf2GS2Pu1"
      authorizationParams={{
        audience: "http://localhost:3000/",
        redirect_uri: window.location.origin,
      }}
      useRefreshTokens={true}
      cacheLocation="localstorage"
    >
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Auth0Provider>
  </React.StrictMode>
);
