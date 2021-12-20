import React from "react";
import PropTypes from "prop-types";
import { css } from "@linaria/core";

const Container = ({ children }) => <div className={className}>{children}</div>;

Container.defaultProps = {
  children: null,
};

Container.propTypes = {
  children: PropTypes.node,
};

export default Container;

const className = css`
  max-width: 1080px;
  width: 100%;
`;
