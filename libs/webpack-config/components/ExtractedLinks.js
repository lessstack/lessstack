import { useContext } from "react";
import { RenderContext } from "./RenderProvider.js";

const ExtractedLinks = () => {
  const { links, collector } = useContext(RenderContext);
  collector.linksAdded = true;
  return links;
};

export default ExtractedLinks;
