import React from "react";
import { render } from "../entries/jest";
import HomePage from "./HomePage";

it("renders", () => {
  expect(render(<HomePage />).container).toMatchSnapshot();
});
