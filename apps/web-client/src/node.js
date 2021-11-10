import React from "react";
import PropTypes from "prop-types";
import { StaticRouter } from "react-router-dom/server";
import { ResponsePropType } from "@hmr/config-webpack/utils";

import App from "./App";

const NodeClient = ({ location, response }) => (
  <StaticRouter location={location}>
    <App response={response} />
  </StaticRouter>
);

NodeClient.propTypes = {
  location: PropTypes.string.isRequired,
  response: ResponsePropType.isRequired,
};

export default NodeClient;
