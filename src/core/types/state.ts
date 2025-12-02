import type { ComponentNode } from "./node";
import type { ComponentId, DefaultComponentConfig } from "./utils";

export type BuilderState<Config extends DefaultComponentConfig> = Record<
  ComponentId,
  ComponentNode<Config>
>;
