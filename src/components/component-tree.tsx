import type { ComponentId } from "@/core";
import { useBuilder } from "@/hooks/use-builder";
import { useSelection } from "@/hooks/use-selection";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { 
  ChevronRightIcon, 
  ChevronDownIcon,
  Component,
  FileText,
  Square,
  Type,
  Layout,
  CheckSquare,
  Radio,
  List,
  FileEdit
} from "lucide-react";

const componentIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  Title: Type,
  Text: FileText,
  Input: Square,
  Textarea: FileEdit,
  Select: List,
  Checkbox: CheckSquare,
  Radio: Radio,
  Group: Layout,
};

function getComponentIcon(type: string) {
  return componentIcons[type] || Component;
}

interface TreeNodeProps {
  componentId: ComponentId;
  level: number;
}

function TreeNode({ componentId, level }: TreeNodeProps) {
  const [isOpen, setIsOpen] = useState(true);
  const { state, childrenIds } = useBuilder();
  const { selectedId, select } = useSelection();
  const component = state[componentId];
  const children = childrenIds[componentId] ?? [];

  if (!component) return null;

  const hasChildren = children.length > 0;
  const isSelected = selectedId === componentId;
  const Icon = getComponentIcon(component.type);

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (hasChildren) {
      setIsOpen(!isOpen);
    }
  };

  const handleSelect = () => {
    select(componentId);
  };

  return (
    <div className="select-none">
      <div
        onClick={handleSelect}
        className={cn(
          "group flex items-center gap-2 px-2 py-1.5 rounded-md text-sm transition-colors cursor-pointer",
          "hover:bg-accent hover:text-accent-foreground",
          isSelected && "bg-primary/10 text-primary font-medium",
          !isSelected && "text-foreground"
        )}
        style={{ paddingLeft: `${level * 16 + 8}px` }}
      >
        {/* Chevron for expand/collapse */}
        <div
          className={cn(
            "flex items-center justify-center w-4 h-4 transition-transform duration-200",
            !hasChildren && "opacity-0"
          )}
          onClick={handleToggle}
        >
          {hasChildren && (
            isOpen ? (
              <ChevronDownIcon className="w-3.5 h-3.5 text-muted-foreground" />
            ) : (
              <ChevronRightIcon className="w-3.5 h-3.5 text-muted-foreground" />
            )
          )}
        </div>

        {/* Component Icon */}
        <Icon className={cn(
          "w-4 h-4 shrink-0",
          isSelected ? "text-primary" : "text-muted-foreground"
        )} />

        {/* Component Type */}
        <span className={cn(
          "truncate flex-1",
          isSelected && "font-medium"
        )}>
          {component.type}
        </span>

        {/* Visual indicator for selected */}
        {isSelected && (
          <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
        )}
      </div>

      {/* Children */}
      {isOpen && hasChildren && (
        <div className="relative">
          {/* Vertical line connector */}
          {level >= 0 && (
            <div
              className="absolute left-0 top-0 bottom-0 w-px bg-border"
              style={{ left: `${level * 16 + 12}px` }}
            />
          )}
          <div className="flex flex-col">
            {children.map((childId) => (
              <TreeNode key={childId} componentId={childId} level={level + 1} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function ComponentTree() {
  const { rootIds } = useBuilder();

  if (rootIds.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 px-4">
        <Component className="w-8 h-8 text-muted-foreground/50 mb-2" />
        <p className="text-xs text-muted-foreground text-center">
          No components yet
        </p>
        <p className="text-xs text-muted-foreground/70 text-center mt-1">
          Drag components to canvas
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col py-1">
      {rootIds.map((rootId) => (
        <TreeNode key={rootId} componentId={rootId} level={0} />
      ))}
    </div>
  );
}
