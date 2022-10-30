import { Config, loadable } from "@lessstack/react";
import type { FC } from "react";
import { Route, Routes } from "react-router-dom";
import logo from "./logo.svg";
import routes from "./routes";

const Error404 = loadable(() => import("./pages/Error404"));
const PageA = loadable(() => import("./pages/PageA"));
const PageB = loadable(() => import("./pages/PageB"));

const App: FC = () => (
  <Config rootId="example-client-web">
    Hello world
    <Routes>
      <Route path={routes.pageA} element={<PageA />} />
      <Route path={routes.pageB} element={<PageB />} />
      <Route path="*" element={<Error404 />} />
    </Routes>
    <img alt="" src={logo} />
  </Config>
);

export default App;
