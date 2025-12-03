import type { ComponentId } from "@/core";
import { useBuilder } from "@/hooks/use-builder";
import { useState } from "react";
import { Button } from "./ui/button";
import { ChevronRightIcon } from "lucide-react";
import { cn } from "@/lib/utils";


function TreeNode({ componentId, number, level }: { componentId: ComponentId, number: number, level: number }) {
    const [isOpen, setIsOpen] = useState(true)
    const { state, childrenIds } = useBuilder()
    const component = state[componentId]
    const children = childrenIds[componentId] ?? []

    const hasChildren = children.length > 0

    const handleToggle = () => {
        if (hasChildren) {
            setIsOpen(!isOpen)
        }
    }

    return (
        <div className="flex flex-col" style={{ paddingLeft: `${level * 8}px` }}>
            <Button size="sm" variant="ghost" className="w-full justify-start" onClick={handleToggle}>
                <span>{number}. {component.type}</span>
                {children.length > 0 && (
                    <ChevronRightIcon className={cn("w-4 h-4 transition-transform duration-200 ml-auto", isOpen ? "rotate-90" : "")} />
                )}
            </Button>
            {
                (isOpen && hasChildren) && (
                    <div className="flex flex-col">
                        {children.map((childId, idx) => (
                            <TreeNode key={childId} componentId={childId} number={idx + 1} level={level + 1} />
                        ))}
                    </div>
                )
            }
        </div>
    )
}

export function ComponentTree() {
    const { rootIds } = useBuilder()
    if (rootIds.length === 0) {
        return (
            <p className="text-xs text-muted-foreground">No components</p>
        )
    }
    return (
        <div className="flex flex-col">
            {rootIds.map((rootId, idx) => (
                <TreeNode key={rootId} componentId={rootId} number={idx + 1} level={0} />
            ))}
        </div>
    )
}
