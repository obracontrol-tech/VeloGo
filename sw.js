// VeloGo — Service Worker (v1.5: mapas sin conexión)
const CACHE = 'velogo-v151';                 // la app (se renueva con cada versión)
const MAPS = 'velogo-offline-map';           // zonas guardadas por el ciclista (no se borran al actualizar)
const VIEW = 'velogo-map-view';              // mapa ya visto (se recorta solo)
const LIBS = 'velogo-libs';                  // librerías externas (mapa, Firebase, letras)
const KEEP = [CACHE, MAPS, VIEW, LIBS];
const CORE = ['./', './index.html', './manifest.json', './privacidad.html', './icons/qr.svg', './icons/icon-192.png', './icons/icon-512.png'];
const VIEW_MAX = 4000;

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(k => Promise.all(k.filter(n => !KEEP.includes(n)).map(n => caches.delete(n)))).then(() => self.clients.claim()));
});

let trimming = false;
async function trimView() {
  if (trimming) return; trimming = true;
  try { const c = await caches.open(VIEW); const keys = await c.keys(); if (keys.length > VIEW_MAX) { for (const k of keys.slice(0, keys.length - VIEW_MAX + 500)) await c.delete(k); } }
  finally { trimming = false; }
}
async function fromCaches(req) {
  return (await caches.match(req, { cacheName: MAPS })) || (await caches.match(req, { cacheName: VIEW }));
}
// Mapa: primero lo guardado; si no, red y se guarda en "visto"
async function tileFirst(req) {
  const hit = await fromCaches(req);
  if (hit) return hit;
  const r = await fetch(req);
  if (r.ok) { const c = await caches.open(VIEW); c.put(req, r.clone()); if (Math.random() < 0.05) trimView(); }
  return r;
}
// Estilo y TileJSON: red primero (versión nueva del mapa), guardado si no hay conexión
async function netFirstMap(req) {
  try { const r = await fetch(req); if (r.ok) { const c = await caches.open(VIEW); c.put(req, r.clone()); } return r; }
  catch (e) { const hit = await fromCaches(req); if (hit) return hit; throw e; }
}
async function libFirst(req) {
  const hit = await caches.match(req, { cacheName: LIBS });
  if (hit) { fetch(req).then(r => { if (r.ok) caches.open(LIBS).then(c => c.put(req, r)); }).catch(() => {}); return hit; }
  const r = await fetch(req); if (r.ok) { const c = await caches.open(LIBS); c.put(req, r.clone()); } return r;
}

self.addEventListener('fetch', e => {
  const req = e.request; if (req.method !== 'GET') return;
  const u = new URL(req.url);
  if (u.hostname === 'tiles.openfreemap.org') {
    const isData = /\.(pbf|png|jpg|webp|json)$/.test(u.pathname) && !u.pathname.startsWith('/styles/');
    e.respondWith(isData ? tileFirst(req) : netFirstMap(req)); return;
  }
  if (u.hostname === 'server.arcgisonline.com') { e.respondWith(tileFirst(req)); return; }
  if (u.hostname === 'unpkg.com' || (u.hostname === 'www.gstatic.com' && u.pathname.startsWith('/firebasejs/')) || u.hostname === 'fonts.googleapis.com' || u.hostname === 'fonts.gstatic.com') {
    e.respondWith(libFirst(req)); return;
  }
  if (u.origin !== location.origin) return;
  // La app: red primero (siempre la última versión); caché si no hay conexión
  e.respondWith(
    fetch(req).then(r => { const c = r.clone(); caches.open(CACHE).then(ca => ca.put(req, c)); return r; })
      .catch(() => caches.match(req).then(r => r || caches.match('./index.html')))
  );
});
