import { useContext } from "react";
import type { FC } from "react";

import RenderContext from "../contexts/Render";

const ExtractedLinks: FC = () => {
  const { collector, links } = useContext(RenderContext);
  collector.linksAdded = true;
  return <>{links}</>;
};

export default ExtractedLinks;
