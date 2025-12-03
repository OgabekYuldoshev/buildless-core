import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Plus, Trash2 } from 'lucide-react'
import type { PropFieldProps } from '../prop-field-factory'

interface ArrayPropFieldProps extends PropFieldProps {
  arrayItemType: 'string' | 'object'
}

type ArrayItem = string | { label: string; value: string }

function isValidObjectItem(item: unknown): item is { label: string; value: string } {
  return (
    typeof item === 'object' &&
    item !== null &&
    'label' in item &&
    'value' in item &&
    typeof (item as { label: unknown }).label === 'string' &&
    typeof (item as { value: unknown }).value === 'string'
  )
}

function normalizeArrayItem(
  item: unknown,
  arrayItemType: 'string' | 'object'
): ArrayItem {
  if (arrayItemType === 'object') {
    if (isValidObjectItem(item)) {
      return item
    }
    return { label: '', value: '' }
  }
  return typeof item === 'string' ? item : String(item ?? '')
}

export function ArrayPropField({
  label,
  value,
  onChange,
  arrayItemType,
}: ArrayPropFieldProps) {
  const arrayValue = Array.isArray(value)
    ? value.map((item) => normalizeArrayItem(item, arrayItemType))
    : []

  const updateArray = (newArray: ArrayItem[]) => {
    onChange(newArray)
  }

  const addItem = () => {
    if (arrayItemType === 'object') {
      updateArray([...arrayValue, { label: '', value: '' }])
    } else {
      updateArray([...arrayValue, ''])
    }
  }

  const removeItem = (index: number) => {
    if (index < 0 || index >= arrayValue.length) return
    updateArray(arrayValue.filter((_, i) => i !== index))
  }

  const updateItem = (index: number, newValue: ArrayItem) => {
    if (index < 0 || index >= arrayValue.length) return
    const newArray = [...arrayValue]
    newArray[index] = newValue
    updateArray(newArray)
  }

  const updateObjectItem = (
    index: number,
    field: 'label' | 'value',
    newValue: string
  ) => {
    if (index < 0 || index >= arrayValue.length) return
    
    const currentItem = arrayValue[index]
    if (arrayItemType === 'object') {
      if (isValidObjectItem(currentItem)) {
        updateItem(index, { ...currentItem, [field]: newValue })
      } else {
        // If item is not in correct format, create new object with the new value
        const newItem: { label: string; value: string } = {
          label: field === 'label' ? newValue : '',
          value: field === 'value' ? newValue : '',
        }
        updateItem(index, newItem)
      }
    }
  }

  const getObjectItem = (item: ArrayItem, field: 'label' | 'value'): string => {
    if (arrayItemType === 'object' && isValidObjectItem(item)) {
      return item[field] ?? ''
    }
    return ''
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label>{label}</Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addItem}
          className="h-7"
        >
          <Plus className="h-3 w-3" />
        </Button>
      </div>

      <div className="space-y-2">
        {arrayValue.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-2">
            No items. Click + to add one.
          </p>
        ) : (
          arrayValue.map((item, index) => {
            // Use index as key since array order is stable during updates
            // React will handle re-renders correctly with index keys in this controlled scenario
            return (
              <div
                key={index}
                className="flex items-center gap-2 p-2 border rounded-md bg-background"
              >
                {arrayItemType === 'object' ? (
                  <div className="flex-1 grid grid-cols-2 gap-2">
                    <Input
                      placeholder="Label"
                      value={getObjectItem(item, 'label')}
                      onChange={(e) =>
                        updateObjectItem(index, 'label', e.target.value)
                      }
                      className="h-8"
                    />
                    <Input
                      placeholder="Value"
                      value={getObjectItem(item, 'value')}
                      onChange={(e) =>
                        updateObjectItem(index, 'value', e.target.value)
                      }
                      className="h-8"
                    />
                  </div>
                ) : (
                  <Input
                    value={String(item)}
                    onChange={(e) => updateItem(index, e.target.value)}
                    className="flex-1 h-8"
                  />
                )}
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeItem(index)}
                  className="h-8 w-8 p-0"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

