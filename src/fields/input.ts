
import type { ComponentConfig } from "@/core";

export interface InputProps {
  label: string;
  placeholder: string;
}

export const Input: ComponentConfig<InputProps> = {
  defaultProps: {
    label: "Label here",
    placeholder: "Placeholder here",
  },
};
