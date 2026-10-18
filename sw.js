const V='sr-v10';
const CORE=["./", "index.html", "app.css", "app.js", "data.js", "extra.js", "manifest.json", "Outfit-Bold.ttf", "Outfit-Regular.ttf", "Readex-Arabic.woff", "icon-192.png", "icon-512.png", "apple-touch-icon.png"];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==V).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  const u=new URL(e.request.url);
  if(e.request.method!=='GET'||u.origin!==location.origin)return;
  const heavy=/\/(audio_(?!index)|snd_|pics_)[^/]*\.js$|\.(png|jpg|webp|ttf|woff)$/.test(u.pathname);
  if(heavy){
    e.respondWith(caches.open(V).then(c=>c.match(e.request).then(hit=>hit||fetch(e.request).then(r=>{if(r&&r.ok)c.put(e.request,r.clone());return r}))));
  }else{
    e.respondWith(fetch(e.request).then(r=>{if(r&&r.ok){const cl=r.clone();caches.open(V).then(c=>c.put(e.request,cl))}return r}).catch(()=>caches.match(e.request).then(h=>h||caches.match('index.html'))));
  }
});
