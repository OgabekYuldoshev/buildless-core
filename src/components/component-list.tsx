import type { ComponentId } from '@/core'
import { useBuilder } from '@/hooks/use-builder'
import { useEffect, useMemo, useRef, useState } from 'react'
import { ComponentWrapper } from './component-wrapper'
import { ComponentRender } from './component-render'
import { dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter'
import type { ComponentType } from '@/fields'
import { cn } from '@/lib/utils'
import { GroupDropIndicator } from '@atlaskit/pragmatic-drag-and-drop-react-drop-indicator/group';

type BaseDragData = {
    sourceType: 'base'
    type: ComponentType
}

type NodeDragData = {
    sourceType: 'node'
    id: ComponentId
    parentId: ComponentId | null
    index: number
}

type DragData = BaseDragData | NodeDragData

interface EmptyDropProps {
    parentId: ComponentId | null
}

function EmptyDrop({ parentId }: EmptyDropProps) {
    const ref = useRef<HTMLDivElement>(null)
    const [isOver, setIsOver] = useState(false)
    const { insert, move, state } = useBuilder()

    // Calculate depth of a component in the tree (0 = root level)
    const calculateDepth = (parentId: ComponentId | null): number => {
        if (parentId === null) return 0
        let depth = 0
        let currentParentId: ComponentId | null = parentId
        while (currentParentId !== null) {
            const parentNode: { parentId: ComponentId | null } | undefined = state[currentParentId]
            if (!parentNode) break
            depth++
            currentParentId = parentNode.parentId
        }
        return depth
    }

    useEffect(() => {
        const element = ref.current
        if (!element) return

        return dropTargetForElements({
            element,
            canDrop: ({ source }) => {
                const data = source.data as DragData | undefined
                if (!data) return false

                // Calculate target depth (this list's parent depth)
                const targetDepth = calculateDepth(parentId)
                
                // Maximum depth is 3 (0, 1, 2, 3), so if targetDepth is already 3,
                // we cannot add more nested components
                if (targetDepth >= 3) {
                    return false
                }

                if (data.sourceType === 'base') {
                    return true
                }

                if (data.sourceType === 'node') {
                    const sourceId = data.id

                    if (parentId === sourceId) return false

                    let currentParent = parentId
                    while (currentParent) {
                        if (currentParent === sourceId) return false
                        const parentNode = state[currentParent]
                        currentParent = parentNode?.parentId ?? null
                    }

                    return true
                }

                return false
            },
            onDragEnter: () => setIsOver(true),
            onDragLeave: () => setIsOver(false),
            onDrop: ({ source }) => {
                setIsOver(false)
                const data = source.data as DragData

                if (data.sourceType === 'base') {
                    insert({
                        type: data.type,
                        parentId,
                        index: 0,
                    })
                }

                if (data.sourceType === 'node') {
                    move({
                        id: data.id,
                        parentId,
                        index: 0,
                    })
                }
            },
        })
    }, [insert, move, parentId, state])

    return (
        <div
            ref={ref}
            className={cn(
                "w-full max-w-4xl mx-auto border border-dashed rounded-md py-6 text-sm text-muted-foreground flex items-center justify-center",
                isOver && "border-primary bg-primary/5 text-primary"
            )}
        >
            Drop component here
        </div>
    )
}

interface ComponentListProps {
    parentId: ComponentId | null
}

export function ComponentList({ parentId }: ComponentListProps) {
    const { rootIds, childrenIds } = useBuilder()

    const componentIds = useMemo(() => {
        if (parentId === null) return rootIds
        return (childrenIds[parentId] ?? []) as ComponentId[]
    }, [parentId, rootIds, childrenIds])

    if (componentIds.length === 0) {
        return <EmptyDrop parentId={parentId} />
    }

    return (
            <div className="w-full max-w-4xl mx-auto space-y-2">
                {componentIds.map((id, index) => (
                    <ComponentWrapper
                        key={id}
                        componentId={id}
                        parentId={parentId}
                        index={index}
                    >
                        <ComponentRender componentId={id} />
                    </ComponentWrapper>
                ))}
            </div>

    )
}
