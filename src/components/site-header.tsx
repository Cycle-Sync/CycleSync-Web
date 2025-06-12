import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { ModeToggle } from "./mode-toggle";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 flex h-16 shrink-0 items-center justify-between gap-2 border-b bg-background px-4">
      <SidebarTrigger />
      <Separator orientation="vertical" className="mr-2 h-6" />
      <div className="flex items-center gap-2">
        <span className="text-base font-semibold">CycleSync</span>
      </div>
      <Button asChild variant="outline">
        <a href="https://github.com/your-repo">GitHub</a>
      </Button>
      <ModeToggle className="ml-auto" />
      <Separator orientation="vertical" className="ml-2 h-6" />
    </header>
  );
}