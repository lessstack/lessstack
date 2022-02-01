import React, { useContext } from "react";
import PropTypes from "prop-types";
import { RenderContext } from "./RenderProvider.js";

const Root = ({ as: Component, ...props }) => {
  const { html, collector, rootId } = useContext(RenderContext);
  collector.rootAdded = true;

  return (
    <Component
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...props}
      id={rootId}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

Root.defaultProps = {
  as: "div",
};

Root.propTypes = {
  as: PropTypes.string,
};

export default Root;
