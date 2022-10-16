import ExtractedScripts from "./ExtractedScripts";
import ExtractedLinks from "./ExtractedLinks";
import ExtractedStyles from "./ExtractedStyles";
import Root from "./Root";
import type { FC, HTMLAttributes } from "react";

const Document: FC<{
  bodyProps?: HTMLAttributes<HTMLBodyElement>;
  headProps?: HTMLAttributes<HTMLHeadElement>;
  htmlProps?: HTMLAttributes<HTMLElement>;
  rootProps?: HTMLAttributes<HTMLElement>;
}> = ({
  bodyProps = {},
  headProps = {},
  htmlProps = {},
  rootProps = {},
} = {}) => (
  <html lang="en" {...htmlProps}>
    <head {...headProps}>
      <ExtractedLinks />
      <ExtractedStyles />
    </head>
    <body {...bodyProps}>
      <Root {...rootProps} />
      <ExtractedScripts />
    </body>
  </html>
);

export default Document;
