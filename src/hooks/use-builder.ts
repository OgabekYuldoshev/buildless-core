import { useMemo, useSyncExternalStore } from "react";
import { createBuilder, type ComponentId } from "@/core";
import { components } from "@/fields";

const builder = createBuilder({
  components,
});

function subscribe(listener: () => void) {
  return builder.subscribe(listener);
}

function getSnapshot() {
  return builder.getState();
}

export function useBuilder() {
  const state = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  const rootIds = useMemo(
    () =>
      Object.values(state)
        .filter((node) => node.parentId === null)
        .sort((a, b) =>
          a.position < b.position ? -1 : a.position > b.position ? 1 : 0
        )
        .map((node) => node.id),
    [state]
  );

  const childrenIds = useMemo(() => {
    const children: Record<ComponentId, ComponentId[]> = {};

    Object.values(state).forEach((node) => {
      if (node.parentId === null) return;
      if (!children[node.parentId]) {
        children[node.parentId] = [];
      }
      children[node.parentId].push(node.id);
    });

    Object.values(children).forEach((ids) => {
      ids.sort((aId, bId) => {
        const a = state[aId];
        const b = state[bId];
        if (!a || !b) return 0;
        return a.position < b.position ? -1 : a.position > b.position ? 1 : 0;
      });
    });
    return children;
  }, [state]);

  const api = useMemo(
    () => ({
      state,
      rootIds,
      childrenIds,
      insert: builder.insert.bind(builder),
      update: builder.update.bind(builder),
      remove: builder.remove.bind(builder),
      move: builder.move.bind(builder),
    }),
    [state, builder]
  );

  return api;
}
