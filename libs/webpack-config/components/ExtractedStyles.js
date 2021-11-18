import { useContext } from "react";
import { Context } from "./RenderProvider.js";

const ExtractedStyles = () => {
  const { styles, collector } = useContext(Context);
  collector.stylesAdded = true;
  return styles;
};

export default ExtractedStyles;
