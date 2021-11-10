import React from "react";
import { loadable, ResponsePropType } from "@witb/config-webpack/utils";
import { Routes, Route } from "react-router-dom";

const Error404Page = loadable(() => import("./pages/Error404Page"));
const HelloWorldPage = loadable(() => import("./pages/HelloWorldPage"));

const App = ({ response }) => (
  <Routes>
    <Route path="/" element={<HelloWorldPage />} />
    <Route path="*" element={<Error404Page response={response} />} />
  </Routes>
);

App.defaultProps = {
  response: null,
};

App.propTypes = {
  response: ResponsePropType,
};

export default App;
