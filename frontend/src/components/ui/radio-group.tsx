import * as React from "react";

export function RadioGroup({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>;
}

export function RadioGroupItem({ value }: { value: string }) {
  return <input type="radio" value={value} />;
}
