
import type { ComponentConfig } from "@/core";
import { Textarea as TextareaBase } from '@/components/ui/textarea'
import { Label } from "@/components/ui/label";

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

export function TextareaRender({ label, placeholder, rows = 3 }: TextareaProps) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={label}>{label}</Label>
      <TextareaBase id={label} placeholder={placeholder} rows={rows} />
    </div>
  )
}