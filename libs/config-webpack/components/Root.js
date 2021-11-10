import React, { useContext } from "react";
import PropTypes from "prop-types";
import { Context } from "./RenderProvider";

const Root = ({ as: Component, ...props }) => {
  const { html, collector } = useContext(Context);
  collector.rootAdded = true;

  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <Component {...props} id="app" dangerouslySetInnerHTML={{ __html: html }} />
  );
};

Root.defaultProps = {
  as: "div",
};

Root.propTypes = {
  as: PropTypes.string,
};

export default Root;
