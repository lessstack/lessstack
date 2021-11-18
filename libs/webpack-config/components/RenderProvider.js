import React, { createContext } from "react";
import PropTypes from "prop-types";

export const Context = createContext();

const filterHmrElements = (elements) =>
  elements.filter(
    (element) =>
      !(element.props.src || element.props.href)?.match(/-wps-hmr\.[^.\\/]+$/),
  );

const Provider = ({ children, html, extractor, collector }) => (
  <Context.Provider
    value={{
      scripts: [
        <script
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{
            __html: `WITB_ENVIRONMENT_VARS = ${JSON.stringify({
              // eslint-disable-next-line no-undef, camelcase
              webpackPublickPath: __webpack_public_path__,
            })};`,
          }}
        />,
      ].concat(filterHmrElements(extractor.getScriptElements())),
      links: filterHmrElements(extractor.getLinkElements()),
      styles: filterHmrElements(extractor.getStyleElements()),
      html,
      collector,
    }}
  >
    {children}
  </Context.Provider>
);

Provider.propTypes = {
  children: PropTypes.node.isRequired,
  html: PropTypes.string.isRequired,
  extractor: PropTypes.shape({
    getScriptElements: PropTypes.func.isRequired,
    getLinkElements: PropTypes.func.isRequired,
    getStyleElements: PropTypes.func.isRequired,
  }).isRequired,
  collector: PropTypes.shape({}).isRequired,
};

export default Provider;
