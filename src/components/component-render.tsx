import type { ComponentId } from "@/core"
import type { ComponentType } from "@/fields"
import { CheckboxRender } from "@/fields/checkbox"
import { GroupRender } from "@/fields/group"
import { InputRender } from "@/fields/input"
import { RadioRender } from "@/fields/radio"
import { SelectRender } from "@/fields/select"
import { TextRender } from "@/fields/text"
import { TextareaRender } from "@/fields/textarea"
import { TitleRender } from "@/fields/title"
import { useBuilder } from "@/hooks/use-builder"
import type { JSX } from "react"

interface ComponentRenderProps {
    componentId: ComponentId
}
export function ComponentRender({ componentId }: ComponentRenderProps) {
    const { state } = useBuilder()
    const componentNode = state[componentId]

    const renderComponents = {
        Title: TitleRender,
        Text: TextRender,
        Textarea: TextareaRender,
        Group: GroupRender,
        Select: SelectRender,
        Checkbox: CheckboxRender,
        Radio: RadioRender,
        Input: InputRender,
    } as Record<ComponentType, (props: any) => JSX.Element>

    const RenderComponent = renderComponents[componentNode.type]
    return <RenderComponent componentId={componentId} {...componentNode.props} />
}
