import type { ButtonHTMLAttributes, FC, ReactNode } from "react";

type ButtonProps = {
  children: ReactNode;
  isDisabled: boolean;
  type?: ButtonHTMLAttributes<HTMLButtonElement>["type"];
};

const Button: FC<ButtonProps> = ({
  children,
  isDisabled,
  type = "button",
}: ButtonProps) => (
  <button disabled={isDisabled} type={type}>
    {children}
  </button>
);

export default Button;
