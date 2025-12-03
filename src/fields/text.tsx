import type { ComponentConfig } from "@/core";

export interface TextProps {
  content: string;
}

export const Text: ComponentConfig<TextProps> = {
  defaultProps: {
    content: "This is a text",
  },
};

export function TextRender({ content }: TextProps) {
  return (
    <p className="text-foreground">{content}</p>
  )
}