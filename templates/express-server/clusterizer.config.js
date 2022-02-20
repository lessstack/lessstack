export default async () => {
  const client = await loadClient();
  const NODE_ENV = process.env.NODE_ENV || "development";

  return NODE_ENV === "development"
    ? {
        env: { NODE_ENV },
        watch: ["./src", client.nodeStatsPath, client.browserStatsPath],
        maxInstances: 3,
        minInstances: 1,
      }
    : {
        env: { NODE_ENV },
        maxInstances: 1,
        minInstances: 0,
        maxFailures: 0,
        logs: false,
      };
};

const loadClient = async (first = true) => {
  try {
    return (await import("@witb/web-client")).default;
  } catch (err) {
    if (first) {
      process.stdout.write("Waiting for the client to be built… ");
    }

    const client = await new Promise((resolve) =>
      setTimeout(() => resolve(loadClient(false)), 500),
    );

    if (first) {
      process.stdout.write("\x1b[32mdone!\x1b[0m\n");
    }

    return client;
  }
};
