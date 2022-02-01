import React from "react";
import ExtractedScripts from "./ExtractedScripts.js";
import ExtractedLinks from "./ExtractedLinks.js";
import ExtractedStyles from "./ExtractedStyles.js";
import Root from "./Root.js";

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
