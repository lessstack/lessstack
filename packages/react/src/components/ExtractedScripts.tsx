import { useContext } from "react";
import type { FC } from "react";

import RenderContext from "../contexts/Render";

const ExtractedScripts: FC = () => {
  const { collector, extraction } = useContext(RenderContext);
  collector.scriptsAdded = true;
  return <>{extraction.scriptElements}</>;
};

export default ExtractedScripts;
