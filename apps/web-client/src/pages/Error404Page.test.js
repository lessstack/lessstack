/**
 * @jest-environment jsdom
 */
import React from "react";
import { render } from "@testing-library/react";
import Error404Page from "./Error404Page";
import JestContext from "../jest";

it("stets response.statusCode", () => {
  const response = { headers: {} };
  render(
    <JestContext>
      <Error404Page response={response} />
    </JestContext>,
  );

  expect(response.statusCode).toEqual(404);
});
