
import type { ComponentConfig } from "@/core";

export interface TextareaProps {
  label: string;
  placeholder: string;
  rows: number;
}

export const Textarea: ComponentConfig<TextareaProps> = {
  defaultProps: {
    label: "Label here",
    placeholder: "Placeholder here",
    rows: 3,
  },
};
