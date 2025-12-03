import type { ComponentType } from "@/fields"
import { useBuilder } from "@/hooks/use-builder"
import { cn } from "@/lib/utils"
import { dropTargetForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter"
import { useEffect, useRef, useState } from "react"
import { Layout, ArrowDown, Code2 } from "lucide-react"
import { ComponentList } from "./component-list"
import { StateViewer } from "./state-viewer"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog"
import { Button } from "./ui/button"

type BaseDraggableComponentData = {
    sourceType: 'base',
    type: ComponentType,
}

export function Canvas() {
    const [isOver, setIsOver] = useState(false)
    const elementRef = useRef<HTMLDivElement>(null)
    const { rootIds, insert } = useBuilder()

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
    }, [rootIds, insert])

    if (rootIds.length === 0) {
        return (
            <main 
                ref={elementRef}
                className={cn(
                    "flex-1 flex items-center justify-center transition-all duration-150",
                    isOver 
                        ? "bg-muted border-2 border-dashed border-primary" 
                        : "bg-background"
                )}
            >
                <div className={cn(
                    "flex flex-col items-center justify-center gap-4 text-center px-8 py-12 transition-all duration-150",
                    isOver && "scale-105"
                )}>
                    <div className={cn(
                        "relative p-6 rounded-full transition-all duration-150",
                        isOver 
                            ? "bg-primary/10 text-primary" 
                            : "bg-muted text-muted-foreground"
                    )}>
                        <Layout className="w-12 h-12" />
                        {isOver && (
                            <ArrowDown className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-6 h-6 text-primary animate-bounce" />
                        )}
                    </div>
                    <div className="space-y-2">
                        <h3 className={cn(
                            "text-xl font-semibold transition-colors duration-150",
                            isOver ? "text-primary" : "text-foreground"
                        )}>
                            {isOver ? "Drop component here" : "Empty Canvas"}
                        </h3>
                        <p className="text-sm text-muted-foreground max-w-md">
                            {isOver 
                                ? "Release to add your first component" 
                                : "Drag a component from the sidebar to get started"}
                        </p>
                    </div>
                </div>
            </main>
        )
    }

    return (
        <main 
            ref={elementRef}
            className="flex-1 p-8 flex flex-col gap-6"
        >
            <div className="flex-1">
                <ComponentList parentId={null} />
            </div>
            <div className="flex items-center justify-end border-t pt-4">
                <Dialog>
                    <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="gap-2">
                            <Code2 className="w-4 h-4" />
                            View State (JSON)
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[90vh]">
                        <DialogHeader>
                            <DialogTitle>Builder State (JSON)</DialogTitle>
                        </DialogHeader>
                        <StateViewer />
                    </DialogContent>
                </Dialog>
            </div>
        </main>
    )
}
