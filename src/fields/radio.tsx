
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
      <RadioGroup id={label} disabled>
        {options.length === 0 ? (
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="placeholder" disabled id="placeholder" />
            <Label htmlFor="placeholder" className="text-sm font-normal text-muted-foreground">
              No options
            </Label>
          </div>
        ) : (
          options.map((option) => (
            <div key={option.value} className="flex items-center space-x-2">
              <RadioGroupItem value={option.value} id={option.value} />
              <Label htmlFor={option.value} className="text-sm font-normal cursor-not-allowed">
                {option.label}
              </Label>
            </div>
          ))
        )}
      </RadioGroup>
    </div>
  )
}