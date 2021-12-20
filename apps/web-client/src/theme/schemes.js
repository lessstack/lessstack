import { indigo10, indigo70, gray10, gray90 } from "./colors.js";

export const light = {
  background: gray10,
  border: indigo10,
  text: gray90,
};

export const dark = {
  background: gray90,
  border: indigo70,
  text: gray10,
};

export const properties = {
  background: "--theme-scheme-background",
  border: "--theme-scheme-border",
  text: "--theme-scheme-text",
};

export const variables = {
  background: `var(${properties.background})`,
  border: `var(${properties.border})`,
  text: `var(${properties.text})`,
};

export const apply = (scheme) => `
  --theme-scheme-background: ${scheme.background};
  --theme-scheme-border: ${scheme.border};
  --theme-scheme-text: ${scheme.text};
`;
