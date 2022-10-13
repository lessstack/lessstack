import type { FC } from "react";
import { useContext } from "react";
import NodeContext from "./NodeContext.js";

const ExtractedLinks: FC = () => {
  const { collector, links } = useContext(NodeContext);
  collector.linksAdded = true;
  return <>{links}</>;
};

export default ExtractedLinks;
