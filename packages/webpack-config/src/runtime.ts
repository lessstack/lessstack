import type { LessstackRuntimeProps } from "./types";

declare global {
  const __LESSSTACK_RUNTIME_PROPS__: LessstackRuntimeProps | undefined;
  let __webpack_public_path__: string | undefined;
}

try {
  if (typeof __LESSSTACK_RUNTIME_PROPS__?.webpackPublicPath === "string") {
    __webpack_public_path__ = __LESSSTACK_RUNTIME_PROPS__?.webpackPublicPath;

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
