
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
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


export function RadioRender({ label, options }: RadioProps) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={label}>{label}</Label>
      <RadioGroup id={label}>
        {options.map((option) => (
          <RadioGroupItem key={option.value} value={option.value}>{option.label}</RadioGroupItem>
        ))}
      </RadioGroup>
    </div>
  )
}