import { useContext } from "react";
import type { FC } from "react";

import RenderContext from "../contexts/Render.js";

const ExtractedStyles: FC = () => {
  const { collector, styles } = useContext(RenderContext);
  collector.stylesAdded = true;
  return <>{styles}</>;
};

export default ExtractedStyles;
