
import type { ComponentConfig } from "@/core";

export interface CheckboxProps {
  label: string;
  options: { label: string; value: string }[];
}

export const Checkbox: ComponentConfig<CheckboxProps> = {
  defaultProps: {
    label: "Label here",
    options: [],
  },
};
