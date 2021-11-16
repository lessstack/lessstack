import React from "react";
import { render } from "../jest";
import HomePage from "./HomePage";

it("renders", () => {
  expect(render(<HomePage />).container).toMatchSnapshot();
});
