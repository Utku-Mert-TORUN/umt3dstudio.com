/* Umt3D Studio — basit offline önbellek.
   HTML/CSS/JS için önce ağ (güncel kalsın), ağ yoksa önbellek. Diğer istekler dokunulmaz. */
var CACHE = "umt3d-v4";
var SHELL = [
  "./", "index.html", "calculator.html", "faq.html", "privacy.html", "hakkinda.html", "iletisim.html", "kosullar.html",
  "css/site.css", "css/calculator.css", "js/site.js", "js/calculator.js",
  "manifest.webmanifest", "favicon.ico", "assets/umt3d-icon.svg", "assets/p2s-printer.svg", "assets/filament-spool.svg", "icons/icon-192.png", "icons/icon-512.png"
];

self.addEventListener("install", function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(SHELL); }).then(function () { return self.skipWaiting(); }));
});

self.addEventListener("activate", function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); }));
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener("fetch", function (e) {
  var req = e.request;
  if (req.method !== "GET") return;
  var url = new URL(req.url);
  if (url.origin !== location.origin) return;
  e.respondWith(
    fetch(req).then(function (res) {
      if (res && res.status === 200) {
        var copy = res.clone();
        caches.open(CACHE).then(function (c) { c.put(req, copy); });
      }
      return res;
    }).catch(function () {
      return caches.match(req).then(function (hit) { return hit || caches.match("index.html"); });
    })
  );
});
