import { useContext } from "react";
import PropTypes from "prop-types";
import { ConfigContext } from "./ConfigProvider.js";

const Config = ({ children, doctype, document, rootId }) => {
  const config = useContext(ConfigContext);

  config.children = children ?? config.children;
  config.doctype = doctype ?? config.doctype;
  config.document = document ?? config.document;
  config.rootId = rootId ?? config.rootId;

  return children;
};

Config.defaultProps = {
  children: null,
  doctype: null,
  document: null,
  rootId: null,
};

Config.propTypes = {
  children: PropTypes.node,
  doctype: PropTypes.string,
  document: PropTypes.func,
  rootId: PropTypes.string,
};

export default Config;
