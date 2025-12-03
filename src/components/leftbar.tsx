import { BaseDraggableComponent } from "./base-draggable-component";
import { ComponentTree } from "./component-tree";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuItem } from "./ui/sidebar";
import { groupedComponents } from "@/fields";

export function Leftbar() {
    return (
        <Sidebar>
            <SidebarContent>
                {
                    Object.entries(groupedComponents).map(([group, components]) => (
                        <SidebarGroup key={group}>
                            <SidebarGroupLabel>{group}</SidebarGroupLabel>
                            <SidebarGroupContent>
                                <SidebarMenu>
                                    {components.map((component) => (
                                        <SidebarMenuItem key={component}>
                                            <BaseDraggableComponent type={component} />
                                        </SidebarMenuItem>
                                    ))}
                                </SidebarMenu>
                            </SidebarGroupContent>
                        </SidebarGroup>
                    ))}
                <SidebarGroup>
                    <SidebarGroupLabel>ComponentTree</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <ComponentTree />
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    )
}
