/* Fernweh Atlas — Service Worker (Stufe 0)
 * Offline-fähig ohne Framework: App-Shell cachen, Seiten network-first,
 * statische Assets cache-first. Funktioniert auch unter /UrlaubsFinder/. */
const CACHE = "fernweh-atlas-v1";
const SCOPE = new URL(self.registration ? self.registration.scope : "./", self.location).pathname;

self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE).then((c) => c.addAll([SCOPE]).catch(() => {})),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return; // Fremd-Assets (z. B. Fotos) nicht anfassen

  if (req.mode === "navigate") {
    // Seiten: erst Netz, dann Cache, dann Start-Seite als Offline-Fallback
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(req, copy));
          return res;
        })
        .catch(() => caches.match(req).then((r) => r || caches.match(SCOPE))),
    );
    return;
  }

  // Statische Assets: erst Cache, dann Netz (und nachcachen)
  event.respondWith(
    caches.match(req).then(
      (cached) =>
        cached ||
        fetch(req)
          .then((res) => {
            if (res && res.ok && res.type === "basic") {
              const copy = res.clone();
              caches.open(CACHE).then((c) => c.put(req, copy));
            }
            return res;
          })
          .catch(() => cached),
    ),
  );
});
