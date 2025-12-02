import type {
  ComponentId,
  ComponentPosition,
  DefaultComponentConfig,
  GetComponentConfig,
  GetComponentType,
  Listener,
} from "./types/utils";
import { Registry } from "./registry";
import type { BuilderState, ComponentNode } from "./types";
import { generateKeyBetween } from "./utils/fractional-indexing";
import { generateComponentId } from "./utils/component-id";
import { validateAndNormalizeState } from "./utils/validate-and-normalize-state";

interface BuilderOptions<Config extends DefaultComponentConfig> {
  registry: Registry<Config>;
  initialState?: BuilderState<Config>;
}

export class Builder<
  Config extends DefaultComponentConfig = DefaultComponentConfig
> {
  private nodes = new Map<ComponentId, ComponentNode<Config>>();
  private registry: Registry<Config>;
  private cachedNodes: BuilderState<Config> | null = null;
  private listeners: Set<Listener<Config>> = new Set();

  constructor({ registry, initialState }: BuilderOptions<Config>) {
    this.registry = registry;
    if (initialState) {
      this.replaceState(initialState);
    }
  }

  private invalidateCache() {
    this.cachedNodes = null;
  }

  private emitChanges() {
    this.invalidateCache();
    const snapshot = this.getState();
    for (const listener of this.listeners) {
      listener(snapshot);
    }
  }

  private replaceState(state: BuilderState<Config>) {
    this.nodes = validateAndNormalizeState(state, this.registry);
    this.cachedNodes = null;
  }

  private getRootNodes() {
    return [...this.nodes.values()]
      .filter((node) => node.parentId === null)
      .sort((a, b) =>
        a.position < b.position ? -1 : a.position > b.position ? 1 : 0
      )
      .map((node) => node.id);
  }

  private getChildrenNodes(parentId: ComponentId) {
    return [...this.nodes.values()]
      .filter((node) => node.parentId === parentId)
      .sort((a, b) =>
        a.position < b.position ? -1 : a.position > b.position ? 1 : 0
      )
      .map((node) => node.id);
  }

  public insert<Type extends GetComponentType<Config>>(options: {
    type: Type;
    index: number;
    parentId?: ComponentId | null;
    values?: Partial<GetComponentConfig<Config, Type>["defaultProps"]>;
  }): ComponentId {
    const { type, index, parentId = null, values = {} } = options;
    const config = this.registry.getComponentConfig(type);

    if (!config) {
      throw new Error(`Component config not found for type: ${type}`);
    }

    if (parentId !== null) {
      if (!this.nodes.has(parentId)) {
        throw new Error(`Parent node with id ${parentId} not found`);
      }

      const parentNode = this.nodes.get(parentId);

      if (parentNode && !this.registry.canHaveChildren(parentNode.type)) {
        throw new Error(
          `Cannot insert: Node type "${parentNode.type}" cannot have children`
        );
      }
    }

    const nodeIds = parentId
      ? this.getChildrenNodes(parentId)
      : this.getRootNodes();

    validateNodeIndex(index, nodeIds.length);

    const id = generateComponentId() as ComponentId;

    const position = calculateNodePosition(this.nodes, nodeIds, index);
    const node: ComponentNode<Config> = {
      id,
      position,
      type,
      props: { ...config.defaultProps, ...values },
      parentId,
    };

    this.nodes.set(id, node);
    this.emitChanges();

    return id;
  }

  public update<Type extends GetComponentType<Config>>(options: {
    id: ComponentId;
    values?: Partial<GetComponentConfig<Config, Type>["defaultProps"]>;
  }) {
    const { id, values = {} } = options;
    const node = this.nodes.get(id);

    if (!node) {
      throw new Error(`Node with id ${id} not found`);
    }

    node.props = { ...node.props, ...values };

    this.emitChanges();

    return id;
  }

  public remove(id: ComponentId) {
    if (!this.nodes.has(id)) {
      throw new Error(`Cannot delete: Node with id "${id}" does not exist`);
    }

    const childrenByParent: Record<ComponentId, ComponentId[]> = {};

    for (const [nodeId, node] of this.nodes.entries()) {
      if (node.parentId === null) continue;

      let arr = childrenByParent[node.parentId];

      if (!arr) {
        arr = [];
        childrenByParent[node.parentId] = arr;
      }

      arr.push(nodeId);
    }

    const recursivelyRemove = (currentId: ComponentId) => {
      const children = childrenByParent[currentId] ?? [];

      for (const childId of children) {
        recursivelyRemove(childId);
      }

      this.nodes.delete(currentId);
    };

    recursivelyRemove(id);
    this.emitChanges();
  }

  public getState(): BuilderState<Config> {
    if (!this.cachedNodes) {
      this.cachedNodes = {} as BuilderState<Config>;
      for (const [id, node] of this.nodes.entries()) {
        this.cachedNodes[id] = node;
      }
    }

    return this.cachedNodes;
  }

  public setState(state: BuilderState<Config>) {
    this.replaceState(state);
    this.emitChanges();
  }

  public subscribe = (listener: Listener<Config>) => {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  };
}

function validateNodeIndex(index: number, maxLength: number) {
  if (index < 0 || index > maxLength) {
    throw new Error(
      `Invalid index ${index}. Must be between 0 and ${maxLength}`
    );
  }
}

function calculateNodePosition<Config extends DefaultComponentConfig>(
  nodes: Map<ComponentId, ComponentNode<Config>>,
  nodeIds: ComponentId[],
  index: number
) {
  const prevNodeId = index > 0 ? nodeIds[index - 1] : null;
  const nextNodeId = index < nodeIds.length ? nodeIds[index] : null;
  const prevPosition = prevNodeId
    ? nodes.get(prevNodeId)?.position ?? null
    : null;
  const nextPosition = nextNodeId
    ? nodes.get(nextNodeId)?.position ?? null
    : null;

  return generateKeyBetween(prevPosition, nextPosition) as ComponentPosition;
}

export interface BuilderConfig<Config extends DefaultComponentConfig> {
  readonly components: Config;
  readonly initialState?: BuilderState<Config>;
}

export function createBuilder<Config extends DefaultComponentConfig>(
  config: BuilderConfig<Config>
) {
  return new Builder({
    registry: new Registry({ components: config.components }),
    initialState: config.initialState,
  });
}
