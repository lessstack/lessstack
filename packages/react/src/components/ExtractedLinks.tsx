import { useContext } from "react";
import type { FC } from "react";

import RenderContext from "../contexts/Render";

const ExtractedLinks: FC = () => {
  const { collector, extraction } = useContext(RenderContext);
  collector.linksAdded = true;
  return <>{extraction.linkElements}</>;
};

export default ExtractedLinks;
