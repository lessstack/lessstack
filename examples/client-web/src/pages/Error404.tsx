import { Config } from "@lessstack/react";
import { Link } from "react-router-dom";
import type { FC } from "react";

import routes from "../routes";

const Error404: FC = () => (
  <Config response={{ statusCode: 404 }}>
    <div>Error404</div>
    <Link to={routes.root}>Back</Link>
  </Config>
);

export default Error404;
