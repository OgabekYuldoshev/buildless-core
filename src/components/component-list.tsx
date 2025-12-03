import type { ComponentId } from '@/core'
import { useBuilder } from '@/hooks/use-builder'
import { useMemo } from 'react'
import { ComponentWrapper } from './component-wrapper'
import { ComponentRender } from './component-render'

interface ComponentListProps {
    parentId: ComponentId | null
}
export function ComponentList({ parentId }: ComponentListProps) {
    const { rootIds, childrenIds } = useBuilder()

    const componentIds = useMemo(() => {
        if (parentId === null) return rootIds
        return (childrenIds[parentId] ?? []) as ComponentId[]
    }, [parentId])

    return (
        <div className="w-full max-w-4xl mx-auto">
            {componentIds.map((id) => (
                <ComponentWrapper key={id} componentId={id}>
                    <ComponentRender componentId={id} />
                </ComponentWrapper>
            ))}
        </div>
    )
}
