import React from "react";
import { render } from "../jest";
import Error404Page from "./Error404Page";

it("renders", () => {
  expect(render(<Error404Page />).container).toMatchSnapshot();
});

it("sets response.statusCode to 404", () => {
  const response = { headers: {} };
  render(<Error404Page response={response} />);

  expect(response.statusCode).toEqual(404);
});
