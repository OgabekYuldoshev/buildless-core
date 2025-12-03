
import { ComponentList } from "@/components/component-list";
import { Label } from "@/components/ui/label";
import type { ComponentConfig } from "@/core";
import type { WithComponentId } from "@/types";

export interface GroupProps {
  label: string;
}

export const Group: ComponentConfig<GroupProps> = {
  defaultProps: {
    label: "Label here",
  },
  canHaveChildren: true,
};

export function GroupRender({ componentId, label }: WithComponentId<GroupProps>) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={label}>{label}</Label>
      <div className="mt-2 pl-4 border-l border-dashed space-y-1">
        <ComponentList parentId={componentId} />
      </div>
    </div>
  )
}