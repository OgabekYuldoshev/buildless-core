import { useBuilder } from '@/hooks/use-builder'
import { useSelection } from '@/hooks/use-selection'
import { createPropField, inferPropType } from './prop-field-factory'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'

export function PropsEditor() {
  const { selectedId, clearSelection } = useSelection()
  const { state, update } = useBuilder()

  if (!selectedId) {
    return (
      <div className="flex items-center justify-center h-full p-8">
        <div className="text-center space-y-2">
          <p className="text-sm font-medium text-muted-foreground">
            No component selected
          </p>
          <p className="text-xs text-muted-foreground">
            Click on a component in the canvas to edit its properties
          </p>
        </div>
      </div>
    )
  }

  const componentNode = state[selectedId]

  if (!componentNode) {
    return (
      <div className="flex items-center justify-center h-full p-8">
        <p className="text-sm text-muted-foreground">
          Component not found
        </p>
      </div>
    )
  }

  const handlePropChange = (propKey: string, value: unknown) => {
    update({
      id: selectedId,
      values: {
        [propKey]: value,
      } as Partial<typeof componentNode.props>,
    })
  }

  const props = componentNode.props as unknown as Record<string, unknown>
  const propEntries = Object.entries(props)

  return (
    <div className="h-full flex flex-col">
      {/* Header with close button */}
      <div className="flex items-center justify-between p-4 border-b bg-background">
        <div className="space-y-0.5">
          <h2 className="text-base font-semibold">Component Properties</h2>
          <p className="text-xs text-muted-foreground">
            {componentNode.type}
          </p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={clearSelection}
          className="h-8 w-8"
          title="Close"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </Button>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6 space-y-6">
          {propEntries.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              This component has no editable properties
            </p>
          ) : (
            <div className="space-y-4">
              {propEntries.map(([propKey, propValue]) => {
                const propType = inferPropType(
                  propValue,
                  propKey,
                  componentNode.type
                )

                return (
                  <div key={propKey}>
                    {createPropField(
                      propType,
                      {
                        label: formatPropLabel(propKey),
                        value: propValue,
                        onChange: (value) => handlePropChange(propKey, value),
                        propKey,
                        componentId: selectedId,
                        componentType: componentNode.type,
                      }
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function formatPropLabel(key: string): string {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (str) => str.toUpperCase())
    .trim()
}
