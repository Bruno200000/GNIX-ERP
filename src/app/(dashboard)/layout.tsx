import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { AIChatBubble } from "@/components/layout/AIChatBubble";
import { UIProvider } from "@/context/UIContext";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <UIProvider>
      <div className="flex h-full w-full overflow-hidden">
        <Sidebar />
        <div className="flex flex-1 flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto bg-slate-50/50 p-6 dark:bg-slate-900">
            {children}
          </main>
        </div>
      </div>
      <AIChatBubble />
    </UIProvider>
  );
}
