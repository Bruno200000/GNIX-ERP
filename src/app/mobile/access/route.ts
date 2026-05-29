import { randomBytes } from "crypto"
import { networkInterfaces } from "os"
import { NextResponse, type NextRequest } from "next/server"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

function getLanIps() {
  return Object.values(networkInterfaces())
    .flatMap((items) => items ?? [])
    .filter((item) => item.family === "IPv4" && !item.internal)
    .map((item) => item.address)
}

function splitHost(host: string) {
  const cleanHost = host.replace(/^\[/, "").replace(/\]$/, "")
  const lastColon = cleanHost.lastIndexOf(":")

  if (lastColon === -1) {
    return { hostname: cleanHost, port: "" }
  }

  return {
    hostname: cleanHost.slice(0, lastColon),
    port: cleanHost.slice(lastColon + 1),
  }
}

function mobileAccessDetails(request: NextRequest, preferredIp?: string, preferredPort?: string) {
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host") ?? "localhost:3000"
  const protocol = request.headers.get("x-forwarded-proto") ?? "http"
  const { hostname, port } = splitHost(host)
  const lanIps = getLanIps()
  const isLocalHost = ["localhost", "127.0.0.1", "::1"].includes(hostname)
  const serverIp = preferredIp || (isLocalHost ? lanIps[0] : hostname) || hostname
  const serverPort = preferredPort ?? (port || (isLocalHost ? "3000" : ""))

  return {
    lanIps,
    serverIp,
    port: serverPort,
    mobileUrl: `${protocol}://${serverIp}${serverPort ? `:${serverPort}` : ""}/mobile`,
  }
}

export async function GET(request: NextRequest) {
  return NextResponse.json(mobileAccessDetails(request))
}

export async function POST(request: NextRequest) {
  let preferredIp = ""
  let preferredPort = ""

  try {
    const body = await request.json()
    preferredIp = typeof body.serverIp === "string" ? body.serverIp : ""
    preferredPort = typeof body.port === "string" ? body.port : ""
  } catch {
    // Defaults are enough when no JSON body is sent.
  }

  const details = mobileAccessDetails(request, preferredIp, preferredPort)
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString()
  const token = randomBytes(16).toString("hex")
  const temporaryUrl = `${details.mobileUrl}?access=${token}&expires=${encodeURIComponent(expiresAt)}`

  return NextResponse.json({
    ...details,
    temporaryUrl,
    expiresAt,
  })
}
