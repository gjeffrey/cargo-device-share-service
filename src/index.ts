interface Env {
  DEVICE_SHARES: KVNamespace;
  APP_METADATA: KVNamespace;
  APP_NAME: string;
  APP_URL_SCHEME?: string;
  CARGO_URL_SCHEME?: string;
  DOWNLOAD_URL?: string;
  DOWNLOAD_VERSION?: string;
  DOWNLOAD_BUILD_LABEL?: string;
  CF_ACCOUNT_ID?: string;
  CF_ZONE_ID?: string;
  CF_API_TOKEN?: string;
  TUNNEL_BASE_DOMAIN?: string;
}

interface DeviceSharePayload {
  version: number;
  deviceName: string;
  deviceID: string;
  addresses: string[];
  createdAt: string;
}

interface DownloadInfo {
  url: string;
  version?: string;
  buildLabel?: string;
  publishedAt?: string;
}

interface TunnelAvailabilityResponse {
  available: boolean;
  hostname?: string;
  reason?: string;
}

interface TunnelReserveRequest {
  requestedSubdomain: string;
  localPort: number;
  installationID?: string;
  appName?: string;
}

interface TunnelReservation {
  hostname: string;
  tunnelID: string;
  token: string;
}

interface CloudflareResult<T> {
  success: boolean;
  errors?: Array<{ message?: string }>;
  result: T;
}

interface CloudflareTunnel {
  id: string;
  name: string;
}

interface CloudflareDNSRecord {
  id: string;
  name: string;
}

const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365;
const HARBOR_ICON_DATA_URL = "data:image/png;base64,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";

export default {
  async fetch(request, env): Promise<Response> {
    const url = new URL(request.url);

    if (request.method === "POST" && url.pathname === "/api/share") {
      return createShare(request, env, url);
    }

    if (request.method === "GET" && url.pathname === "/api/tunnels/availability") {
      return checkTunnelAvailability(url, env);
    }

    if (request.method === "POST" && url.pathname === "/api/tunnels/reserve") {
      return reserveTunnel(request, env);
    }

    if (request.method === "GET" && url.pathname.startsWith("/api/share/")) {
      const id = url.pathname.split("/").pop();
      return getShareJSON(env, id);
    }

    if (request.method === "GET" && url.pathname.startsWith("/s/")) {
      const id = url.pathname.split("/").pop();
      return getSharePage(env, url, id);
    }

    if (request.method === "GET" && url.pathname === "/") {
      return new Response(await renderLandingPage(env), {
        headers: {
          "content-type": "text/html; charset=utf-8"
        }
      });
    }

    return new Response("Not found", { status: 404 });
  }
} satisfies ExportedHandler<Env>;

async function createShare(request: Request, env: Env, url: URL): Promise<Response> {
  if (!(await checkRateLimit(request, env))) {
    return json({ error: "Too many requests. Please try again later." }, 429);
  }

  let payload: DeviceSharePayload;

  try {
    payload = await request.json<DeviceSharePayload>();
  } catch {
    return json({ error: "The request body must be valid JSON." }, 400);
  }

  const normalized = normalizePayload(payload);
  if (!normalized) {
    return json({ error: "The share payload is missing required device information." }, 400);
  }

  const id = randomShortID();
  await env.DEVICE_SHARES.put(id, JSON.stringify(normalized), {
    expirationTtl: ONE_YEAR_SECONDS
  });

  const shareURL = new URL(`/s/${id}`, url).toString();
  return json({ id, url: shareURL }, 201);
}

async function checkTunnelAvailability(url: URL, env: Env): Promise<Response> {
  const requested = normalizeSubdomain(url.searchParams.get("name") ?? "");
  if (!requested) {
    return json({ available: false, reason: "Choose a subdomain first." } satisfies TunnelAvailabilityResponse, 400);
  }

  const hostname = tunnelHostname(env, requested);
  const existing = await env.DEVICE_SHARES.get(tunnelReservationKey(requested));
  if (existing) {
    return json({ available: false, hostname, reason: "That subdomain is already reserved." } satisfies TunnelAvailabilityResponse);
  }

  return json({ available: true, hostname } satisfies TunnelAvailabilityResponse);
}

async function reserveTunnel(request: Request, env: Env): Promise<Response> {
  if (!(await checkRateLimit(request, env))) {
    return json({ error: "Too many requests. Please try again later." }, 429);
  }

  const missing = missingTunnelConfig(env);
  if (missing.length > 0) {
    return json({ error: `Tunnel broker is not configured. Missing ${missing.join(", ")}.` }, 503);
  }

  let payload: TunnelReserveRequest;
  try {
    payload = await request.json<TunnelReserveRequest>();
  } catch {
    return json({ error: "The request body must be valid JSON." }, 400);
  }

  const requested = normalizeSubdomain(payload.requestedSubdomain);
  if (!requested) {
    return json({ error: "Choose a valid subdomain." }, 400);
  }

  if (!Number.isInteger(payload.localPort) || payload.localPort < 1025 || payload.localPort > 65535) {
    return json({ error: "Choose a valid local port." }, 400);
  }

  const reservationKey = tunnelReservationKey(requested);
  const existing = await env.DEVICE_SHARES.get(reservationKey);
  if (existing) {
    return json({ error: "That subdomain is already reserved." }, 409);
  }

  const hostname = tunnelHostname(env, requested);
  const tunnelName = [
    "platform10-share",
    requested,
    crypto.randomUUID().replaceAll("-", "").slice(0, 8)
  ].join("-");

  try {
    const tunnel = await createCloudflareTunnel(env, tunnelName);
    await configureCloudflareTunnel(env, tunnel.id, hostname, payload.localPort);
    await createTunnelDNSRecord(env, hostname, tunnel.id);
    const token = await getCloudflareTunnelToken(env, tunnel.id);

    const reservation: TunnelReservation = {
      hostname,
      tunnelID: tunnel.id,
      token
    };

    await env.DEVICE_SHARES.put(
      reservationKey,
      JSON.stringify({
        hostname,
        tunnelID: tunnel.id,
        tunnelName,
        installationID: payload.installationID ?? "",
        appName: payload.appName ?? "platform10 Share",
        createdAt: new Date().toISOString()
      }),
      { expirationTtl: ONE_YEAR_SECONDS }
    );

    return json(reservation, 201);
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : "Could not create Cloudflare tunnel." }, 502);
  }
}

function missingTunnelConfig(env: Env): string[] {
  return [
    env.CF_ACCOUNT_ID ? "" : "CF_ACCOUNT_ID",
    env.CF_ZONE_ID ? "" : "CF_ZONE_ID",
    env.CF_API_TOKEN ? "" : "CF_API_TOKEN"
  ].filter(Boolean);
}

function normalizeSubdomain(value: string): string {
  const normalized = value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  if (normalized.length < 3 || normalized.length > 40) {
    return "";
  }
  if (!/^[a-z0-9](?:[a-z0-9-]*[a-z0-9])$/.test(normalized)) {
    return "";
  }
  return normalized;
}

function tunnelHostname(env: Env, subdomain: string): string {
  const baseDomain = (env.TUNNEL_BASE_DOMAIN?.trim() || "share.platform10.uk")
    .replace(/^https?:\/\//, "")
    .replace(/\/.*$/, "")
    .toLowerCase();
  return `${subdomain}.${baseDomain}`;
}

function tunnelReservationKey(subdomain: string): string {
  return `tunnel:subdomain:${subdomain}`;
}

async function createCloudflareTunnel(env: Env, name: string): Promise<CloudflareTunnel> {
  const secret = randomBase64(32);
  return cloudflareAPI<CloudflareTunnel>(
    env,
    `/accounts/${env.CF_ACCOUNT_ID}/cfd_tunnel`,
    {
      method: "POST",
      body: JSON.stringify({
        name,
        tunnel_secret: secret,
        config_src: "cloudflare"
      })
    }
  );
}

async function configureCloudflareTunnel(env: Env, tunnelID: string, hostname: string, localPort: number): Promise<void> {
  await cloudflareAPI<unknown>(
    env,
    `/accounts/${env.CF_ACCOUNT_ID}/cfd_tunnel/${tunnelID}/configurations`,
    {
      method: "PUT",
      body: JSON.stringify({
        config: {
          ingress: [
            {
              hostname,
              service: `http://localhost:${localPort}`
            },
            {
              service: "http_status:404"
            }
          ]
        }
      })
    }
  );
}

async function createTunnelDNSRecord(env: Env, hostname: string, tunnelID: string): Promise<CloudflareDNSRecord> {
  return cloudflareAPI<CloudflareDNSRecord>(
    env,
    `/zones/${env.CF_ZONE_ID}/dns_records`,
    {
      method: "POST",
      body: JSON.stringify({
        type: "CNAME",
        name: hostname,
        content: `${tunnelID}.cfargotunnel.com`,
        proxied: true,
        ttl: 1
      })
    }
  );
}

async function getCloudflareTunnelToken(env: Env, tunnelID: string): Promise<string> {
  const token = await cloudflareAPI<string>(
    env,
    `/accounts/${env.CF_ACCOUNT_ID}/cfd_tunnel/${tunnelID}/token`,
    { method: "GET" }
  );
  if (!token) {
    throw new Error("Cloudflare did not return a tunnel token.");
  }
  return token;
}

async function cloudflareAPI<T>(env: Env, path: string, init: RequestInit): Promise<T> {
  const response = await fetch(`https://api.cloudflare.com/client/v4${path}`, {
    ...init,
    headers: {
      "authorization": `Bearer ${env.CF_API_TOKEN}`,
      "content-type": "application/json",
      ...(init.headers ?? {})
    }
  });

  const payload = await response.json<CloudflareResult<T>>();
  if (!response.ok || !payload.success) {
    const message = payload.errors?.map((error) => error.message).filter(Boolean).join("; ")
      || `Cloudflare API returned HTTP ${response.status}.`;
    throw new Error(message);
  }
  return payload.result;
}

function randomBase64(byteCount: number): string {
  const bytes = new Uint8Array(byteCount);
  crypto.getRandomValues(bytes);
  let binary = "";
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }
  return btoa(binary);
}

async function checkRateLimit(request: Request, env: Env): Promise<boolean> {
  const ip = request.headers.get("CF-Connecting-IP") ?? "unknown";
  const key = `ratelimit:${ip}`;
  const current = parseInt((await env.DEVICE_SHARES.get(key)) ?? "0", 10);
  if (current >= 10) return false;
  await env.DEVICE_SHARES.put(key, String(current + 1), { expirationTtl: 60 });
  return true;
}

async function getShareJSON(env: Env, id?: string): Promise<Response> {
  if (!id) {
    return json({ error: "Missing share ID." }, 400);
  }

  const payload = await env.DEVICE_SHARES.get(id, "json") as DeviceSharePayload | null;
  if (!payload) {
    return json({ error: "This device share link does not exist or has expired." }, 404);
  }

  return json(payload, 200);
}

async function getSharePage(env: Env, url: URL, id?: string): Promise<Response> {
  if (!id) {
    return new Response("Missing share ID.", { status: 400 });
  }

  const payload = await env.DEVICE_SHARES.get(id, "json") as DeviceSharePayload | null;
  if (!payload) {
    return new Response(renderMissingPage(env), {
      status: 404,
      headers: {
        "content-type": "text/html; charset=utf-8"
      }
    });
  }

  const appImportURL = buildAppImportURL(resolveAppURLScheme(env), payload);
  const downloadInfo = await resolveDownloadInfo(env);
  return new Response(renderSharePage(env, url, payload, appImportURL, downloadInfo), {
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "public, max-age=300"
    }
  });
}

function normalizePayload(payload: DeviceSharePayload): DeviceSharePayload | null {
  const deviceName = payload.deviceName?.trim();
  const deviceID = payload.deviceID?.trim();
  const addresses = (payload.addresses ?? [])
    .map((address) => address.trim())
    .filter(Boolean)
    .slice(0, 8);

  if (!deviceName || !deviceID) {
    return null;
  }

  return {
    version: 1,
    deviceName,
    deviceID,
    addresses: addresses.length > 0 ? addresses : ["dynamic"],
    createdAt: payload.createdAt ?? new Date().toISOString()
  };
}

function buildAppImportURL(scheme: string, payload: DeviceSharePayload): string {
  const encoded = base64URLEncode(JSON.stringify(payload));
  return `${scheme}://connect-device?payload=${encoded}`;
}

function resolveAppURLScheme(env: Env): string {
  return env.APP_URL_SCHEME?.trim() || env.CARGO_URL_SCHEME?.trim() || "platform10";
}

function randomShortID(): string {
  return crypto.randomUUID().replace(/-/g, "").slice(0, 16);
}

function base64URLEncode(value: string): string {
  const bytes = new TextEncoder().encode(value);
  let binary = "";
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }

  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8"
    }
  });
}

async function resolveDownloadInfo(env: Env): Promise<DownloadInfo | null> {
  const kvValue = await env.APP_METADATA.get("latest-download", "json") as DownloadInfo | null;
  if (kvValue?.url) {
    return kvValue;
  }

  if (env.DOWNLOAD_URL && env.DOWNLOAD_URL.trim().length > 0) {
    return {
      url: env.DOWNLOAD_URL.trim(),
      version: env.DOWNLOAD_VERSION?.trim() || undefined,
      buildLabel: env.DOWNLOAD_BUILD_LABEL?.trim() || undefined
    };
  }

  return null;
}

async function renderLandingPage(env: Env): Promise<string> {
  const downloadInfo = await resolveDownloadInfo(env);
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${escapeHTML(env.APP_NAME)} Device Share</title>
    <style>${baseStyles()}</style>
  </head>
  <body>
    <!-- harbor-device-share deploy probe 2026-04-22b -->
    <main class="shell">
      <section class="hero">
        ${renderBrandLockup("platform10")}
        <h1>Create short platform10 handoff links.</h1>
        <p class="lede">Deploy this worker, point platform10 at it in Settings, and the app will generate short share pages that open directly back into platform10.</p>
        ${renderDownloadPanel(downloadInfo)}
      </section>
    </main>
  </body>
</html>`;
}

function renderMissingPage(env: Env): string {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Link unavailable</title>
    <style>${baseStyles()}</style>
  </head>
  <body>
    <!-- harbor-device-share deploy probe 2026-04-22b -->
    <main class="shell">
      <section class="panel">
        ${renderBrandLockup(env.APP_NAME)}
        <h1>This connection link is unavailable.</h1>
        <p class="lede">It may have expired, been removed, or never existed on this deployment.</p>
      </section>
    </main>
  </body>
</html>`;
}

function renderSharePage(
  env: Env,
  url: URL,
  payload: DeviceSharePayload,
  appImportURL: string,
  downloadInfo: DownloadInfo | null
): string {
  const displayName = payload.deviceName.trim().length > 0 ? payload.deviceName : "this device";
  const downloadButton = downloadInfo?.url
    ? `<a class="button" href="${escapeHTML(downloadInfo.url)}">Download platform10</a>`
    : "";

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Connect with ${escapeHTML(displayName)} on platform10</title>
    <meta property="og:title" content="Connect with ${escapeHTML(displayName)} on platform10">
    <meta property="og:description" content="Open platform10 and add ${escapeHTML(displayName)} with one click.">
    <meta property="og:url" content="${escapeHTML(url.toString())}">
    <style>${baseStyles()}</style>
  </head>
  <body>
    <main class="shell">
      <section class="hero">
        ${renderBrandLockup(env.APP_NAME)}
        <h1>Connect with ${escapeHTML(displayName)} on platform10.</h1>
        <p class="lede">If platform10 is already installed, it should open automatically.</p>
        <div class="button-row">
          <a class="button primary" href="${escapeHTML(appImportURL)}">Open platform10</a>
          ${downloadButton}
        </div>
        <p class="support-copy"><span id="handoff-status">Opening platform10…</span> <a class="inline-link" href="${escapeHTML(appImportURL)}">Already have platform10 installed? Click here.</a></p>
        <p class="meta">If not, just download and run. No account needed.</p>
      </section>
    </main>
    <script>
      (() => {
        const deepLink = "${escapeJS(appImportURL)}";
        const status = document.getElementById("handoff-status");
        const attemptOpen = () => {
          const frame = document.createElement("iframe");
          frame.setAttribute("aria-hidden", "true");
          frame.style.position = "absolute";
          frame.style.width = "1px";
          frame.style.height = "1px";
          frame.style.opacity = "0";
          frame.style.pointerEvents = "none";
          frame.src = deepLink;
          document.body.appendChild(frame);
          window.setTimeout(() => frame.remove(), 1600);
        };
        document.addEventListener("visibilitychange", () => {
          if (document.hidden && status) {
            status.textContent = "platform10 is opening…";
          }
        });
        attemptOpen();
        window.setTimeout(() => {
          if (!document.hidden && status) {
            status.textContent = "Already have platform10 installed?";
          }
        }, 1400);
      })();
    </script>
  </body>
</html>`;
}

function renderBrandLockup(appName: string): string {
  return `
    <div class="brand-lockup" aria-label="${escapeHTML(appName)}">
      <img class="app-icon" src="${HARBOR_ICON_DATA_URL}" alt="">
      <div class="brand-text">
        <span class="eyebrow">platform10</span>
      </div>
    </div>
  `;
}

function renderDownloadPanel(downloadInfo: DownloadInfo | null): string {
  if (!downloadInfo?.url) {
    return "";
  }

  const metaParts = [
    downloadInfo.version ? `Version ${escapeHTML(downloadInfo.version)}` : "",
    downloadInfo.buildLabel ? escapeHTML(downloadInfo.buildLabel) : "",
    downloadInfo.publishedAt ? escapeHTML(formatPublishedDate(downloadInfo.publishedAt)) : ""
  ].filter(Boolean);

  const metaMarkup = metaParts.length > 0
    ? `<p class="meta">${metaParts.join(" • ")}</p>`
    : "";

  return `
      <section class="panel download-panel">
        <div class="download-grid">
          <div class="download-copy">
            <p class="section-label">Need platform10 first?</p>
            <h2 class="download-title">Download the desktop app</h2>
            ${metaMarkup}
          </div>
          <div class="download-actions">
            <a class="button primary" href="${escapeHTML(downloadInfo.url)}">Download platform10</a>
          </div>
        </div>
      </section>
  `;
}

function formatPublishedDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric"
  }).format(date);
}

function baseStyles(): string {
  return `
    :root {
      color-scheme: dark light;
      --bg: #f8f5ef;
      --ink: #07142e;
      --muted: #5d6674;
      --line: rgba(7, 20, 46, 0.13);
      --card: rgba(255, 255, 255, 0.82);
      --accent: #f44236;
      --green: #0e925d;
      --blue: #277bd6;
      --yellow: #f4b500;
      --shell: 1040px;
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      font-family: ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      background:
        linear-gradient(90deg, transparent 0 88px, rgba(244, 66, 54, 0.16) 88px 94px, transparent 94px 100%),
        linear-gradient(180deg, #fffcf7 0%, var(--bg) 100%);
      color: var(--ink);
    }
    .shell {
      max-width: var(--shell);
      margin: 0 auto;
      padding: 28px 24px 48px;
    }
    .hero {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      justify-content: center;
      gap: 14px;
    }
    .download-panel {
      margin-top: 20px;
    }
    .download-title {
      margin: 0 0 8px;
      font-size: clamp(24px, 3vw, 30px);
      line-height: 1;
      letter-spacing: 0;
    }
    .eyebrow, .section-label {
      margin: 0 0 8px;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      color: var(--muted);
    }
    .brand-lockup {
      display: inline-flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 18px;
    }
    .brand-text {
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
    .brand-lockup .eyebrow {
      margin: 0;
      color: var(--ink);
      opacity: 0.72;
    }
    .app-icon {
      width: 40px;
      height: 40px;
      border-radius: 10px;
      box-shadow: 0 10px 22px rgba(7, 20, 46, 0.14);
      flex: none;
    }
    h1 {
      margin: 0 0 10px;
      font-size: clamp(40px, 5.4vw, 72px);
      line-height: 0.92;
      letter-spacing: 0;
      max-width: 12ch;
    }
    .lede {
      max-width: 520px;
      margin: 0;
      font-size: 17px;
      line-height: 1.45;
      color: var(--muted);
    }
    .button-row {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      margin-top: 18px;
    }
    .button {
      appearance: none;
      border: 1px solid var(--line);
      border-radius: 999px;
      background: rgba(255,255,255,0.72);
      color: var(--ink);
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-height: 46px;
      padding: 0 20px;
      font: inherit;
      font-weight: 600;
      text-decoration: none;
    }
    .button.primary {
      background: var(--accent);
      color: white;
      border-color: var(--accent);
    }
    .panel {
      background: var(--card);
      border: 1px solid var(--line);
      border-radius: 18px;
      padding: 20px;
      backdrop-filter: blur(18px);
    }
    .download-grid {
      display: grid;
      grid-template-columns: minmax(0, 1fr) auto;
      gap: 18px;
      align-items: end;
    }
    .download-actions {
      display: flex;
      align-items: center;
      justify-content: flex-end;
    }
    .meta {
      margin: 0;
      color: var(--muted);
      line-height: 1.45;
    }
    .support-copy {
      margin: 2px 0 0;
      color: var(--muted);
      font-size: 14px;
      line-height: 1.45;
    }
    .inline-link {
      color: var(--ink);
      text-decoration: none;
      border-bottom: 1px solid rgba(7, 20, 46, 0.24);
    }
    .inline-link:hover {
      border-bottom-color: rgba(7, 20, 46, 0.48);
    }
    @media (max-width: 760px) {
      .shell {
        padding: 22px 16px 36px;
      }
      .download-grid {
        grid-template-columns: 1fr;
        align-items: start;
      }
      .download-actions {
        justify-content: flex-start;
      }
      .app-icon {
        width: 36px;
        height: 36px;
        border-radius: 10px;
      }
    }
  `;
}

function escapeHTML(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function escapeJS(value: string): string {
  return value.replaceAll("\\", "\\\\").replaceAll("'", "\\'");
}
