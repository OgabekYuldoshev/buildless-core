import type { ComponentId } from "./core"

export type WithComponentId<T> = T & { componentId: ComponentId }