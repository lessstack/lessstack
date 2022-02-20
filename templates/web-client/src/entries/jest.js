/* eslint-env jest */
/* eslint-disable import/no-extraneous-dependencies */
import React from "react";
import PropTypes from "prop-types";
import { MemoryRouter } from "react-router-dom";
import { render as testingLibraryRender } from "@testing-library/react";

const JestContext = ({ children, initialEntries, initialIndex }) => (
  <MemoryRouter initialEntries={initialEntries} initialIndex={initialIndex}>
    {children}
  </MemoryRouter>
);

JestContext.defaultProps = {
  initialEntries: ["/"],
  initialIndex: 0,
};

JestContext.propTypes = {
  children: PropTypes.node.isRequired,
  initialEntries: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.string.isRequired,
      PropTypes.shape({
        pathname: PropTypes.string,
        search: PropTypes.string,
        hash: PropTypes.string,
        state: PropTypes.shape({}),
      }).isRequired,
    ]).isRequired,
  ),
  initialIndex: PropTypes.number,
};

export const render = (ui, options) =>
  testingLibraryRender(ui, { wrapper: JestContext, ...options });

export default JestContext;
