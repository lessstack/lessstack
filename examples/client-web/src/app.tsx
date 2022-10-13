import { Links, Scripts, Styles } from "@lessstack/react/build";

const App = () => (
  <html lang="en">
    <head>
      <title>Example web</title>
      <Links />
      <Styles />
    </head>
    <body>
      Hello world
      <Scripts />
    </body>
  </html>
);

export default App;
