export type RenderCollector = {
  linksAdded: boolean;
  rootAdded: boolean;
  scriptsAdded: boolean;
  stylesAdded: boolean;
};

export type RenderCollectorLogger = {
  error: (...obj: unknown[]) => void;
  log: (...obj: unknown[]) => void;
  warn: (...obj: unknown[]) => void;
};

export const defaultLogger: RenderCollectorLogger | null =
  (process.env.NODE_ENV ?? "development") === "development" ? console : null;

export const validateCollector = (
  collector: RenderCollector,
  logger: RenderCollectorLogger | null = defaultLogger,
) => {
  if (logger !== null) {
    if (!collector.scriptsAdded) {
      logger.warn(`Custom Document does not contain <ExtractedScripts />`);
    }

    if (!collector.linksAdded) {
      logger.warn(`Custom? Document does not contain <ExtractedLinks />`);
    }

    if (!collector.stylesAdded) {
      logger.warn(`Custom Document does not contain <ExtractedStyles />`);
    }
  }

  if (!collector.rootAdded) {
    throw new Error(`Custom Document does not contain <Root />`);
  }
};
