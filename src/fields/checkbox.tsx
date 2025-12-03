
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
        {options.length === 0 ? (
          <div className="flex items-center space-x-2">
            <CheckboxBase value="placeholder" disabled />
            <Label htmlFor="placeholder" className="text-sm font-normal text-muted-foreground">
              No options
            </Label>
          </div>
        ) : (
          options.map((option) => (
            <div key={option.value} className="flex items-center space-x-2">
              <CheckboxBase value={option.value} disabled />
              <Label htmlFor={option.value} className="text-sm font-normal cursor-not-allowed">
                {option.label}
              </Label>
            </div>
          ))
        )}
      </div>
    </div>
  )
}