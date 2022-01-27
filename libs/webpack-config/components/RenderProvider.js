import React, { createContext, useMemo } from "react";
import PropTypes from "prop-types";

export const Context = createContext();

function Provider({ children, html, collector }) {
  const value = useMemo(
    () => ({
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
      ],
      links: [],
      styles: [],
      html,
      collector,
    }),
    [],
  );

  return <Context.Provider value={value}>{children}</Context.Provider>;
}

Provider.propTypes = {
  children: PropTypes.node.isRequired,
  html: PropTypes.string.isRequired,
  collector: PropTypes.shape({}).isRequired,
};

export default Provider;
