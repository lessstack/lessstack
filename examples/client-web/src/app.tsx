import { Links, Scripts, Styles } from "@lessstack/react";
import logo from "./logo.svg";

const App = () => (
  <html lang="en">
    <head>
      <title>Example web</title>
      <Links />
      <Styles />
    </head>
    <body>
      Hello world
      <img alt="" src={logo} />
      <Scripts />
    </body>
  </html>
);

export default App;
