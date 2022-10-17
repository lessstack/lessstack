import { createContext } from "react";
import Document from "../components/Document";

import type { RenderOptions } from "../types";

const ConfigContext = createContext<RenderOptions>({
  doctype: "<!DOCTYPE html>",
  document: Document,
  hydratation: "all",
  initialProps: {},
  response: {
    headers: {} as RenderOptions["response"]["headers"],
    statusCode: 200,
    statusMessage: "",
  },
  rootId: "root",
  statsPath: "",
});

export default ConfigContext;
