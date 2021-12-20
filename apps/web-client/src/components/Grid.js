import React from "react";
import PropTypes from "prop-types";
import { css, cx } from "@linaria/core";
import { createModifiers, modifierPropType } from "../theme/breakpoints.js";

const Grid = ({ children, direction, size, spacing }) => (
  <div className={cx(styles, modifiers.resolve({ direction, size, spacing }))}>
    {children}
  </div>
);

Grid.defaultProps = {
  children: null,
  direction: "vertical",
  size: null,
};

Grid.propTypes = {
  children: PropTypes.node,
  direction: modifierPropType(PropTypes.oneOf(["horizontal", "vertical"])),
  size: modifierPropType(
    PropTypes.oneOf([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]),
  ),
};

export default Grid;

const modifiers = createModifiers({
  // Direction
  direction: {
    horizontal: `flex-direction: row`,
    vertical: `flex-direction: column`,
  },

  // Sizing
  size: {
    1: `width: ${(100 / 12).toFixed(3)}%`,
    2: `width: ${((100 / 12) * 2).toFixed(3)}%`,
    3: `width: 25%`,
    4: `width: ${((100 / 12) * 4).toFixed(3)}%`,
    5: `width: ${((100 / 12) * 5).toFixed(3)}%`,
    6: `width: 50%`,
    7: `width: ${((100 / 12) * 7).toFixed(3)}%`,
    8: `width: ${((100 / 12) * 8).toFixed(3)}%`,
    9: `width: 75%`,
    10: `width: ${((100 / 12) * 10).toFixed(3)}%`,
    11: `width: ${((100 / 12) * 11).toFixed(3)}%`,
    12: `width: 100%`,
  },

  // Spacing
  spacing: {
    XXS: `gap: 2px`,
    XS: `gap: 4px`,
    S: `gap: 8px`,
    M: `gap: 16px`,
    L: `gap: 24px`,
    XL: `gap: 32px`,
    XXL: `gap: 64px`,
  },
});

const styles = css`
  display: flex;
  ${modifiers.style}
`;
