
import { Label } from "@/components/ui/label";
import { Select as SelectBase, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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


export function SelectRender({ label, placeholder, options, multiple = false }: SelectProps) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={label}>{label} {multiple ? "(Multiple)" : ""}</Label>
      <SelectBase disabled>
        <SelectTrigger className="w-full">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.length === 0 ? (
            <SelectItem value="placeholder" disabled>No options</SelectItem>
          ) : (
            options.map((option) => (
              <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
            ))
          )}
        </SelectContent>
      </SelectBase>
    </div>
  )
}