import * as React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline";
}

export function Button({ variant = "primary", className, ...props }: ButtonProps) {
  return (
    <button
      className={className}
      {...props}
    />
  );
}
