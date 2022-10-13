import type { FC } from "react";
import { useContext } from "react";
import NodeContext from "./NodeContext.js";

const ExtractedStyles: FC = () => {
  const { collector, styles } = useContext(NodeContext);
  collector.stylesAdded = true;
  return <>{styles}</>;
};

export default ExtractedStyles;
