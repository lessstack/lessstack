import type { ButtonHTMLAttributes, FC, ReactNode } from "react";

declare type ButtonProps = {
  children: ReactNode;
  isDisabled: boolean;
  type?: ButtonHTMLAttributes<HTMLButtonElement>["type"];
};
declare const Button: FC<ButtonProps>;
export default Button;
// # sourceMappingURL=Button.d.ts.map
