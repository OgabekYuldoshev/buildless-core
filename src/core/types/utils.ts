import type { ComponentConfig } from "./node";
import type { BuilderState } from "./state";

export type ComponentId = string & { __brand: "ComponentId" };

export type ComponentPosition = string & { __brand: "ComponentPosition" };

export type DefaultComponentConfig = Record<string, ComponentConfig<any>>;

export type GetComponentType<Config extends DefaultComponentConfig> =
  keyof Config & string;

export type GetComponentConfig<
  Config extends DefaultComponentConfig,
  ComponentType extends GetComponentType<Config>
> = Config[ComponentType];

export type Listener<Config extends DefaultComponentConfig> = (
  values: BuilderState<Config>
) => void;
