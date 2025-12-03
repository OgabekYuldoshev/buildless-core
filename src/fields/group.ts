
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
