import React from "react";
import { BrowserRouter } from "react-router-dom";
import App from "../App";

let { pathname } = document.location;
if (globalThis.initialProps.url.length > 1) {
  const index = pathname.lastIndexOf(globalThis.initialProps.url.substr(1));

  if (index > -1) {
    pathname = pathname.substr(0, index);
  }
}

const BrowserEntry = () => (
  <BrowserRouter basename={pathname}>
    <App />
  </BrowserRouter>
);

export default BrowserEntry;
