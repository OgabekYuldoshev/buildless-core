import { Sidebar } from './ui/sidebar'
import { PropsEditor } from './props-editor/props-editor'

export function Rightbar() {
    return (
        <Sidebar side='right'>
            <PropsEditor />
        </Sidebar>
    )
}
