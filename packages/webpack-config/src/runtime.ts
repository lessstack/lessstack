import type { LessstackRuntimeProps } from "./types";

declare global {
  const LESSSTACK_RUNTIME_PROPS: LessstackRuntimeProps | undefined;
  let __webpack_public_path__: string | undefined;
}

try {
  if (typeof LESSSTACK_RUNTIME_PROPS?.webpackPublicPath === "string") {
    __webpack_public_path__ = LESSSTACK_RUNTIME_PROPS?.webpackPublicPath;

    if (
      __webpack_public_path__.length &&
      __webpack_public_path__[__webpack_public_path__.length - 1] !== "/"
    ) {
      __webpack_public_path__ += "/";
    }
  }
} catch (e) {
  console.error(e);
}
