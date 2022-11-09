import type {
  LessstackBuildProps as LessstackWebpackBuildProps,
  LessstackRuntimeProps as LessstackWebpackRuntimeProps,
} from "@lessstack/webpack-config/types";
import type {
  ComponentType,
  ReactElement,
  ReactHTML,
  ReactHTMLElement,
} from "react";

export type RootId = string;
export type InitialProps = object;

export type InitialPropsOption<Props extends object = object> =
  keyof Props extends never
    ? Props extends Record<string, never>
      ? { initialProps?: Record<string, never> }
      : { initialProps: undefined }
    : {
        initialProps: Props;
      };

export type ComponentOption<Props extends object = object> = {
  component: ComponentType<Props>;
};

export type RendererBaseOptions<Props extends object = object> =
  ComponentOption<Props> & InitialPropsOption<Props>;

export type RenderOptions<Props extends object = object> = {
  doctype: string;
  document: ComponentType<Props>;
  hydratation: "all" | "selective";
  initialProps: object;
  response: {
    // headers: Record<Lowercase<string>, string>;
    headers: Record<string, string>;
    statusCode: number;
    statusMessage: string;
  };
  rootId: RootId;
  statsPath: string;
};

export type LessstackRuntimeProps = LessstackWebpackRuntimeProps & {
  initialProps: InitialProps;
  rootId: RootId;
};

export type RenderExtraction = {
  linkElements: ReactHTMLElement<HTMLLinkElement>[];
  scriptElements: ReactHTMLElement<HTMLScriptElement>[];
  styleElements: ReactHTMLElement<HTMLStyleElement>[];
};

declare global {
  const LESSSTACK_BUILD_PROPS: LessstackWebpackBuildProps;
  const LESSSTACK_RUNTIME_PROPS: LessstackRuntimeProps;
}
