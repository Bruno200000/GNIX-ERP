import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { AIChatBubble } from "@/components/layout/AIChatBubble";
import { SettingsRuntimeEffects } from "@/components/layout/SettingsRuntimeEffects";
import { UIProvider } from "@/context/UIContext";
import { getCurrentAccessData, getSettingsData } from "@/lib/erp-data";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const access = await getCurrentAccessData();
  const settings = await getSettingsData();

  if (!access.isActive) {
    redirect("/pending-approval");
  }

  return (
    <UIProvider>
      <SettingsRuntimeEffects settings={settings} />
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
