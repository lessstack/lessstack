import React from "react";
import PropTypes from "prop-types";
import { StaticRouter } from "react-router-dom/server";
import { ResponsePropType } from "@witb/webpack-config/utils";

import App from "../App";

const NodeEntry = ({ url, response }) => (
  <StaticRouter location={url}>
    <App response={response} />
    <script
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{
        __html: `var initialProps = ${JSON.stringify({ url })};`,
      }}
    />
  </StaticRouter>
);

NodeEntry.propTypes = {
  url: PropTypes.string.isRequired,
  response: ResponsePropType.isRequired,
};

export default NodeEntry;
