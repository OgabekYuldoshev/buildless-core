import { Input } from "./input";
import { Title } from "./title";

export const components = {
  Title,
  Input
};

export type ComponentSchema = typeof components

export type ComponentType = keyof typeof components