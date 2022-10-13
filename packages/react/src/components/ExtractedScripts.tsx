import type { FC } from "react";
import { useContext } from "react";
import NodeContext from "./NodeContext.js";

const ExtractedScripts: FC = () => {
  const { collector, scripts } = useContext(NodeContext);
  collector.scriptsAdded = true;
  return <>{scripts}</>;
};

export default ExtractedScripts;
