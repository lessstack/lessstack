import React, { createContext } from "react";
import PropTypes from "prop-types";

export const ConfigContext = createContext();

const ConfigProvider = ({ children, config }) => (
  <ConfigContext.Provider value={config}>{children}</ConfigContext.Provider>
);

ConfigProvider.propTypes = {
  children: PropTypes.node.isRequired,
  config: PropTypes.shape({
    doctype: PropTypes.string.isRequired,
    document: PropTypes.func.isRequired,
    rootId: PropTypes.string.isRequired,
  }).isRequired,
};

export default ConfigProvider;
