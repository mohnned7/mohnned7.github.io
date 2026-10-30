const V='sr-v40';
const M='sr-media-1';
const CHANGED=["snd_a1_10.js", "snd_a1_12.js", "snd_a1_2.js", "snd_a1_3.js", "snd_a1_s13.js", "snd_a1_s16.js", "snd_a1_s2.js", "snd_a1_s3.js", "snd_a1_s4.js", "snd_abc_2.js", "snd_abc_3.js", "snd_abc_s2.js", "snd_abc_s3.js", "snd_abc_s4.js", "snd_calendar_1.js", "snd_calendar_s1.js", "snd_colors_1.js", "snd_colors_s1.js", "snd_exam_4.js", "snd_exam_s5.js", "snd_intro_1.js", "snd_intro_s1.js", "snd_jobs_1.js", "snd_jobs_s1.js", "snd_letter_3.js", "snd_letter_s3.js", "snd_num_1.js", "snd_num_2.js", "snd_num_s1.js", "snd_num_s2.js", "snd_verbs_1.js", "snd_verbs_s1.js", "snd_verbs_s2.js"];
const CORE=["./", "index.html", "app.css", "app.js", "data.js", "extra.js", "manifest.json", "Outfit-Bold.ttf", "Outfit-Regular.ttf", "Readex-Arabic.woff", "icon-192.png", "icon-512.png", "apple-touch-icon.png"];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==V&&k!==M).map(k=>caches.delete(k)))).then(()=>caches.open(M)).then(c=>c.keys().then(rs=>Promise.all(rs.filter(r=>CHANGED.some(f=>r.url.split('?')[0].endsWith('/'+f))).map(r=>c.delete(r))))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  const u=new URL(e.request.url);
  if(e.request.method!=='GET'||u.origin!==location.origin)return;
  const snd=/\/(audio_(?!index)|snd_)[^/]*\.js$|\.(ttf|woff)$/.test(u.pathname);
  const img=/\/pics_[^/]*\.js$|\.(png|jpg|jpeg|webp|gif|svg)$/.test(u.pathname);
  if(snd){
    e.respondWith(caches.open(M).then(c=>c.match(e.request).then(hit=>hit||fetch(e.request).then(r=>{if(r&&r.ok)c.put(e.request,r.clone());return r}))));
  }else{
    const C=img?M:V;
    e.respondWith(fetch(e.request,{cache:'no-cache'}).then(r=>{if(r&&r.ok){const cl=r.clone();caches.open(C).then(c=>c.put(e.request,cl))}return r}).catch(()=>caches.match(e.request).then(h=>h||(e.request.mode==='navigate'?caches.match('index.html'):h))));
  }
});
