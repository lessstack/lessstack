import React from "react";
import PropTypes from "prop-types";
import { css } from "@linaria/core";
import { variables, apply, dark } from "../theme/schemes.js";

const Container = ({ children }) => <div className={className}>{children}</div>;

Container.defaultProps = {
  children: null,
};

Container.propTypes = {
  children: PropTypes.node,
};

export default Container;

const className = css`
  align-self: center;
  margin: 0 auto;
  max-width: 600px;
  width: calc(100% - 24px);

  ${apply(dark)}

  background: ${variables.background};
  color: ${variables.text};
`;
