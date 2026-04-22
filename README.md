# Cargo Device Share Service

Standalone Cloudflare Worker for Cargo for Syncthing device handoff links.

It creates short share pages and JSON endpoints that let someone:

- add a device to Cargo with one click
- copy the raw Syncthing device ID
- scan a QR code for the device ID

This repo exists separately from the private Cargo app repo so Cloudflare's one-click deployment can target a public, standalone Worker repository.

## Deploy to Cloudflare

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/gjeffrey/cargo-device-share-service)

## What gets deployed

- Worker source: `src/index.ts`
- KV binding: `DEVICE_SHARES`
- Public routes:
  - `POST /api/share`
  - `GET /api/share/:id`
  - `GET /s/:id`
  - `GET /`

## One-click deploy

1. Click the `Deploy to Cloudflare` button above.
2. Sign in to Cloudflare if prompted.
3. Review the generated Worker settings.
4. Keep or rename the Worker.
5. Keep or rename the `DEVICE_SHARES` KV namespace.
6. Leave the default vars unless you intentionally changed the desktop app:
   - `APP_NAME=Cargo for Syncthing`
   - `CARGO_URL_SCHEME=cargo-syncthing`
7. Finish the deployment.
8. Copy the deployed Worker URL, usually something like `https://your-worker.your-subdomain.workers.dev`.

## Connect it to Cargo

1. Open Cargo.
2. Go to `Settings`.
3. Find `Device Sharing Service`.
4. Paste the deployed Worker URL.

After that, Cargo can generate:

- short share links
- hosted share pages
- one-click `Add to Cargo` handoff links

## Local development

```bash
npm install
npx wrangler dev
```

## Manual deploy

```bash
npm install
npx wrangler types
npx tsc --noEmit
npx wrangler deploy
```

## Test the deployed service

Example payload for `POST /api/share`:

```json
{
  "version": 1,
  "deviceName": "MacBook Pro",
  "deviceID": "YOUR-SYNCTHING-DEVICE-ID",
  "addresses": [
    "dynamic"
  ],
  "createdAt": "2026-04-22T12:00:00Z"
}
```

Example test:

```bash
curl -X POST "https://your-worker.your-subdomain.workers.dev/api/share" \
  -H "content-type: application/json" \
  -d '{
    "version": 1,
    "deviceName": "MacBook Pro",
    "deviceID": "YOUR-SYNCTHING-DEVICE-ID",
    "addresses": ["dynamic"],
    "createdAt": "2026-04-22T12:00:00Z"
  }'
```
