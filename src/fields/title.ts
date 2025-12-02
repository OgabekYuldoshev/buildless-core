import type { ComponentConfig } from "@/core";

export interface TitleProps {
  content: string;
  size: "sm" | "md" | "lg";
}

export const Title: ComponentConfig<TitleProps> = {
  defaultProps: {
    content: "This is a title",
    size: "md",
  },
};
