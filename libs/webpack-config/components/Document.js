import React from "react";
import ExtractedScripts from "./ExtractedScripts";
import ExtractedLinks from "./ExtractedLinks";
import ExtractedStyles from "./ExtractedStyles";
import Root from "./Root";

const Document = () => (
  <html lang="en">
    <head>
      <ExtractedLinks />
      <ExtractedStyles />
    </head>
    <body>
      <Root />
      <ExtractedScripts />
    </body>
  </html>
);

export default Document;
