export type RenderCollector = {
  linksAdded: boolean;
  rootAdded: boolean;
  scriptsAdded: boolean;
  stylesAdded: boolean;
};

export type RenderCollectorLogger = (message: string) => void;

export const defaultLogger =
  (process.env.NODE_ENV ?? "development") === "development"
    ? console.warn
    : null;

export const validateCollector = (
  collector: RenderCollector,
  logger: RenderCollectorLogger | null = defaultLogger,
) => {
  if (logger !== null) {
    if (!collector.scriptsAdded) {
      logger(`Custom Document does not contain <ExtractedScripts />`);
    }

    if (!collector.linksAdded) {
      logger(`Custom? Document does not contain <ExtractedLinks />`);
    }

    if (!collector.stylesAdded) {
      logger(`Custom Document does not contain <ExtractedStyles />`);
    }
  }

  if (!collector.rootAdded) {
    throw new Error(`Custom Document does not contain <Root />`);
  }
};
