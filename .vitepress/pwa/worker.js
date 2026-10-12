const { base, version, files } = __PWA_CONFIG__;
const prefix = `notes-pwa:${base}:`;
const precache = `${prefix}${version}:static`;
const runtime = `${prefix}${version}:runtime`;
const core = new Set(files.map((file) => new URL(file, self.location.origin).href));

self.addEventListener("install", (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(precache);
    try {
      // Limit concurrent requests on large knowledge bases.
      for (let offset = 0; offset < files.length; offset += 20) {
        await cache.addAll(files.slice(offset, offset + 20).map((url) => new Request(url, { cache: "reload" })));
      }
    } catch (error) {
      await caches.delete(precache);
      throw error;
    }
  })());
});

self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    for (const name of await caches.keys()) {
      if (name.startsWith(prefix) && name !== precache && name !== runtime) await caches.delete(name);
    }
    await self.clients.claim();
  })());
});

self.addEventListener("message", (event) => {
  if (event.data?.type === "SKIP_WAITING") event.waitUntil(self.skipWaiting());
});

function keyFor(url, navigation) {
  url.search = "";
  url.hash = "";
  if (navigation) {
    if (url.pathname.endsWith("/")) url.pathname += "index.html";
    else if (!/\.[^/]+$/.test(url.pathname)) url.pathname += ".html";
  }
  return url.href;
}

async function remember(key, response) {
  if (!response.ok || response.type === "opaque" || response.headers.has("content-range")) return;
  // Large media stays online; keep the bounded reading cache within a practical size.
  if (Number(response.headers.get("content-length")) > 5 * 1024 * 1024) return;
  if ((await response.clone().blob()).size > 5 * 1024 * 1024) return;
  const cache = await caches.open(runtime);
  await cache.put(key, response);
  const keys = await cache.keys();
  for (const request of keys.slice(0, Math.max(0, keys.length - 200))) await cache.delete(request);
}

self.addEventListener("fetch", (event) => {
  const request = event.request;
  const url = new URL(request.url);
  if (request.method !== "GET" || url.origin !== self.location.origin || !url.pathname.startsWith(base)
    || request.headers.has("range") || url.pathname === `${base}sw.js`) return;
  const navigation = request.mode === "navigate";
  const hasQuery = !!url.search;
  const key = keyFor(url, navigation || url.pathname.endsWith("/"));
  // Keep query-specific resources separate; embed/theme parameters only alter client rendering.
  if (!navigation && hasQuery) return;
  event.respondWith((async () => {
    const cached = await (await caches.open(precache)).match(key)
      || await (await caches.open(runtime)).match(key);
    if (!navigation && cached) return cached;
    try {
      const response = await fetch(request);
      if (response.status >= 500 && cached) return cached;
      if (!core.has(key)) event.waitUntil(remember(key, response.clone()).catch(() => {}));
      return response;
    } catch {
      if (cached) return cached;
      if (navigation) return (await caches.open(precache)).match(`${base}offline.html`);
      return Response.error();
    }
  })());
});
