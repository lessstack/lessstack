import loadable from "@loadable/component";
import PropTypes from "prop-types";
import { css } from "@linaria/core";

export const ResponsePropType = PropTypes.shape({
  statusCode: PropTypes.string,
  statusMessage: PropTypes.string,
  headers: PropTypes.shape({}).isRequired,
});

export { css, loadable };
