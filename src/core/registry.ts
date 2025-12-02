import type {
  DefaultComponentConfig,
  GetComponentConfig,
  GetComponentType,
} from "./types/utils";

export interface RegistryOptions<
  ComponentConfig extends DefaultComponentConfig
> {
  components: ComponentConfig;
}

export class Registry<
  ComponentConfig extends DefaultComponentConfig = DefaultComponentConfig,
  ComponentType extends GetComponentType<ComponentConfig> = GetComponentType<ComponentConfig>
> {
  private registry: Map<
    ComponentType,
    GetComponentConfig<ComponentConfig, ComponentType>
  >;
  constructor({ components }: RegistryOptions<ComponentConfig>) {
    this.registry = new Map(
      Object.entries(components).map(([name, config]) => [
        name as ComponentType,
        config as GetComponentConfig<ComponentConfig, ComponentType>,
      ])
    );
  }

  public getComponentConfig<T extends ComponentType>(type: T) {
    const config = this.registry.get(type);

    if (!config) {
      throw new Error(`Component config not found for type: ${type}`);
    }

    return config as GetComponentConfig<ComponentConfig, T>;
  }

  public canHaveChildren<T extends ComponentType>(type: T) {
    const config = this.getComponentConfig(type) as GetComponentConfig<
      ComponentConfig,
      T
    >;
    return config.canHaveChildren ?? false;
  }
}
