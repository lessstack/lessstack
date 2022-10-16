import type { FC, JSXElementConstructor } from "react";
import { useContext } from "react";
import RenderContext from "../contexts/Render";

const Root: FC<{
  as?: JSXElementConstructor<Record<string, unknown>> | string;
}> = ({ as: Component = "div", ...props }) => {
  const { collector, rootHtml, rootId } = useContext(RenderContext);
  collector.rootAdded = true;

  return (
    <Component
      {...props}
      id={rootId}
      dangerouslySetInnerHTML={{ __html: rootHtml }}
    />
  );
};

export default Root;
