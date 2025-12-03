import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import type { PropFieldProps } from '../prop-field-factory'

export function BooleanPropField({
  label,
  value,
  onChange,
}: PropFieldProps) {
  return (
    <div className="flex items-center space-x-2">
      <Checkbox
        id={label}
        checked={Boolean(value ?? false)}
        onCheckedChange={(checked) => onChange(checked)}
      />
      <Label
        htmlFor={label}
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        {label}
      </Label>
    </div>
  )
}

