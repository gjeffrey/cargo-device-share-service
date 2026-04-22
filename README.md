# Cargo Device Share Service

Standalone Cloudflare Worker for Cargo for Syncthing device handoff links.

It creates short share pages and JSON endpoints that let someone:

- add a device to Cargo with one click
- copy the raw Syncthing device ID
- scan a QR code for the device ID
- download the latest public Cargo build from a stable URL

This repo exists separately from the private Cargo app repo so Cloudflare's one-click deployment can target a public, standalone Worker repository.

## Deploy to Cloudflare

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/gjeffrey/cargo-device-share-service)

## One-click deploy

1. Click the `Deploy to Cloudflare` button above.
2. Sign in to Cloudflare if prompted.
3. Review the generated Worker settings.
4. Keep or rename the Worker.
5. Keep or rename these KV namespaces:
   - `DEVICE_SHARES`
   - `APP_METADATA`
6. Leave the default vars unless you intentionally changed the desktop app:
   - `APP_NAME=Cargo for Syncthing`
   - `CARGO_URL_SCHEME=cargo-syncthing`
7. Finish the deployment.
8. Copy the deployed Worker URL.

## Connect it to Cargo

1. Open Cargo.
2. Go to `Settings`.
3. Find `Device Sharing Service`.
4. Paste the deployed Worker URL.

## Download metadata

The worker reads the latest public download information from:

- KV key: `latest-download` in the `APP_METADATA` binding
- fallback vars:
  - `DOWNLOAD_URL`
  - `DOWNLOAD_VERSION`
  - `DOWNLOAD_BUILD_LABEL`

The expected KV value is JSON like:

```json
{
  "url": "https://downloads.example.com/Cargo-for-Syncthing-latest.zip",
  "version": "0.1.0-beta.3",
  "buildLabel": "Test build",
  "publishedAt": "2026-04-22T12:00:00Z"
}
```

## Local development

```bash
npm install
npx wrangler dev
```

## Manual deploy

```bash
npm install
npx wrangler types
npm run check
npx wrangler deploy
```
