/* eslint-env browser */
import React from "react";
import { hydrateRoot } from "react-dom";
import "./browser.entries";

// eslint-disable-next-line import/no-unresolved
import Client from "@witb/webpack-config/alias/client";

console.log("-----");
hydrateRoot(document.getElementById("app"), <Client />);
