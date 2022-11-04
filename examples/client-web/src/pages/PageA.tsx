import { Link } from "react-router-dom";
import type { FC } from "react";

import routes from "../routes";

const PageA: FC = () => (
  <>
    <div>PageA</div>
    <Link to={routes.pageB}>PageB</Link>
  </>
);

export default PageA;
