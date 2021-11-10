import React from "react";
import { Link } from "react-router-dom";
import { ResponsePropType } from "@hmr/config-webpack/utils";

const HelloWorldPage = ({ response }) => {
  if (response) {
    response.statusCode = 404;
  }

  return (
    <div>
      <h1>404 Not Found</h1>
      <p>
        <Link to="/">Back to home</Link>
      </p>
    </div>
  );
};

HelloWorldPage.defaultProps = {
  response: null,
};

HelloWorldPage.propTypes = {
  response: ResponsePropType,
};

export default HelloWorldPage;
