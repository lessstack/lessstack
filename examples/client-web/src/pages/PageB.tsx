import { Link } from "react-router-dom";
import type { FC } from "react";

import routes from "../routes";

const PageB: FC = () => (
  <>
    <div>PageB</div>
    <Link to={routes.pageA}>PageA</Link>
  </>
);

export default PageB;
