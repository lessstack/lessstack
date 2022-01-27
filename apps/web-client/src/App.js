import React, { lazy } from "react";
import { ResponsePropType } from "@witb/webpack-config/utils";
import { Routes, Route } from "react-router-dom";

const Error404Page = lazy(() => import("./pages/Error404Page"));
const HomePage = lazy(() => import("./pages/HomePage"));

function App({ response }) {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="*" element={<Error404Page response={response} />} />
    </Routes>
  );
}

App.defaultProps = {
  response: null,
};

App.propTypes = {
  response: ResponsePropType,
};

export default App;
