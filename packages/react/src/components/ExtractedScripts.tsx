import type { FC } from "react";
import { useContext } from "react";
import RenderContext from "../contexts/Render.js";

const ExtractedScripts: FC = () => {
  const { collector, scripts } = useContext(RenderContext);
  collector.scriptsAdded = true;
  return <>{scripts}</>;
};

export default ExtractedScripts;