import React from "react";
import PropTypes from "prop-types";
import { StaticRouter } from "react-router-dom/server";
import { ResponsePropType } from "@witb/webpack-config/utils";

import App from "../App";

const NodeEntry = ({ location, response }) => (
  <StaticRouter location={location}>
    <App response={response} />
  </StaticRouter>
);

NodeEntry.propTypes = {
  location: PropTypes.string.isRequired,
  response: ResponsePropType.isRequired,
};

export default NodeEntry;
