import React from "react";
import { css } from "@linaria/core";
import reactIcon from "../images/react-icon.svg";

const HomePage = () => (
  <div>
    Hello <span className={style}>World</span>!
    <img alt="" src={reactIcon} />
  </div>
);

export default HomePage;

const style = css`
  color: #ff22cc;
`;
