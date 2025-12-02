import type {
  ComponentId,
  ComponentPosition,
  DefaultComponentConfig,
  GetComponentConfig,
  GetComponentType,
} from "./utils";

export type ComponentConfig<Props> = {
  defaultProps: Props;
  canHaveChildren?: boolean;
};

export type ComponentNode<
  Config extends DefaultComponentConfig = DefaultComponentConfig,
  ComponentType extends GetComponentType<Config> = GetComponentType<Config>
> = {
  id: ComponentId;
  position: ComponentPosition;
  type: ComponentType;
  props: GetComponentConfig<Config, ComponentType>["defaultProps"];
  parentId: ComponentId | null;
};
