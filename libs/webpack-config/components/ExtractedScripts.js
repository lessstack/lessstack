import { useContext } from "react";
import { Context } from "./RenderProvider.js";

const ExtractedScripts = () => {
  const { scripts, collector } = useContext(Context);
  collector.scriptsAdded = true;
  return scripts;
};

export default ExtractedScripts;
