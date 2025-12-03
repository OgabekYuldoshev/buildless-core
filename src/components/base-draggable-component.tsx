import { draggable } from '@atlaskit/pragmatic-drag-and-drop/element/adapter'
import { ExpandIcon } from "lucide-react"
import { SidebarMenuButton } from "./ui/sidebar"
import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'
import type { ComponentType } from '@/fields'

interface BaseDraggableComponentProps {
    type: ComponentType
}
export function BaseDraggableComponent({ type }: BaseDraggableComponentProps) {
    const elementRef = useRef<HTMLButtonElement>(null)
    const [isDragging, setIsDragging] = useState(false)

    useEffect(() => {
        const element = elementRef.current
        if (!element) return

        return draggable({
            element,
            getInitialData: () => ({
                sourceType: 'base',
                type,
            }),
            onDragStart: () => {
                setIsDragging(true)
            },
            onDrop: () => {
                setIsDragging(false)
            },
        })
    }, [type])

    return (
        <SidebarMenuButton
            ref={elementRef}
            className={
                cn('border cursor-grab', isDragging && 'bg-muted')
            }>
            <span>{type}</span>
            <ExpandIcon className="ml-auto" />
        </SidebarMenuButton>
    )
}
