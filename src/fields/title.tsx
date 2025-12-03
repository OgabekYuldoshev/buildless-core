import type { ComponentConfig } from "@/core";
import { cn } from "@/lib/utils";

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


export function TitleRender({ content, size = 'md' }: TitleProps) {
  const sizes = {
    sm: 'text-sm',
    md: 'text-md',
    lg: 'text-lg',
  }
  return (
    <h1 className={cn('text-foreground font-semibold', sizes[size])}>
      {content}
    </h1>
  )
}