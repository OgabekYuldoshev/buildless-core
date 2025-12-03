import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { PropFieldProps } from '../prop-field-factory'

interface SelectPropFieldProps extends PropFieldProps {
  options: { label: string; value: string }[]
}

export function SelectPropField({
  label,
  value,
  onChange,
  options,
}: SelectPropFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={label}>{label}</Label>
      <Select
        value={String(value ?? '')}
        onValueChange={(newValue) => onChange(newValue)}
      >
        <SelectTrigger id={label} className="w-full">
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

