import type { ComponentId } from '@/core'
import { useBuilder } from '@/hooks/use-builder'
import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Button } from './ui/button'
import { GripHorizontalIcon } from 'lucide-react'
import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine'
import {
    draggable,
    dropTargetForElements,
    type ElementDropTargetEventBasePayload,
} from '@atlaskit/pragmatic-drag-and-drop/element/adapter'
import {
    attachClosestEdge,
    type Edge,
    extractClosestEdge,
} from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge'
import DropIndicator from '@atlaskit/pragmatic-drag-and-drop-react-drop-indicator/box'
import { cn } from '@/lib/utils'

import type { ComponentType } from '@/fields'

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

type TargetData = {
    componentId: ComponentId
    parentId: ComponentId | null
    index: number
}

interface ComponentWrapperProps {
    componentId: ComponentId
    parentId: ComponentId | null
    index: number
    children: React.ReactNode
}

export const ComponentWrapper = memo(function ComponentWrapperInternal({
    componentId,
    parentId,
    index,
    children,
}: ComponentWrapperProps) {
    const { state, rootIds, childrenIds, insert, move } = useBuilder()
    const elementRef = useRef<HTMLDivElement>(null)
    const [isDragging, setIsDragging] = useState(false)
    const [closestEdge, setClosestEdge] = useState<Edge | null>(null)
    const [isHovered, setIsHovered] = useState(false)

    const dragData = useMemo<NodeDragData>(
        () => ({
            sourceType: 'node',
            id: componentId,
            parentId,
            index,
        }),
        [componentId, parentId, index],
    )

    const handleDropIndicatorChange = useCallback(
        ({ source, self }: ElementDropTargetEventBasePayload) => {
            const element = elementRef.current
            if (!element || source.element === element) {
                setClosestEdge(null)
                return
            }

            const sourceData = source.data as DragData
            const targetData = self.data as TargetData
            const edge = extractClosestEdge(self.data)

            if (!edge) {
                setClosestEdge(null)
                return
            }

            // For base items we always show indicator
            if (sourceData.sourceType === 'base') {
                setClosestEdge(edge)
                return
            }

            // For existing nodes, hide indicator if it would be a no-op move in the same list
            if (sourceData.sourceType === 'node' && sourceData.parentId === targetData.parentId) {
                const siblings =
                    targetData.parentId === null
                        ? rootIds
                        : (childrenIds[targetData.parentId] ?? [])

                const sourceIndex = siblings.indexOf(sourceData.id)
                const targetIndex = siblings.indexOf(targetData.componentId)

                const isItemBeforeSource = targetIndex === sourceIndex - 1
                const isItemAfterSource = targetIndex === sourceIndex + 1
                const isSameItem = targetIndex === sourceIndex

                const isDropIndicatorHidden =
                    isSameItem ||
                    (isItemBeforeSource && edge === 'bottom') ||
                    (isItemAfterSource && edge === 'top')

                setClosestEdge(isDropIndicatorHidden ? null : edge)
                return
            }

            setClosestEdge(edge)
        },
        [childrenIds, rootIds],
    )

    const handleDragLeave = useCallback(() => {
        setClosestEdge(null)
    }, [])

    const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        const target = e.target as HTMLElement
        const currentTarget = e.currentTarget as HTMLElement
        
        // Find the closest ComponentWrapper from the target
        const nestedWrapper = target.closest('[data-component-wrapper]') as HTMLElement
        
        // Only set hover if the nested wrapper is this element itself
        // If target is inside a different ComponentWrapper, don't hover this one
        if (nestedWrapper === currentTarget) {
            setIsHovered(true)
        } else if (nestedWrapper && nestedWrapper !== currentTarget) {
            // Mouse is over a nested ComponentWrapper, so don't hover parent
            setIsHovered(false)
        } else {
            // Target is not a ComponentWrapper, so hover this element
            setIsHovered(true)
        }
    }, [])

    const handleMouseEnter = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        const target = e.target as HTMLElement
        const currentTarget = e.currentTarget as HTMLElement
        
        // Find the closest ComponentWrapper from the target
        const nestedWrapper = target.closest('[data-component-wrapper]') as HTMLElement
        
        // Only set hover if entering this element directly (not from a nested wrapper)
        if (nestedWrapper === currentTarget || !nestedWrapper) {
            const relatedTarget = e.relatedTarget as Node | null
            // Only set hover if coming from outside
            if (!relatedTarget || !currentTarget.contains(relatedTarget)) {
                setIsHovered(true)
            }
        }
    }, [])

    const handleMouseLeave = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        const relatedTarget = e.relatedTarget as Node | null
        const currentTarget = e.currentTarget as HTMLElement
        
        // Clear hover if leaving to outside
        if (!relatedTarget || !currentTarget.contains(relatedTarget)) {
            setIsHovered(false)
        } else {
            // If going to a nested ComponentWrapper, clear hover
            const nestedWrapper = (relatedTarget as Element)?.closest?.('[data-component-wrapper]') as HTMLElement
            if (nestedWrapper && nestedWrapper !== currentTarget) {
                setIsHovered(false)
            }
        }
    }, [])

    // Calculate depth of a component in the tree (0 = root level)
    const calculateDepth = useCallback((parentId: ComponentId | null): number => {
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
    }, [state])

    useEffect(() => {
        const element = elementRef.current
        if (!element) return

        return combine(
            draggable({
                element,
                getInitialData: () => dragData,
                onDragStart: () => {
                    setIsDragging(true)
                },
                onDrop: () => {
                    setIsDragging(false)
                },
            }),
            dropTargetForElements({
                element,
                canDrop({ source }) {
                    const data = source.data as DragData | undefined
                    if (!data) return false

                    // Calculate target depth (this wrapper's parent depth + 1)
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

                        // cannot drop "around" itself
                        if (sourceId === componentId) return false

                        // prevent moving a node into its own descendant
                        if (parentId) {
                            let currentParent: ComponentId | null = parentId
                            while (currentParent) {
                                if (currentParent === sourceId) return false
                                const nextParentNode = state[currentParent] as { parentId: ComponentId | null } | undefined
                                currentParent = nextParentNode ? nextParentNode.parentId : null
                            }
                        }

                        return true
                    }

                    return false
                },
                getData({ input }) {
                    const target: TargetData = {
                        componentId,
                        parentId,
                        index,
                    }

                    return attachClosestEdge(target, {
                        element,
                        input,
                        allowedEdges: ['top', 'bottom'],
                    })
                },
                onDragEnter: handleDropIndicatorChange,
                onDrag: handleDropIndicatorChange,
                onDragLeave: handleDragLeave,
                onDrop({ source, location, self }) {
                    setClosestEdge(null)

                    // Same innermost-guard as in canDrop: if this wrapper is
                    // not the innermost target, we let the inner target
                    // handle the drop (to avoid double inserts).
                    const innerMost = location.current.dropTargets[0]
                    if (!innerMost || innerMost.element !== self.element) {
                        return
                    }

                    const sourceData = source.data as DragData
                    const target = innerMost

                    const targetData = target.data as TargetData
                    const edge = extractClosestEdge(targetData)

                    if (!edge) return

                    const targetParentId = targetData.parentId

                    // Compute siblings in the destination list
                    const siblings =
                        targetParentId === null
                            ? rootIds
                            : (childrenIds[targetParentId] ?? [])

                    const targetIndexOriginal = siblings.indexOf(targetData.componentId)
                    const safeTargetIndex =
                        targetIndexOriginal === -1 ? siblings.length : targetIndexOriginal

                    // Dropping a new base component from the sidebar
                    if (sourceData.sourceType === 'base') {
                        let insertIndex = safeTargetIndex
                        if (edge === 'bottom') {
                            insertIndex = safeTargetIndex + 1
                        }

                        insert({
                            type: sourceData.type,
                            parentId: targetParentId,
                            index: insertIndex,
                        })
                        return
                    }

                    // Moving an existing node
                    if (sourceData.sourceType === 'node') {
                        const sourceId = sourceData.id

                        // Same parent: need to account for removal before reinsert
                        if (sourceData.parentId === targetParentId) {
                            const sourceIndex = siblings.indexOf(sourceId)
                            if (sourceIndex === -1) return

                            let destOriginal = safeTargetIndex
                            if (edge === 'bottom') {
                                destOriginal = safeTargetIndex + 1
                            }

                            let destFiltered = destOriginal
                            if (destOriginal > sourceIndex) {
                                destFiltered = destOriginal - 1
                            }

                            move({
                                id: sourceId,
                                parentId: targetParentId,
                                index: destFiltered,
                            })
                            return
                        }

                        // Different parent: we can use the simple index
                        let destIndex = safeTargetIndex
                        if (edge === 'bottom') {
                            destIndex = safeTargetIndex + 1
                        }

                        move({
                            id: sourceId,
                            parentId: targetParentId,
                            index: destIndex,
                        })
                    }
                },
            }),
        )
    }, [
        childrenIds,
        componentId,
        dragData,
        handleDropIndicatorChange,
        handleDragLeave,
        index,
        insert,
        move,
        parentId,
        rootIds,
        state,
    ])

    return (
        <div
            ref={elementRef}
            data-component-wrapper
            onMouseEnter={handleMouseEnter}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className={cn(
                "border p-4 rounded-lg gap-3 bg-background cursor-grab transition-shadow relative",
                isHovered && !isDragging && "ring-2 ring-primary/60",
                isDragging && "shadow-lg ring-2 ring-primary/60 opacity-80"
            )}
        >
            {children}
            {closestEdge && (
                <DropIndicator
                    edge={closestEdge}
                    gap="4px"
                    type="no-terminal"
                />
            )}
        </div>

    )
})
