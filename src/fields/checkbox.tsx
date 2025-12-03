
import type { ComponentConfig } from "@/core";
import { Label } from "@/components/ui/label";
import { Checkbox as CheckboxBase } from "@/components/ui/checkbox";

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


export function CheckboxRender({ label, options }: CheckboxProps) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={label}>{label}</Label>
      <div className="flex flex-col gap-2 flex-wrap">
        {options.map((option) => (
          <CheckboxBase key={option.value} value={option.value}>{option.label}</CheckboxBase>
        ))}
      </div>
    </div>
  )
}