import type { FC } from "react";
import { Link } from "react-router-dom";
import routes from "../routes";

const PageA: FC = () => (
  <>
    <div>PageA</div>
    <Link to={routes.pageB}>PageB</Link>
  </>
);

export default PageA;
