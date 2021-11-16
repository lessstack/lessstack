import React from "react";
import { ResponsePropType } from "@witb/webpack-config/utils";
import loadable from "@loadable/component";
import { Routes, Route } from "react-router-dom";

const Error404Page = loadable(() => import("./pages/Error404Page"));
const HomePage = loadable(() => import("./pages/HomePage"));

const App = ({ response }) => (
  <Routes>
    <Route path="/" element={<HomePage />} />
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
