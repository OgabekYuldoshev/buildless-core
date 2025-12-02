// builder.ts (yoki alohida util ichida)

import type { Registry } from "../registry";
import type { BuilderState, ComponentId, ComponentNode } from "../types";

import type { DefaultComponentConfig } from "../types";

export function validateAndNormalizeState<
  Config extends DefaultComponentConfig
>(
  state: BuilderState<Config>,
  registry: Registry<Config>
): Map<ComponentId, ComponentNode<Config>> {
  const nodes = new Map<ComponentId, ComponentNode<Config>>();
  const childrenByParent = new Map<ComponentId, ComponentId[]>();

  // 1) Bazaviy: id -> node map, type mavjudligi, parent mavjudligi
  for (const [id, rawNode] of Object.entries(state) as [
    ComponentId,
    ComponentNode<Config>
  ][]) {
    if (rawNode.id !== id) {
      throw new Error(
        `State invalid: key "${id}" does not match node.id "${rawNode.id}"`
      );
    }

    // type registryda borligini tekshirish
    const config = registry.getComponentConfig(rawNode.type);
    if (!config) {
      throw new Error(
        `State invalid: unknown component type "${rawNode.type}"`
      );
    }

    // parent bor bo'lsa, keyinchalik tekshiramiz (hozircha faqat yig'amiz)
    if (rawNode.parentId !== null) {
      let arr = childrenByParent.get(rawNode.parentId);
      if (!arr) {
        arr = [];
        childrenByParent.set(rawNode.parentId, arr);
      }
      arr.push(id);
    }

    nodes.set(id, rawNode);
  }

  // 2) Har bir parentId mavjudligini tekshirish
  for (const parentId of childrenByParent.keys()) {
    if (!nodes.has(parentId)) {
      throw new Error(`State invalid: parent node "${parentId}" not found`);
    }
  }

  // 3) Cycles yo'qligini tekshirish (DFS)
  const VisitState = {
    NotVisited: 0,
    Visiting: 1,
    Visited: 2,
  } as const;

  const visitStatus = new Map<ComponentId, number>();

  const dfs = (id: ComponentId) => {
    const status = visitStatus.get(id) ?? VisitState.NotVisited;
    if (status === VisitState.Visiting) {
      throw new Error(`State invalid: cycle detected at node "${id}"`);
    }
    if (status === VisitState.Visited) return;

    visitStatus.set(id, VisitState.Visiting);
    const children = childrenByParent.get(id) ?? [];
    for (const childId of children) {
      dfs(childId);
    }
    visitStatus.set(id, VisitState.Visited);
  };

  for (const id of nodes.keys()) {
    dfs(id);
  }

  // 4) canHaveChildren qoidasini tekshirish
  for (const [parentId, children] of childrenByParent.entries()) {
    if (children.length === 0) continue;

    const parentNode = nodes.get(parentId);
    if (!parentNode) continue; // yuqorida allaqachon tekshirganmiz

    if (!registry.canHaveChildren(parentNode.type)) {
      throw new Error(
        `State invalid: node "${parentId}" of type "${parentNode.type}" cannot have children`
      );
    }
  }

  // 5) (ixtiyoriy) position bo'yicha basic validatsiya
  // Masalan, har bir parent uchun position'lar unique bo'lsin:
  const positionsByParent = new Map<ComponentId | null, Set<string>>();
  for (const node of nodes.values()) {
    const parentKey = node.parentId;
    let set = positionsByParent.get(parentKey);
    if (!set) {
      set = new Set();
      positionsByParent.set(parentKey, set);
    }
    if (set.has(node.position)) {
      throw new Error(
        `State invalid: duplicate position "${node.position}" under parent "${parentKey}"`
      );
    }
    set.add(node.position);
  }

  return nodes;
}
