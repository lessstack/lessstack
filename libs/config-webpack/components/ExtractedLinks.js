import { useContext } from "react";
import { Context } from "./RenderProvider";

const ExtractedLinks = () => {
  const { links, collector } = useContext(Context);
  collector.linksAdded = true;
  return links;
};

export default ExtractedLinks;
