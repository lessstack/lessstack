/* eslint-disable import/prefer-default-export */
import PropTypes from "prop-types";

export const ResponsePropType = PropTypes.shape({
  statusCode: PropTypes.string,
  statusMessage: PropTypes.string,
  headers: PropTypes.shape({}).isRequired,
});
