import { useContext } from "react";
import { Context } from "./RenderProvider";

const ExtractedStyles = () => {
  const { styles, collector } = useContext(Context);
  collector.stylesAdded = true;
  return styles;
};

export default ExtractedStyles;
