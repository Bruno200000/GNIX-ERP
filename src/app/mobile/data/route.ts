import { NextResponse } from "next/server"
import {
  getAppNotificationsData,
  getDashboardData,
  getProfileData,
  getSettingsData,
} from "@/lib/erp-data"

export const dynamic = "force-dynamic"

export async function GET() {
  const [dashboard, profile, settings, notifications] = await Promise.all([
    getDashboardData(),
    getProfileData(),
    getSettingsData(),
    getAppNotificationsData(),
  ])

  return NextResponse.json({
    dashboard,
    profile,
    settings: {
      language: settings?.language,
      dark_mode: settings?.dark_mode,
      auto_translate: settings?.auto_translate,
      ai_provider: settings?.ai_provider,
    },
    notifications,
    refreshed_at: new Date().toISOString(),
  })
}
