
import type { ComponentConfig } from "@/core";

export interface RadioProps {
  label: string;
  options: { label: string; value: string }[];
}

export const Radio: ComponentConfig<RadioProps> = {
  defaultProps: {
    label: "Label here",
    options: [],
  },
};
