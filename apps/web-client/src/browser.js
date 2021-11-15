import React from "react";
import { BrowserRouter } from "react-router-dom";
import App from "./App";

const BrowserEntry = () => (
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

export default BrowserEntry;
