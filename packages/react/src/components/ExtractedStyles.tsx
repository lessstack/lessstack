import { useContext } from "react";
import type { FC } from "react";

import RenderContext from "../contexts/Render";

const ExtractedStyles: FC = () => {
  const { collector, extraction } = useContext(RenderContext);
  collector.stylesAdded = true;
  return <>{extraction.styleElements}</>;
};

export default ExtractedStyles;
