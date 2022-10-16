import { Config, loadable } from "@lessstack/react";
import type { FC } from "react";
import { Suspense } from "react";
import logo from "./logo.svg";

const PageA = loadable(() => import("./pages/PageA"));

const App: FC = () => (
  <Config rootId="example-client-web">
    Hello world
    <Suspense fallback="ok">
      <PageA />
    </Suspense>
    <img alt="" src={logo} />
  </Config>
);

export default App;
