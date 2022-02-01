import { useContext } from "react";
import { RenderContext } from "./RenderProvider.js";

const ExtractedScripts = () => {
  const { scripts, collector } = useContext(RenderContext);
  collector.scriptsAdded = true;
  return scripts;
};

export default ExtractedScripts;
