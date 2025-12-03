
import { Label } from "@/components/ui/label";
import type { ComponentConfig } from "@/core";

export interface GroupProps {
  label: string;
}

export const Group: ComponentConfig<GroupProps> = {
  defaultProps: {
    label: "Label here",
  },
  canHaveChildren: true,
};

export function GroupRender({ label }: GroupProps) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={label}>{label}</Label>
      Should have children
    </div>
  )
}