import React from "react";
import { css } from "@witb/config-webpack/utils";

const HelloWorldPage = () => (
  <div>
    Hello <span className={style}>World</span>!
  </div>
);

export default HelloWorldPage;

const style = css`
  color: #ff22cc;
`;
