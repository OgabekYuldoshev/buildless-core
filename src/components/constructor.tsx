import { Canvas } from "./canvas";
import { Leftbar } from "./leftbar";
import { Rightbar } from "./rightbar";
import { SidebarProvider } from "./ui/sidebar";
import { SelectionProvider } from "@/hooks/use-selection";

export function Constructor() {
    return (
        <SelectionProvider>
            <SidebarProvider>
                <Leftbar />
                <Canvas />
                <Rightbar />
            </SidebarProvider>
        </SelectionProvider>
    )
}
