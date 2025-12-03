import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import type { PropFieldProps } from '../prop-field-factory'

export function StringPropField({
  label,
  value,
  onChange,
}: PropFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={label}>{label}</Label>
      <Input
        id={label}
        type="text"
        value={String(value ?? '')}
        onChange={(e) => onChange(e.target.value)}
        className="w-full"
      />
    </div>
  )
}

