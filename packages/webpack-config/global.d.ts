/// <reference types="react" />

/**
 * Markdown/MDX
 */
declare module "*.md" {
  const component: React.JSXElementConstructor<Record<string, unknown>>;
  export default component;
}
declare module "*.mdx" {
  const component: React.JSXElementConstructor<Record<string, unknown>>;
  export default component;
}

/**
 * Images
 */
declare module "*.gif" {
  const src: string;
  export default src;
}

declare module "*.jpg" {
  const src: string;
  export default src;
}

declare module "*.jpeg" {
  const src: string;
  export default src;
}

declare module "*.png" {
  const src: string;
  export default src;
}

/**
 * Fonts
 */
declare module "*.eot" {
  const src: string;
  export default src;
}

declare module "*.ttf" {
  const src: string;
  export default src;
}

declare module "*.woff" {
  const src: string;
  export default src;
}

declare module "*.woff2" {
  const src: string;
  export default src;
}

/**
 * Misc
 */
declare module "*.svg" {
  const src: string;
  export default src;
}
