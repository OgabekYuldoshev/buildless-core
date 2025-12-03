import { Input } from "./input";
import { Title } from "./title";
import { Text } from "./text";
import { Textarea } from "./textarea";
import { Group } from "./group";
import { Select } from "./select";
import { Checkbox } from "./checkbox";
import { Radio } from "./radio";

export const components = {
  Title,
  Input,
  Text,
  Textarea,
  Group,
  Select,
  Checkbox,
  Radio,
};

export const groupedComponents = {
  Content: ["Title", "Text"],
  Form: ["Input", "Textarea", "Select", "Checkbox", "Radio"],
  Layout: ["Group"],
} satisfies Record<string, ComponentType[]>;

export type ComponentSchema = typeof components;

export type ComponentType = keyof typeof components;
