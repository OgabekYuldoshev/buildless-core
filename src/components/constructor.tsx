import { Canvas } from "./canvas";
import { Leftbar } from "./leftbar";
import { Rightbar } from "./rightbar";
import { SidebarProvider } from "./ui/sidebar";

export function Constructor() {
    return (
        <SidebarProvider>
            <Leftbar />
            <Canvas />
            <Rightbar />
        </SidebarProvider>
    )
}
