import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { WorkLedgerTable } from "@/components/work-ledger-table";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

async function getTasks() {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
  const res = await fetch(`${baseUrl}/api/tasks`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch tasks");
  }

  return res.json();
}

export default async function TasksPage() {
  const tasksData = await getTasks();

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <div className="px-4 lg:px-6">
                <h2 className="text-2xl font-bold tracking-tight mb-6">
                  工作台账
                </h2>
                <WorkLedgerTable data={tasksData} />
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
