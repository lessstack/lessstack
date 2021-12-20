import PropTypes from "prop-types";

export const BREAKPOINTS = {
  xs: 0,
  s: 600,
  m: 900,
  l: 1200,
  xl: 1536,
};

export const isValidBreakpoint = (breakpoint) =>
  Object.prototype.hasOwnProperty.call(BREAKPOINTS, breakpoint);

export const mediaQuery = (breakpoint, style) => {
  if (!breakpoint) {
    return style;
  }

  if (!isValidBreakpoint(breakpoint)) {
    throw new Error(`Unknown breakpoint "${breakpoint}"`);
  }

  return `
    @media screen and (min-width: ${BREAKPOINTS[breakpoint]}px) {
      ${style}
    }
  `;
};

export const resolveModifiers = (name, values, value) => {
  if (value && typeof value === "object") {
    return Object.entries(value)
      .reduce((acc, [breakpoint, bpValue]) => {
        if (
          !isValidBreakpoint(breakpoint) ||
          !Object.prototype.hasOwnProperty.call(values, bpValue)
        ) {
          return acc;
        }

        acc.push(`${name}--${bpValue}--${breakpoint}`);
        return acc;
      }, [])
      .join(" ");
  }
  if (Object.prototype.hasOwnProperty.call(values, value)) {
    return `${name}--${value}`;
  }

  return null;
};

export const modifierPropType = (type) =>
  PropTypes.oneOfType([
    type.isRequired,
    PropTypes.shape(
      Object.keys(BREAKPOINTS).reduce((acc, breakpoint) => {
        acc[breakpoint] = type;
        return acc;
      }, {}),
    ).isRequired,
  ]);

export const createModifierValueRule = (breakpoint, name, value, rule) =>
  `&.${name}--${value}${breakpoint ? `--${breakpoint}` : ""} {${rule}}`;

export const createModifierRules = (breakpoint, name, values) =>
  Object.entries(values).reduce(
    (rules, [value, rule]) =>
      `${rules}${createModifierValueRule(breakpoint, name, value, rule)}`,
    "",
  );

export const createModifiersRules = (breakpoint, modifiers) =>
  Object.entries(modifiers).reduce(
    (rules, [name, values]) =>
      `${rules}${createModifierRules(breakpoint, name, values)}`,
    "",
  );

export const createModifiersMedias = (modifiers) =>
  [null]
    .concat(Object.keys(BREAKPOINTS))
    .reduce(
      (queries, breakpoint) =>
        `${queries}${mediaQuery(
          breakpoint,
          createModifiersRules(breakpoint, modifiers),
        )}`,
      "",
    );

export const createModifierResolvers = (modifiers) => {
  const resolvers = Object.entries(modifiers).reduce((acc, [name, values]) => {
    acc[name] = (value) => resolveModifiers(name, values, value);
    return acc;
  }, {});

  const resolve = (properties) => {
    const classNames = Object.entries(properties).reduce(
      (acc, [name, value]) => {
        const className = resolvers[name]?.(value);

        if (className) {
          acc.push(className);
        }

        return acc;
      },
      [],
    );

    return classNames.length ? classNames.join(" ") : null;
  };

  return {
    resolve,
    resolvers,
  };
};

export const createModifiers = (modifiers) => {
  const style = createModifiersMedias(modifiers);
  const { resolve, resolvers } = createModifierResolvers(modifiers);

  return {
    style,
    resolve,
    resolvers,
  };
};
