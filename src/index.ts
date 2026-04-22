import QRCode from "qrcode";

interface Env {
  DEVICE_SHARES: KVNamespace;
  APP_METADATA: KVNamespace;
  APP_NAME: string;
  CARGO_URL_SCHEME: string;
  DOWNLOAD_URL?: string;
  DOWNLOAD_VERSION?: string;
  DOWNLOAD_BUILD_LABEL?: string;
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

const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365;

export default {
  async fetch(request, env): Promise<Response> {
    const url = new URL(request.url);

    if (request.method === "POST" && url.pathname === "/api/share") {
      return createShare(request, env, url);
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

  const cargoImportURL = buildCargoImportURL(env.CARGO_URL_SCHEME, payload);
  const downloadInfo = await resolveDownloadInfo(env);
  const deviceIDQRCode = await QRCode.toString(payload.deviceID, {
    type: "svg",
    margin: 1,
    width: 176,
    color: {
      dark: "#161616",
      light: "#ffffff"
    }
  });

  return new Response(renderSharePage(env, url, payload, cargoImportURL, deviceIDQRCode, downloadInfo), {
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

function buildCargoImportURL(scheme: string, payload: DeviceSharePayload): string {
  const encoded = base64URLEncode(JSON.stringify(payload));
  return `${scheme}://connect-device?payload=${encoded}`;
}

function randomShortID(): string {
  return crypto.randomUUID().replace(/-/g, "").slice(0, 8);
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
    <main class="shell">
      <section class="hero">
        <p class="eyebrow">Cargo Device Share</p>
        <h1>Create short Syncthing connection links from Cargo.</h1>
        <p class="lede">Deploy this worker, point Cargo at it in Settings, and the app will generate short share pages that open directly back into Cargo and still show the raw Syncthing device ID.</p>
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
    <main class="shell">
      <section class="panel">
        <p class="eyebrow">${escapeHTML(env.APP_NAME)}</p>
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
  cargoImportURL: string,
  deviceIDQRCode: string,
  downloadInfo: DownloadInfo | null
): string {
  const addressLines = payload.addresses.map((address) => `<li>${escapeHTML(address)}</li>`).join("");
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Connect ${escapeHTML(payload.deviceName)}</title>
    <meta property="og:title" content="Connect ${escapeHTML(payload.deviceName)}">
    <meta property="og:description" content="Use this link to add ${escapeHTML(payload.deviceName)} to Cargo or any Syncthing install.">
    <meta property="og:url" content="${escapeHTML(url.toString())}">
    <style>${baseStyles()}</style>
  </head>
  <body>
    <main class="shell">
      <section class="hero">
        <p class="eyebrow">${escapeHTML(env.APP_NAME)}</p>
        <h1>Connect ${escapeHTML(payload.deviceName)}</h1>
        <p class="lede">Open this device in Cargo with one click, or use the Syncthing device ID below in any regular Syncthing install.</p>
        <div class="button-row">
          <a class="button primary" href="${escapeHTML(cargoImportURL)}">Add to Cargo</a>
          <button class="button" type="button" onclick="navigator.clipboard.writeText('${escapeJS(payload.deviceID)}')">Copy Device ID</button>
        </div>
      </section>

      ${renderDownloadPanel(downloadInfo)}

      <section class="grid">
        <article class="panel">
          <p class="section-label">Syncthing Device ID</p>
          <code class="device-id">${escapeHTML(payload.deviceID)}</code>
          <p class="meta">Addresses advertised by this device</p>
          <ul class="address-list">${addressLines}</ul>
        </article>

        <article class="panel qr-panel">
          <p class="section-label">QR Code</p>
          <div class="qr">${deviceIDQRCode}</div>
          <p class="meta">Scan this QR code or paste the device ID into any Syncthing install.</p>
        </article>
      </section>
    </main>
  </body>
</html>`;
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
        <p class="section-label">Need Cargo first?</p>
        <h2 class="download-title">Download the desktop app</h2>
        ${metaMarkup}
        <div class="button-row">
          <a class="button primary" href="${escapeHTML(downloadInfo.url)}">Download Cargo</a>
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
      --bg: #f3efe5;
      --ink: #181511;
      --muted: #6f6458;
      --line: rgba(24, 21, 17, 0.12);
      --card: rgba(255, 255, 255, 0.75);
      --accent: #161616;
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      font-family: ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      background: linear-gradient(180deg, #faf7f0 0%, #ece5d7 100%);
      color: var(--ink);
    }
    .shell {
      max-width: 960px;
      margin: 0 auto;
      padding: 40px 20px 64px;
    }
    .hero {
      padding: 0 0 32px;
      border-bottom: 1px solid var(--line);
      margin-bottom: 28px;
    }
    .download-panel {
      margin-top: 26px;
    }
    .download-title {
      margin: 0 0 10px;
      font-size: clamp(24px, 3vw, 34px);
      line-height: 1.05;
      letter-spacing: -0.03em;
    }
    .eyebrow, .section-label {
      margin: 0 0 10px;
      font-size: 12px;
      font-weight: 700;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      color: var(--muted);
    }
    h1 {
      margin: 0 0 12px;
      font-size: clamp(36px, 6vw, 68px);
      line-height: 0.95;
      letter-spacing: -0.05em;
    }
    .lede {
      max-width: 720px;
      margin: 0;
      font-size: 18px;
      line-height: 1.5;
      color: var(--muted);
    }
    .button-row {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      margin-top: 22px;
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
      min-height: 44px;
      padding: 0 18px;
      font: inherit;
      text-decoration: none;
    }
    .button.primary {
      background: var(--accent);
      color: white;
      border-color: var(--accent);
    }
    .grid {
      display: grid;
      gap: 18px;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    }
    .panel {
      background: var(--card);
      border: 1px solid var(--line);
      border-radius: 28px;
      padding: 22px;
      backdrop-filter: blur(18px);
    }
    .device-id {
      display: block;
      margin: 0 0 18px;
      font-size: 15px;
      line-height: 1.6;
      overflow-wrap: anywhere;
    }
    .meta {
      margin: 0;
      color: var(--muted);
      line-height: 1.5;
    }
    .address-list {
      margin: 12px 0 0;
      padding-left: 20px;
      color: var(--ink);
    }
    .qr-panel {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
    }
    .qr {
      display: inline-flex;
      padding: 14px;
      border-radius: 18px;
      background: white;
      margin-bottom: 14px;
    }
    .qr svg {
      display: block;
      width: 176px;
      height: 176px;
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
