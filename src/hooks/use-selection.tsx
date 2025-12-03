import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import type { ComponentId } from '@/core'

interface SelectionContextValue {
  selectedId: ComponentId | null
  select: (id: ComponentId | null) => void
  clearSelection: () => void
}

const SelectionContext = createContext<SelectionContextValue | null>(null)

interface SelectionProviderProps {
  children: ReactNode
}

export function SelectionProvider({ children }: SelectionProviderProps) {
  const [selectedId, setSelectedId] = useState<ComponentId | null>(null)

  const select = useCallback((id: ComponentId | null) => {
    setSelectedId(id)
  }, [])

  const clearSelection = useCallback(() => {
    setSelectedId(null)
  }, [])

  const value: SelectionContextValue = {
    selectedId,
    select,
    clearSelection,
  }

  return (
    <SelectionContext.Provider value={value}>
      {children}
    </SelectionContext.Provider>
  )
}

export function useSelection() {
  const context = useContext(SelectionContext)
  if (!context) {
    throw new Error('useSelection must be used within SelectionProvider')
  }
  return context
}

