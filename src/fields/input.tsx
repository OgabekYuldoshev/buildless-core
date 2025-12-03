
import type { ComponentConfig } from "@/core";
import { Label } from "@/components/ui/label";
import { Input as InputBase } from "@/components/ui/input";

export interface InputProps {
  label: string;
  placeholder: string;
}

export const Input: ComponentConfig<InputProps> = {
  defaultProps: {
    label: "Label here",
    placeholder: "Placeholder here",
  },
};

export function InputRender({ label, placeholder }: InputProps) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={label}>{label}</Label>
      <InputBase id={label} placeholder={placeholder} disabled />
    </div>
  )
}