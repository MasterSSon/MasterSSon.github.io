// Wycena Fachowca — tryb offline
var WERSJA = 'wf-1.2.10';
var PLIKI = ['./', './index.html', './rdzen.js', './cenniki.js', './manifest.json', './ikona-192.png', './ikona-512.png'];
self.addEventListener('install', function (e) { e.waitUntil(caches.open(WERSJA).then(function (c) { return c.addAll(PLIKI); })); self.skipWaiting(); });
self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (k) { return Promise.all(k.filter(function (x) { return x !== WERSJA; }).map(function (x) { return caches.delete(x); })); }));
  self.clients.claim();
});
self.addEventListener('fetch', function (e) {
  if (e.request.method !== 'GET') return;
  e.respondWith(fetch(e.request).then(function (r) {
    var kopia = r.clone(); if (r.ok && new URL(e.request.url).origin === location.origin) caches.open(WERSJA).then(function (c) { c.put(e.request, kopia); });
    return r;
  }).catch(function () { return caches.match(e.request).then(function (r) { return r || caches.match('./index.html'); }); }));
});
