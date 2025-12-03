import type { ComponentType } from "@/fields"
import { useBuilder } from "@/hooks/use-builder"
import { cn } from "@/lib/utils"
import { dropTargetForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter"
import { useEffect, useRef, useState } from "react"
import { ComponentList } from "./component-list"

type BaseDraggableComponentData = {
    sourceType: 'base',
    type: ComponentType,
}

export function Canvas() {
    const [isOver, setIsOver] = useState(false)
    const elementRef = useRef<HTMLDivElement>(null)
    const { rootIds, state, insert } = useBuilder()

    useEffect(() => {
        const element = elementRef.current
        if (!element) return
        if (rootIds.length > 0) return
        return dropTargetForElements({
            element,
            canDrop: ({ source }) => {
                const data = source.data as BaseDraggableComponentData
                return data.sourceType === 'base'
            },
            onDragEnter: () => {
                setIsOver(true)
            },
            onDragLeave: () => {
                setIsOver(false)
            },
            onDrop: ({ source }) => {
                setIsOver(false)
                const data = source.data as BaseDraggableComponentData

                if (data.sourceType === 'base') {
                    insert({
                        type: data.type,
                        index: 0,
                    })
                }
            },
        })
    }, [rootIds])

    if (rootIds.length === 0) {
        return (
            <main ref={elementRef} className={cn("flex-1", isOver && 'bg-muted')}>Canvas</main>
        )
    }

    return (
        <main className="flex-1 p-8">
            <ComponentList parentId={null} />
        </main>
    )
}
