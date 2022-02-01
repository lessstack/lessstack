import { useContext } from "react";
import { RenderContext } from "./RenderProvider.js";

const ExtractedStyles = () => {
  const { styles, collector } = useContext(RenderContext);
  collector.stylesAdded = true;
  return styles;
};

export default ExtractedStyles;
