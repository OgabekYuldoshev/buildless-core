
import type { ComponentConfig } from "@/core";

export interface SelectProps {
  label: string;
  placeholder: string;
  options: { label: string; value: string }[];
  multiple: boolean;
}

export const Select: ComponentConfig<SelectProps> = {
  defaultProps: {
    label: "Label here",
    placeholder: "Placeholder here",
    options: [],
    multiple: false,
  },
};
