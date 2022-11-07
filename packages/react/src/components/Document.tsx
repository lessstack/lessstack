import type { FC, HTMLAttributes } from "react";

import ExtractedLinks from "./ExtractedLinks";
import ExtractedScripts from "./ExtractedScripts";
import ExtractedStyles from "./ExtractedStyles";
import Root from "./Root";

const Document: FC<{
  bodyProps?: HTMLAttributes<HTMLBodyElement>;
  headProps?: HTMLAttributes<HTMLHeadElement>;
  htmlProps?: HTMLAttributes<HTMLElement>;
  rootProps?: HTMLAttributes<HTMLElement>;
  title?: string;
}> = ({
  bodyProps = {},
  headProps = {},
  htmlProps = {},
  rootProps = {},
  title = null,
} = {}) => (
  <html lang="en" {...htmlProps}>
    <head {...headProps}>
      <meta charSet="UTF-8" />
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0, shrink-to-fit=no"
      />
      <title>{title ?? "Lessstack App"}</title>
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
