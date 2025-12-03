import React from 'react'
import type { ComponentType } from '@/fields'
import type { ComponentId } from '@/core'
import { StringPropField } from './fields/string-prop-field'
import { NumberPropField } from './fields/number-prop-field'
import { BooleanPropField } from './fields/boolean-prop-field'
import { SelectPropField } from './fields/select-prop-field'
import { ArrayPropField } from './fields/array-prop-field'

export interface PropFieldProps {
  label: string
  value: unknown
  onChange: (value: unknown) => void
  propKey: string
  componentId: ComponentId
  componentType: ComponentType
}

export type PropFieldComponent = React.ComponentType<PropFieldProps>

interface PropTypeInfo {
  type: 'string' | 'number' | 'boolean' | 'select' | 'array'
  options?: { label: string; value: string }[]
  arrayItemType?: 'string' | 'object'
}

function isOptionsObject(obj: unknown): obj is { label: string; value: string } {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'label' in obj &&
    'value' in obj &&
    typeof (obj as { label: unknown }).label === 'string' &&
    typeof (obj as { value: unknown }).value === 'string'
  )
}

export function inferPropType(
  value: unknown,
  propKey: string,
  componentType: ComponentType
): PropTypeInfo {
  if (typeof value === 'string') {
    // Check if it's a select-like prop based on component type and key
    if (propKey === 'size' && ['Title'].includes(componentType)) {
      return {
        type: 'select',
        options: [
          { label: 'Small', value: 'sm' },
          { label: 'Medium', value: 'md' },
          { label: 'Large', value: 'lg' },
        ],
      }
    }
    return { type: 'string' }
  }

  if (typeof value === 'number') {
    return { type: 'number' }
  }

  if (typeof value === 'boolean') {
    return { type: 'boolean' }
  }

  if (Array.isArray(value)) {
    // If prop key is "options", treat as options array (label/value objects)
    if (propKey === 'options') {
      // Check if array has items and they are options objects
      if (value.length > 0 && isOptionsObject(value[0])) {
        return { type: 'array', arrayItemType: 'object' }
      }
      // Even if empty, if it's "options" prop, default to object type
      return { type: 'array', arrayItemType: 'object' }
    }
    
    // For other arrays, check the first item
    if (value.length > 0) {
      if (isOptionsObject(value[0])) {
        return { type: 'array', arrayItemType: 'object' }
      }
      if (typeof value[0] === 'object' && value[0] !== null) {
        return { type: 'array', arrayItemType: 'object' }
      }
    }
    return { type: 'array', arrayItemType: 'string' }
  }

  return { type: 'string' }
}

export function createPropField(
  propType: PropTypeInfo,
  props: PropFieldProps
): React.ReactElement | null {
  switch (propType.type) {
    case 'string':
      return <StringPropField {...props} />
    case 'number':
      return <NumberPropField {...props} />
    case 'boolean':
      return <BooleanPropField {...props} />
    case 'select':
      return (
        <SelectPropField
          {...props}
          options={propType.options || []}
        />
      )
    case 'array':
      return (
        <ArrayPropField
          {...props}
          arrayItemType={propType.arrayItemType || 'string'}
        />
      )
    default:
      return null
  }
}

