import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import type { PropFieldProps } from '../prop-field-factory'

export function NumberPropField({
  label,
  value,
  onChange,
}: PropFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={label}>{label}</Label>
      <Input
        id={label}
        type="number"
        value={Number(value ?? 0)}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full"
      />
    </div>
  )
}

