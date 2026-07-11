const CACHE = "activiteitenweger-v3";

const FILES = [
  "./",
  "./index.html",
  "./style.css",
  "./script-v3.js",
  "./manifest.json",
  "./icon-512.png"
];

self.addEventListener("install", event => {
    event.waitUntil(
        caches.open(CACHE).then(cache => cache.addAll(FILES))
    );
});

self.addEventListener("fetch", event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            return response || fetch(event.request);
        })
    );
});