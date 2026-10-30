/* Sprachrakete 🚀 — تعلّم الألمانية بالعربية · MOHANNAD */
(function(){
'use strict';
var SR = window.SR, SX = window.SRX || {stories:[], letters:[], exam:null};
var $ = function(s, r){ return (r||document).querySelector(s); };
var $$ = function(s, r){ return Array.prototype.slice.call((r||document).querySelectorAll(s)); };
function esc(s){ return String(s == null ? '' : s).replace(/[&<>"]/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]; }); }
function pron(s){ return esc(s).replace(/\{u:([^}]*)\}/g,'<span class="uu">$1</span>').replace(/\{o:([^}]*)\}/g,'<span class="oo">$1</span>'); }
function rich(s){ return String(s).replace(/<de>(.*?)<\/de>/g,'<span class="de">$1</span>'); }
function ar(n){ return String(n); }
function shuffle(a, rnd){ a = a.slice(); rnd = rnd || Math.random; for (var i = a.length - 1; i > 0; i--){ var j = Math.floor(rnd() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
function seeded(str){ var h = 1779033703 ^ str.length; for (var i = 0; i < str.length; i++){ h = Math.imul(h ^ str.charCodeAt(i), 3432918353); h = h << 13 | h >>> 19; }
  return function(){ h = Math.imul(h ^ h >>> 16, 2246822507); h = Math.imul(h ^ h >>> 13, 3266489909); h ^= h >>> 16; return (h >>> 0) / 4294967296; }; }
function dkey(d){ return d.getFullYear() + '-' + (d.getMonth()+1) + '-' + d.getDate(); }
function today(){ return dkey(new Date()); }
function yesterday(){ return dkey(new Date(Date.now() - 864e5)); }
function plural(n, one, two, few, many){ return n === 1 ? one : n === 2 ? two : (n >= 3 && n <= 10) ? ar(n) + ' ' + few : ar(n) + ' ' + many; }
var ICONS = {
  home:'<path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',
  learn:'<path d="M12 6.5C10 5 7.5 4.5 3 4.5v14c4.5 0 7 .5 9 2 2-1.5 4.5-2 9-2v-14c-4.5 0-7 .5-9 2z"/><path d="M12 6.5v14"/>',
  train:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.3" fill="currentColor"/>',
  play:'<path d="M7 7h10a5 5 0 0 1 4.9 6l-.7 3.4a2.5 2.5 0 0 1-4.3 1.2L14.5 15h-5l-2.4 2.6a2.5 2.5 0 0 1-4.3-1.2L2.1 13A5 5 0 0 1 7 7z"/><path d="M7.5 9.5v3.5M5.75 11.25h3.5"/><circle cx="16" cy="10" r="1" fill="currentColor" stroke="none"/><circle cx="18" cy="12.5" r="1" fill="currentColor" stroke="none"/>',
  search:'<circle cx="11" cy="11" r="7"/><path d="m20 20-3.6-3.6"/>',
  sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2M12 19.5v2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M2.5 12h2M19.5 12h2M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4"/>',
  moon:'<path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/>',
  me:'<circle cx="12" cy="9.5" r="6.5"/><rect x="8.2" y="7" width="7.6" height="4.6" rx="2.3"/><path d="M5.5 21.5c.6-2.8 3.2-4.3 6.5-4.3s5.9 1.5 6.5 4.3"/>',
  words:'<circle cx="12" cy="12" r="5.5"/><path d="M6.3 14.6C3.6 16.5 2.5 18.2 3.3 19c1.3 1.3 6.6-1 11.7-5.3s8.2-8.8 7-10c-.7-.8-2.6 0-5 1.6"/>',
  a1:'<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5z"/><path d="M4 20.5A2.5 2.5 0 0 0 6.5 23H20v-5"/><path d="M9 8h6M9 11.5h4"/>',
  a2:'<path d="m12 3 9 5-9 5-9-5z"/><path d="m3 12.5 9 5 9-5"/><path d="m3 17 9 5 9-5"/>',
  read:'<path d="M14 3H6.5A2.5 2.5 0 0 0 4 5.5v13A2.5 2.5 0 0 0 6.5 21h11a2.5 2.5 0 0 0 2.5-2.5V9z"/><path d="M14 3v6h6M8 13h8M8 17h5"/>',
  tools:'<rect x="3" y="3" width="7.5" height="7.5" rx="2"/><rect x="13.5" y="3" width="7.5" height="7.5" rx="2"/><rect x="3" y="13.5" width="7.5" height="7.5" rx="2"/><path d="M17.25 14v7M13.75 17.5h7"/>',
  warn:'<path d="M12 3 2 20h20z"/><path d="M12 10v4M12 17h.01"/>',
  back:'<path d="M5 12h14M13 6l6 6-6 6"/>',
  mic:'<rect x="9" y="2.5" width="6" height="11.5" rx="3"/><path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21M8.5 21h7"/>',
  rocket:'<path d="M12 2.5c3 2.2 4.5 5.6 4.5 9.5v3.5h-9V12c0-3.9 1.5-7.3 4.5-9.5z"/><circle cx="12" cy="10" r="1.8"/><path d="M7.5 13 4.5 16v3l3-1.5M16.5 13l3 3v3l-3-1.5M10 18.5c0 1.5.8 2.6 2 3.3 1.2-.7 2-1.8 2-3.3"/>',
  chart:'<path d="M3 21h18"/><rect x="5" y="11" width="3.2" height="7" rx="1"/><rect x="10.4" y="6" width="3.2" height="12" rx="1"/><rect x="15.8" y="13" width="3.2" height="5" rx="1"/>',
  gear:'<circle cx="12" cy="12" r="3.2"/><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.87l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.7 1.7 0 0 0-1.87-.34 1.7 1.7 0 0 0-1 1.54V21a2 2 0 1 1-4 0v-.09a1.7 1.7 0 0 0-1.1-1.55 1.7 1.7 0 0 0-1.87.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.7 1.7 0 0 0 .34-1.87 1.7 1.7 0 0 0-1.54-1H3a2 2 0 1 1 0-4h.09a1.7 1.7 0 0 0 1.55-1.1 1.7 1.7 0 0 0-.34-1.87l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.7 1.7 0 0 0 1.87.34H9a1.7 1.7 0 0 0 1-1.54V3a2 2 0 1 1 4 0v.09a1.7 1.7 0 0 0 1 1.55 1.7 1.7 0 0 0 1.87-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.7 1.7 0 0 0-.34 1.87V9a1.7 1.7 0 0 0 1.54 1H21a2 2 0 1 1 0 4h-.09a1.7 1.7 0 0 0-1.55 1z"/>'
};
function ic(n, cls){ return '<svg class="ic' + (cls ? ' ' + cls : '') + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (ICONS[n] || '') + '</svg>'; }
var ICON_PLAY = '<svg viewBox="0 0 24 24"><path d="M3 10v4h4l5 4V6L7 10H3zm13.5 2a4.5 4.5 0 0 0-2.5-4v8a4.5 4.5 0 0 0 2.5-4zM14 3.2v2.1a7 7 0 0 1 0 13.4v2.1a9 9 0 0 0 0-17.6z"/></svg>';
var ICON_MIC = '<svg viewBox="0 0 24 24"><path d="M12 14a3 3 0 0 0 3-3V5a3 3 0 0 0-6 0v6a3 3 0 0 0 3 3zm5-3a5 5 0 0 1-10 0H5a7 7 0 0 0 6 6.92V21h2v-3.08A7 7 0 0 0 19 11h-2z"/></svg>';
var ART = {m:'der', f:'die', n:'das'};
var ARTINFO = {m:'<b>der</b> أداة للمذكّر، مثل «الـ» في العربية.<br>مثال: <span class="de">der Hund</span> = الكلب', f:'<b>die</b> أداة للمؤنّث، مثل «الـ» في العربية.<br>مثال: <span class="de">die Katze</span> = القطة', n:'<b>das</b> أداة للمحايد (لا مذكّر ولا مؤنّث)، مثل «الـ» في العربية.<br>مثال: <span class="de">das Haus</span> = البيت'};

/* ---------------- storage ---------------- */
function blank(){ return {xp:0, streak:0, last:'', days:{}, badges:{}, heard:{}, done:{}, gs:{}, mist:{}, fixed:0, cards:{}, games:{}, daily:{}, tools:{}, name:'', set:{theme:'dark', kids:false, sp:false, speed:'slow'}, v:5, perfect:false, test:null, popup:false, station:0, exam:{}, spoke:0}; }
var S = (function(){
  var d = blank();
  try{ var x = JSON.parse(localStorage.getItem('sprachrakete') || 'null');
    if (x){ for (var k in x) if (k !== 'seen') d[k] = x[k];
      d.set = Object.assign({theme:'dark', kids:false, sp:false, speed:'slow'}, x.set || {});
      if ((x.v || 1) < 3){ if (!x.set || x.set.theme !== 'light') d.set.theme = 'dark'; }
      if ((x.v || 1) < 4){ d.set.sp = false; d.v = 4; }
      if ((x.v || 1) < 5){ var od = 0; for (var kk in (x.done || {})) if (/^[tlsw]:/.test(kk)) od++; var of = [0, .06, .15, .28, .45, .62, .8, 1], oi = 0; of.forEach(function(f, i){ if (od >= Math.ceil(f * 48)) oi = i; }); d.stFloor = Math.min(oi, 6); d.v = 5; }
      ['heard','done','gs','mist','exam','days','badges','cards','games','daily','tools'].forEach(function(k){ if (!d[k] || typeof d[k] !== 'object') d[k] = {}; });
    } }catch(e){}
  return d;
})();
function save(){ try{ localStorage.setItem('sprachrakete', JSON.stringify(S)); }catch(e){} }

/* ---------------- owner config (config.json) ---------------- */
var CFG = {announcement:{text:'', link:'', color:'gold'}, whatsapp:'201080845228', youtube:'u0_0z', suggest:'', hide:[], goatcounter:'', repo:'mohnned7/mohnned7.github.io'};
var HIDE_KEYS = {exam:'تدريب الامتحان', test:'اختبار المستوى', speak:'اختبر نطقك', mistakes:'كرّاسة أخطائي', stories:'القصص', letters:'الرسائل', a2:'دروس A2', tools:'الأدوات', games:'الألعاب', scenes:'ألعاب المواقف', journey:'رحلتي'};
function hidden(k){ return (CFG.hide || []).indexOf(k) >= 0; }
function waNum(){ return String(CFG.whatsapp || '').replace(/[^\d]/g, ''); }
function ytName(){ return String(CFG.youtube || '').replace(/^@/, '').trim(); }
function loadConfig(){
  try{ fetch('config.json?t=' + Date.now(), {cache:'no-store'}).then(function(r){ return r.ok ? r.json() : null; }).then(function(c){
    if (!c || typeof c !== 'object') return;
    for (var k in c) CFG[k] = c[k];
    if (!Array.isArray(CFG.hide)) CFG.hide = [];
    if (!CFG.announcement || typeof CFG.announcement !== 'object') CFG.announcement = {text:''};
    showAnnouncement(); startStats(); if (!$('#stage')) route(); else navHide();
  }).catch(function(){}); }catch(e){}
}
function showAnnouncement(){
  var old = $('#annBar'); if (old) old.remove();
  var a = CFG.announcement || {}, t = String(a.text || '').trim(); if (!t) return;
  var key = 'ann:' + t; try{ if (localStorage.getItem('sr-ann') === key) return; }catch(e){}
  var lk = String(a.link || '').trim(), safe = /^(https?:\/\/|#\/)/.test(lk);
  var bar = document.createElement('div'); bar.id = 'annBar'; bar.className = 'ann ' + (['violet','red','green'].indexOf(a.color) >= 0 ? a.color : 'gold');
  bar.innerHTML = (safe ? '<a href="' + esc(lk) + '"' + (/^https?:/.test(lk) ? ' target="_blank" rel="noopener"' : '') + '>' + esc(t) + ' ‹</a>' : '<span>' + esc(t) + '</span>') + '<button type="button" aria-label="إغلاق">✕</button>';
  var top = $('#top'); top.parentNode.insertBefore(bar, top.nextSibling);
  bar.querySelector('button').onclick = function(){ bar.remove(); try{ localStorage.setItem('sr-ann', key); }catch(e){} };
}
var statsOn = false;
function startStats(){
  var code = String(CFG.goatcounter || '').trim().replace(/[^a-z0-9-]/gi, ''); if (!code || statsOn || location.protocol !== 'https:') return;
  statsOn = true; window.goatcounter = {no_onload:true};
  var s = document.createElement('script'); s.async = true; s.src = 'https://gc.zgo.at/count.js'; s.setAttribute('data-goatcounter', 'https://' + code + '.goatcounter.com/count');
  s.onload = function(){ countPeople(); countView(); }; document.head.appendChild(s);
}
function countPeople(){ try{ if (/^#\/?admin/.test(location.hash || '')) return; var g = window.goatcounter, now = Date.now(), d = new Date(), td = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate(), k = 'sr_ppl', m = {}; try{ m = JSON.parse(localStorage.getItem(k) || '{}') || {}; }catch(e){}
  var send = function(path){ g.count({path:path, title:path, event:false}); };
  if (!m.f){ send('/_people_all'); m.f = 1; } if (m.d !== td){ send('/_people_day'); m.d = td; } if (!m.w || now - m.w > 6048e5){ send('/_people_week'); m.w = now; }
  try{ localStorage.setItem(k, JSON.stringify(m)); }catch(e){} }catch(e){} }
function countView(){ try{ if (window.goatcounter && window.goatcounter.count){ var h = (location.hash || '#/').replace(/^#\/?/, '').split('/').slice(0, 2).join('/'); if (/^admin/.test(h)) return; window.goatcounter.count({path:'/' + h, title:document.title}); } }catch(e){} }

/* ---------------- theme / settings ---------------- */
function isDark(){ return S.set.theme !== 'light'; }
function applySettings(){
  var dark = isDark();
  document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
  document.body.classList.toggle('kids', !!S.set.kids);
  document.body.classList.toggle('sp', !!S.set.sp);
  var tb = $('#themeBtn'); if (tb){ tb.innerHTML = ic(dark ? 'sun' : 'moon'); tb.title = dark ? 'الوضع النهاري' : 'الوضع الليلي'; }
  var meta = $('meta[name=theme-color]'); if (meta) meta.setAttribute('content', dark ? '#0D0A24' : '#F3F1FF');
}

/* ---------------- audio ---------------- */
var AUD = {}, AUDS = {};
window.SRA = function(o){ for (var k in o) AUD[k] = o[k]; };
window.SRAS = function(o){ for (var k in o) AUDS[k] = o[k]; };
var IDX = null, idxDone = false, pend = [], loadedF = {};
window.SRI = function(o){ IDX = o || null; };
(function(){ var s = document.createElement('script'); s.src = 'audio_index.js'; s.async = true;
  function fin(){ idxDone = true; var p = pend; pend = []; p.forEach(function(g){ loadAudio(g); }); }
  s.onload = fin; s.onerror = function(){ s.remove(); fin(); }; document.head.appendChild(s); })();
var loadingN = 0;
function addScript(f){ if (loadedF[f]) return; loadedF[f] = 1; loadingN++; var s = document.createElement('script'); s.src = f; s.async = true; s.onload = function(){ loadingN = Math.max(0, loadingN - 1); }; s.onerror = function(){ loadingN = Math.max(0, loadingN - 1); s.remove(); }; document.head.appendChild(s); }
function loadAudio(grp){
  if (!grp) return;
  if (!idxDone){ if (pend.indexOf(grp) < 0) pend.push(grp); return; }
  if (IDX && IDX[grp]){ (IDX[grp].n || []).forEach(addScript); if (S.set.speed === 'slow') (IDX[grp].s || []).forEach(addScript); return; }
  var f = SR.audioGroups && SR.audioGroups[grp]; if (f) addScript(f);
}
var usedGroups = {};
function useAudio(grp){ usedGroups[grp] = 1; loadAudio(grp); }
var synth = window.speechSynthesis, voice = null, curA = null, token = 0;
function pickVoice(){
  if (!synth) return; var v = synth.getVoices() || []; var de = v.filter(function(x){ return /^de/i.test(x.lang); });
  var good = de.filter(function(x){ return /natural|neural|enhanced|premium|google|anna|katja|petra|helena/i.test(x.name); });
  voice = good.find(function(x){ return /de[-_]DE/i.test(x.lang); }) || good[0] || de.find(function(x){ return /de[-_]DE/i.test(x.lang); }) || de[0] || null;
}
if (synth){ pickVoice(); synth.onvoiceschanged = pickVoice; }
var paBtn = null, paLabel = '';
function paStart(b){ paEnd(); paBtn = b; paLabel = b.textContent; b.textContent = '⏹ إيقاف'; b.classList.add('stopbtn'); }
function paEnd(){ if (paBtn){ paBtn.textContent = paLabel; paBtn.classList.remove('stopbtn'); paBtn = null; } }
function paToggle(b, run){ if (!b) return; b.onclick = function(){ if (paBtn === b){ stopAudio(); return; } stopAudio(); paStart(b); run(); }; }
function stopAudio(){ token++; spId++; paEnd(); if (synth) synth.cancel(); if (curA){ try{ curA.pause(); }catch(e){} curA = null; } }
var PL = null;
/* iPhone needs one sound started by a tap before audio can play later. Done ONCE, with a valid silent clip,
   and never while a word is playing, so it can never cut a word. */
var SILENT = 'data:audio/mpeg;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjYwLjE2LjEwMAAAAAAAAAAAAAAA//OEwAAAAAAAAAAAAEluZm8AAAAPAAAACQAABCAARUVFRUVFRUVFRUVdXV1dXV1dXV1dXXR0dHR0dHR0dHR0i4uLi4uLi4uLi4uioqKioqKioqKiorq6urq6urq6urq60dHR0dHR0dHR0dHo6Ojo6Ojo6Ojo6P//////////////AAAAAExhdmM2MC4zMQAAAAAAAAAAAAAAACQD8AAAAAAAAAQgDeb0IwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//NExAAAAANIAAAAAExBTUUzLjEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVTEFNRTMu//NExFMAAANIAAAAADEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVTEFNRTMu//NExKYAAANIAAAAADEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVTEFNRTMu//NExKwAAANIAAAAADEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVTEFNRTMu//NExKwAAANIAAAAADEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVTEFNRTMu//NExKwAAANIAAAAADEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVTEFNRTMu//NExKwAAANIAAAAADEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//NExKwAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//NExKwAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV';
function unlockAudio(){ try{ if (!PL) PL = new Audio(); if (PL._u || PL._busy || curA === PL) return; PL._busy = 1; PL.src = SILENT;
  var pr = PL.play(); if (pr && pr.then) pr.then(function(){ PL._u = 1; PL._busy = 0; document.removeEventListener('pointerdown', unlockAudio); document.removeEventListener('touchend', unlockAudio); }, function(){ PL._busy = 0; }); else PL._busy = 0; }catch(e){} }
document.addEventListener('pointerdown', unlockAudio, {passive:true}); document.addEventListener('touchend', unlockAudio, {passive:true});
var spId = 0, spWait = 0;
/* a swipe/scroll must never count as a tap on a word card */
var tg = {x:0, y:0, moved:false, sy:0, t:0}, lastScrollT = 0;
document.addEventListener('pointerdown', function(e){ tg = {x:e.clientX, y:e.clientY, moved:false, sy:scrollY, t:Date.now()}; }, true);
document.addEventListener('pointermove', function(e){ if (Math.abs(e.clientX - tg.x) > 8 || Math.abs(e.clientY - tg.y) > 8) tg.moved = true; }, {capture:true, passive:true});
addEventListener('scroll', function(){ lastScrollT = Date.now(); }, {passive:true});
document.addEventListener('click', function(e){
  var c = e.target && e.target.closest && e.target.closest('.it[data-i],.lt,.sline,[data-s],[data-x],.bub');
  if (!c) return;
  if (tg.moved || Math.abs(scrollY - tg.sy) > 4){ e.stopPropagation(); e.preventDefault(); }
}, true);
/* finger drag (scrolling) cancels a word that is still waiting for its audio */
document.addEventListener('touchmove', function(){ if (spWait && spWait === spId) spId++; spWait = 0; }, {passive:true});
function speak(text, done, tries, id){
  if (id === undefined) id = ++spId; else if (id !== spId) return;
  if (curA){ try{ curA.onended = null; curA.onerror = null; curA.pause(); }catch(e){} curA = null; }
  var slow = S.set.speed === 'slow', b = slow && AUDS[text] ? AUDS[text] : AUD[text], native = slow && !!AUDS[text];
  /* recorded voice still downloading: wait for it instead of using the phone's voice */
  if (!b && (loadingN > 0 || !idxDone) && (tries || 0) < 25){ spWait = id; setTimeout(function(){ speak(text, done, (tries || 0) + 1, id); }, 150); return; }
  spWait = 0;
  var fin = false; function end(){ if (fin) return; fin = true; if (done) done(); }
  if (b){
    if (synth) synth.cancel();
    var a = (PL && PL._u) ? PL : new Audio(); a.onended = null; a.onerror = null; a.src = 'data:audio/mpeg;base64,' + b; a.playbackRate = native ? 1 : (slow ? 0.82 : 1);
    try{ a.preservesPitch = true; a.mozPreservesPitch = true; a.webkitPreservesPitch = true; }catch(e){}
    /* the phone's voice stays as the backup, but only for a real failure of the word that is still playing,
       never because the user tapped something else (AbortError = interrupted on purpose) */
    var backup = function(err){ if (fin || id !== spId || curA !== a) return; if (err && err.name === 'AbortError') return; fin = true; tts(text, done); };
    a.onended = end; a.onerror = function(){ backup(null); };
    curA = a; var pr = a.play(); if (pr && pr.catch) pr.catch(backup);
    return;
  }
  tts(text, end);
}
function tts(text, done){
  if (!synth){ if (done) setTimeout(done, 600); return; }
  synth.cancel(); var u = new SpeechSynthesisUtterance(text);
  u.lang = voice ? voice.lang : 'de-DE'; if (voice) u.voice = voice;
  u.rate = S.set.speed === 'slow' ? 0.62 : 0.88;
  var fired = false; function f(){ if (fired) return; fired = true; if (done) done(); }
  u.onend = f; u.onerror = f; synth.speak(u);
  setTimeout(f, 1400 + text.length * 150);
}

/* ---------------- units & progress ---------------- */
var TOPIC_EXTRA = [{id:'abc',e:'🔤',color:'#5B3DF5',title:'الحروف',de:'Das Alphabet',desc:'30 حرفًا بأسمائها وأصواتها'},
                   {id:'num',e:'🔢',color:'#FF6B2C',title:'الأرقام',de:'Die Zahlen',desc:'من الصفر إلى المليون'}];
function modById(id){ return SR.modules.find(function(m){ return m.id === id; }); }
function topics(){ return TOPIC_EXTRA.concat(SR.modules); }
var UNITS = [], UMAP = {};
function buildUnits(){
  UNITS = []; UMAP = {};
  function add(u){ UNITS.push(u); UMAP[u.id] = u; }
  topics().forEach(function(t){ add({id:'t:' + t.id, kind:'topic', key:t.id, title:t.title, e:t.e, color:t.color, href:'#/t/' + t.id, size:itemsOf(t.id).length}); });
  SR.a1.forEach(function(l){ add({id:'l:' + l.id, kind:'a1', key:l.id, title:l.title, e:'📘', color:l.color, href:'#/l/' + l.id, size:l.items.length, num:l.num}); });
  SR.a2.forEach(function(l){ add({id:'l:' + l.id, kind:'a2', key:l.id, title:l.title, e:l.e || '📗', color:l.color, href:'#/l/' + l.id, size:l.items.length}); });
  (SR.b1 || []).forEach(function(l){ add({id:'l:' + l.id, kind:'b1', key:l.id, title:l.title, e:l.e || '📙', color:l.color, href:'#/l/' + l.id, size:l.items.length}); });
  (SX.stories || []).forEach(function(s){ add({id:'s:' + s.id, kind:'story', key:s.id, title:s.title, e:s.e, color:s.color, href:'#/story/' + s.id, size:1}); });
  (SX.letters || []).forEach(function(w){ add({id:'w:' + w.id, kind:'letter', key:w.id, title:w.title, e:w.e, color:w.color, href:'#/letter/' + w.id, size:w.lines.length}); });
  if (SX.exam) EXAM_PARTS.forEach(function(p){ add({id:'e:' + p.id, kind:'exam', key:p.id, title:'تدريب الامتحان: ' + p.t, e:p.e, color:p.c, href:'#/exam/' + p.id, size:1}); });
}
var PATH = ['t:abc','t:num','t:greet','t:intro','l:a1-1','l:a1-2','l:a1-3','t:colors','t:family','l:a1-4','l:a1-5','t:food','t:home','l:a1-6','l:a1-7','t:body','t:animals','l:a1-8','l:a1-9','t:jobs','t:weather','l:a1-10','l:a1-11','t:travel','t:verbs','t:calendar','t:situations'];
function pathOrder(){ var o = PATH.filter(function(id){ return UMAP[id]; }); UNITS.forEach(function(u){ if (o.indexOf(u.id) < 0) o.push(u.id); }); return o; }
function heardCount(uid){ var h = S.heard[uid]; return h ? Object.keys(h).length : 0; }
function unitPct(uid){ var u = UMAP[uid]; if (!u) return 0; if (S.done[uid]) return 100; return Math.min(99, Math.round(heardCount(uid) / Math.max(1, u.size) * 100)); }
function doneCount(){ return UNITS.filter(function(u){ return S.done[u.id]; }).length; }
function markHeard(uid, k){
  var u = UMAP[uid]; if (!u || k == null) return;
  S.heard[uid] = S.heard[uid] || {};
  if (S.heard[uid][k]) return;
  S.heard[uid][k] = 1; dayLog().h = (dayLog().h || 0) + 1; save();
  if (!S.done[uid]){ addXP(2, true); if (heardCount(uid) >= u.size && (u.kind !== 'topic' || (S.pass && S.pass[uid]))) complete(uid); }
  updUnitBar(uid);
}
function updUnitBar(uid){
  var b = $('#ubar'); if (!b || b.dataset.u !== uid) return; var u = UMAP[uid], n = Math.min(heardCount(uid), u.size);
  b.innerHTML = unitBarInner(uid);
}
function unitBarInner(uid){ var u = UMAP[uid], n = S.done[uid] ? u.size : Math.min(heardCount(uid), u.size), pct = unitPct(uid);
  return '<div class="ubtop"><b>' + (S.done[uid] ? '✅ أكملتَ هذا الدرس' : '🎧 استمعتَ إلى ' + ar(n) + ' من ' + ar(u.size)) + '</b><span>' + ar(pct) + '٪</span></div><div class="prog"><i style="width:' + pct + '%"></i></div>' +
    (S.done[uid] ? '' : u.kind === 'topic' ? '<small>لإكمال الموضوع: ' + (heardCount(uid) >= u.size ? '✅' : '⬜') + ' استمع إلى كل الكلمات · ' + (S.pass && S.pass[uid] ? '✅' : '⬜') + ' ' + (S.pass && S.pass[uid] ? 'العب لعبة واحصل على 70٪ أو أكثر.' : '<a class="ublink" href="#/g/meaning/' + uid.slice(2) + '">🎮 العب لعبة واحصل على 70٪ أو أكثر ‹</a>') + '</small>' : '<small>استمع إلى كل الأمثلة لتكمل الدرس.</small>'); }
function unitBar(uid){ return UMAP[uid] ? '<div class="ubar" id="ubar" data-u="' + uid + '">' + unitBarInner(uid) + '</div>' : ''; }
function complete(uid){
  if (!UMAP[uid] || S.done[uid]) return;
  S.done[uid] = today(); save(); addXP(20, true);
  var u = UMAP[uid]; setTimeout(function(){ toast('✅ أكملت: ' + u.title + ' (+20)'); confetti(); }, 250);
  updUnitBar(uid); checkBadges(); setTimeout(checkStation, 1200);
}

/* ---------------- stations (space journey) ---------------- */
var STATIONS = [{f:0,e:'🌍',a:'الأرض',d:'منصة الإطلاق'},{f:.104,e:'☁️',a:'فوق السحاب',d:'أول خطوة'},{f:.208,e:'🛰️',a:'المدار',d:'بدأت الرحلة فعلًا'},
  {f:.333,e:'🌙',a:'القمر',d:'أساس قوي'},{f:.479,e:'🔴',a:'المريخ',d:'نصف الطريق تقريبًا'},{f:.645,e:'🟠',a:'المشتري',d:'مستوى رائع'},{f:.833,e:'🪐',a:'زحل',d:'قريب جدًا من النهاية'},{f:1,e:'🌌',a:'المجرة',d:'أكملت كل شيء!'}];
function stNeed(i){ return Math.ceil(STATIONS[i].f * UNITS.length); }
function stationIdx(){ var n = doneCount(), r = 0; STATIONS.forEach(function(s, i){ if (n >= stNeed(i)) r = i; }); return Math.max(r, S.stFloor || 0); }
function station(){ return STATIONS[stationIdx()]; }
var pendingSt = false;
function checkStation(){
  var i = stationIdx(); if (i <= (S.station || 0)) return;
  if (($('#stage') && !$('.result')) || $('.modal')){ pendingSt = true; return; }
  pendingSt = false;
  S.station = i; save(); var st = STATIONS[i];
  var m = modal('<div class="big">' + st.e + '</div><h3>وصلتَ إلى ' + st.a + '!</h3><p>' + st.d + ' · أكملت ' + ar(doneCount()) + ' من ' + ar(UNITS.length) + ' وحدة.</p><button class="btn wide flame" id="shareSt">📸 شارك إنجازك</button><a class="btn alt wide" href="#/journey" id="seeJ" style="display:block;margin-top:8px;text-decoration:none">🚀 شاهد رحلتك</a>');
  confetti(); $('#shareSt', m).onclick = function(){ m.remove(); shareBadge(); }; $('#seeJ', m).onclick = function(){ m.remove(); };
}

/* ---------------- XP, streak, badges ---------------- */
var BADGES = [
  {id:'start',e:'🚀',t:'الإقلاع',d:'أول نقطة لك'},
  {id:'test',e:'🧭',t:'عرفتَ مستواك',d:'أنهيت اختبار المستوى'},
  {id:'streak3',e:'🔥',t:'اشتعلت',d:'3 أيام متتالية'},
  {id:'streak7',e:'☄️',t:'أسبوع كامل',d:'7 أيام متتالية'},
  {id:'xp500',e:'⚡',t:'500 نقطة',d:'جمعت 500 نقطة'},
  {id:'perfect',e:'💯',t:'بلا أخطاء',d:'جولة كاملة صحيحة'},
  {id:'games5',e:'🎮',t:'لاعب محترف',d:'جرّبت 5 ألعاب مختلفة'},
  {id:'cards50',e:'🧠',t:'ذاكرة قوية',d:'حفظت 50 بطاقة'},
  {id:'daily5',e:'🎯',t:'ملتزم',d:'أنهيت 5 مهام يومية'},
  {id:'fixer',e:'🩹',t:'صحّحت أخطائي',d:'صحّحت 20 خطأ'},
  {id:'explorer',e:'🪐',t:'مستكشف',d:'أكملت 10 مواضيع'},
  {id:'a1',e:'🏆',t:'بطل A1',d:'أكملت كل دروس A1'},
  {id:'story3',e:'📖',t:'قارئ',d:'أكملت 3 قصص'},
  {id:'exam',e:'📝',t:'جاهز للامتحان',d:'أكملت أجزاء التدريب الأربعة'},
  {id:'speaker',e:'🎤',t:'نطق ممتاز',d:'نطقت 20 كلمة صحيحة'},
  {id:'adv10',e:'🗺️',t:'مغامر',d:'أكملت 10 مراحل في المغامرة'},
  {id:'stars50',e:'⭐',t:'جامع النجوم',d:'جمعت 50 نجمة'},
  {id:'scenes',e:'🎬',t:'ابن البلد',d:'أنهيت كل المواقف'},
  {id:'lvl5',e:'🧑‍🚀',t:'المستوى 5',d:'وصلت إلى المستوى 5'},
  {id:'week',e:'🏅',t:'بطل الأسبوع',d:'أنجزت تحدّي أسبوع كامل'},
  {id:'review5',e:'🔁',t:'ذاكرة حديدية',d:'أنهيت 5 مراجعات'}
];
function checkBadges(){
  var got = [];
  function give(id){ if (!S.badges[id]){ S.badges[id] = today(); got.push(id); } }
  var done = function(kind){ return UNITS.filter(function(u){ return u.kind === kind && S.done[u.id]; }).length; };
  if (S.xp > 0) give('start'); if (S.wk && Object.keys(S.wk).length) give('week'); if ((S.reviews || 0) >= 5) give('review5');
  if (S.test != null) give('test');
  if (S.streak >= 3) give('streak3');
  if (S.streak >= 7) give('streak7');
  if (S.xp >= 500) give('xp500');
  if (S.perfect) give('perfect');
  if (Object.keys(S.games).length >= 5) give('games5');
  if (Object.keys(S.cards).filter(function(k){ return S.cards[k] >= 3; }).length >= 50) give('cards50');
  if (Object.keys(S.daily).length >= 5) give('daily5');
  if ((S.fixed || 0) >= 20) give('fixer');
  if (done('topic') >= 10) give('explorer');
  if (SR.a1.length && done('a1') >= SR.a1.length) give('a1');
  if (done('story') >= 3) give('story3');
  if (SX.exam && done('exam') >= 4) give('exam');
  if ((S.spoke || 0) >= 20) give('speaker');
  if (Object.keys(S.adv || {}).length >= 10) give('adv10');
  if (starsTotal() >= 50) give('stars50');
  if (typeof SCENES !== 'undefined' && SCENES.every(function(x){ return S.scenes && S.scenes[x.id]; })) give('scenes');
  if (lvlOf(S.xp).n >= 5) give('lvl5');
  if (got.length){ save(); var b = BADGES.find(function(x){ return x.id === got[0]; }); setTimeout(function(){ toast(b.e + ' وسام جديد: ' + b.t); confetti(); }, 700); }
}
function lvlOf(xp){ var n = 1, need = 0, step = 60; while (xp >= need + step){ need += step; n++; step = 60 + (n - 1) * 30; } return {n:n, cur:xp - need, step:step}; }
function starsTotal(){ var t = 0, k; for (k in (S.adv || {})) t += S.adv[k]; for (k in (S.scenes || {})) t += S.scenes[k]; return t; }
function canPop(){ return !!$('.result, .lvres') || !/^#\/(g\/|adv\/|scene\/|daily|exam\/|test)/.test(location.hash); }
function levelUp(n){ if ($('.modal') || !canPop()) return setTimeout(function(){ levelUp(n); }, 1500);
  var m = modal('<div class="lvup"><span class="lvp">' + uiPic('tile_journey', '🧑‍🚀') + '</span><div class="lvt2" dir="ltr">Level Up!</div><div class="lvn">المستوى ' + ar(n) + '</div><p class="sub">رائع! أنت تتقدم بسرعة، استمر 🚀</p><button class="btn wide flame" id="lvok">يلا نكمل</button></div>');
  confetti(); fx(true); $('#lvok', m).onclick = function(){ m.remove(); }; }
function addXP(n, quiet){
  if (n > 0 && !quiet) xpFloat(n);
  var xp0 = S.xp, lv0 = lvlOf(S.xp).n; S.xp += n; var lv1 = lvlOf(S.xp).n; if (lv1 > lv0) setTimeout(function(){ levelUp(lv1); }, 2600); var t = today();
  if (S.last !== t){ S.streak = (S.last === yesterday()) ? S.streak + 1 : 1; S.last = t; }
  S.days[t] = (S.days[t] || 0) + n; save();
  if (!quiet) checkBadges(); updateRibbon(); countUp(xp0, S.xp); var gc = $('.goal'); if (gc){ var was = gc.classList.contains('done'); gc.outerHTML = goalHTML(); if (!was && S.goal && (S.days[t] || 0) >= S.goal) setTimeout(function(){ toast('🎯 حققت هدف اليوم!'); confetti(); }, 400); } else if (S.goal && (S.days[t] || 0) >= S.goal && (S.days[t] - n) < S.goal) setTimeout(function(){ toast('🎯 حققت هدف اليوم!'); }, 400);
}
/* ---------------- effects ---------------- */
var lastTap = null, actx = null;
document.addEventListener('pointerdown', function(e){ lastTap = {x:e.clientX, y:e.clientY, t:Date.now()}; }, true);
function fxOn(){ return S.set.fx !== false; }
function calm(){ try{ return matchMedia('(prefers-reduced-motion: reduce)').matches; }catch(e){ return false; } }
function tone(freqs, dur, type, vol){ try{ actx = actx || new (window.AudioContext || window.webkitAudioContext)(); if (actx.state === 'suspended') actx.resume(); var t0 = actx.currentTime;
  freqs.forEach(function(f, k){ var o = actx.createOscillator(), g = actx.createGain(); o.type = type || 'sine'; o.frequency.value = f; var st = t0 + k * dur * .8;
    g.gain.setValueAtTime(0, st); g.gain.linearRampToValueAtTime(vol || .12, st + .015); g.gain.exponentialRampToValueAtTime(.0001, st + dur); o.connect(g); g.connect(actx.destination); o.start(st); o.stop(st + dur + .02); }); }catch(e){} }
function fx(ok){ if (!fxOn()) return;
  if (ok){ tone([660, 990], .16, 'sine', .1); try{ navigator.vibrate && navigator.vibrate(18); }catch(e){} }
  else { tone([220, 180], .18, 'triangle', .09); try{ navigator.vibrate && navigator.vibrate([35, 50, 35]); }catch(e){} } }
function xpFloat(n){ if (!fxOn() || calm()) return; var x = innerWidth / 2, y = innerHeight / 2;
  if (lastTap && Date.now() - lastTap.t < 2500){ x = lastTap.x; y = lastTap.y; }
  var d = document.createElement('div'); d.className = 'xpf'; d.textContent = '+' + n + ' ⚡'; d.style.left = Math.max(30, Math.min(innerWidth - 30, x)) + 'px'; d.style.top = Math.max(60, y - 10) + 'px';
  document.body.appendChild(d); setTimeout(function(){ d.remove(); }, 1100); }
function countUp(a, b){ var el = $('[data-st="xp"] b'); if (!el || b <= a || calm()) return; var t0 = performance.now(), dur = 700;
  el.classList.add('bump'); (function step(t){ var k = Math.min(1, (t - t0) / dur); el.textContent = Math.round(a + (b - a) * (1 - Math.pow(1 - k, 3))); if (k < 1) requestAnimationFrame(step); else { el.textContent = b; el.classList.remove('bump'); } })(t0); }
function touch(tool){ S.tools[tool] = 1; save(); }

/* ---------------- toast / confetti / modal ---------------- */
var toastT;
function toast(msg){ var t = $('#toast'); t.textContent = msg; t.classList.add('show'); clearTimeout(toastT); toastT = setTimeout(function(){ t.classList.remove('show'); }, 2600); }
function confetti(){
  if (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var c = document.createElement('canvas'); c.className = 'confetti'; document.body.appendChild(c);
  var W = c.width = innerWidth, H = c.height = innerHeight, x = c.getContext('2d');
  var cols = ['#FFC53D','#FF6B2C','#7C5CFF','#19C79A','#FF3D7F','#3A86FF'];
  var P = []; for (var i = 0; i < 120; i++) P.push({x:W/2, y:H/3, vx:(Math.random()-.5)*12, vy:Math.random()*-12-4, r:Math.random()*6+3, c:cols[i%cols.length], a:Math.random()*6});
  var f = 0; (function tick(){ x.clearRect(0,0,W,H); P.forEach(function(p){ p.vy += .35; p.x += p.vx; p.y += p.vy; p.a += .2; x.save(); x.translate(p.x,p.y); x.rotate(p.a); x.fillStyle = p.c; x.fillRect(-p.r/2,-p.r/2,p.r,p.r*.6); x.restore(); });
    if (++f < 110) requestAnimationFrame(tick); else c.remove(); })();
}
function modal(inner, cls){
  var m = document.createElement('div'); m.className = 'modal';
  m.innerHTML = '<div class="mcard ' + (cls || '') + '"><button class="x" aria-label="إغلاق">✕</button>' + inner + '</div>';
  document.body.appendChild(m); m.querySelector('.x').onclick = function(){ m.remove(); }; m.onclick = function(e){ if (e.target === m) m.remove(); };
  return m;
}

/* ---------------- data helpers ---------------- */
function itemsOf(tid){
  if (tid === 'abc') return SR.letters.map(function(l){ return {de:ART[l.g] + ' ' + l.de, ar:({m:'ديا',f:'دي',n:'داس'})[l.g] + ' ' + l.ar, mn:l.mn, e:l.e, g:l.g, n:l.de, grp:'abc'}; });
  if (tid === 'num') return SR.nums.map(function(n){ return {de:n.de, ar:n.ar, mn:n.mn + ' (' + n.big + ')', e:'🔢', grp:'num'}; });
  if (tid === 'a1') { var o = []; SR.a1.forEach(function(l){ l.items.forEach(function(it){ o.push(Object.assign({grp:'a1'}, it)); }); }); return o; }
  if (tid === 'a2') { var p = []; SR.a2.forEach(function(l){ l.items.forEach(function(it){ p.push(Object.assign({grp:'a2'}, it)); }); }); return p; }
  if (/^u\d+$/.test(tid)) return unitItems(+tid.slice(1));
  if (tid === 'mist') return Object.keys(S.mist).map(function(k){ return S.mist[k].it; }).filter(Boolean);
  if (tid === 'all') { var all = []; topics().forEach(function(t){ if (t.id !== 'situations') all = all.concat(itemsOf(t.id)); }); return all; }
  var m = modById(tid); if (!m) return [];
  if (m.dialogs){ var d = []; m.dialogs.forEach(function(x){ x.lines.forEach(function(l){ d.push({de:l.de, ar:l.ar, mn:l.mn, e:x.e, grp:m.id}); }); }); return d; }
  return m.items.map(function(it){ return Object.assign({grp:m.id}, it); });
}
function sayOf(it){ return it.say || it.de; }
function play(it, el, done){
  useAudio(it.grp); $$('.on.it,.on.bub,.on.lt,.on.sline').forEach(function(x){ x.classList.remove('on'); }); if (el) el.classList.add('on');
  if (it.u != null) markHeard(it.u, it.k);
  speak(sayOf(it), function(){ if (el) el.classList.remove('on'); if (done) done(); });
}
function deHTML(it){
  if (it.g && it.n){ return '<span class="art ' + it.g + '" data-g="' + it.g + '">' + ART[it.g] + '</span> ' + esc(it.n); }
  return esc(it.de);
}
function artLegend(){ return '<div class="legend"><span class="art m">der</span> مذكّر <span class="art f">die</span> مؤنّث <span class="art n">das</span> محايد<small>اضغط على الأداة الملوّنة لمعرفة المزيد</small></div>'; }
var tipEl = null;
document.addEventListener('click', function(e){
  var rt = e.target.closest && e.target.closest('[data-retry]'); if (rt){ viewExamPart(rt.dataset.retry, EXM); return; }
  var a = e.target.closest && e.target.closest('.art[data-g]');
  if (tipEl){ tipEl.remove(); tipEl = null; }
  if (!a || a.closest('.opt,.mc,.mb,.artb,.wchip,.fc,.qcard')) return;
  var r = a.getBoundingClientRect(); tipEl = document.createElement('div'); tipEl.className = 'arttip'; tipEl.innerHTML = ARTINFO[a.dataset.g];
  document.body.appendChild(tipEl);
  var w = tipEl.offsetWidth, left = Math.min(innerWidth - w - 10, Math.max(10, r.left + r.width / 2 - w / 2));
  tipEl.style.left = left + 'px'; tipEl.style.top = (r.bottom + scrollY + 8) + 'px';
  setTimeout(function(){ if (tipEl){ tipEl.remove(); tipEl = null; } }, 4500);
});

/* ---------------- numbers ---------------- */
var NW = ['null','eins','zwei','drei','vier','fünf','sechs','sieben','acht','neun','zehn','elf','zwölf','dreizehn','vierzehn','fünfzehn','sechzehn','siebzehn','achtzehn','neunzehn'];
var TENS = ['','','zwanzig','dreißig','vierzig','fünfzig','sechzig','siebzig','achtzig','neunzig'];
function m100(n){ if (n < 20) return [NW[n]]; var u = n % 10, t = Math.floor(n/10); if (!u) return [TENS[t]]; return [u === 1 ? 'ein' : NW[u], 'und', TENS[t]]; }
function m1000(n){ var h = Math.floor(n/100), r = n % 100, o = []; if (h) o = o.concat(h === 1 ? ['hundert'] : [NW[h], 'hundert']); if (r) o = o.concat(m100(r)); return o; }
function morphs(n){
  if (n === 0) return ['null']; if (n === 1000000) return ['eine Million'];
  var t = Math.floor(n/1000), r = n % 1000, o = [];
  if (t){ var tm = t === 1 ? [] : m1000(t); if (tm.length && tm[tm.length-1] === 'eins') tm[tm.length-1] = 'ein'; o = o.concat(tm, ['tausend']); }
  if (r) o = o.concat(m1000(r)); return o;
}
function numDe(n){ return morphs(n).join(''); }
function numAr(n){ return morphs(n).map(function(m){ return SR.NUM[m] || m; }).join(' '); }
function ordDe(n){ return n === 1 ? 'erste' : n === 3 ? 'dritte' : n === 7 ? 'siebte' : n === 8 ? 'achte' : numDe(n) + (n < 20 ? 'te' : 'ste'); }
function ordAr(n){ return n === 1 ? 'ايرسته' : n === 3 ? 'دغيته' : n === 7 ? 'زيبته' : n === 8 ? 'اخته' : numAr(n) + (n < 20 ? 'ته' : 'سته'); }

/* ---------------- clock language ---------------- */
var WAR = {'Es':'اس','ist':'ايست','Uhr':'اوا','nach':'ناخ','vor':'فوا','halb':'هالب','Viertel':'فيرتل','ein':'اين'};
function hw(x){ return x === 1 ? 'eins' : NW[x]; }
function informal(h, m){
  var h12 = h % 12 || 12, nx = h12 % 12 + 1;
  if (m === 0) return 'Es ist ' + (h12 === 1 ? 'ein' : NW[h12]) + ' Uhr.';
  if (m === 15) return 'Es ist Viertel nach ' + hw(h12) + '.';
  if (m === 30) return 'Es ist halb ' + hw(nx) + '.';
  if (m === 45) return 'Es ist Viertel vor ' + hw(nx) + '.';
  if (m === 25) return 'Es ist fünf vor halb ' + hw(nx) + '.';
  if (m === 35) return 'Es ist fünf nach halb ' + hw(nx) + '.';
  if (m < 30) return 'Es ist ' + (m === 20 ? 'zwanzig' : NW[m]) + ' nach ' + hw(h12) + '.';
  return 'Es ist ' + (60 - m === 20 ? 'zwanzig' : NW[60 - m]) + ' vor ' + hw(nx) + '.';
}
function formal(h, m){ return 'Es ist ' + (h === 1 ? 'ein' : numDe(h)) + ' Uhr' + (m ? ' ' + numDe(m) : '') + '.'; }
function sentAr(s){
  return s.replace(/[.]/g,'').split(' ').map(function(w){
    if (WAR[w]) return WAR[w]; if (SR.NUM[w]) return SR.NUM[w];
    var n = -1; for (var i = 0; i <= 100; i++){ if (numDe(i) === w){ n = i; break; } } return n >= 0 ? numAr(n) : w;
  }).join(' ') + '.';
}

/* ---------------- shell ---------------- */
var ROCKET = '<svg viewBox="0 0 120 230" class="rocket" aria-hidden="true"><defs>' +
  '<linearGradient id="rkB" x1="0" x2="1"><stop offset="0" stop-color="#FFFFFF"/><stop offset=".55" stop-color="#F1EEFF"/><stop offset="1" stop-color="#BDB3F5"/></linearGradient>' +
  '<linearGradient id="rkN" x1="0" x2="1"><stop offset="0" stop-color="#FF9A5A"/><stop offset=".6" stop-color="#FF6B2C"/><stop offset="1" stop-color="#D9480F"/></linearGradient>' +
  '<linearGradient id="rkF" x1="0" x2="1"><stop offset="0" stop-color="#FF6FA3"/><stop offset="1" stop-color="#C2185B"/></linearGradient>' +
  '<radialGradient id="rkW" cx=".35" cy=".35" r=".8"><stop offset="0" stop-color="#B9A8FF"/><stop offset=".5" stop-color="#6A4DFF"/><stop offset="1" stop-color="#2A1A8C"/></radialGradient>' +
  '<linearGradient id="rkFl" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFF4C2"/><stop offset=".35" stop-color="#FFC53D"/><stop offset=".75" stop-color="#FF6B2C"/><stop offset="1" stop-color="#FF3D7F" stop-opacity="0"/></linearGradient></defs>' +
  '<g class="flame"><path d="M44 168 Q60 236 76 168 Z" fill="url(#rkFl)"/><path d="M51 168 Q60 210 69 168 Z" fill="#FFF4C2" opacity=".9"/></g>' +
  '<path d="M30 120 L8 160 Q6 168 14 166 L34 156 Z" fill="url(#rkF)"/><path d="M90 120 L112 160 Q114 168 106 166 L86 156 Z" fill="url(#rkF)"/>' +
  '<path d="M60 6 C88 30 94 84 88 150 Q60 160 32 150 C26 84 32 30 60 6 Z" fill="url(#rkB)"/>' +
  '<path d="M60 6 C76 20 85 38 88 58 Q60 66 32 58 C35 38 44 20 60 6 Z" fill="url(#rkN)"/>' +
  '<path d="M32 58 Q60 66 88 58 L89 66 Q60 74 31 66 Z" fill="#14103A" opacity=".18"/>' +
  '<circle cx="60" cy="94" r="17" fill="#14103A"/><circle cx="60" cy="94" r="13" fill="url(#rkW)"/><ellipse cx="54" cy="88" rx="4.5" ry="3" fill="#fff" opacity=".85" transform="rotate(-30 54 88)"/>' +
  '<circle cx="42" cy="124" r="2" fill="#B2A8E6"/><circle cx="78" cy="124" r="2" fill="#B2A8E6"/>' +
  '<path d="M52 128 L60 122 L68 128 L68 162 Q60 166 52 162 Z" fill="url(#rkF)"/>' +
  '<path d="M42 150 Q60 158 78 150 L74 168 Q60 172 46 168 Z" fill="#3A2F7A"/></svg>';

function shell(){
  document.body.insertAdjacentHTML('afterbegin',
   '<header class="top" id="top"><div class="wrap"><a class="ibtn me tback" id="topBack" href="#/" hidden aria-label="رجوع">' + ic('back') + '<small>رجوع</small></a><a class="logo" href="#/"><svg viewBox="0 0 100 100" class="lgo"><defs><linearGradient id="lgB" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2A0E6E"/><stop offset="1" stop-color="#7B2FE0"/></linearGradient><linearGradient id="lgF" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFF3B0"/><stop offset=".5" stop-color="#FFC53D"/><stop offset="1" stop-color="#FF8A00"/></linearGradient><linearGradient id="lgW" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#DCD7F0"/></linearGradient></defs><circle cx="50" cy="50" r="50" fill="url(#lgB)"/><g fill="#fff"><circle class="lg-tw" cx="22" cy="26" r="2"/><circle class="lg-tw2" cx="76" cy="20" r="1.8"/><circle class="lg-tw" cx="84" cy="62" r="1.8"/><circle class="lg-tw2" cx="16" cy="60" r="1.6"/><path class="lg-tw2" d="M33 12l1.4 3.2 3.2 1.4-3.2 1.4-1.4 3.2-1.4-3.2-3.2-1.4 3.2-1.4z"/></g><g class="lg-rk"><g transform="translate(-4 5) rotate(45 50 50) scale(.92) translate(4 2)"><g class="lg-fl"><path d="M41 67C40 76 44 84 50 98 56 84 60 76 59 67 56 71 53 72 50 72 47 72 44 71 41 67z" fill="url(#lgF)"/><path d="M45 67C45 74 47 80 50 88 53 80 55 74 55 67z" fill="#FFF3B0"/></g><path d="M42 50C34 56 31 64 31 72L42 66z" fill="#FF6B2C"/><path d="M58 50C66 56 69 64 69 72L58 66z" fill="#FF6B2C"/><path d="M50 16C60 24 62 44 58 68H42C38 44 40 24 50 16z" fill="url(#lgW)"/><path d="M50 16C55.5 20 58.6 26 59.8 32H40.2C41.4 26 44.5 20 50 16z" fill="#FF6B2C"/><circle cx="50" cy="44" r="6" fill="#5B2BD9" stroke="#fff" stroke-width="2"/><circle cx="48" cy="42" r="1.6" fill="#fff" opacity=".7"/><path d="M47 68 50 60 53 68z" fill="#FF6B2C"/></g></g></svg>'+
   '<b>Sprach<span>rakete</span></b></a><button class="ibtn tmini" id="themeBtn" aria-label="الوضع الليلي أو النهاري">' + ic('sun') + '</button><span class="tsp"></span><a class="ibtn wabtn" id="waBtn" href="https://whatsapp.com/channel/0029VbDTaxI6xCSKXFymw837" target="_blank" rel="noopener" aria-label="قناة الواتساب" title="قناة الواتساب">' + WA_SVG + '</a><a class="ibtn" id="srchBtn" href="#/search" aria-label="بحث" title="بحث">' + ic('search') + '</a><button class="ibtn" id="setBtn" aria-label="الإعدادات" title="الإعدادات">' + ic('gear') + '</button></div></header>'+
   '<main id="app"></main>'+
   '<nav class="nav" aria-label="القائمة"><div class="in">'+
   '<a href="#/" data-n="home">' + ic('home') + 'اليوم</a><a href="#/learn" data-n="learn">' + ic('learn') + 'الدروس</a><a href="#/lab" data-n="lab" class="navmid"><span class="nm">' + ic('mic') + '</span>النطق</a><a href="#/train" data-n="train">' + ic('train') + 'التدريب</a><a href="#/me" data-n="me">' + ic('words') + 'رحلتي</a></div></nav>'+
   '<div class="toast" id="toast" role="status"></div><div class="feedback" id="fb"></div>');
  $('#themeBtn').onclick = function(){ var b = this; b.classList.remove('spin'); void b.offsetWidth; b.classList.add('spin'); document.documentElement.classList.add('tswitch'); S.set.theme = isDark() ? 'light' : 'dark'; save(); applySettings(); setTimeout(function(){ document.documentElement.classList.remove('tswitch'); }, 500); };
  $('#setBtn').onclick = settingsSheet;
  addEventListener('scroll', function(){ $('#top').classList.toggle('scrolled', scrollY > 6); }, {passive:true});
}
function navHide(){ var g = $('.nav a[data-n="play"]'); if (g) g.hidden = hidden('games'); var n = $('.nav .in'); if (n) n.style.gridTemplateColumns = 'repeat(' + $$('.nav a').filter(function(a){ return !a.hidden; }).length + ',1fr)'; }
var NAVALIAS = {words:'learn', play:'train', search:'', lab:'lab'};
function setNav(n0){ var n = NAVALIAS.hasOwnProperty(n0) ? NAVALIAS[n0] : n0; navHide(); $$('.nav a').forEach(function(a){ a.classList.toggle('on', a.dataset.n === n); }); var mb = $('#meBtn'); if (mb) mb.classList.toggle('on', n0 === 'me'); var sb = $('#srchBtn'); if (sb) sb.classList.toggle('on', n0 === 'search'); }
var leaveHook = null;
function render(html, nav){
  document.body.classList.remove('lsn-tabs', 'th-neon');
  if (leaveHook){ try{ leaveHook(); }catch(e){} leaveHook = null; }
  stopAudio(); hideFb(); $$('.modal').forEach(function(m){ m.remove(); }); if (tipEl){ tipEl.remove(); tipEl = null; }
  var app = $('#app'); app.innerHTML = html; app.classList.remove('enter'); void app.offsetWidth; app.classList.add('enter');
  setNav(nav); window.scrollTo(0, 0);
  var bk = $('#app .ph .back'), tb = $('#topBack');
  if (tb){ if (bk){ tb.setAttribute('href', bk.getAttribute('href')); tb.title = bk.textContent.replace('→', '').trim(); tb.hidden = false; } else tb.hidden = true; $('#top').classList.toggle('hasback', !!bk); }
  if (pendingSt && !$('#stage')) setTimeout(checkStation, 700);
}
function ctlBar(extra, noPr){
  return '<div class="ctl"><div class="seg" role="group" aria-label="سرعة الصوت"><button data-sp="slow" class="' + (S.set.speed === 'slow' ? 'on' : '') + '">🐢 بطيء</button><button data-sp="normal" class="' + (S.set.speed !== 'slow' ? 'on' : '') + '">عادي</button></div>' +
    (noPr ? '' : prChip()) + (extra || '') + '</div>';
}
function prChip(){ return '<button class="chip pr-chip ' + (S.set.sp ? 'on' : '') + '" data-pr aria-pressed="' + !!S.set.sp + '">' + (S.set.sp ? 'إخفاء النطق بالعربية' : 'إظهار النطق بالعربية') + '</button>'; }
function setSpeed(v){ S.set.speed = v; save(); if (v === 'slow') Object.keys(usedGroups).forEach(loadAudio); }
function bindCtl(){
  $$('[data-sp]').forEach(function(b){ b.onclick = function(){ setSpeed(b.dataset.sp); $$('[data-sp]').forEach(function(x){ x.classList.toggle('on', x.dataset.sp === b.dataset.sp); }); }; });
  $$('[data-pr]').forEach(function(b){ b.onclick = function(){ S.set.sp = !S.set.sp; save(); applySettings(); $$('[data-pr]').forEach(function(x){ x.classList.toggle('on', S.set.sp); x.setAttribute('aria-pressed', !!S.set.sp); if (x.classList.contains('pr-chip')) x.textContent = S.set.sp ? 'إخفاء النطق بالعربية' : 'إظهار النطق بالعربية'; }); }; });
}
function streakNow(){ return (S.last === today() || S.last === yesterday()) ? S.streak : 0; }
function updateRibbon(){ var r = $('#ribbon'); if (r){ r.innerHTML = ribbonHTML(); bindRibbon(); } }
function ribbonHTML(){ var st = station();
  return '<button class="stat" data-st="xp"><i>⚡</i><b>' + S.xp + '</b><span>نقطة</span></button><button class="stat' + (streakNow() ? ' lit' : '') + '" data-st="streak"><i>🔥</i><b>' + streakNow() + '</b><span>أيام متتالية</span></button>' +
    '<button class="stat" data-st="station"><i>' + st.e + '</i><b class="sm">' + st.a + '</b><span>محطتك</span></button>'; }
function bindRibbon(){ $$('[data-st]').forEach(function(b){ b.onclick = function(){ var k = b.dataset.st; if (k === 'xp') xpInfo(); else if (k === 'streak') streakInfo(); else go('#/journey'); }; }); }
function xpInfo(){
  var days = [], mx = 1, names = ['أحد','إثنين','ثلاثاء','أربعاء','خميس','جمعة','سبت'];
  for (var i = 6; i >= 0; i--){ var d = new Date(Date.now() - i * 864e5), v = S.days[dkey(d)] || 0; mx = Math.max(mx, v); days.push({v:v, n:i === 0 ? 'اليوم' : names[d.getDay()]}); }
  var bars = '<div class="bars">' + days.map(function(d){ return '<div class="bcol"><span>' + (d.v ? d.v : '') + '</span><i style="height:' + Math.max(4, d.v / mx * 100) + '%"></i><small>' + d.n + '</small></div>'; }).join('') + '</div>';
  modal('<div class="big">⚡</div><h3>' + S.xp + ' نقطة</h3><p>نقاطك في آخر 7 أيام:</p>' + bars +
    '<div class="howto"><b>كيف تجمع النقاط؟</b><div>🎧 كل كلمة جديدة تستمع إليها: <b>+2</b></div><div>✅ إكمال درس أو موضوع: <b>+20</b></div><div>🎮 كل إجابة صحيحة في الألعاب: <b>+10</b></div><div>🎯 مهمة اليوم: <b>+50</b></div><div>🎤 نطق كلمة صحيح: <b>+5</b></div></div>');
}
function streakInfo(){
  var d = new Date(), y = d.getFullYear(), mo = d.getMonth(), first = new Date(y, mo, 1), off = first.getDay(), dim = new Date(y, mo + 1, 0).getDate(), cells = '';
  ['ح','ن','ث','ر','خ','ج','س'].forEach(function(x){ cells += '<span class="h">' + x + '</span>'; });
  for (var i = 0; i < off; i++) cells += '<span></span>';
  for (var k = 1; k <= dim; k++){ var on = S.days[y + '-' + (mo + 1) + '-' + k]; cells += '<span class="' + (on ? 'f' : '') + (k === d.getDate() ? ' t' : '') + '">' + (on ? '<i class="fl">🔥</i>' : '') + ar(k) + '</span>'; }
  var act = Object.keys(S.days).length;
  modal('<div class="big">🔥</div><h3>' + (streakNow() ? plural(streakNow(), 'يوم واحد متتالٍ', 'يومان متتاليان', 'أيام متتالية', 'يومًا متتاليًا') : 'ابدأ سلسلتك اليوم') + '</h3><p>تعلّم كل يوم ولو 5 دقائق حتى لا تنقطع السلسلة.</p>' +
    '<div class="cal rtl">' + cells + '</div><p style="margin-top:10px">مجموع أيام التعلّم: <b>' + ar(act) + '</b></p>');
}

/* ---------------- daily goal + onboarding ---------------- */
var GOALS = [{m:5, x:30, t:'5 دقائق', d:'خفيف'}, {m:10, x:60, t:'10 دقائق', d:'مناسب'}, {m:20, x:120, t:'20 دقيقة', d:'جاد'}];
function goalHTML(){
  if (!S.goal) return '';
  var got = S.days[today()] || 0, pct = Math.min(100, Math.round(got / S.goal * 100)), done = got >= S.goal;
  return '<div class="goal' + (done ? ' done' : '') + '"><div class="goal-t"><b>' + (done ? '✅ حققت هدف اليوم!' : '🎯 هدفك اليوم') + '</b><span>' + Math.min(got, S.goal) + ' / ' + S.goal + ' نقطة</span></div><div class="prog"><i style="width:' + pct + '%"></i></div></div>';
}
function lenaWelcome(next){
  if ($('.modal')) return;
  var L = [[0, 'Hallo!', 'أهلًا!'], [2.0, 'Willkommen bei Sprachrakete!', 'مرحبًا بك في Sprachrakete!'], [5.0, 'Lass uns zusammen Deutsch lernen – Schritt für Schritt!', 'هيا نتعلّم الألمانية معًا، خطوة بخطوة!']];
  var m = modal('<div class="ln-st"><svg class="lnsvg" viewBox="0 0 300 320"> <defs> <linearGradient id="ln-bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8F7BFF"/><stop offset="1" stop-color="#5B3DF5"/></linearGradient> </defs> <circle cx="150" cy="170" r="130" fill="url(#ln-bg)"/> <circle cx="60" cy="70" r="5" fill="#FFC53D"/><circle cx="245" cy="95" r="4" fill="#fff" opacity=".7"/><circle cx="238" cy="230" r="6" fill="#FF6B2C"/> <g id="ln-all"> <path d="M96 140 C92 96 118 70 150 70 C182 70 208 96 204 140 C202 168 198 190 190 204 L110 204 C102 190 98 168 96 140z" fill="#7A4A2A"/> <circle cx="150" cy="68" r="24" fill="#7A4A2A"/><path d="M136 60 q12 -10 26 -2" stroke="#9A6340" stroke-width="4" fill="none" stroke-linecap="round"/> <path d="M70 320 C70 256 102 224 150 224 C198 224 230 256 230 320z" fill="#2FA36B"/> <path d="M128 226 Q150 242 172 226" fill="none" stroke="#228553" stroke-width="8" stroke-linecap="round"/> <path d="M134 180 h32 v42 q-16 10 -32 0z" fill="#EDB993"/> <g id="ln-arm"> <path d="M205 262 C222 252 236 232 242 206" stroke="#2FA36B" stroke-width="28" stroke-linecap="round" fill="none"/> <circle cx="246" cy="186" r="17" fill="#F7CFAF"/> <path d="M233 178 v-12 M241 174 v-16 M249 174 v-15 M257 178 v-11 M231 192 l-8 -6" stroke="#F7CFAF" stroke-width="7" stroke-linecap="round"/> </g> <g id="ln-head"> <ellipse cx="150" cy="142" rx="50" ry="56" fill="#F7CFAF"/> <path d="M98 136 C96 98 120 80 150 80 C182 80 206 100 202 136 C190 118 176 108 160 104 C150 116 126 124 100 128z" fill="#8B5632"/> <path d="M100 124 C94 150 96 178 106 196 C110 176 108 150 110 132z" fill="#8B5632"/> <path d="M200 124 C206 150 204 178 194 196 C190 176 192 150 190 132z" fill="#8B5632"/> <g id="ln-eyes"><ellipse cx="130" cy="148" rx="5.5" ry="7" fill="#2B1B14"/><ellipse cx="170" cy="148" rx="5.5" ry="7" fill="#2B1B14"/> <circle cx="132" cy="145.5" r="1.8" fill="#fff"/><circle cx="172" cy="145.5" r="1.8" fill="#fff"/></g> <path d="M122 134 q8 -4 16 0 M162 134 q8 -4 16 0" stroke="#6B4026" stroke-width="2.6" fill="none" stroke-linecap="round"/> <ellipse cx="118" cy="164" rx="9" ry="5.5" fill="#FF8C8C" opacity=".5"/><ellipse cx="182" cy="164" rx="9" ry="5.5" fill="#FF8C8C" opacity=".5"/> <path d="M150 154 q2.5 4 -0.5 6" stroke="#E0A582" stroke-width="2.2" fill="none" stroke-linecap="round"/> <path d="M118 96 C128 86 142 82 152 82" stroke="#A9714A" stroke-width="5" fill="none" stroke-linecap="round"/> <path id="ln-sm" d="M140 168 Q150 177 160 168" stroke="#A8413F" stroke-width="3.2" fill="none" stroke-linecap="round"/> <g id="ln-mo" transform="translate(150 170) scale(1 0)"><path d="M-10 -2 Q0 -3 10 -2 Q9 12 0 13 Q-9 12 -10 -2z" fill="#7A2830"/><path d="M-6 7 Q0 4 6 7 Q4 11 0 11 Q-4 11 -6 7z" fill="#F27A80"/></g> </g> </g> </svg></div><div class="ln-cap" id="lnCap"><div class="de">Hallo! 👋</div><div class="ar">أنا لينا، اضغط لتسمعني</div></div><button class="btn wide" id="lnPlay">▶ استمع إلى لينا</button><button class="linkbtn" id="lnSkip">تخطَّ</button>', 'lncard');
  var au = new Audio('lena.mp3'), raf, cur = -1, done = 0, mo = $('#ln-mo', m), sm = $('#ln-sm', m), cap = $('#lnCap', m), pb = $('#lnPlay', m);
  au.preload = 'auto';
  function close(){ try{ au.pause(); }catch(e){} cancelAnimationFrame(raf); S.lena = 1; save(); m.remove(); if (next) setTimeout(next, 300); }
  m.querySelector('.x').onclick = close; m.onclick = function(e){ if (e.target === m) close(); }; $('#lnSkip', m).onclick = close;
  function mouth(v){ mo.setAttribute('transform', 'translate(150 170) scale(1 ' + v.toFixed(2) + ')'); sm.style.opacity = v > .15 ? 0 : 1; }
  function setCap(a, b){ cap.innerHTML = '<div class="de">' + a + '</div><div class="ar">' + b + '</div>'; }
  function loop(){ var t = au.currentTime, ph = t % 1, v = au.paused ? 0 : Math.max(0, .15 + .75 * Math.abs(Math.sin(t * 11)));
    var gap = (t > 1.3 && t < 2.05) || (t > 4.3 && t < 5.05); mouth(gap || v < .12 ? 0 : v);
    for (var k = L.length - 1; k >= 0; k--){ if (t >= L[k][0]){ if (cur !== k){ cur = k; setCap(L[k][1], L[k][2]); } break; } }
    if (!au.paused && !au.ended) raf = requestAnimationFrame(loop); else mouth(0); }
  au.onended = function(){ mouth(0); done = 1; pb.textContent = '🚀 لنبدأ التعلّم'; pb.classList.add('flame'); };
  pb.onclick = function(){ if (done) return close(); cur = -1; au.currentTime = 0; var pr = au.play(); if (pr && pr.catch) pr.catch(function(){ toast('اضغط مرة أخرى للاستماع'); }); pb.textContent = '🔊 ...'; cancelAnimationFrame(raf); loop(); };
}
var WA_CH = 'https://whatsapp.com/channel/0029VbDTaxI6xCSKXFymw837';
function waInvite(){
  if (S.wainv || $('.modal')) return;
  S.wainv = 1; save();
  var m = modal('<div class="wainv"><div class="wainv-i"><svg viewBox="0 0 24 24" fill="#fff"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm5.3 14.1c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .2-3.3-.7-2.8-1.1-4.6-4-4.7-4.2-.1-.2-1.1-1.5-1.1-2.9 0-1.4.7-2 1-2.3.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 2c.1.2.1.4 0 .5l-.3.5-.4.4c-.1.2-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.3 2.4 1.5.3.1.5.1.6-.1l.9-1c.2-.3.4-.2.6-.1l1.9.9c.3.1.5.2.5.3.1.2.1.7-.1 1.1z"/></svg></div>' +
    '<h3>📢 انضم إلى قناة Sprachrakete على واتساب</h3><p>دروس جديدة وتنبيهات أولًا بأول</p>' +
    '<a class="btn wide wainv-go" href="' + WA_CH + '" target="_blank" rel="noopener">انضم الآن</a>' +
    '<button class="btn alt wide" id="waLater" style="margin-top:8px">لاحقًا</button></div>');
  $('.wainv-go', m).onclick = function(){ setTimeout(function(){ m.remove(); }, 300); };
  $('#waLater', m).onclick = function(){ m.remove(); };
}
function onboarding(){
  if (S.onb || $('.modal')) return;
  var step = 0, data = {name:S.name || '', lvl:null, goal:60}, old = S.xp > 0, steps = old ? [0, 2] : [0, 1, 2];
  var m = modal('<div id="onb"></div>', 'onbcard');
  m.querySelector('.x').onclick = function(){ S.onb = 1; save(); m.remove(); };
  function dotsH(){ return '<div class="onb-dots">' + steps.map(function(i){ return '<i class="' + (i === step ? 'on' : '') + '"></i>'; }).join('') + '</div>'; }
  function draw(){
    var b = $('#onb', m);
    if (step === 0){
      b.innerHTML = dotsH() + '<div class="big">🚀</div><h3>أهلًا بك في Sprachrakete!</h3><p>' + (old ? 'أضفنا ميزات جديدة! ' : 'رحلتك لتعلّم الألمانية تبدأ الآن. ') + 'ما اسمك؟</p>' +
        '<input class="inp" id="onbName" placeholder="اكتب اسمك" value="' + esc(data.name) + '" autocomplete="given-name"><button class="btn wide" id="onbNext" style="margin-top:12px">التالي</button><button class="btn alt wide" id="onbSkip" style="margin-top:8px">تخطَّ</button>' + (old ? '' : '<button class="linkbtn" id="onbRestore">💾 لديك كود تقدّم من جهاز آخر؟ استرجعه</button>');
      $('#onbNext', m).onclick = function(){ data.name = $('#onbName', m).value.trim(); step = steps[1]; draw(); };
      $('#onbSkip', m).onclick = function(){ step = steps[1]; draw(); };
      var rb = $('#onbRestore', m); if (rb) rb.onclick = function(){ m.remove(); backupSheet(); };
      $('#onbName', m).onkeydown = function(e){ if (e.key === 'Enter') $('#onbNext', m).click(); };
      setTimeout(function(){ var i = $('#onbName', m); if (i) i.focus(); }, 80);
    } else if (step === 1){
      b.innerHTML = dotsH() + '<div class="big">🧭</div><h3>' + (data.name ? 'تشرفنا يا ' + esc(data.name) + '! ' : '') + 'ما مستواك في الألمانية؟</h3>' +
        '<div class="onb-opts"><button class="onb-o" data-l="new"><span>🌱</span><b>مبتدئ تمامًا</b><small>أبدأ من الحروف والأرقام</small></button>' +
        '<button class="onb-o" data-l="some"><span>📘</span><b>أعرف القليل</b><small>أبدأ بدروس A1</small></button>' +
        '<button class="onb-o" data-l="test"><span>❓</span><b>لا أعرف</b><small>اختبار قصير يحدد مستواي</small></button></div>';
      $$('.onb-o', m).forEach(function(o){ o.onclick = function(){ data.lvl = o.dataset.l; step = 2; draw(); }; });
    } else {
      b.innerHTML = dotsH() + '<div class="big">🎯</div><h3>' + (old && data.name ? 'أهلًا يا ' + esc(data.name) + '! ' : '') + 'كم تريد أن تتعلم كل يوم؟</h3><p>اختر هدفًا يوميًا، ويمكنك تغييره لاحقًا من حسابي.</p>' +
        '<div class="onb-opts">' + GOALS.map(function(g){ return '<button class="onb-o' + (g.x === data.goal ? ' on' : '') + '" data-g="' + g.x + '"><span>⏱️</span><b>' + g.t + '</b><small>' + g.d + ' · ' + g.x + ' نقطة يوميًا</small></button>'; }).join('') + '</div>' +
        '<button class="btn wide flame" id="onbGo" style="margin-top:12px">🚀 لنبدأ</button>';
      $$('.onb-o', m).forEach(function(o){ o.onclick = function(){ data.goal = +o.dataset.g; $$('.onb-o', m).forEach(function(z){ z.classList.toggle('on', z === o); }); }; });
      $('#onbGo', m).onclick = function(){
        if (data.name) S.name = data.name; S.goal = data.goal; S.onb = 1; save(); m.remove();
        setTimeout(waInvite, 700);
        if (!data.lvl){ viewHome(); toast('🎯 هدفك اليومي: ' + S.goal + ' نقطة'); return; }
        go(data.lvl === 'test' ? '#/test' : data.lvl === 'some' ? '#/learn/a1' : '#/words');
      };
    }
  }
  draw();
}

function contPic(u){ var k = u.kind === 'topic' ? 'head_' + u.key : u.id.indexOf('s:') === 0 ? 'story_' + u.key : u.id.indexOf('w:') === 0 ? 'letter_' + u.key : ''; return k ? uiPic(k, u.e) : '<span class="pe">' + u.e + '</span>'; }
function greet(){ var h = new Date().getHours(); return h < 5 ? 'ليلة سعيدة 🌙' : h < 12 ? 'صباح الخير ☀️' : h < 18 ? 'نهارك سعيد' : 'مساء الخير 🌙'; }
/* ---------------- HOME ---------------- */
function wordOfDay(){
  var pool = []; SR.modules.forEach(function(m){ (m.items || []).forEach(function(it){ if (it.e && it.de.split(' ').length <= 2 && !/[?!.]/.test(it.de)) pool.push(Object.assign({grp:m.id}, it)); }); });
  return pool[Math.floor(seeded(today())() * pool.length)];
}
function nextUnit(){
  var o = pathOrder(), started = o.find(function(id){ return !S.done[id] && heardCount(id) > 0; });
  return UMAP[started || o.find(function(id){ return !S.done[id]; }) || o[0]];
}
function viewHome(){
  var w = wordOfDay(), done = !!S.daily[today()], nu = nextUnit(), mc = Object.keys(S.mist).length, si = stationIdx(), st = STATIONS[si], nx = STATIONS[si + 1];
  var html = '<section class="hero photo" id="hero"><div class="stars s1"></div><div class="stars s2"></div><div class="planet p1"><i></i></div><div class="planet p2"></div><div class="comet"></div>' +
   '<div class="txt"><h1><span class="de">Sprachrakete</span>تعلّم الألمانية بالعربية من أول حرف حتى تتكلم</h1><p>دروس بالصوت، وألعاب، ونقاط تأخذك من الأرض إلى المجرة.</p></div>' +
   '<div class="count" id="count" aria-live="polite"></div>' +
   '<div class="launch"><button class="go" id="launch">🚀 عُدّ معي بالألمانية</button><div class="rkwrap">' + ROCKET + '</div></div></section>' +
   '<div class="wrap"><section class="dash"><div class="dash-h"><div><small>' + greet() + '</small><b>' + (S.name ? esc(S.name) : 'رائد الفضاء') + ' 👋</b></div><a class="dash-j" href="#/journey"><span>' + st.e + '</span>' + esc(st.a) + '</a></div>' +
     '<div class="ribbon" id="ribbon">' + ribbonHTML() + '</div>' + goalHTML() + weekHTML() +
     '<a class="dash-trip" href="#/journey"><span>' + (nx ? 'المحطة التالية: ' + nx.e + ' ' + nx.a : 'وصلت إلى المجرة! 🎉') + '</span><div class="prog"><i style="width:' + Math.round(doneCount() / Math.max(1, UNITS.length) * 100) + '%"></i></div></a></section>' +
   planHTML() + lenaTip('home') +
   (nu ? '<a class="cont hero2" href="' + nu.href + '" style="--c:' + nu.color + '"><span class="em cov">' + contPic(nu) + '</span><div class="tx"><small>' + (heardCount(nu.id) ? 'تابع من حيث توقفت' : 'ابدأ من هنا') + '</small><b>' + esc(nu.title) + '</b><div class="prog"><i style="width:' + unitPct(nu.id) + '%"></i></div></div><span class="gobtn">' + (heardCount(nu.id) ? 'تابع' : 'ابدأ') + ' ‹</span></a>' : '') +
   '<div class="duo"><a class="mini ' + (done ? 'ok' : 'hot') + '" href="#/daily"><span class="em">' + (done ? '✅' : '🎯') + '</span><b>' + (done ? 'أنهيت مهمة اليوم' : 'مهمة اليوم') + '</b><small>' + (done ? 'عُد غدًا 🔥' : '10 أسئلة · +50 نقطة') + '</small></a>' +
     (S.test == null && !hidden('test') ? '<a class="mini" href="#/test" style="--c:#5B3DF5"><span class="em">🧭</span><b>حدّد مستواك</b><small>12 سؤالًا فقط</small></a>'
       : (mc && !hidden('mistakes') ? '<a class="mini" href="#/mistakes" style="--c:#E63946"><span class="em">🩹</span><b>راجع أخطاءك</b><small>' + plural(mc, 'كلمة واحدة', 'كلمتان', 'كلمات', 'كلمة') + '</small></a>'
       : (hidden('games') ? '<a class="mini" href="#/learn" style="--c:#5B3DF5"><span class="em">📚</span><b>الدروس</b><small>كلمات وقواعد</small></a>' : '<a class="mini" href="#/play" style="--c:#FF6B2C"><span class="em">🎮</span><b>العب وتعلّم</b><small>9 ألعاب</small></a>'))) + '</div>' +
   (srsDue().length ? '<a class="revc" href="#/review"><span class="em">🔁</span><div><b>مراجعة اليوم</b><small>' + plural(srsDue().length, 'كلمة واحدة', 'كلمتان', 'كلمات', 'كلمة') + ' حان وقت مراجعتها</small></div><span class="arr">‹</span></a>' : '') +
   '<div class="sh"><h2>كلمة اليوم</h2></div>' +
   '<div class="wod">' + qEm(w, '⭐') + '<div style="flex:1;min-width:0"><div class="w">' + deHTML(w) + '</div><div class="pr arp">' + pron(w.ar) + '</div><div class="m">' + esc(w.mn) + '</div></div><button class="play" id="wodPlay" aria-label="استمع">' + ICON_PLAY + '</button></div>' +
   '<div class="sh"><h2>إلى أين اليوم؟</h2></div><div class="tiles big">' +
     bigTile('#/learn', '📚', '#5B3DF5', 'الدروس', 'الكلمات ودروس A1 وA2', 'tile_learn') + bigTile('#/train', '🎯', '#8338EC', 'التدريب', 'الامتحان والنطق والأخطاء', 'tile_train') +
     (hidden('games') ? '' : bigTile('#/play', '🎮', '#FF6B2C', 'الألعاب', GAMES.length + ' ألعاب ومغامرة', 'tile_play')) + (hidden('journey') ? '' : bigTile('#/journey', '🚀', '#19C79A', 'رحلتي', st.e + ' ' + st.a, 'tile_journey')) + '</div>' +
   
   '<div class="sh"><h2>تواصل معي</h2></div>' + contactHTML(false) +
   footerFull() + '</div>';
  render(html, 'home'); bindRibbon(); loadPics(w.grp);
  if (!S.onb) setTimeout(function(){ if (!S.lena && !(S.xp > 0)) lenaWelcome(onboarding); else onboarding(); }, 400);
  $('#wodPlay').onclick = function(){ play(w); };
  bindPlan(); bindTip();
  $('#launch').onclick = countdown;
  bindInstall();
}
function footer(){ return ''; }
function footerFull(){ return '<div class="foot"><div class="foot-l"><a href="#/about">عن الموقع</a><a href="#/suggest">💡 اقترح علينا</a><a href="de-index.html">فهرس الدروس</a><a href="#/privacy">الخصوصية</a><a href="#/me">الإعدادات</a></div>Sprachrakete 🚀 © ' + new Date().getFullYear() + ' مهند · جميع الحقوق محفوظة' + (S.set.sp ? '<br>النطق بالحروف العربية للمساعدة فقط، والأفضل الاعتماد على الصوت.' : '') + '</div>'; }
function viewAbout(){
  var html = '<div class="wrap"><div class="ph sm" style="--c:#5B3DF5"><a class="back" href="#/">→ الرئيسية</a><span class="em">🚀</span><h1>عن Sprachrakete</h1><div class="g">Über uns</div><p>موقع مجاني لتعلّم الألمانية بالعربية، من أول حرف حتى تتكلم.</p></div>' +
    '<div class="panel about"><h3>👋 من أنا؟</h3><p>أنا مهند، وصنعت هذا الموقع لأساعد الناطقين بالعربية على تعلّم الألمانية بطريقة سهلة وممتعة، وليكون رفيقك اليومي: تتعلم الكلمة، وتسمعها، وتلعب بها، ثم تختبر نفسك.</p></div>' +
    '<div class="panel about"><h3>🎯 ماذا ستجد هنا؟</h3><ul><li>كلمات وجمل بالصوت والمعنى في ' + SR.modules.length + ' موضوعًا.</li><li>دروس قواعد A1 وA2 بشرح بسيط وأمثلة.</li><li>قصص قصيرة ورسائل جاهزة للكتابة.</li><li>تدريب كامل على امتحان A1 بأجزائه الأربعة.</li><li>ألعاب ونقاط وأوسمة ورحلة فضائية تحفّزك كل يوم.</li></ul></div>' +
    '<div class="panel about"><h3>🔒 خصوصيتك</h3><p>لا تحتاج إلى حساب أو بريد إلكتروني. تقدّمك ونقاطك محفوظة على جهازك فقط، ولا نجمع أي بيانات شخصية. نستخدم عدّاد زيارات بسيطًا لا يتعرّف عليك ولا يستخدم ملفات تعريف الارتباط.</p></div>' +
    '<div class="panel about"><h3>💡 نصائح للاستفادة</h3><ul><li>استمع إلى كل كلمة وكرّرها بصوت عالٍ.</li><li>عشر دقائق كل يوم أفضل من ساعتين مرة في الأسبوع.</li><li>راجع كرّاسة أخطائي باستمرار.</li></ul></div>' +
    '<div class="sh"><h2>تواصل معي</h2></div>' + contactHTML(false) +
    '<p class="sub center" style="margin-top:16px">الخط العربي: Readex Pro (رخصة SIL OFL). جميع المحتويات والتصميم © مهند.</p>' + footer() + '</div>';
  render(html, 'home');
}
function viewPrivacy(){
  var html = '<div class="wrap"><div class="ph sm" style="--c:#14103A"><a class="back" href="#/">→ الرئيسية</a><span class="em">🔒</span><h1>سياسة الخصوصية</h1><div class="g">Datenschutz</div><p>باختصار: لا نجمع أي بيانات شخصية عنك.</p></div>' +
    '<div class="panel about"><h3>ما الذي يُحفظ؟</h3><p>تقدّمك ونقاطك وإعداداتك محفوظة على جهازك فقط (في ذاكرة المتصفح)، ولا تُرسل إلى أي خادم. يمكنك مسحها في أي وقت من إعدادات المتصفح.</p></div>' +
    '<div class="panel about"><h3>لا حسابات</h3><p>لا تحتاج إلى تسجيل أو بريد إلكتروني أو رقم هاتف لاستخدام الموقع.</p></div>' +
    '<div class="panel about"><h3>عدّاد الزيارات</h3><p>قد نستخدم عدّاد زيارات بسيطًا يحسب عدد الزيارات والصفحات فقط، دون ملفات تعريف الارتباط ودون التعرّف على هويتك.</p></div>' +
    '<div class="panel about"><h3>النسخة الاحتياطية</h3><p>كود النسخة الاحتياطية يُنشأ على جهازك، ولا يصل إلينا. أنت من يقرر أين تحفظه.</p></div>' +
    '<div class="panel about"><h3>التواصل</h3><p>إذا راسلتنا عبر واتساب، يصلنا ما تكتبه فقط، ولا نشاركه مع أحد.</p></div>' +
    '<p class="sub center">آخر تحديث: أكتوبر 2026</p>' + footer() + '</div>';
  render(html, 'home');
}
function viewSuggest(){
  var form = String(CFG.suggest || '').trim(), okForm = /^https:\/\//.test(form), wa = waNum();
  var kinds = [['💡','فكرة جديدة','عندي فكرة لميزة أو لعبة'],['📚','درس أو كلمات','أريد درسًا أو كلمات عن موضوع معيّن'],['🐞','مشكلة','شيء لا يعمل جيدًا'],['💬','رأيي في الموقع','أريد أن أقول رأيي']];
  var html = '<div class="wrap"><div class="ph sm" style="--c:#FF6B2C"><a class="back" href="#/">→ الرئيسية</a><span class="em">💡</span><h1>اقترح علينا</h1><div class="g">Deine Ideen</div><p>رأيك يصنع الموقع. اكتب لنا فكرتك أو أي مشكلة واجهتك.</p></div>' +
    '<div class="sug">' + kinds.map(function(k, i){ return '<button class="sugk' + (i === 0 ? ' on' : '') + '" data-k="' + i + '"><span>' + k[0] + '</span><b>' + k[1] + '</b><small>' + k[2] + '</small></button>'; }).join('') + '</div>' +
    '<div class="panel"><label class="sub" for="sugT">اكتب اقتراحك هنا</label><textarea class="inp" id="sugT" rows="5" placeholder="مثلًا: أتمنى إضافة دروس عن المطعم…"></textarea>' +
    (okForm ? '<a class="btn wide flame" id="sugGo" href="' + esc(form) + '" target="_blank" rel="noopener" style="text-decoration:none;margin-top:10px;display:block;text-align:center">✉️ أرسل الاقتراح</a><p class="sub center" style="margin:8px 0 0">يُفتح نموذج قصير. لا نطلب اسمك أو رقمك.</p>' : '') +
    (wa ? '<a class="btn wide' + (okForm ? ' alt' : ' flame') + '" id="sugWa" href="#" target="_blank" rel="noopener" style="text-decoration:none;margin-top:10px;display:block;text-align:center">💬 أرسل عبر واتساب</a>' : '') + '</div>' +
    '<div class="tip tip" style="margin-top:12px"><b class="k">🙏 شكرًا لك</b>نقرأ كل اقتراح، وأفضل الأفكار تظهر في الموقع قريبًا.</div>' + footer() + '</div>';
  render(html, 'home');
  var cur = 0;
  function txt(){ var k = kinds[cur], t = ($('#sugT').value || '').trim(); return k[0] + ' ' + k[1] + (t ? ':\n' + t : '') + '\n\n— من موقع Sprachrakete'; }
  function upd(){ var w = $('#sugWa'); if (w) w.href = 'https://wa.me/' + wa + '?text=' + encodeURIComponent(txt()); }
  $$('.sugk').forEach(function(b){ b.onclick = function(){ cur = +b.dataset.k; $$('.sugk').forEach(function(x){ x.classList.toggle('on', x === b); }); upd(); }; });
  $('#sugT').oninput = upd; upd();
  var g = $('#sugGo'); if (g) g.onclick = function(){ try{ navigator.clipboard && navigator.clipboard.writeText(($('#sugT').value || '').trim()); }catch(e){} };
}
function viewNotFound(){
  render('<div class="wrap"><div class="nf"><div class="nf-n de">404</div><div class="nf-e">🛰️</div><h1>يبدو أن صاروخك ضلّ الطريق!</h1><p class="sub">هذه الصفحة غير موجودة. لا تقلق، يمكنك العودة إلى الرئيسية ومواصلة رحلتك.</p><a class="btn" href="#/" style="text-decoration:none;display:inline-block;margin-top:8px">🏠 العودة إلى الرئيسية</a>' +
    '<div class="nf-try"><span>أو جرّب:</span><a class="chip" href="#/learn">📚 الدروس</a>' + (hidden('games') ? '' : '<a class="chip" href="#/play">🎮 الألعاب</a>') + (hidden('exam') ? '' : '<a class="chip" href="#/exam">📝 الامتحان</a>') + '</div></div>' +
    '<p class="sub center" style="margin:18px 0 8px">تحتاج إلى مساعدة؟ تواصل معي</p>' + contactHTML(false) + footer() + '</div>', 'home');
}
function bigTile(h, e, c, t, d, img){ if (img) return '<a class="tile ptile" href="' + h + '" style="--c:' + c + '"><span class="tph">' + uiPic(img, e) + '</span><span class="tbody"><b>' + t + '</b><span>' + d + '</span></span></a>';
  return '<a class="tile" href="' + h + '" style="--c:' + c + '"><span class="em">' + e + '</span><b>' + t + '</b><span>' + d + '</span></a>'; }
function planet(t){
  var uid = 't:' + t.id, its = itemsOf(t.id).length, pct = unitPct(uid), dn = S.done[uid];
  return '<a class="pl" href="#/t/' + t.id + '" style="--c:' + t.color + '">' + (dn ? '<span class="done">✅</span>' : '') + '<div class="orb porb">' + uiPic('head_' + t.id, t.e) + '</div><b>' + esc(t.title) + '</b><div class="g">' + esc(t.de) + '</div>' +
    '<div class="m">' + ar(its) + ' كلمة وجملة</div><div class="bar"><i style="width:' + pct + '%"></i></div></a>';
}
var TOOLS = [{h:'#/tool/conj',e:'🧩',c:'#3A86FF',t:'مُصرِّف الأفعال',d:'اكتب أي فعل وشوف تصريفه'},{h:'#/tool/numbers',e:'🔢',c:'#FF6B2C',t:'مصنع الأرقام',d:'اكتب أي رقم واستمع إليه'},{h:'#/tool/clock',e:'🕐',c:'#5B3DF5',t:'الساعة الناطقة',d:'حرّك العقارب واستمع للوقت'},
  {h:'#/tool/calendar',e:'🗓️',c:'#19C79A',t:'التقويم الحي',d:'تاريخ اليوم بالألمانية'}];
function toolBanner(h, g){ var t = TOOLS.find(function(x){ return x.h === h; }); if (!t || hidden('tools')) return ''; return '<a class="mission" href="' + h + '" style="background:linear-gradient(115deg,' + t.c + ',' + (g || '#FFC53D') + ');color:#fff;margin:0 0 12px"><span class="em">' + t.e + '</span><div><b>جرّب أداة: ' + t.t + '</b><span>' + t.d + '</span></div><span class="arr">‹</span></a>'; }
function toolsHTML(){ return TOOLS.map(function(t){ return bigTile(t.h, t.e, t.c, t.t, t.d); }).join(''); }
function ladderHTML(){
  return '<div class="ladder">' + SR.levels.map(function(l, i){ var open = l[3] === 'open';
    return '<a class="rung ' + (open ? 'open' : '') + '' + '" href="#/levels"><span class="lv de">' + l[0] + '</span><div><b>' + esc(l[1]) + '</b><span>' + esc(l[2]) + '</span></div><em>' + (open ? 'متاح' : 'قريبًا') + '</em></a>'; }).join('') + '</div>';
}
var ICON_CHAT = '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.4 8.4 0 0 1-12.4 7.4L3 20.5l1.6-5.3A8.4 8.4 0 1 1 21 11.5z"/></svg>';
var ICON_PLAYC = '<svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M8 5.5v13l11-6.5z"/></svg>';
function contactHTML(withInstall){
  return '<div class="contact">' + (waNum() ? '<a class="cbtn wa" href="https://wa.me/' + waNum() + '?text=' + encodeURIComponent('مرحبًا! وصلت إليك من موقع Sprachrakete 🚀') + '" target="_blank" rel="noopener"><i>' + ICON_CHAT + '</i><div>تواصل معي على واتساب<small>رد سريع</small></div></a>' : '') +
    (ytName() ? '<a class="cbtn yt" href="https://www.youtube.com/@' + encodeURIComponent(ytName()) + '?sub_confirmation=1" target="_blank" rel="noopener"><i>' + ICON_PLAYC + '</i><div>اشترك في القناة<small>دروس بالفيديو</small></div></a>' : '') + '</div>' +
    (withInstall ? '<div class="panel install" id="installCard"><span class="em">📲</span><div style="flex:1"><b>ثبّت Sprachrakete على شاشتك</b><div class="sub">يفتح مثل التطبيق بضغطة واحدة</div></div><button class="btn" id="installBtn">تثبيت</button></div>' : '');
}
var running = false;
function countdown(){
  if (running) return; running = true;
  var hero = $('#hero'), c = $('#count'), btn = $('#launch');
  var words = [['10','Zehn'],['9','Neun'],['8','Acht'],['7','Sieben'],['6','Sechs'],['5','Fünf'],['4','Vier'],['3','Drei'],['2','Zwei'],['1','Eins']];
  btn.disabled = true; btn.textContent = '🔊 استمع وعُدّ معي'; useAudio('num'); hero.classList.add('firing');
  var i = 0, my = token;
  (function next(){
    if (my !== token){ running = false; return; }
    if (i < words.length){ var w = words[i++]; c.innerHTML = '<div class="n">' + w[0] + '</div><div class="w de">' + w[1] + '</div>'; c.classList.remove('pop'); void c.offsetWidth; c.classList.add('pop'); speak(w[1], function(){ setTimeout(next, 120); }); return; }
    c.innerHTML = '<div class="n de sm">Start!</div><div class="w">انطلق 🚀</div>'; speak('Start!');
    hero.classList.add('lift');
    setTimeout(function(){
      if (my !== token){ running = false; return; }
      c.innerHTML = '<div class="n de sm">Los geht\'s!</div><div class="w">أحسنت! الآن تعرف العدّ من 10 إلى 1 👏</div>';
      setTimeout(function(){ if (!$('#hero')) { running = false; return; } hero.classList.remove('lift','firing'); c.innerHTML = ''; btn.disabled = false; btn.textContent = '🔁 مرة أخرى'; running = false; }, 2600);
      if (!S.tools.countdown){ S.tools.countdown = 1; addXP(10); toast('+10 نقاط ⚡'); }
    }, 1500);
  })();
}

/* ---------------- LEARN ---------------- */
var LTABS = [{id:'words', i:'words', t:'الكلمات'}, {id:'a1', i:'a1', t:'دروس A1'}, {id:'a2', i:'a2', t:'دروس A2'}, {id:'b1', i:'a2', t:'دروس B1'}, {id:'read', i:'read', t:'اقرأ واكتب'}, {id:'tools', i:'tools', t:'أدوات'}];
function tabBar(list, cur, base){ return '<div class="tabs" role="tablist">' + list.map(function(t){ return '<a role="tab" aria-selected="' + (t.id === cur) + '" class="tab' + (t.id === cur ? ' on' : '') + '" href="' + base + t.id + '">' + (t.i ? ic(t.i) : '<span>' + t.e + '</span>') + t.t + (t.soon ? '<em class="soon">قريبًا</em>' : '') + '</a>'; }).join('') + '</div>'; }
function viewLearn(tab){
  var LT = LTABS.filter(function(t){ return !(t.id === 'a2' && hidden('a2')) && !(t.id === 'tools' && hidden('tools')) && !(t.id === 'read' && hidden('stories') && hidden('letters')); });
  if (!LT.some(function(t){ return t.id === tab; })) tab = '';
  if (!tab) return learnHub(LT);
  var body = '', TT = LT.filter(function(t){ return t.id === tab; })[0];
  if (tab === 'words'){
    body = '<p class="lead">ابدأ من هنا: الحروف والأرقام أولًا، ثم كلمات كل موضوع بالصوت والمعنى.</p>' +
      '<div class="starter">' + TOPIC_EXTRA.map(function(t){ var uid = 't:' + t.id, pct = unitPct(uid);
        return '<a class="stc" href="#/t/' + t.id + '" style="--c:' + t.color + '"><span class="badge">' + (S.done[uid] ? '✅ أكملته' : pct ? pct + '٪' : 'ابدأ هنا') + '</span><div class="orb porb">' + uiPic('head_' + t.id, t.e) + '</div><b>' + esc(t.title) + '</b><div class="g">' + esc(t.de) + '</div><div class="m">' + esc(t.desc) + '</div><div class="bar"><i style="width:' + pct + '%"></i></div></a>'; }).join('') + '</div>' +
      '<div class="sh"><h2>مواضيع الكلمات</h2><span class="cnt">' + SR.modules.length + ' موضوعًا</span></div><div class="planets">' + SR.modules.map(planet).join('') + '</div>';
  } else if (tab === 'a1'){
    var a1d = SR.a1.filter(function(l){ return S.done['l:' + l.id]; }).length;
    body = '<p class="lead">قواعد مستوى A1 خطوة بخطوة. كل درس فيه شرح قصير وأمثلة بالصوت.</p>' +
      '<div class="sh"><h2>دروس A1</h2><span class="cnt">' + a1d + ' من ' + SR.a1.length + '</span></div><div class="list">' + SR.a1.map(lessonRow).join('') + '</div>';
  } else if (tab === 'a2'){
    var a2d = SR.a2.filter(function(l){ return S.done['l:' + l.id]; }).length;
    body = '<p class="lead">بعد A1: الماضي، والمقارنة، والجمل الأطول.</p>' +
      '<div class="sh"><h2>دروس A2</h2><span class="cnt">' + a2d + ' من ' + SR.a2.length + '</span></div><div class="list">' + SR.a2.map(lessonRow).join('') + '</div>';
  } else if (tab === 'b1'){
    var B1 = SR.b1 || [], b1d = B1.filter(function(l){ return S.done['l:' + l.id]; }).length;
    body = '<p class="lead">المستوى المتوسط: تطلب بأدب، وتصف الأشياء بجمل كاملة، وتحكي ما حدث.</p>' +
      '<div class="sh"><h2>دروس B1</h2><span class="cnt">' + ar(b1d) + ' من ' + ar(B1.length) + '</span></div><div class="list">' + B1.map(lessonRow).join('') +
      (SR.b1soon || []).map(function(t){ return '<div class="it lesson soonrow" style="--c:#6B6790"><span class="em num">⏳</span><div class="tx"><b>' + esc(t) + '</b><div class="cj">قريبًا</div></div><span class="st"><em class="soon">قريبًا</em></span></div>'; }).join('') + '</div>' +
      '<a class="wach" href="https://whatsapp.com/channel/0029VbDTaxI6xCSKXFymw837" target="_blank" rel="noopener"><span class="wach-i">' + ICON_CHAT + '</span><div><b>⏳ تكملة دروس B1 قريبًا</b><small>اشترك في قناة الواتساب، ويصلك كل درس جديد أولًا بأول 💬</small><span class="wach-b">اشترك في القناة</span></div></a>';
  } else if (tab === 'read'){
    body = '<p class="lead">طبّق ما تعلمته: اقرأ واستمع إلى قصص قصيرة، وتعلّم كتابة الرسائل كما في الامتحان.</p>' +
      '<div class="tiles big">' + (hidden('stories') ? '' : bigTile('#/stories', '📖', '#FF3D7F', 'قصص قصيرة', plural((SX.stories || []).length, 'قصة واحدة', 'قصتان', 'قصص', 'قصة') + ' بالصوت والأسئلة')) + (hidden('letters') ? '' : bigTile('#/letters', '✉️', '#3A86FF', 'رسائل جاهزة', plural((SX.letters || []).length, 'نموذج واحد', 'نموذجان', 'نماذج', 'نموذجًا') + ' للكتابة')) + '</div>';
  } else {
    body = '<p class="lead">أدوات تفاعلية تساعدك على الأرقام والوقت والتاريخ.</p><div class="tiles big">' + toolsHTML() + '</div>';
  }
  var html = '<div class="wrap"><a class="back" href="#/learn">→ الدروس</a>' + '<div class="lsec-h"><span class="lsec-i">' + ic(TT.i) + '</span><h1>' + TT.t + '</h1></div>' +
    '<div class="tabbody">' + body + '</div>' + footer() + '</div>';
  render(html, tab === 'words' ? 'words' : 'learn');
  window.scrollTo(0, 0);
}
var LHUB = {words:['#FF9F1C', 'الحروف والأرقام والمواضيع'], a1:['#5B3DF5', 'قواعد البداية خطوة بخطوة'], a2:['#3A86FF', 'الماضي والمقارنة والجمل الأطول'], b1:['#8338EC', 'الأمنيات والجمل الموصولة والحكاية'], read:['#FF3D7F', 'قصص قصيرة ورسائل جاهزة'], tools:['#06D6A0', 'الأرقام والوقت والتاريخ']};
function learnHub(LT){
  function cnt(t){ if ((t.id === 'a1' || t.id === 'a2' || t.id === 'b1') && SR[t.id]){ var L = SR[t.id], d = L.filter(function(l){ return S.done['l:' + l.id]; }).length; return '<span class="lhc-n">' + ar(d) + ' من ' + ar(L.length) + '</span><span class="lhc-bar"><i style="width:' + Math.round(d / L.length * 100) + '%"></i></span>'; }
    if (t.id === 'words'){ return '<span class="lhc-n">' + ar(SR.modules.length) + ' موضوعًا</span>'; } return ''; }
  var html = '<div class="wrap"><div class="ph sm" style="--c:#5B3DF5"><span class="em phpic">' + uiPic('tile_learn', '📚') + '</span><h1>الدروس</h1><div class="g">Lernen</div></div>' +
    pathCard() + '<p class="lead">اختر ما تريد أن تتعلّمه:</p><div class="lhub">' + LT.map(function(t){ var h = LHUB[t.id] || ['#5B3DF5', ''];
      return '<a class="lhc' + (t.soon ? ' soon' : '') + '" href="#/learn/' + t.id + '" style="--c:' + h[0] + '"><span class="lhc-i">' + ic(t.i) + '</span><b>' + t.t + '</b><small>' + h[1] + '</small>' + (t.soon ? '<em class="soon">قريبًا</em>' : cnt(t)) + '</a>'; }).join('') +
      '<a class="lhc" href="#/videos" style="--c:#FF3D3D"><span class="lhc-i">🎬</span><b>المحاضرات</b><small>دروس بالفيديو</small></a>' +
      '<a class="lhc" href="#/levels" style="--c:#FFB020"><span class="lhc-i">' + ic('train') + '</span><b>المستويات</b><small>من A1 إلى C2</small></a>' +
    '</div>' + footer() + '</div>';
  render(html, 'learn'); window.scrollTo(0, 0);
}
function viewTrain(){
  var mc = Object.keys(S.mist).length, ex = EXAM_PARTS.filter(function(p){ return S.done['e:' + p.id]; }).length;
  var html = '<div class="wrap"><div class="ph sm" style="--c:#8338EC"><span class="em phpic">' + uiPic('tile_train', '🎯') + '</span><h1>التدريب</h1><div class="g">Training</div><p>استعد للامتحان، واعرف مستواك، وصحّح نطقك وأخطاءك.</p></div>' +
    '<div class="tiles big">' + (hidden('games') ? '' : bigTile('#/play', '🎮', '#FF6B2C', 'الألعاب', GAMES.length + ' ألعاب ومغامرة ومواقف', 'tile_play')) +
      (hidden('exam') ? '' : bigTile('#/exam', '📝', '#8338EC', 'تدريب على امتحان A1', ex ? 'أكملت ' + ex + ' من 4 أجزاء · ' + exCount() + ' نماذج' : exCount() + ' نماذج كاملة: استماع، قراءة، كتابة، محادثة')) +
      (hidden('test') ? '' : bigTile('#/test', '🧭', '#2B1F86', 'اختبار المستوى', S.test == null ? '12 سؤالًا تحدد من أين تبدأ' : 'نتيجتك السابقة: ' + S.test + ' من 12')) +
      bigTile('#/saved', '⭐', '#FFB020', 'المحفوظات', favCount() ? plural(favCount(), 'كلمة واحدة', 'كلمتان', 'كلمات', 'كلمة') + ' حفظتها' : 'اضغط ☆ على أي كلمة لتحفظها') +
      bigTile('#/review', '🔁', '#0EA5E9', 'مراجعة اليوم', srsDue().length ? plural(srsDue().length, 'كلمة واحدة', 'كلمتان', 'كلمات', 'كلمة') + ' تنتظرك' : 'لا مراجعة الآن') +
      (hidden('speak') ? '' : bigTile('#/speak', '🎤', '#06A77D', 'اختبر نطقك', 'انطق والموقع يسمعك')) +
      (hidden('mistakes') ? '' : bigTile('#/mistakes', '🩹', '#E63946', 'كرّاسة أخطائي', mc ? plural(mc, 'كلمة واحدة', 'كلمتان', 'كلمات', 'كلمة') + ' للمراجعة' : 'لا أخطاء الآن')) + '</div>' +
    lenaTip('train') + footer() + '</div>';
  render(html, 'train'); bindTip();
}
function lessonRow(l){
  var uid = 'l:' + l.id, n = l.num ? ar(l.num) : (l.e || ''), pct = unitPct(uid);
  return '<a class="it lesson" href="#/l/' + l.id + '" style="--c:' + l.color + '"><span class="em num">' + n + '</span><div class="tx"><b>' + esc(l.title) + '</b><div class="cj">' + esc(l.de) + '</div><div class="prog thin"><i style="width:' + pct + '%"></i></div></div><span class="st">' + (S.done[uid] ? '✅' : pct ? ar(pct) + '٪' : '‹') + '</span></a>';
}
/* conjugation rows (same pronoun in every part of the spoken text): show that pronoun, so rows like
   "lernen · wohnen" for wir and for sie no longer look identical */
var PRON_LBL = {ich:'ich', du:'du', er:'er/sie/es', wir:'wir', ihr:'ihr', sie:'sie/Sie'};
function conjPron(it){ if (!it.say || it.say === it.de || it.de.indexOf('·') < 0) return '';
  var parts = it.say.split(',').map(function(x){ return x.trim().split(/\s+/)[0]; });
  var p = parts[0]; if (!PRON_LBL[p] || !parts.every(function(x){ return x === p; })) return ''; return PRON_LBL[p]; }
function itemRow(it, i, c){
  return '<button class="it' + ((it.de || '').length > 34 || (it.mn || '').length > 40 ? ' wide' : '') + '" data-i="' + i + '" style="--c:' + (c || 'var(--violet)') + '">' + (it.c ? '<span class="sw" style="background:' + it.c + '"></span>' : '<span class="em">' + (it.e || '🔹') + '</span>') +
    '<span class="tx"><span class="d">' + (conjPron(it) ? '<span class="cjp" lang="de">' + conjPron(it) + '</span>' : '') + deHTML(it) + '</span><span class="pr arp">' + pron(it.ar || '') + '</span><span class="m">' + esc(it.mn) + '</span>' +
    (it.conj ? '<span class="cj">' + esc(it.conj) + '</span>' : '') + '</span>' + iActs(it) + '<span class="play sm" aria-hidden="true">' + ICON_PLAY + '</span>' + (it.u != null && S.heard[it.u] && S.heard[it.u][it.k] ? '<span class="hd">✓</span>' : '') + '</button>';
}
/* picture cards: real photos load per topic from pics_<topic>.js (window.SRPIC), emoji is the fallback */
var PIC_TOPICS = ['ui', 'abc', 'body', 'animals', 'food', 'home', 'travel', 'weather', 'family', 'jobs'];
var PIC_HEAD = {body:'Hand', animals:'Hund', food:'Brot', home:'Haus', travel:'Flugzeug', weather:'Sonne', family:'Familie', jobs:'Arzt'};
window.SRP = window.SRP || {}; var SRPN = {};
function picKey(it){ return it && it.n ? ((it.grp && PIC_TOPICS.indexOf(it.grp) >= 0 ? it.grp : '') + '/' + it.n) : ''; }
function picUrl(key){ if (!key) return ''; if (SRP[key]) return SRP[key]; var n = key.split('/').pop(); return SRPN[n] || ''; }
window.SRPIC = function(o){ for (var k in o){ SRP[k] = o[k]; var n = k.split('/').pop(); if (!SRPN[n]) SRPN[n] = o[k]; }
  $$('.pic[data-n]').forEach(function(el){ var u = picUrl(el.dataset.n); if (u && !el.querySelector('img')) el.innerHTML = '<img src="' + u + '" alt="" decoding="async">'; }); };
var picLoaded = {};
function loadPics(id){ (id === 'all' ? PIC_TOPICS : [id]).forEach(function(t){ if (PIC_TOPICS.indexOf(t) < 0 || picLoaded[t]) return; picLoaded[t] = 1; var sc = document.createElement('script'); sc.src = 'pics_' + t + '.js'; sc.async = true; document.head.appendChild(sc); }); }
function uiPic(name, e, cls){ var k = 'ui/' + name, u = picUrl(k); return '<span class="pic' + (cls ? ' ' + cls : '') + '" data-n="' + k + '">' + (u ? '<img src="' + u + '" alt="" decoding="async">' : '<span class="pe">' + (e || '') + '</span>') + '</span>'; }
setTimeout(function(){ loadPics('ui'); }, 0);
function picHTML(it){ var k = picKey(it), u = picUrl(k); return '<span class="pic" data-n="' + esc(k) + '">' + (u ? '<img src="' + u + '" alt="" decoding="async">' : '<span class="pe">' + (it.e || '🔹') + '</span>') + '</span>'; }
function qEm(it, fb){ var k = picKey(it), u = picUrl(k);
  if (!k) return '<div class="em">' + (it.e || fb) + '</div>';
  return '<div class="em qpic"><span class="pic" data-n="' + esc(k) + '">' + (u ? '<img src="' + u + '" alt="" decoding="async">' : '<span class="pe">' + (it.e || fb) + '</span>') + '</span></div>'; }
function headPic(m){ return '<span class="em phpic">' + uiPic('head_' + m.id, m.e) + '</span>'; }
function picCard(it, i, c){
  return '<button class="it pcard" data-i="' + i + '" style="--c:' + (c || 'var(--violet)') + '">' + picHTML(it) +
    '<span class="tx"><span class="d">' + deHTML(it) + '</span><span class="pr arp">' + pron(it.ar || '') + '</span><span class="m">' + esc(it.mn) + '</span></span>' +
    iActs(it) + '<span class="play sm" aria-hidden="true">' + ICON_PLAY + '</span>' + (it.u != null && S.heard[it.u] && S.heard[it.u][it.k] ? '<span class="hd">✓</span>' : '') + '</button>';
}
function bindItems(list){
  $$('.it[data-i]').forEach(function(el){ el.onclick = function(e){ var act = e && e.target && e.target.closest ? e.target.closest('[data-act]') : null; if (act){ e.preventDefault(); e.stopPropagation(); return itemAct(act, list[+el.dataset.i]); } if (paBtn) stopAudio(); var it = list[+el.dataset.i]; play(it, el); if (it.u != null && !el.querySelector('.hd')) el.insertAdjacentHTML('beforeend', '<span class="hd">✓</span>'); }; });
  paToggle($('#playAll'), function(){ playAllList(list); });
}
function playAllList(list){
  var my = token, i = 0, els = $$('.it[data-i]');
  (function next(){ if (my !== token) return; if (i >= els.length) return paEnd(); var el = els[i], it = list[+el.dataset.i]; i++; el.scrollIntoView({block:'center', behavior:'smooth'});
    if (it.u != null && !el.querySelector('.hd')) el.insertAdjacentHTML('beforeend', '<span class="hd">✓</span>');
    play(it, el, function(){ if (my === token) setTimeout(next, S.set.speed === 'slow' ? 900 : 600); }); token = my; })();
}
function practiceTiles(tid, withSpeak){
  return '<div class="sh"><h2>جرّب نفسك</h2></div><div class="tiles">' + GAMES.slice(0, 4).map(function(g){ return gameTile(g, tid); }).join('') + '</div>' +
    (withSpeak ? '<a class="mission speak" href="#/speak/' + tid + '"><span class="em">🎤</span><div><b>اختبر نطقك</b><span>انطق الكلمات والموقع يخبرك هل نطقك صحيح</span></div><span class="arr">‹</span></a>' : '');
}
function viewTopic(id){
  if (id === 'abc') return viewABC(); if (id === 'num') return viewNumbers();
  var m = modById(id); if (!m) return go('#/learn');
  var uid = 't:' + id; useAudio(m.id);
  var html = '<div class="wrap"><div class="ph" style="--c:' + m.color + '"><a class="back" href="#/words">→ الكلمات</a>' + headPic(m) + '<h1>' + esc(m.title) + '</h1><div class="g">' + esc(m.de) + '</div><p>' + esc(m.desc) + '</p></div>' +
    unitBar(uid) + (m.id === 'calendar' ? toolBanner('#/tool/calendar', '#3A86FF') : '') + ctlBar(m.items ? '<button class="chip go2" id="playAll">▶ تشغيل الكل</button>' : '');
  var list = [];
  if (m.dialogs){
    m.dialogs.forEach(function(d){ html += '<div class="dlg" style="--c:' + m.color + '"><h3>' + d.e + ' ' + esc(d.t) + '</h3>';
      d.lines.forEach(function(l){ var k = list.length; list.push({de:l.de, ar:l.ar, mn:l.mn, grp:m.id, u:uid, k:k});
        html += '<button class="bub ' + (l.s === 'A' ? 'a' : 'b') + '" data-b="' + k + '"><div class="who">' + esc(d.who[l.s === 'A' ? 0 : 1]) + '</div><div class="d">' + esc(l.de) + '</div><div class="pr arp">' + pron(l.ar) + '</div><div class="m">' + esc(l.mn) + '</div></button>'; });
      html += '<button class="chip" data-dlg="' + (list.length - d.lines.length) + '-' + list.length + '">▶ تشغيل الحوار</button></div>'; });
  } else {
    list = m.items.map(function(it, k){ return Object.assign({grp:m.id, u:uid, k:k}, it); });
    if (list.some(function(x){ return x.g; })) html += artLegend();
    var nouns = list.filter(function(x){ return x.g && x.n && x.n.indexOf(' ') < 0; }), rest = list.filter(function(x){ return nouns.indexOf(x) < 0; });
    if (nouns.length >= 4 && PIC_TOPICS.indexOf(m.id) >= 0){
      html += '<div class="pgrid">' + nouns.map(function(it){ return picCard(it, list.indexOf(it), m.color); }).join('') + '</div>' +
        (rest.length ? '<div class="sh"><h2>جمل مفيدة</h2></div><div class="list">' + rest.map(function(it){ return itemRow(it, list.indexOf(it), m.color); }).join('') + '</div>' : '');
      loadPics(m.id);
    } else html += '<div class="list">' + list.map(function(it, i){ return itemRow(it, i, m.color); }).join('') + '</div>';
  }
  html += footer() + '</div>';
  render(html, 'words'); bindCtl(); bindItems(list);
  $$('[data-b]').forEach(function(b){ b.onclick = function(){ play(list[+b.dataset.b], b); }; });
  $$('[data-dlg]').forEach(function(b){ b.onclick = function(){ var r = b.dataset.dlg.split('-'), a = +r[0], z = +r[1]; stopAudio(); var my = token, i = a;
    (function next(){ if (my !== token || i >= z) return; var el = $('[data-b="' + i + '"]'); var it = list[i]; i++; el.scrollIntoView({block:'center', behavior:'smooth'}); play(it, el, function(){ if (my === token) setTimeout(next, 700); }); token = my; })(); }; });
}
function viewABC(){
  useAudio('abc'); var uid = 't:abc';
  var html = '<div class="wrap"><div class="ph" style="--c:#5B3DF5"><a class="back" href="#/words">→ الكلمات</a>' + headPic({id:'abc', e:'🔤'}) + '<h1>الحروف</h1><div class="g">Das Alphabet</div><p>اضغط على الحرف لتسمع نطقه، واضغط على الكلمة لتسمعها.</p></div>' + unitBar(uid) + ctlBar() + artLegend() +
    '<div class="abc">' + SR.letters.map(function(l, i){ var hd = S.heard[uid] && S.heard[uid][i]; return '<button class="lt" data-l="' + i + '">' + (hd ? '<span class="hd">✓</span>' : '') + '<div class="L">' + esc(l.L) + '</div><div class="nm arpw">اسمه: <span class="pr">' + pron(l.lp) + '</span></div>' + picHTML({grp:'abc', n:l.de, e:l.e}) + '<div class="w"><span class="art ' + l.g + '">' + ART[l.g] + '</span> ' + esc(l.de) + '</div><div class="nm">' + esc(l.mn) + '</div></button>'; }).join('') + '</div>' +
    footer() + '</div>';
  render(html, 'words'); bindCtl(); loadPics('abc');
  $$('[data-l]').forEach(function(b){ b.onclick = function(ev){ var i = +b.dataset.l, l = SR.letters[i]; $$('.lt.on').forEach(function(x){ x.classList.remove('on'); }); b.classList.add('on');
    var word = ev && ev.target && ev.target.closest && ev.target.closest('.w');
    markHeard(uid, i); if (!b.querySelector('.hd')) b.insertAdjacentHTML('afterbegin', '<span class="hd">✓</span>');
    speak(word ? ART[l.g] + ' ' + l.de : l.ls, function(){ b.classList.remove('on'); }); }; });
}
function viewNumbers(){
  useAudio('num'); var uid = 't:num';
  var list = itemsOf('num').map(function(it, k){ return Object.assign({u:uid, k:k}, it); });
  var html = '<div class="wrap"><div class="ph" style="--c:#FF6B2C"><a class="back" href="#/words">→ الكلمات</a>' + headPic({id:'num', e:'🔢'}) + '<h1>الأرقام</h1><div class="g">Die Zahlen</div><p>احفظ هذه الأرقام، والباقي يُركَّب منها. جرّب مصنع الأرقام بالأسفل.</p></div>' + unitBar(uid) +
    ctlBar('<button class="chip go2" id="playAll">▶ تشغيل الكل</button>') +
    '<a class="mission" href="#/tool/numbers" style="background:linear-gradient(115deg,#FF6B2C,#FFC53D);color:#1A1446;margin:0 0 12px"><span class="em">🏭</span><div><b>مصنع الأرقام</b><span>اكتب أي رقم من 0 إلى مليون واستمع إليه</span></div><span class="arr">‹</span></a>' +
    '<div class="tip memo"><b class="k">🧠 السر</b>من 21 إلى 99 يقول الألمان الآحاد أولًا: <span class="de">einundzwanzig</span> = واحد و<b>عشرون</b>، تمامًا كما نقول بالعربية!</div>' +
    '<div class="list">' + SR.nums.map(function(n, i){ var hd = S.heard[uid] && S.heard[uid][i]; return '<button class="it" data-i="' + i + '" style="--c:#FF6B2C"><span class="em num" style="color:#FF6B2C">' + n.big + '</span><span class="tx"><span class="d">' + esc(n.de) + '</span><span class="pr arp">' + pron(n.ar) + '</span><span class="m">' + esc(n.mn) + '</span></span><span class="play sm">' + ICON_PLAY + '</span>' + (hd ? '<span class="hd">✓</span>' : '') + '</button>'; }).join('') + '</div>' +
    footer() + '</div>';
  render(html, 'words'); bindCtl(); bindItems(list);
}
function viewLesson(id){
  var l = SR.a1.concat(SR.a2, SR.b1 || []).find(function(x){ return x.id === id; }); if (!l) return go('#/learn');
  var uid = 'l:' + id, grp = id.slice(0, 2); useAudio(grp);
  var list = l.items.map(function(it, k){ return Object.assign({grp:grp, u:uid, k:k}, it); });
  var TK = {tip:['💡','معلومة'], trap:['⚠️','انتبه'], memo:['🧠','احفظها هكذا']};
  var all = SR.a1.concat(SR.a2, SR.b1 || []), k = all.indexOf(l), nx = all[k + 1], pv = all[k - 1];
  /* group the examples; conjugation rows become one table */
  var groups = [], cur = null;
  list.forEach(function(it, i){ var g = l.items[i].grp || (cur ? cur.t : 'أمثلة'); if (!cur || cur.t !== g){ cur = {t:g, rows:[]}; groups.push(cur); } cur.rows.push([it, i]); });
  function tiles(rows){ return '<div class="list">' + rows.map(function(r){ var h = itemRow(r[0], r[1], l.color); return (r[0].de.length > 34 || (r[0].mn || '').length > 40) ? h.replace('<button class="it"', '<button class="it wide"') : h; }).join('') + '</div>'; }
  function conjTab(rows){ return '<div class="ctab" style="--c:' + l.color + '">' + rows.map(function(r){ var it = r[0];
      return '<button class="it ctr" data-i="' + r[1] + '" style="--c:' + l.color + '"><span class="ctp" lang="de">' + conjPron(it) + '</span><span class="ctf de">' + esc(it.de).replace(/\s*·\s*/g, '<br>') + '</span>' + (it.mn ? '<span class="ctm">' + esc(it.mn.replace(/^[^:]*:\s*/, '')) + '</span>' : '') + '<span class="play sm" aria-hidden="true">' + ICON_PLAY + '</span></button>'; }).join('') + '</div>'; }
  function block(g){ var out = '', run = [], isC = null;
    g.rows.forEach(function(r){ var c = !!conjPron(r[0]); if (isC !== null && c !== isC){ out += isC ? conjTab(run) : tiles(run); run = []; } isC = c; run.push(r); });
    if (run.length) out += isC ? conjTab(run) : tiles(run); return out; }
  var nEx = list.length, sec = 0;
  function head(ic, t, sub){ sec++; return '<div class="lsec-hd" id="ls' + sec + '"><span class="lsec-n" style="--c:' + l.color + '">' + sec + '</span><div><b>' + ic + ' ' + t + '</b>' + (sub ? '<small>' + sub + '</small>' : '') + '</div></div>'; }
  var html = '<div class="aurora" aria-hidden="true"><i></i><i></i><i></i></div><div class="rkt" aria-hidden="true"><i></i><b id="rktB">🚀</b></div><div class="wrap lesson2"><div class="ph" style="--c:' + l.color + '"><a class="back" href="#/learn/' + grp + '">→ دروس ' + grp.toUpperCase() + '</a><span class="em">' + (l.e || '📘') + '</span><h1>' + esc(l.title) + '</h1><div class="g">' + esc(l.de) + '</div>' + (l.mission ? '<p>🎯 ' + esc(l.mission) + '</p>' : '') + '</div>' +
    '<div class="lmap" style="--c:' + l.color + '"><button data-go="ls1">📖 الشرح</button><button data-go="ls2">🧩 الأمثلة <em>' + ar(nEx) + '</em></button><button data-go="ls3">✅ اختبر نفسك</button></div>' +
    keyRule(l) + unitBar(uid) +
    head('📖', 'الشرح', 'اقرأ القاعدة أولًا، ثم انتقل إلى الأمثلة') +
    '<div class="rgrid">' + l.rules.map(function(r, n){ return '<div class="rcard" style="--c:' + l.color + '"><span class="rbig">' + (n + 1) + '</span><span class="rnum">القاعدة ' + ar(n + 1) + '</span><div>' + rich(r) + '</div></div>'; }).join('') + '</div>' +
    (l.tips || []).map(function(t){ var x = TK[t.k] || ['💡','معلومة']; return '<div class="tip ' + t.k + ' tip2"><span class="tip-i">' + x[0] + '</span><div><b class="k">' + x[1] + '</b>' + rich(t.t) + '</div></div>'; }).join('') +
    (id === 'a1-8' ? toolBanner('#/tool/clock', '#8338EC') : '') +
    head('🧩', 'الأمثلة', 'اضغط على أي مثال لتسمعه') + ctlBar('<button class="chip go2" id="playAll">▶ تشغيل الكل</button>') +
    groups.map(function(g){ return (groups.length > 1 || g.t !== 'أمثلة' ? '<div class="gh2" style="--c:' + l.color + '"><span></span>' + esc(g.t) + '<span></span></div>' : '') + block(g); }).join('') +
    head('✅', 'اختبر نفسك', '3 أسئلة سريعة على هذا الدرس') + '<div id="lquiz" class="lquiz"></div>' +
    '<div class="lnav2">' + (pv ? '<a class="lnb" href="#/l/' + pv.id + '"><small>الدرس السابق</small><b>' + esc(pv.title) + '</b></a>' : '<span></span>') + (nx ? '<a class="lnb nx" href="#/l/' + nx.id + '" style="--c:' + nx.color + '"><small>الدرس التالي</small><b>' + esc(nx.title) + '</b></a>' : '') + '</div>' + footer() + '</div>';
  render(html, 'learn'); document.body.classList.add('th-neon'); bindCtl(); bindItems(list);
  $$('.lmap [data-go]').forEach(function(b){ b.onclick = function(){ var t = $('#' + b.dataset.go); if (t) t.scrollIntoView({behavior:'smooth', block:'start'}); }; });
  var mapB = $$('.lmap [data-go]'); function mapOn(){ var y = scrollY + 170, on = 'ls1'; ['ls1','ls2','ls3'].forEach(function(k){ var t = $('#' + k); if (t && t.getBoundingClientRect().top + scrollY <= y) on = k; }); mapB.forEach(function(b){ b.classList.toggle('on', b.dataset.go === on); }); }
  function hdr(){ var m = $('.lmap'), h = $('.lesson2 .ph'); document.body.classList.toggle('lsn-tabs', !!(h && h.getBoundingClientRect().bottom < 70)); }
  function rk(){ var b = $('#rktB'); if (!b) return; var max = document.documentElement.scrollHeight - innerHeight, f = max > 0 ? scrollY / max : 0; b.style.top = 'calc(' + (f * 100) + '% - ' + (f * 22) + 'px)'; }
  rk(); hdr(); mapOn(); var mapT = 0; addEventListener('scroll', function sc(){ rk(); if (!$('.lesson2')){ document.body.classList.remove('lsn-tabs'); removeEventListener('scroll', sc); return; } hdr(); clearTimeout(mapT); mapT = setTimeout(mapOn, 60); }, {passive:true});
  /* quick self-check: German example -> pick the Arabic meaning */
  var pool = list.filter(function(x){ return x.mn && !conjPron(x); }), qs = shuffle(pool.slice()).slice(0, 3), qi = 0, ok = 0;
  function q(){ var box = $('#lquiz'); if (!box) return;
    if (!qs.length){ box.innerHTML = '<p class="sub">لا توجد أسئلة لهذا الدرس.</p>'; return; }
    if (qi >= qs.length){ box.innerHTML = '<div class="lq-end"><b>' + (ok === qs.length ? '🏆 ممتاز!' : '👍 أحسنت') + '</b> أجبت عن ' + ar(ok) + ' من ' + ar(qs.length) + ' بشكل صحيح.<button class="btn alt" id="lqA">🔁 أسئلة أخرى</button></div>'; $('#lqA').onclick = function(){ qs = shuffle(pool.slice()).slice(0, 3); qi = 0; ok = 0; q(); }; return; }
    var it = qs[qi], opts = shuffle([it.mn].concat(shuffle(pool.filter(function(x){ return x.mn !== it.mn; })).slice(0, 2).map(function(x){ return x.mn; })));
    box.innerHTML = '<div class="lq-c"><span class="lq-n">سؤال ' + ar(qi + 1) + ' من ' + ar(qs.length) + '</span><div class="lq-de de">' + esc(it.de) + '</div><div class="lq-s">ما معنى هذه الجملة؟</div><div class="opts">' + opts.map(function(o, n){ return '<button class="opt" data-q="' + n + '">' + esc(o) + '</button>'; }).join('') + '</div></div>';
    $$('[data-q]', box).forEach(function(b){ b.onclick = function(){ var good = opts[+b.dataset.q] === it.mn; $$('[data-q]', box).forEach(function(x){ x.disabled = true; if (opts[+x.dataset.q] === it.mn) x.classList.add('ok'); }); if (!good) b.classList.add('no'); else ok++; fx(good); setTimeout(function(){ qi++; q(); }, 1100); }; }); }
  q();
}
function viewLevels(){
  var html = '<div class="wrap"><div class="ph" style="--c:#2B1F86"><a class="back" href="#/learn">→ الدروس</a><span class="em">🧗</span><h1>سلّم المستويات</h1><div class="g">A1 → C2</div><p>هذه المستويات معيار أوروبي (CEFR) يُستخدم في الامتحانات والعمل.</p></div>' + ladderHTML() +
    '<a class="wach" href="https://whatsapp.com/channel/0029VbDTaxI6xCSKXFymw837" target="_blank" rel="noopener"><span class="wach-i">' + ICON_CHAT + '</span><div><b>🛸 المستويات القادمة قريبًا</b><small>اشترك في قناة الواتساب، ويصلك كل جديد أولًا بأول 💬</small><span class="wach-b">اشترك في القناة</span></div></a>' + footer() + '</div>';
  render(html, 'learn');
}

/* ---------------- TOOLS ---------------- */
function viewNumTool(){
  useAudio('num');
  var html = '<div class="wrap"><div class="ph" style="--c:#FF6B2C"><a class="back" href="#/t/num">→ الأرقام</a><span class="em phpic">' + uiPic('head_num', '🏭') + '</span><h1>مصنع الأرقام</h1><div class="g">Zahlen-Fabrik</div><p>اكتب أي رقم من 0 إلى 1000000 وشاهد كيف يُركَّب.</p></div>' + ctlBar() +
    '<div class="panel"><input class="inp de" id="nIn" inputmode="numeric" placeholder="مثلًا 2026" value="21" aria-label="الرقم"><div class="bigout" id="nOut"></div><div class="pr arp center" id="nAr" style="font-size:18px"></div>' +
    '<div class="row" style="justify-content:center;margin-top:12px"><button class="btn" id="nPlay">🔊 استمع</button><button class="btn alt" id="nRand">🎲 رقم عشوائي</button></div></div>' +
    '<div class="panel"><b>🎧 تحدٍّ: استمع واكتب الرقم</b><p style="color:var(--mute);font-size:14px;margin:4px 0 10px">ستسمع رقمًا بالألمانية، اكتبه بالأرقام.</p><div class="row"><button class="btn flame" id="qPlay">▶ استمع إلى الرقم</button><input class="inp de" id="qIn" inputmode="numeric" style="flex:1;min-width:120px" aria-label="إجابتك"><button class="btn" id="qChk">تحقّق</button></div><div id="qRes" class="center" style="margin-top:8px;font-weight:800"></div></div>' + footer() + '</div>';
  render(html, 'learn'); bindCtl(); touch('num');
  function upd(){ var v = parseInt(($('#nIn').value || '').replace(/[^\d]/g,''), 10);
    if (isNaN(v) || v > 1000000){ $('#nOut').textContent = '؟'; $('#nAr').textContent = 'اكتب رقمًا من 0 إلى مليون'; return null; }
    $('#nOut').textContent = numDe(v); $('#nAr').innerHTML = pron(numAr(v)); return v; }
  $('#nIn').oninput = upd; upd();
  $('#nPlay').onclick = function(){ var v = upd(); if (v != null) speak(numDe(v)); };
  $('#nRand').onclick = function(){ var v = Math.random() < .5 ? Math.floor(Math.random()*100) : Math.floor(Math.random()*3000); $('#nIn').value = v; upd(); speak(numDe(v)); };
  var target = null;
  $('#qPlay').onclick = function(){ if (target == null) target = Math.floor(Math.random()*999) + 1; speak(numDe(target)); $('#qRes').textContent = ''; };
  $('#qChk').onclick = function(){ if (target == null) return; var v = parseInt($('#qIn').value, 10);
    if (v === target){ $('#qRes').innerHTML = '✅ صحيح! ' + target + ' = <span class="de">' + numDe(target) + '</span>'; addXP(5); target = null; $('#qIn').value = ''; }
    else $('#qRes').textContent = '❌ ليس هو، استمع مرة أخرى'; };
}
function clockSVG(h, m){
  var ha = ((h % 12) + m/60) * 30, ma = m * 6, t = '';
  for (var i = 0; i < 12; i++){ var a = i * 30 * Math.PI/180, r1 = i % 3 ? 86 : 78; t += '<line x1="' + (100 + 92*Math.sin(a)).toFixed(1) + '" y1="' + (100 - 92*Math.cos(a)).toFixed(1) + '" x2="' + (100 + r1*Math.sin(a)).toFixed(1) + '" y2="' + (100 - r1*Math.cos(a)).toFixed(1) + '" stroke="currentColor" stroke-width="' + (i % 3 ? 2 : 5) + '" stroke-linecap="round"/>'; }
  var nums = [12,3,6,9].map(function(n, k){ var a = k * 90 * Math.PI/180; return '<text x="' + (100 + 62*Math.sin(a)).toFixed(1) + '" y="' + (100 - 62*Math.cos(a) + 8).toFixed(1) + '" text-anchor="middle" font-family="Outfit" font-weight="700" font-size="22" fill="currentColor">' + n + '</text>'; }).join('');
  function hand(a, L, w, c){ a = a * Math.PI/180; return '<line x1="100" y1="100" x2="' + (100 + L*Math.sin(a)).toFixed(1) + '" y2="' + (100 - L*Math.cos(a)).toFixed(1) + '" stroke="' + c + '" stroke-width="' + w + '" stroke-linecap="round"/>'; }
  return '<svg viewBox="0 0 200 200" role="img" aria-label="ساعة"><circle cx="100" cy="100" r="96" fill="var(--surface)" stroke="currentColor" stroke-width="6"/>' + t + nums + hand(ha, 48, 9, 'currentColor') + hand(ma, 72, 6, '#FF6B2C') + '<circle cx="100" cy="100" r="7" fill="#FF6B2C"/></svg>';
}
function viewClock(){
  var now = new Date(), st = {h:now.getHours(), m:Math.floor(now.getMinutes()/5)*5};
  var html = '<div class="wrap"><div class="ph" style="--c:#5B3DF5"><a class="back" href="#/l/a1-8">→ الوقت ويومك</a><span class="em">🕐</span><h1>الساعة الناطقة</h1><div class="g">Wie spät ist es?</div><p>غيّر الساعة والدقائق، وشاهد الوقت بالطريقتين.</p></div>' + ctlBar() +
    '<div class="panel"><div class="clockwrap" id="ck"></div><div class="steps"><button class="btn alt" data-d="h-1">− ساعة</button><button class="btn alt" data-d="h1">+ ساعة</button><button class="btn alt" data-d="m-5">− 5 د</button><button class="btn alt" data-d="m5">+ 5 د</button></div></div>' +
    '<div class="panel"><b>💬 في الكلام اليومي</b><div class="bigout sm" id="inf"></div><div class="pr arp center" id="infAr"></div><div class="row" style="justify-content:center;margin-top:8px"><button class="btn" id="pInf">🔊 استمع</button></div></div>' +
    '<div class="panel"><b>🚉 الصيغة الرسمية (المواعيد والقطارات)</b><div class="bigout sm" id="frm"></div><div class="pr arp center" id="frmAr"></div><div class="row" style="justify-content:center;margin-top:8px"><button class="btn" id="pFrm">🔊 استمع</button></div></div>' +
    '<div class="tip trap"><b class="k">⚠️ انتبه</b><span class="de">halb acht</span> لا تعني الثامنة والنصف! معناها «نصف ساعة قبل الثامنة» أي 7:30.</div>' + footer() + '</div>';
  render(html, 'learn'); bindCtl(); touch('clock');
  function upd(){ $('#ck').innerHTML = clockSVG(st.h, st.m); var a = informal(st.h, st.m), b = formal(st.h, st.m);
    $('#inf').textContent = a; $('#infAr').innerHTML = pron(sentAr(a)); $('#frm').textContent = b; $('#frmAr').innerHTML = pron(sentAr(b)); }
  $$('[data-d]').forEach(function(b){ b.onclick = function(){ var d = b.dataset.d, k = d[0], v = +d.slice(1);
    if (k === 'h') st.h = (st.h + v + 24) % 24; else { st.m += v; if (st.m >= 60){ st.m = 0; st.h = (st.h + 1) % 24; } if (st.m < 0){ st.m = 55; st.h = (st.h + 23) % 24; } } upd(); speak(informal(st.h, st.m)); }; });
  $('#pInf').onclick = function(){ speak(informal(st.h, st.m)); };
  $('#pFrm').onclick = function(){ speak(formal(st.h, st.m)); };
  upd();
}
function viewCalendar(){
  useAudio('calendar');
  var d = new Date(), wd = (d.getDay() + 6) % 7, day = SR.days[wd], mon = SR.months[d.getMonth()], dn = d.getDate(), y = d.getFullYear();
  var sDe = 'Heute ist ' + day[0] + ', der ' + ordDe(dn) + ' ' + mon[0] + ' ' + numDe(y) + '.';
  var sAr = 'هويته ايست ' + day[1] + '، ديا ' + ordAr(dn) + ' ' + mon[1] + ' ' + numAr(y) + '.';
  var first = new Date(y, d.getMonth(), 1), off = (first.getDay() + 6) % 7, dim = new Date(y, d.getMonth() + 1, 0).getDate(), cells = '';
  ['Mo','Di','Mi','Do','Fr','Sa','So'].forEach(function(x){ cells += '<span class="h">' + x + '</span>'; });
  for (var i = 0; i < off; i++) cells += '<span></span>';
  for (var k = 1; k <= dim; k++) cells += '<span class="' + (k === dn ? 't' : '') + '">' + k + '</span>';
  var html = '<div class="wrap"><div class="ph" style="--c:#19C79A"><a class="back" href="#/t/calendar">→ الأيام والشهور</a><span class="em phpic">' + uiPic('head_calendar', '🗓️') + '</span><h1>التقويم الحي</h1><div class="g">' + esc(day[0]) + ' · ' + esc(mon[0]) + '</div><p>تاريخ اليوم والساعة الآن بالألمانية.</p></div>' + ctlBar() +
    '<div class="panel"><b>📍 اليوم</b><div class="bigout sm">' + esc(sDe) + '</div><div class="pr arp center">' + pron(sAr) + '</div><div class="row" style="justify-content:center;margin-top:8px"><button class="btn" id="pD">🔊 استمع</button></div>' +
    '<div class="center" style="font-family:Outfit;font-weight:700;margin-top:14px">' + esc(mon[0]) + ' ' + y + '</div><div class="cal">' + cells + '</div></div>' +
    '<div class="panel"><b>⏰ الساعة الآن</b><div class="bigout sm" id="tNow"></div><div class="pr arp center" id="tAr"></div><div class="row" style="justify-content:center;margin-top:8px"><button class="btn" id="pT">🔊 استمع</button></div></div>' +
    '<div class="tip memo"><b class="k">🧠 احفظها هكذا</b>يُقال التاريخ بالعدد الترتيبي: <span class="de">der erste, der zweite, der dritte</span>… ومن 20 فما فوق نضيف <span class="de">-ste</span>.</div>' +
    '<a class="mission" href="#/t/calendar"><span class="em">🗓️</span><div><b>كل الأيام والشهور</b><span>بالصوت والنطق</span></div><span class="arr">‹</span></a>' + footer() + '</div>';
  render(html, 'learn'); bindCtl(); touch('cal');
  function tick(){ if (!$('#tNow')) return clearInterval(iv); var n = new Date(), s = formal(n.getHours(), n.getMinutes()); $('#tNow').textContent = s; $('#tAr').innerHTML = pron(sentAr(s)); }
  var iv = setInterval(tick, 15000); tick();
  $('#pD').onclick = function(){ speak(sDe); };
  $('#pT').onclick = function(){ speak($('#tNow').textContent); };
}
function femAr(s){ return s.split(' ').map(function(w){ return /[ةى]$/.test(w) ? w : w + 'ة'; }).join(' '); }
function viewIntro(){
  var st = {name:S.name || '', g:'m', c:0, city:'', age:'', job:0, langs:{0:1, 3:1}};
  var html = '<div class="wrap"><div class="ph" style="--c:#FF3D7F"><a class="back" href="#/me">→ صفحتي</a><span class="em">🙋</span><h1>تعريفي بالألمانية</h1><div class="g">Ich stelle mich vor</div><p>املأ بياناتك واحصل على تعريف نفسك بالألمانية جاهزًا بالصوت.</p></div>' + ctlBar() +
    '<div class="panel form"><label for="iN">اسمك (بالحروف اللاتينية أفضل)</label><input class="inp de" id="iN" placeholder="Mohannad" value="' + esc(st.name) + '">' +
    '<label>أنا</label><div class="seg" style="width:max-content"><button data-gg="m" class="on">👦 ذكر</button><button data-gg="f">👧 أنثى</button></div>' +
    '<label for="iC">بلدك</label><select class="inp" id="iC">' + SR.countries.map(function(c, i){ return '<option value="' + i + '">' + c[3] + ' ' + c[2] + '</option>'; }).join('') + '</select>' +
    '<label for="iT">مدينتك</label><input class="inp de" id="iT" placeholder="Kairo">' +
    '<label for="iA">عمرك</label><input class="inp de" id="iA" inputmode="numeric" placeholder="20">' +
    '<label for="iJ">عملك أو دراستك</label><select class="inp" id="iJ">' + SR.jobs.map(function(j, i){ return '<option value="' + i + '">' + j[4] + '</option>'; }).join('') + '</select>' +
    '<label>ما اللغات التي تتحدثها؟</label><div class="chips" id="iL">' + SR.langs.map(function(l, i){ return '<button class="chip ' + (st.langs[i] ? 'on' : '') + '" data-l="' + i + '">' + l[2] + '</button>'; }).join('') + '</div></div>' +
    '<div class="panel out" id="iOut"></div><div class="row"><button class="btn wide" id="iPlay">🔊 استمع إلى تعريفك كاملًا</button></div>' + footer() + '</div>';
  render(html, 'me'); bindCtl();
  var lines = [];
  function build(){
    st.name = $('#iN').value.trim(); st.city = $('#iT').value.trim(); st.age = parseInt($('#iA').value, 10); st.c = +$('#iC').value; st.job = +$('#iJ').value;
    var c = SR.countries[st.c], j = SR.jobs[st.job], L = SR.langs.filter(function(x, i){ return st.langs[i]; }), f = st.g === 'f';
    lines = [];
    lines.push(['Hallo! Ich heiße ' + (st.name || '…') + '.', 'هالو! ايش هايسه ' + (st.name || '…') + '.', 'مرحبًا! اسمي ' + (st.name || '…') + '.']);
    lines.push(['Ich komme aus ' + c[0] + '.', 'ايش كومه اوس ' + c[1] + '.', 'أنا من ' + c[2] + '.']);
    if (st.city) lines.push(['Ich wohne in ' + st.city + '.', 'ايش ڤونه ان ' + st.city + '.', 'أسكن في ' + st.city + '.']);
    if (st.age > 0 && st.age < 120) lines.push(['Ich bin ' + numDe(st.age) + ' Jahre alt.', 'ايش بين ' + numAr(st.age) + ' ياغه الت.', 'عمري ' + ar(st.age) + ' سنة.']);
    lines.push(['Ich bin ' + (f ? j[2] : j[0]) + '.', 'ايش بين ' + (f ? j[3] : j[1]) + '.', 'أنا ' + (f ? femAr(j[4]) : j[4]) + '.']);
    if (L.length){ var de = L.map(function(x){ return x[0]; }), arp = L.map(function(x){ return x[1]; }), mn = L.map(function(x){ return x[2]; });
      var jd = de.length > 1 ? de.slice(0, -1).join(', ') + ' und ' + de[de.length-1] : de[0], ja = arp.length > 1 ? arp.slice(0, -1).join('، ') + ' اونت ' + arp[arp.length-1] : arp[0];
      lines.push(['Ich spreche ' + jd + '.', 'ايش شبغيشه ' + ja + '.', 'أتحدث ' + mn.join(' و') + '.']); }
    lines.push(['Freut mich!', 'فغويت ميش!', 'تشرفت بمعرفتك!']);
    $('#iOut').innerHTML = lines.map(function(l, i){ return '<button class="it" data-x="' + i + '" style="--c:#FF3D7F"><span class="tx"><span class="d">' + esc(l[0]) + '</span><span class="pr arp">' + pron(l[1]) + '</span><span class="m">' + esc(l[2]) + '</span></span><span class="play sm">' + ICON_PLAY + '</span></button>'; }).join('');
    $$('[data-x]').forEach(function(b){ b.onclick = function(){ $$('.it.on').forEach(function(x){ x.classList.remove('on'); }); b.classList.add('on'); speak(lines[+b.dataset.x][0], function(){ b.classList.remove('on'); }); }; });
  }
  ['#iN','#iT','#iA'].forEach(function(s){ $(s).oninput = build; }); ['#iC','#iJ'].forEach(function(s){ $(s).onchange = build; });
  $$('[data-gg]').forEach(function(b){ b.onclick = function(){ st.g = b.dataset.gg; $$('[data-gg]').forEach(function(x){ x.classList.toggle('on', x === b); }); build(); }; });
  $$('#iL [data-l]').forEach(function(b){ b.onclick = function(){ var i = +b.dataset.l; st.langs[i] = !st.langs[i]; b.classList.toggle('on', !!st.langs[i]); build(); }; });
  $('#iPlay').onclick = function(){ if (st.name){ S.name = st.name; save(); } touch('intro'); stopAudio(); var my = token, i = 0, els = $$('[data-x]');
    (function next(){ if (my !== token || i >= lines.length) return; var el = els[i]; $$('.it.on').forEach(function(x){ x.classList.remove('on'); }); el.classList.add('on'); speak(lines[i++][0], function(){ el.classList.remove('on'); if (my === token) setTimeout(next, 500); }); token = my; })(); };
  build();
}

/* ---------------- STORIES ---------------- */
function viewStories(){
  var st = SX.stories || [];
  var html = '<div class="wrap"><div class="ph" style="--c:#FF3D7F"><a class="back" href="#/learn/read">→ اقرأ واكتب</a><span class="em phpic">' + uiPic('story_anna', '📖') + '</span><h1>قصص قصيرة</h1><div class="g">Kurze Geschichten</div><p>استمع إلى القصة جملة جملة، ثم أجب عن الأسئلة.</p></div><div class="list">' +
    st.map(function(s, i){ var uid = 's:' + s.id; return '<a class="it lesson" href="#/story/' + s.id + '" style="--c:' + s.color + '"><span class="em cov">' + uiPic('story_' + s.id, s.e) + '</span><div class="tx"><b>' + esc(s.title) + '</b><div class="cj">' + esc(s.de) + '</div><div class="m">' + esc(s.lvl || 'A1') + ' · ' + plural(s.lines.length, 'جملة', 'جملتان', 'جمل', 'جملة') + '</div></div><span class="st">' + (S.done[uid] ? '✅' : '‹') + '</span></a>'; }).join('') + '</div>' + footer() + '</div>';
  render(html, 'learn');
}
function viewStory(id){
  var s = (SX.stories || []).find(function(x){ return x.id === id; }); if (!s) return go('#/stories');
  var uid = 's:' + id; useAudio('story'); if (S.plan && S.plan.skill === 'read'){ dayLog().s = 1; save(); }
  var list = s.lines.map(function(l){ return {de:l.de, mn:l.mn, grp:'story'}; });
  var html = '<div class="wrap"><div class="ph" style="--c:' + s.color + '"><a class="back" href="#/stories">→ القصص</a><span class="em phpic">' + uiPic('story_' + s.id, s.e) + '</span><h1>' + esc(s.title) + '</h1><div class="g">' + esc(s.de) + '</div><p>' + esc(s.intro || '') + '</p></div>' +
    ctlBar('<button class="chip go2" id="playAll">▶ تشغيل القصة</button>') +
    '<div class="seg2"><button class="chip" id="trOn">👁️ إظهار الترجمة</button></div><div class="story notr" id="story">' + s.lines.map(function(l, i){ return '<button class="sline" data-s="' + i + '"><span class="d de">' + esc(l.de) + '</span><span class="m">' + esc(l.mn) + '</span></button>'; }).join('') + '</div>' +
    '<div class="sh"><h2>هل فهمت القصة؟</h2></div><div id="sq"></div>' + footer() + '</div>';
  render(html, 'learn'); bindCtl();
  var showTr = false; $('#trOn').onclick = function(){ showTr = !showTr; $('#story').classList.toggle('notr', !showTr); $$('#story .sline.peek').forEach(function(x){ x.classList.remove('peek'); }); this.classList.toggle('on', showTr); this.textContent = showTr ? '🙈 إخفاء الترجمة' : '👁️ إظهار الترجمة'; };
  $$('[data-s]').forEach(function(b){ b.onclick = function(){ if (paBtn) stopAudio(); play(list[+b.dataset.s], b); }; });
  paToggle($('#playAll'), function(){ var my = token, i = 0, els = $$('.sline');
    (function next(){ if (my !== token) return; if (i >= els.length) return paEnd(); var el = els[i], it = list[i]; i++; el.scrollIntoView({block:'center', behavior:'smooth'}); play(it, el, function(){ if (my === token) setTimeout(next, 600); }); token = my; })(); });
  var qi = 0, ok = 0;
  function q(){
    var box = $('#sq'); if (!box) return;
    if (qi >= s.qs.length){
      var pass = ok >= Math.ceil(s.qs.length * 2 / 3);
      box.innerHTML = '<div class="result small"><div class="em">' + (pass ? '🎉' : '📖') + '</div><h2>' + ar(ok) + ' من ' + ar(s.qs.length) + '</h2><p>' + (pass ? 'ممتاز! فهمت القصة.' : 'استمع إلى القصة مرة أخرى وحاول من جديد.') + '</p><button class="btn" id="sqAgain">🔁 أعد الأسئلة</button></div>';
      $('#sqAgain').onclick = function(){ qi = 0; ok = 0; q(); };
      if (pass){ addXP(ok * 10); complete(uid); }
      return;
    }
    var x = s.qs[qi];
    box.innerHTML = '<div class="qcard"><div class="q">سؤال ' + ar(qi + 1) + ' من ' + ar(s.qs.length) + '</div><div class="bigar">' + esc(x.q) + '</div></div><div class="opts">' + x.o.map(function(o, k){ return '<button class="opt" data-k="' + k + '">' + esc(o) + '</button>'; }).join('') + '</div>';
    $$('#sq .opt').forEach(function(b){ b.onclick = function(){ var good = +b.dataset.k === x.a; if (good) ok++; b.classList.add(good ? 'ok' : 'no'); if (!good) $$('#sq .opt')[x.a].classList.add('ok'); $$('#sq .opt').forEach(function(z){ z.disabled = true; }); setTimeout(function(){ qi++; q(); }, good ? 700 : 1500); }; });
  }
  q();
}

/* ---------------- LETTERS ---------------- */
function viewLetters(){
  var ls = SX.letters || [];
  var html = '<div class="wrap"><div class="ph" style="--c:#3A86FF"><a class="back" href="#/learn/read">→ اقرأ واكتب</a><span class="em phpic">' + uiPic('letter_termin', '✉️') + '</span><h1>رسائل جاهزة</h1><div class="g">Briefe und E-Mails</div><p>نماذج لرسائل قصيرة كما تُطلب في امتحان A1، بالصوت والترجمة.</p></div>' +
    '<div class="tip tip"><b class="k">💡 القاعدة الذهبية</b>كل رسالة فيها: <b>تحية</b> ← <b>ثلاث نقاط</b> مطلوبة ← <b>خاتمة</b> ← <b>اسمك</b>. هذا كل ما يحتاجه الممتحن.</div><div class="list">' +
    ls.map(function(w){ var uid = 'w:' + w.id; return '<a class="it lesson" href="#/letter/' + w.id + '" style="--c:' + w.color + '"><span class="em cov">' + uiPic('letter_' + w.id, w.e) + '</span><div class="tx"><b>' + esc(w.title) + '</b><div class="m">' + esc(w.sit) + '</div><div class="prog thin"><i style="width:' + unitPct(uid) + '%"></i></div></div><span class="st">' + (S.done[uid] ? '✅' : '‹') + '</span></a>'; }).join('') + '</div>' + footer() + '</div>';
  render(html, 'learn');
}
function viewLetter(id){
  var w = (SX.letters || []).find(function(x){ return x.id === id; }); if (!w) return go('#/letters');
  var uid = 'w:' + id; useAudio('letter');
  var list = w.lines.map(function(l, k){ return {de:l.de, mn:l.mn, grp:'letter', u:uid, k:k}; });
  var html = '<div class="wrap"><div class="ph" style="--c:' + w.color + '"><a class="back" href="#/letters">→ الرسائل</a><span class="em phpic">' + uiPic('letter_' + w.id, w.e) + '</span><h1>' + esc(w.title) + '</h1><p>' + esc(w.sit) + '</p></div>' + unitBar(uid) +
    '<div class="panel task"><b>📋 المطلوب في الرسالة</b><ul>' + w.points.map(function(p){ return '<li>' + esc(p) + '</li>'; }).join('') + '</ul></div>' +
    ctlBar('<button class="chip go2" id="playAll">▶ تشغيل الرسالة</button>') +
    '<div class="seg2"><button class="chip" id="trL">👁️ إظهار الترجمة</button></div><div class="letter notr" id="letterBox">' + list.map(function(l, i){ return '<button class="it lline" data-i="' + i + '" style="--c:' + w.color + '"><span class="tx"><span class="d">' + esc(l.de) + '</span><span class="m">' + esc(l.mn) + '</span></span><span class="play sm">' + ICON_PLAY + '</span>' + (S.heard[uid] && S.heard[uid][i] ? '<span class="hd">✓</span>' : '') + '</button>'; }).join('') + '</div>' +
    (w.phrases && w.phrases.length ? '<div class="sh"><h2>جمل مفيدة</h2></div><div class="list">' + w.phrases.map(function(p, i){ return '<button class="it" data-p="' + i + '" style="--c:' + w.color + '"><span class="tx"><span class="d">' + esc(p.de) + '</span><span class="m">' + esc(p.mn) + '</span></span><span class="play sm">' + ICON_PLAY + '</span></button>'; }).join('') + '</div>' : '') +
    '<div class="sh"><h2>جرّب بنفسك</h2></div><div class="panel"><p class="sub">اكتب رسالتك هنا ثم قارنها بالنموذج. (لا يتم إرسال أي شيء)</p><textarea class="inp de" id="myL" rows="7" placeholder="Liebe …,"></textarea><button class="btn wide" id="chkL" style="margin-top:10px">✔ قيّم رسالتي</button><div id="lres"></div></div>' + footer() + '</div>';
  render(html, 'learn'); bindCtl(); bindItems(list);
  $$('[data-p]').forEach(function(b){ b.onclick = function(){ play({de:w.phrases[+b.dataset.p].de, grp:'letter'}, b); }; });
  var showL = false; $('#trL').onclick = function(){ showL = !showL; $('#letterBox').classList.toggle('notr', !showL); $$('#letterBox .peek').forEach(function(x){ x.classList.remove('peek'); }); this.classList.toggle('on', showL); this.textContent = showL ? '🙈 إخفاء الترجمة' : '👁️ إظهار الترجمة'; };
  try{ var dr = localStorage.getItem('sr-letter-' + id); if (dr) $('#myL').value = dr; }catch(e){}
  $('#myL').oninput = function(){ try{ localStorage.setItem('sr-letter-' + id, this.value); }catch(e){} };
  $('#chkL').onclick = function(){
    var t = $('#myL').value.trim(); if (t.split(/\s+/).length < 8) return toast('اكتب رسالة أطول قليلًا أولًا');
    var checks = [
      ['تحية في البداية', /^(liebe|lieber|hallo|sehr geehrte|guten tag|hi)\b/i.test(t)],
      ['خاتمة', /(viele grüße|liebe grüße|mit freundlichen grüßen|bis bald|grüße|lg)\b/i.test(t)],
      ['استخدمت أفعالًا مثل habe / möchte / kann / komme', /(^|\s)(habe|möchte|kann|kannst|komme|kommst|bin|bist|mache|muss|will|gehe|brauche|hast|ist)(\s|[.,!?]|$)/i.test(t)],
      ['طول مناسب (25 كلمة أو أكثر)', t.split(/\s+/).length >= 25],
      ['أسماء تبدأ بحرف كبير', /\b(Termin|Zeit|Hotel|Zimmer|Party|Kurs|Wochenende|Samstag|Sonntag|Montag|Freitag|Uhr|Haus|Arzt|Geburtstag|Information|E-Mail)\b/.test(t) || /\s[A-ZÄÖÜ][a-zäöüß]+/.test(t)]
    ];
    var n = checks.filter(function(c){ return c[1]; }).length;
    $('#lres').innerHTML = '<div class="checks">' + checks.map(function(c){ return '<div class="' + (c[1] ? 'ok' : 'no') + '">' + (c[1] ? '✅ ' : '⬜ ') + c[0] + '</div>'; }).join('') + '</div><p class="sub">تحقّق بنفسك أيضًا: هل ذكرت النقاط الثلاث المطلوبة؟ قارن رسالتك بالنموذج بالأعلى.</p>';
    if (n >= 4) addXP(10);
  };
}

/* ---------------- EXAM ---------------- */
var EXAM_PARTS = [{id:'listen',e:'🎧',c:'#FF6B2C',t:'الاستماع',de:'Hören',d:'3 أجزاء · 15 سؤالًا · 20 دقيقة'},{id:'read',e:'📰',c:'#3A86FF',t:'القراءة',de:'Lesen',d:'3 أجزاء · 15 سؤالًا · 25 دقيقة'},
  {id:'write',e:'✍️',c:'#19C79A',t:'الكتابة',de:'Schreiben',d:'استمارة ورسالة قصيرة · 20 دقيقة'},{id:'speak',e:'🗣️',c:'#FF3D7F',t:'المحادثة',de:'Sprechen',d:'3 أجزاء: تعريف، أسئلة، طلبات'}];
var ABCL = ['a', 'b', 'c'], ABCA = ['أ', 'ب', 'ج'];
var examTimer = null;
function stopExamTimer(){ if (examTimer){ clearInterval(examTimer); examTimer = null; } }
var EXM = 1;
function exCount(){ return 1 + ((SX.exams || []).length); }
function exData(n){ return n > 1 ? (SX.exams || [])[n - 2] : SX.exam; }
function exKey(part, n){ return n > 1 ? part + '#' + n : part; }
function viewExam(){
  if (!SX.exam) return go('#/');
  var n = Math.min(exCount(), Math.max(1, S.set.exm || 1)); EXM = n;
  var tabs = exCount() > 1 ? '<div class="extabs">' + Array.apply(null, Array(exCount())).map(function(_, k){ var m = k + 1, dn = EXAM_PARTS.filter(function(p){ return (S.exam[exKey(p.id, m)] || 0) >= 60; }).length;
    return '<button class="' + (m === n ? 'on' : '') + '" data-exm="' + m + '"><b>النموذج ' + m + '</b><span>' + (dn ? '✅ ' + dn + ' من 4' : 'لم يبدأ') + '</span></button>'; }).join('') + '</div>' : '';
  var html = '<div class="wrap"><div class="ph sm" style="--c:#8338EC"><a class="back" href="#/train">→ التدريب</a><span class="em phpic">' + uiPic('tile_train', '📝') + '</span><h1>تدريب على امتحان A1</h1><div class="g">Prüfungstraining A1</div><p>بنفس نظام الامتحان الرسمي: أربعة أجزاء، والأسئلة بالألمانية، والنتيجة في النهاية.</p></div>' +
    tabs + '<div class="tiles big">' + EXAM_PARTS.map(function(p){ var best = S.exam[exKey(p.id, n)]; return '<a class="tile" href="#/exam/' + p.id + '/' + n + '" style="--c:' + p.c + '"><span class="em">' + p.e + '</span><b>' + p.t + ' · <span class="de">' + p.de + '</span></b><span>' + (best != null ? 'أفضل نتيجة: ' + best + '٪' : p.d) + '</span></a>'; }).join('') + '</div>' +
    '<div class="tip tip" style="margin-top:14px"><b class="k">💡 كيف يعمل التدريب؟</b>لن ترى الإجابة الصحيحة أثناء الامتحان. اختر إجابتك وانتقل، ويمكنك الرجوع وتغييرها. في النهاية تظهر النتيجة ومراجعة كل سؤال مع الترجمة. النجاح من 60٪.</div>' + footer() + '</div>';
  render(html, 'train'); $$('[data-exm]').forEach(function(b){ b.onclick = function(){ S.set.exm = +b.dataset.exm; save(); viewExam(); }; });
}
function examDone(part, pct){
  var k = exKey(part, EXM); S.exam[k] = Math.max(S.exam[k] || 0, pct); S.exh = (S.exh || []); S.exh.unshift({d:today(), p:part, n:EXM, pct:pct}); S.exh = S.exh.slice(0, 30);
  skillAdd({listen:'listen', read:'read', write:'write', speak:'speak'}[part] || 'read', pct); save(); addXP(Math.round(pct / 5));
  if (pct >= 60) complete('e:' + part);
}
function scoreHead(part, ok, total){
  var pct = Math.round(ok / Math.max(1, total) * 100), pass = pct >= 60;
  examDone(part, pct);
  return '<div class="result exres"><div class="em">' + (pct >= 80 ? '🏆' : pass ? '🚀' : '🌱') + '</div><h2>' + pct + '٪</h2><div>' + ok + ' من ' + total + ' إجابة صحيحة</div>' +
    '<div class="verdict ' + (pass ? 'pass' : 'fail') + '">' + (pass ? '✅ ناجح · bestanden' : '❌ لم تنجح بعد · nicht bestanden') + '</div><p class="sub">النجاح من 60٪.' + (pass ? '' : ' راجع أخطاءك بالأسفل وحاول مرة أخرى.') + '</p>' +
    '<div class="row" style="justify-content:center;margin-top:8px"><button class="btn" data-retry="' + part + '">🔁 أعد الامتحان</button><a class="btn alt" href="#/exam" style="text-decoration:none">أجزاء أخرى</a></div></div>';
}
function timerToggle(){ return '<label class="tmr"><input type="checkbox" id="useTimer"' + (S.set.timer === false ? '' : ' checked') + '> ⏱️ امتحان بوقت محدد مثل الحقيقي</label>'; }
function startScreen(P, info, minutes, onStart){
  var stage = $('#stage');
  stage.innerHTML = '<div class="panel exstart"><div class="big">' + P.e + '</div><h2>' + P.t + ' · <span class="de">' + P.de + '</span></h2>' + info + (minutes ? timerToggle() : '') + '<button class="btn wide" id="exGo">ابدأ الامتحان</button></div>';
  $('#exGo').onclick = function(){ var t = $('#useTimer'); if (t){ S.set.timer = t.checked; save(); } onStart(minutes && (!t || t.checked) ? minutes : 0); };
}
function runTimer(minutes, onEnd){
  stopExamTimer(); var bar = $('#exTimer'); if (!minutes || !bar) return;
  var end = Date.now() + minutes * 60000;
  function tick(){ var b = $('#exTimer'); if (!b){ stopExamTimer(); return; } var left = Math.max(0, Math.round((end - Date.now()) / 1000));
    b.textContent = '⏱️ ' + Math.floor(left / 60) + ':' + ('0' + (left % 60)).slice(-2); b.classList.toggle('low', left <= 60);
    if (!left){ stopExamTimer(); toast('انتهى الوقت، تم تسليم الامتحان'); onEnd(); } }
  tick(); examTimer = setInterval(tick, 1000);
}
function flatItems(mod){ var out = []; mod.parts.forEach(function(p, pi){ p.items.forEach(function(it, ii){ out.push({p:p, pi:pi, ii:ii, it:it}); }); }); return out; }
function viewExamPart(part, n){
  EXM = Math.min(exCount(), Math.max(1, n || S.set.exm || 1)); if (S.set.exm !== EXM){ S.set.exm = EXM; save(); }
  var E = exData(EXM); if (!E) return go('#/');
  var P = EXAM_PARTS.find(function(p){ return p.id === part; }); if (!P) return go('#/exam');
  stopExamTimer(); useAudio(EXM > 1 ? 'exam' + EXM : 'exam');
  render('<div class="wrap exwrap"><div class="ph sm" style="--c:' + P.c + '"><a class="back" href="#/exam">→ التدريب على الامتحان</a><span class="em">' + P.e + '</span><h1>' + P.t + '</h1><div class="g">' + P.de + (exCount() > 1 ? ' · النموذج ' + EXM : '') + '</div><p>' + P.d + '</p></div>' + (part === 'listen' || part === 'speak' ? ctlBar('', true) : '') + '<div id="stage"></div>' + footer() + '</div>', 'train'); bindCtl();
  leaveHook = stopExamTimer;
  if (part === 'listen' || part === 'read') return objectiveExam(part, P, part === 'listen' ? E.listen : E.read);
  if (part === 'write') return writeExam(P, E.write);
  return speakExam(P, E.speak);
}
function objectiveExam(part, P, mod){
  var items = flatItems(mod), ans = items.map(function(){ return null; }), plays = items.map(function(){ return 0; }), cur = 0, stage = $('#stage');
  var info = '<p class="sub">' + mod.parts.length + ' أجزاء · ' + items.length + ' سؤالًا' + (part === 'listen' ? '. في بعض الأجزاء تسمع النص مرتين، وفي الجزء 2 مرة واحدة فقط، تمامًا مثل الامتحان.' : '. اقرأ كل نص جيدًا قبل أن تجيب.') + '</p>';
  startScreen(P, info, mod.minutes, function(minutes){
    stage.innerHTML = '<div class="exbar"><span id="exTimer" class="extimer"' + (minutes ? '' : ' hidden') + '></span><span id="exPos" class="expos"></span></div><div class="dots" id="exDots"></div><div id="exQ"></div>' +
      '<div class="row exnav"><button class="btn alt" id="exPrev">→ السابق</button><button class="btn" id="exNext">التالي ←</button></div><button class="btn wide flame" id="exSubmit">✔ تسليم الامتحان</button>';
    $('#exPrev').onclick = function(){ if (cur > 0){ cur--; show(); } };
    $('#exNext').onclick = function(){ if (cur < items.length - 1){ skipNote(); cur++; show(); } };
    $('#exSubmit').onclick = function(){ var miss = ans.filter(function(a){ return a == null; }).length;
      if (miss && !$('#exSubmit').dataset.sure){ $('#exSubmit').dataset.sure = 1; $('#exSubmit').textContent = '⚠️ بقي ' + miss + ' بلا إجابة. اضغط مرة أخرى للتسليم'; return; } finish(); };
    show(); runTimer(minutes, finish);
  });
  function dots(){ $('#exDots').innerHTML = items.map(function(x, i){ return '<button class="dot' + (i === cur ? ' cur' : '') + (ans[i] != null ? ' done' : '') + '" data-j="' + i + '" aria-label="سؤال ' + (i + 1) + '">' + (i + 1) + '</button>'; }).join('');
    $$('#exDots .dot').forEach(function(b){ b.onclick = function(){ var j = +b.dataset.j; if (j === cur) return; skipNote(); cur = j; show(); }; }); }
  function skipNote(){ if (ans[cur] == null) toast('⚠️ السؤال ' + (cur + 1) + ' بلا إجابة، يمكنك الرجوع إليه لاحقًا'); }
  function partHead(x){ return '<div class="exhead"><b>Teil ' + x.p.n + '</b><div class="de">' + esc(x.p.de) + '</div></div>'; }
  function show(){
    stopAudio();
    var x = items[cur], it = x.it, p = x.p, h = partHead(x);
    if (part === 'listen'){
      var left = p.plays - plays[cur];
      h += '<div class="qcard"><div class="q">Aufgabe ' + (cur + 1) + '</div>' +
        '<button class="play" id="exPlay" style="width:76px;height:76px;margin:6px auto"' + (left <= 0 ? ' disabled' : '') + '>' + ICON_PLAY + '</button><div class="q" id="exPl">' + (left <= 0 ? 'استمعت إلى النص' : left === 2 ? 'تسمع النص مرتين' : 'تسمع النص مرة واحدة فقط') + '</div>' +
        (p.kind === 'abc' ? '<div class="bigq de">' + esc(it.q) + '</div>' : '<div class="bigq de">' + esc(it.s) + '</div>') + '</div>';
    } else if (p.kind === 'rf' && p.texts){
      h += '<div class="panel rtexts">' + p.texts.map(function(t){ return '<div class="rt"><div class="rt-h">' + t.e + ' ' + esc(t.kind) + '</div>' + t.de.map(function(s){ return '<p>' + esc(s) + '</p>'; }).join('') + '</div>'; }).join('') + '</div>' +
        '<div class="qcard"><div class="q">Aufgabe ' + (cur + 1) + '</div><div class="bigq de">' + esc(it.s) + '</div></div>';
    } else if (p.kind === 'ab'){
      h += '<div class="qcard"><div class="q">Aufgabe ' + (cur + 1) + '</div><div class="bigq de">' + esc(it.s) + '</div></div>' +
        '<div class="ads">' + ['a', 'b'].map(function(k){ var ad = it[k]; return '<div class="ad"><span class="adk">' + k + '</span><b class="de">' + esc(ad.t) + '</b><div class="de">' + esc(ad.txt) + '</div></div>'; }).join('') + '</div>';
    } else {
      h += '<div class="sign">' + it.sign.map(function(s){ return '<div class="de">' + esc(s) + '</div>'; }).join('') + '</div>' +
        '<div class="qcard"><div class="q">Aufgabe ' + (cur + 1) + '</div><div class="bigq de">' + esc(it.s) + '</div></div>';
    }
    var opts = p.kind === 'abc' ? it.o.map(function(o, k){ return {v:k, l:'<span class="ok-k">' + ABCL[k] + '</span><span class="de">' + esc(o) + '</span>'}; })
             : p.kind === 'ab' ? [{v:'a', l:'<span class="ok-k">a</span><span class="de">' + esc(it.a.t) + '</span>'}, {v:'b', l:'<span class="ok-k">b</span><span class="de">' + esc(it.b.t) + '</span>'}]
             : [{v:true, l:'<span class="de">richtig</span>'}, {v:false, l:'<span class="de">falsch</span>'}];
    h += '<div class="opts exopts' + (p.kind === 'abc' ? '' : ' two') + '">' + opts.map(function(o, k){ return '<button class="opt pick' + (ans[cur] === o.v ? ' chosen' : '') + '" data-k="' + k + '">' + o.l + '</button>'; }).join('') + '</div>';
    $('#exQ').innerHTML = h; $('#exPos').textContent = 'سؤال ' + (cur + 1) + ' من ' + items.length; dots();
    $('#exPrev').disabled = cur === 0; $('#exNext').disabled = cur === items.length - 1;
    $$('#exQ .opt').forEach(function(b){ b.onclick = function(){ ans[cur] = opts[+b.dataset.k].v; $$('#exQ .opt').forEach(function(z){ z.classList.toggle('chosen', z === b); }); dots();
      if (part !== 'listen' && cur < items.length - 1){ var at = cur; setTimeout(function(){ if (cur === at && ans[cur] != null && cur < items.length - 1){ cur++; show(); } }, 350); } }; });
    var pb = $('#exPlay'); if (pb) pb.onclick = function(){ if (plays[cur] >= p.plays) return; plays[cur]++; var l2 = p.plays - plays[cur];
      $('#exPl').textContent = l2 > 0 ? 'يمكنك الاستماع مرة أخرى' : 'استمعت إلى النص'; if (l2 <= 0) pb.disabled = true;
      stopAudio(); var my = token, j = 0; (function n2(){ if (my !== token || j >= it.say.length) return; speak(it.say[j++], function(){ if (my === token) setTimeout(n2, 400); }); token = my; })(); };
  }
  function finish(){
    stopExamTimer(); stopAudio();
    var ok = 0, rows = '';
    var lastP = -1;
    items.forEach(function(x, i){ var it = x.it, p = x.p, right = p.kind === 'abc' ? it.a : p.kind === 'ab' ? it.ans : it.a, mine = ans[i], good = mine === right; if (good) ok++;
      if (x.pi !== lastP){ lastP = x.pi; rows += '<div class="gh">Teil ' + p.n + ' · <span style="font-weight:600">' + esc(p.ar) + '</span></div>'; }
      var lbl = function(v){ if (v == null) return 'بلا إجابة'; if (p.kind === 'abc') return ABCL[v] + ') <span class="de">' + esc(it.o[v]) + '</span> = ' + esc(it.oa[v]); if (p.kind === 'ab') return v + ') <span class="de">' + esc(it[v].t) + '</span>'; return v ? 'richtig (صحيح)' : 'falsch (خطأ)'; };
      rows += '<div class="rv ' + (good ? 'good' : 'bad') + '"><div class="rv-h"><span>' + (good ? '✅' : '❌') + ' سؤال ' + (i + 1) + '</span></div>' +
        '<div class="de rv-q">' + esc(p.kind === 'abc' ? it.q : it.s) + '</div><div class="rv-t">' + esc(p.kind === 'abc' ? it.qa : it.sa) + '</div>' +
        (good ? '<div class="rv-a">إجابتك: ' + lbl(mine) + '</div>' : '<div class="rv-a bad">إجابتك: ' + lbl(mine) + '</div><div class="rv-a goodc">الصحيح: ' + lbl(right) + '</div>') +
        (part === 'listen' ? '<details class="rv-x"><summary>النص المسموع والترجمة</summary>' + it.say.map(function(s){ return '<div class="de">' + esc(s) + '</div>'; }).join('') + '<div class="rv-t">' + esc(it.tr) + '</div><button class="chip" data-say="' + i + '">🔊 استمع مرة أخرى</button></details>' : '') +
        (p.kind === 'ab' ? '<details class="rv-x"><summary>ترجمة الإعلانين</summary><div>a) ' + esc(it.a.ta) + ': ' + esc(it.a.txta) + '</div><div>b) ' + esc(it.b.ta) + ': ' + esc(it.b.txta) + '</div></details>' : '') +
        (p.kind === 'rf' && it.signa ? '<details class="rv-x"><summary>ترجمة اللافتة</summary><div>' + esc(it.signa) + '</div></details>' : '') + '</div>';
    });
    var texts = '';
    if (part === 'read') mod.parts.forEach(function(p){ (p.texts || []).forEach(function(t){ texts += '<details class="rv-x"><summary>' + t.e + ' ترجمة النص: ' + esc(t.kind) + '</summary>' + t.ar.map(function(s){ return '<div>' + esc(s) + '</div>'; }).join('') + '</details>'; }); });
    stage.innerHTML = scoreHead(part, ok, items.length) + '<div class="sh"><h2>مراجعة الإجابات</h2></div>' + (texts ? '<div class="rv-texts">' + texts + '</div>' : '') + rows;
    $$('[data-say]').forEach(function(b){ b.onclick = function(){ var it = items[+b.dataset.say].it; stopAudio(); var my = token, j = 0; (function n2(){ if (my !== token || j >= it.say.length) return; speak(it.say[j++], function(){ if (my === token) setTimeout(n2, 400); }); token = my; })(); }; });
    scrollTo(0, 0);
  }
}
function writeExam(P, W){
  var stage = $('#stage'), f = W.form, t = W.task;
  startScreen(P, '<p class="sub">جزءان: تملأ استمارة من 5 معلومات، ثم تكتب رسالة قصيرة من حوالي 30 كلمة. التصحيح يظهر بعد التسليم.</p>', W.minutes, function(minutes){
    stage.innerHTML = '<div class="exbar"><span id="exTimer" class="extimer"' + (minutes ? '' : ' hidden') + '></span></div>' +
      '<div class="panel"><div class="exhead"><b>Teil 1</b><div class="de">' + esc(f.de) + '</div></div><div class="rt">' + f.text.map(function(s){ return '<p>' + esc(s) + '</p>'; }).join('') + '</div>' +
      '<div class="form">' + f.fields.map(function(x, k){ return '<label for="wf' + k + '" class="de">' + esc(x.de) + '</label><input class="inp de" id="wf' + k + '" data-f="' + k + '" autocomplete="off" autocapitalize="off" spellcheck="false">'; }).join('') + '</div></div>' +
      '<div class="panel"><div class="exhead"><b>Teil 2</b><div class="de">' + esc(t.de) + '</div></div><ul class="de">' + t.points.map(function(p){ return '<li>' + esc(p[0]) + '</li>'; }).join('') + '</ul>' +
      '<textarea class="inp de" id="wt" rows="7" placeholder="Lieber Marco, …"></textarea><div class="sub" id="wc">0 Wörter</div></div>' +
      '<button class="btn wide flame" id="wSubmit">✔ تسليم</button><div id="wres"></div>';
    $('#wt').oninput = function(){ var n = this.value.trim() ? this.value.trim().split(/\s+/).length : 0; $('#wc').textContent = n + ' Wörter'; };
    $('#wSubmit').onclick = function(){ if ($('#wt').value.trim().split(/\s+/).length < 8 && !this.dataset.sure){ this.dataset.sure = 1; this.textContent = '⚠️ الرسالة قصيرة جدًا. اضغط مرة أخرى للتسليم'; return; } submit(); };
    runTimer(minutes, submit);
  });
  function submit(){
    stopExamTimer(); var formOk = 0;
    var fr = f.fields.map(function(x, k){ var v = ($('#wf' + k) || {}).value || '', good = x.a.some(function(a){ return norm(a) === norm(v); }); if (good) formOk++;
      return '<div class="rv ' + (good ? 'good' : 'bad') + '"><div class="rv-h"><span>' + (good ? '✅' : '❌') + ' <span class="de">' + esc(x.de) + '</span> · ' + esc(x.ar) + '</span></div><div class="rv-a' + (good ? '' : ' bad') + '">إجابتك: <span class="de">' + esc(v || '—') + '</span></div>' + (good ? '' : '<div class="rv-a goodc">الصحيح: <span class="de">' + esc(x.a[0]) + '</span></div>') + '</div>'; }).join('');
    var mine = ($('#wt') || {}).value || '';
    $$('#stage input, #stage textarea').forEach(function(el){ el.disabled = true; }); var sb = $('#wSubmit'); if (sb) sb.remove();
    $('#wres').innerHTML = '<div class="sh"><h2>Teil 1 · الاستمارة: ' + formOk + ' من ' + f.fields.length + '</h2></div><details class="rv-x"><summary>ترجمة النص</summary>' + f.texta.map(function(s){ return '<div>' + esc(s) + '</div>'; }).join('') + '</details>' + fr +
      '<div class="sh"><h2>Teil 2 · الرسالة</h2></div><div class="panel"><div class="rv-t">المطلوب: ' + esc(t.ar) + '</div><ul>' + t.points.map(function(p){ return '<li><span class="de">' + esc(p[0]) + '</span> · ' + esc(p[1]) + '</li>'; }).join('') + '</ul>' +
      '<b>رسالتك:</b><div class="rt de mine">' + esc(mine || '—').replace(/\n/g, '<br>') + '</div><b>نموذج للإجابة:</b><div class="rt">' + t.model.map(function(s, k){ return '<p class="de">' + esc(s) + '</p><p class="rv-t">' + esc(t.modela[k]) + '</p>'; }).join('') + '</div>' +
      '<b>قيّم رسالتك بصدق مقارنة بالنموذج:</b><div class="selfc">' + t.check.map(function(c, k){ return '<label><input type="checkbox" data-c="' + k + '"> ' + esc(c) + '</label>'; }).join('') + '</div><button class="btn wide" id="wsc">احسب نتيجتي</button></div><div id="wfin"></div>';
    $('#wsc').onclick = function(){ var self = $$('[data-c]').filter(function(c){ return c.checked; }).length; this.remove(); $$('[data-c]').forEach(function(c){ c.disabled = true; });
      $('#wfin').innerHTML = scoreHead('write', formOk + self, f.fields.length + t.check.length); $('#wfin').scrollIntoView({block:'start', behavior:'smooth'}); };
  }
}
function speakExam(P, SP){
  var stage = $('#stage'), cards = [];
  SP.parts.forEach(function(p, pi){ p.cards.forEach(function(c){ cards.push(Object.assign({part:pi}, c)); }); });
  startScreen(P, '<p class="sub">ثلاثة أجزاء. انظر إلى البطاقة وقل جملتك بصوت عالٍ، ثم اعرض النموذج وقيّم نفسك بصدق.</p>', 0, function(){
    var ci = 0, ok = 0, res = [];
    (function nc(){
      if (ci >= cards.length){
        var rows = cards.map(function(c, i){ return '<div class="rv ' + (res[i] ? 'good' : 'bad') + '"><div class="rv-h"><span>' + (res[i] ? '✅' : '🔁') + ' <span class="de">' + esc(c.w) + '</span> · ' + esc(c.mn) + '</span></div>' + c.model.map(function(m){ return '<div class="de">' + esc(m.de) + '</div><div class="rv-t">' + esc(m.mn) + '</div>'; }).join('') + '</div>'; }).join('');
        stage.innerHTML = scoreHead('speak', ok, cards.length) + '<div class="sh"><h2>مراجعة البطاقات</h2></div>' + rows; scrollTo(0, 0); return; }
      var c = cards[ci], p = SP.parts[c.part]; ci++;
      stage.innerHTML = '<div class="exbar"><span class="expos">بطاقة ' + ci + ' من ' + cards.length + '</span></div><div class="exhead"><b>' + esc(p.t) + '</b><div class="de">' + esc(p.de) + '</div></div>' +
        '<div class="scard"><div class="em">' + (c.e || '💬') + '</div><div class="de big">' + esc(c.w) + '</div></div>' +
        '<p class="center sub">' + (SRec ? 'اضغط على الميكروفون وقل جملتك، والموقع يسمعك ويقارنها بالجواب الصحيح.' : 'قل جملتك بصوت عالٍ أولًا، ثم اضغط لترى النموذج.') + '</p>' +
        (SRec ? '<button class="mic" id="smic">' + ICON_MIC + '<span>اضغط وقل جملتك</span></button><div id="sfb"></div>' : '') +
        '<button class="btn wide alt" id="rev">👀 اعرض النموذج</button><div id="model"></div>';
      if (SRec) $('#smic').onclick = function(){ micCheck(this, c, function(r){ $('#sfb').innerHTML = r.html; if ($('#rev')) $('#rev').click(); var y = $('#sYes'), n = $('#sNo'); if (y && n){ (r.good ? y : n).classList.add('pulse'); } }); };
      $('#rev').onclick = function(){ this.remove();
        $('#model').innerHTML = '<div class="rv-t" style="margin-bottom:8px">' + esc(p.ta) + ' · ' + esc(c.mn) + '</div><div class="list">' + c.model.map(function(m, k){ return '<button class="it" data-m="' + k + '" style="--c:' + P.c + '"><span class="tx"><span class="d">' + esc(m.de) + '</span><span class="m">' + esc(m.mn) + '</span></span><span class="play sm">' + ICON_PLAY + '</span></button>'; }).join('') + '</div>' +
          '<div class="row" style="margin-top:12px"><button class="btn alt" id="sNo" style="flex:1">🔁 لم أعرفها</button><button class="btn" id="sYes" style="flex:1">✅ قلتها صحيحة</button></div>';
        $$('[data-m]').forEach(function(b){ b.onclick = function(){ play({de:c.model[+b.dataset.m].de, grp:'exam'}, b); }; });
        play({de:c.model[0].de, grp:'exam'}, $('[data-m="0"]'));
        $('#sYes').onclick = function(){ ok++; res.push(true); nc(); }; $('#sNo').onclick = function(){ res.push(false); nc(); }; };
    })();
  });
}

/* ---------------- speaking check (exam cards) ---------------- */
var SRec = window.SpeechRecognition || window.webkitSpeechRecognition, srec = null;
function wnorm(s){ return norm(String(s).replace(/\d+/g, function(d){ try{ return ' ' + numDe(+d) + ' '; }catch(e){ return d; } })); }
function wHit(w, arr){ return arr.some(function(x){ return x === w || (w.length > 3 && x.length > 3 && simil(x, w) >= .75); }); }

/* robust speech recognition (iPhone Safari delivers text late, or only after stop) */
var SR_ERR = {'not-allowed':'🔒 المايك مقفول للموقع. اسمح بيه من إعدادات المتصفح. ولو آيفون: فعّل «الإملاء» من الإعدادات ← عام ← لوحة المفاتيح.', 'service-not-allowed':'🔒 التعرّف على الكلام مقفول. على الآيفون: فعّل «الإملاء» من الإعدادات ← عام ← لوحة المفاتيح، وجرّب من Safari.', 'no-speech':'🎙️ ما وصلنيش صوت. اتكلم بعد ما الزرار يتلوّن، وقرّب الموبايل من بُقّك.', 'audio-capture':'🎙️ المايك مش شغال، أو فيه تطبيق تاني بيستخدمه دلوقتي.', 'network':'📶 التعرّف على الكلام محتاج نت. اتأكد إن النت شغال.', 'language-not-supported':'🌍 الألماني مش متاح في الإملاء عندك. ضيف لوحة مفاتيح ألماني من إعدادات الموبايل.', 'empty':'🎙️ سمعت صوت بس ما فهمتش كلام. اتكلم أوضح وجرّب تاني.'};
var srCur = null;
function srListen(onState, onDone){
  if (!SRec){ onDone(null, 'unsupported'); return null; }
  if (srCur){ try{ srCur.stop(); }catch(e){} return null; }
  stopAudio(); if (synth) try{ synth.cancel(); }catch(e){}
  var r = new SRec(), alts = [], err = '', done = false, tmr;
  r.lang = 'de-DE'; r.interimResults = true; r.continuous = false; r.maxAlternatives = 3;
  r.onresult = function(e){ var list = []; for (var i = 0; i < e.results.length; i++){ var res = e.results[i]; for (var k = 0; k < res.length; k++){ if (!list[k]) list[k] = ''; list[k] += (list[k] ? ' ' : '') + res[k].transcript; } } list = list.map(function(s){ return s.trim(); }).filter(Boolean); if (list.length) alts = list; };
  r.onerror = function(e){ if (e.error !== 'aborted') err = e.error || 'empty'; };
  r.onend = function(){ clearTimeout(tmr); if (done) return; done = true; srCur = null; onState(false); if (alts.length) onDone(alts, ''); else onDone(null, err || 'empty'); };
  srCur = r; onState(true);
  tmr = setTimeout(function(){ try{ r.stop(); }catch(e){} }, 9000);
  leaveHook = function(){ done = true; clearTimeout(tmr); try{ r.abort(); }catch(e){} srCur = null; };
  try{ r.start(); }catch(e){ done = true; srCur = null; onState(false); onDone(null, 'audio-capture'); }
  return r;
}
function srErrHTML(code){ return '<div class="pres-x">' + (SR_ERR[code] || (code === 'unsupported' ? '🌐 المتصفح ده مابيدعمش التعرّف على الكلام. جرّب Chrome أو Safari.' : SR_ERR.empty)) + '</div>'; }
function micCheck(btn, c, cb){
  var lbl = btn.querySelector('span');
  srListen(function(on){ btn.classList.toggle('live', on); if (lbl) lbl.textContent = on ? 'أستمع إليك… اضغط للإنهاء' : '🎙️ اضغط وقل جملتك'; }, function(alts, err){
    if (!alts){ cb({good:false, html:srErrHTML(err)}); return; }
    var said = alts[0], best = null; alts.forEach(function(s){ c.model.forEach(function(m){ var sc = simil(wnorm(s), wnorm(m.de)); if (!best || sc > best.sc){ best = {m:m, sc:sc}; said = s; } }); });
    var sw = wnorm(said).split(' ').filter(Boolean);
    var mw = best.m.de.split(/\s+/), hit = 0, colored = mw.map(function(w){ var n = wnorm(w); var ok = !n || n.split(' ').every(function(p){ return wHit(p, sw); }); if (ok) hit++; return '<span class="' + (ok ? 'wok' : 'wno') + '">' + esc(w) + '</span>'; }).join(' ');
    var key = wnorm(c.w).split(' ').filter(function(x){ return x.length > 2 && ['der','die','das'].indexOf(x) < 0; }), keyOk = !key.length || key.some(function(k){ return sw.some(function(x){ return x.indexOf(k.slice(0, 3)) === 0 || simil(x, k) >= .7; }); });
    var pct = Math.round(hit / mw.length * 100); if (!keyOk && pct >= 70) keyOk = true; var good = pct >= 75 && keyOk; skillAdd('speak', pct);
    cb({good:good, html:'<div class="sres ' + (good ? 'good' : 'mid') + '"><div class="sres-h">' + (good ? '✅ ممتاز! جملتك صحيحة تقريبًا' : pct >= 45 ? '👍 قريب! قارن جملتك بالنموذج' : '🔁 حاول مرة أخرى بعد الاستماع إلى النموذج') + '</div>' +
      '<div class="sres-r"><span>🗣️ سمعتُك تقول:</span><div class="de">' + esc(said) + '</div></div>' +
      '<div class="sres-r"><span>✔️ الجملة الأقرب (الأخضر قلته، والأحمر ناقص أو مختلف):</span><div class="de">' + colored + '</div></div>' +
      (keyOk ? '' : '<div class="sres-k">⚠️ لم تستخدم كلمة البطاقة: <b class="de">' + esc(c.w) + '</b></div>') + '</div>'}); });
}
/* ---------------- SPEAK (pronunciation) ---------------- */
function lev(a, b){ var m = [], i, j; for (i = 0; i <= b.length; i++) m[i] = [i]; for (j = 0; j <= a.length; j++) m[0][j] = j;
  for (i = 1; i <= b.length; i++) for (j = 1; j <= a.length; j++) m[i][j] = Math.min(m[i-1][j-1] + (b[i-1] === a[j-1] ? 0 : 1), m[i][j-1] + 1, m[i-1][j] + 1); return m[b.length][a.length]; }
function simil(a, b){ a = norm(a); b = norm(b); if (!a || !b) return 0; return 1 - lev(a, b) / Math.max(a.length, b.length); }
function viewSpeak(tid){
  tid = tid || 'greet';
  var Rec = window.SpeechRecognition || window.webkitSpeechRecognition;
  var pool = uniqBy(itemsOf(tid).filter(function(x){ return x.de.split(' ').length <= 4; }), function(x){ return x.de; });
  if (pool.length < 3) pool = uniqBy(itemsOf('greet'), function(x){ return x.de; });
  pool = shuffle(pool).slice(0, 10);
  var opts = [{id:'greet', t:'التحيات'}, {id:'abc', t:'الحروف'}, {id:'num', t:'الأرقام'}, {id:'colors', t:'الألوان'}, {id:'family', t:'العائلة'}, {id:'food', t:'الطعام'}, {id:'animals', t:'الحيوانات'}, {id:'a1', t:'دروس A1'}];
  var html = '<div class="wrap"><div class="ph" style="--c:#06A77D"><a class="back" href="#/train">→ التدريب</a><span class="em">🎤</span><h1>اختبر نطقك</h1><div class="g">Aussprache</div><p>استمع إلى الكلمة، ثم اضغط على الميكروفون وانطقها.</p></div>' +
    '<div class="pick">' + opts.map(function(o){ return '<a class="chip ' + (o.id === tid ? 'on' : '') + '" href="#/speak/' + o.id + '" style="text-decoration:none">' + o.t + '</a>'; }).join('') + '</div>' +
    (Rec ? '' : '<div class="tip trap"><b class="k">⚠️ تنبيه</b>متصفحك لا يدعم التعرّف على الصوت. جرّب Google Chrome على أندرويد، أو Safari بعد تفعيل «الإملاء» في إعدادات الآيفون. يمكنك الاستماع والتدرّب على أي حال.</div>') +
    ctlBar() + '<div id="stage"></div>' + footer() + '</div>';
  render(html, 'train'); bindCtl();
  pool.forEach(function(x){ useAudio(x.grp); });
  var i = 0, ok = 0, rec = null; var stage = $('#stage');
  leaveHook = function(){ if (rec){ try{ rec.abort(); }catch(e){} rec = null; } };
  function nx(){
    if (i >= pool.length){ stage.innerHTML = '<div class="result"><div class="em">' + (ok >= 7 ? '🏆' : ok >= 4 ? '🚀' : '🌱') + '</div><h2>' + ar(ok) + ' من ' + ar(pool.length) + '</h2><p class="sub">نطقت ' + plural(ok, 'كلمة واحدة', 'كلمتين', 'كلمات', 'كلمة') + ' بشكل صحيح.</p><button class="btn" id="again">🔁 كلمات جديدة</button></div>'; $('#again').onclick = function(){ viewSpeak(tid); }; return; }
    var q = pool[i], tries = 0; i++;
    stage.innerHTML = '<div class="gamebar"><div class="prog"><i style="width:' + ((i - 1) / pool.length * 100) + '%"></i></div><span class="hearts">' + ar(i) + '/' + ar(pool.length) + '</span></div>' +
      '<div class="qcard"><div class="em">' + (q.e || '🗣️') + '</div><div class="big">' + deHTML(q) + '</div><div class="pr arp">' + pron(q.ar || '') + '</div><div class="q">' + esc(q.mn) + '</div><button class="play sm" id="qp" style="margin:8px auto 0">' + ICON_PLAY + '</button></div>' +
      '<button class="mic" id="mic" ' + (Rec ? '' : 'disabled') + '>' + ICON_MIC + '<span>اضغط وانطق</span></button><div id="heard" class="center"></div>' +
      '<div class="row" style="margin-top:10px"><button class="btn alt" id="skip" style="flex:1">تخطَّ ←</button></div>';
    $('#qp').onclick = function(){ play(q); }; play(q);
    $('#skip').onclick = nx;
    if (!Rec) return;
    $('#mic').onclick = function(){
      var btn = this; if (rec){ try{ rec.stop(); }catch(e){} return; }
      stopAudio(); rec = new Rec(); rec.lang = 'de-DE'; rec.interimResults = false; rec.maxAlternatives = 5;
      btn.classList.add('live'); btn.querySelector('span').textContent = 'أستمع إليك…';
      var gotRes = false;
      rec.onresult = function(e){ gotRes = true; var alts = [], r = e.results[0]; for (var k = 0; k < r.length; k++) alts.push(r[k].transcript);
        var target = sayOf(q), noun = q.n || '', best = 0, bestT = alts[0] || '';
        alts.forEach(function(a){ var s = Math.max(simil(a, target), noun ? simil(a, noun) : 0); if (s > best){ best = s; bestT = a; } });
        tries++;
        if (best >= 0.75){ ok++; S.spoke = (S.spoke || 0) + 1; save(); addXP(5); $('#heard').innerHTML = '<div class="hres ok">✅ ممتاز! سمعت: <span class="de">' + esc(bestT) + '</span></div>'; setTimeout(nx, 1300); }
        else { var sw = wnorm(bestT).split(' ').filter(Boolean), tw = String(target).split(/\s+/);
          var col = tw.map(function(w){ var n = wnorm(w); var good = !n || n.split(' ').every(function(p){ return wHit(p, sw); }); return '<span class="' + (good ? 'wok' : 'wno') + '">' + esc(w) + '</span>'; }).join(' ');
          $('#heard').innerHTML = '<div class="hres no">🤔 سمعت: <span class="de">' + esc(bestT || '…') + '</span><div class="hcmp de">' + col + '</div><small>الأخضر نطقته صحيحًا، والأحمر يحتاج تدريبًا.</small><br>' + (tries >= 3 ? 'لا بأس، انتقل للكلمة التالية.' : 'استمع مرة أخرى وحاول.') + '</div>'; } };
      rec.onerror = function(e){ $('#heard').innerHTML = '<div class="hres no">' + (e.error === 'not-allowed' || e.error === 'service-not-allowed' ? 'اسمح للموقع باستخدام الميكروفون من إعدادات المتصفح.' : 'لم أسمع شيئًا، حاول مرة أخرى.') + '</div>'; };
      rec.onend = function(){ rec = null; btn.classList.remove('live'); btn.querySelector('span').textContent = 'اضغط وانطق'; if (!gotRes && !$('#heard').textContent) $('#heard').innerHTML = '<div class="hres no">لم أسمع شيئًا، حاول مرة أخرى.</div>'; };
      try{ rec.start(); }catch(err){ rec = null; btn.classList.remove('live'); }
    };
  }
  nx();
}

/* ---------------- SMART REVIEW (spaced repetition) ---------------- */
var SRS_INT = [1, 2, 4, 7, 14, 30];
function dayNo(d){ d = d || new Date(); return Math.round(new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime() / 864e5); }
function srsTouch(q, ok){ if (!q || !q.de) return; S.srs = S.srs || {}; var now = dayNo(), r = S.srs[q.de];
  if (!r) r = {b:0, it:{de:q.de, ar:q.ar, mn:q.mn, e:q.e, g:q.g, n:q.n, grp:q.grp, say:q.say}};
  if (ok){ if (!r.d || r.d <= now) r.b = Math.min(SRS_INT.length - 1, r.b + (r.d ? 1 : 0)); } else r.b = 0;
  r.d = now + SRS_INT[r.b]; S.srs[q.de] = r; }
function srsDue(){ var now = dayNo(), S2 = S.srs || {}; return Object.keys(S2).filter(function(k){ return S2[k].d <= now && S2[k].it && S2[k].it.mn; }); }
function viewReview(){
  var due = shuffle(srsDue()).slice(0, 15), items = due.map(function(k){ return S.srs[k].it; });
  items.forEach(function(it){ useAudio(it.grp); });
  var html = '<div class="wrap"><div class="ph sm" style="--c:#0EA5E9"><a class="back" href="#/train">→ التدريب</a><span class="em">🔁</span><h1>مراجعة اليوم</h1><div class="g">Wiederholung</div><p>كلمات تعلّمتها من قبل، تعود إليك في الوقت المناسب حتى تثبت في ذاكرتك.</p></div><div id="stage"></div>' + footer() + '</div>';
  render(html, 'train'); var stage = $('#stage');
  if (!items.length){ var all = Object.keys(S.srs || {}).length, next = Object.keys(S.srs || {}).map(function(k){ return S.srs[k].d; }).sort()[0];
    stage.innerHTML = '<div class="empty"><i>🌟</i>' + (all ? 'لا توجد مراجعة اليوم! أحسنت.<br>المراجعة القادمة بعد ' + plural(Math.max(1, (next || dayNo() + 1) - dayNo()), 'يوم واحد', 'يومين', 'أيام', 'يومًا') + '.' : 'العب أي لعبة أولًا، وستظهر هنا الكلمات التي تحتاج مراجعة في الوقت المناسب.') + '<br><br><a class="btn" href="#/play" style="text-decoration:none;display:inline-block">اذهب إلى الألعاب</a></div>'; return; }
  var pool = Object.keys(S.srs).map(function(k){ return S.srs[k].it.mn; }).concat(itemsOf('all').map(function(x){ return x.mn; })).filter(Boolean);
  var i = 0, ok = 0;
  (function q(){
    if (i >= items.length){ addXP(ok * 5 + 10); S.reviews = (S.reviews || 0) + 1; dayLog().r = 1; save(); confetti();
      stage.innerHTML = '<div class="result"><div class="em">' + (ok === items.length ? '🏆' : '🧠') + '</div><h2>' + ar(ok) + ' من ' + ar(items.length) + '</h2><p class="sub">الكلمات الصحيحة ستعود بعد مدة أطول، والخاطئة ستعود غدًا.</p><div class="xpgain">+' + ar(ok * 5 + 10) + ' نقطة ⚡</div><a class="btn" href="#/" style="text-decoration:none;display:inline-block;margin-top:10px">🏠 الرئيسية</a></div>'; return; }
    var it = items[i], opts = shuffle([it.mn].concat(shuffle(pool.filter(function(m){ return m !== it.mn; })).filter(function(m, n, a){ return a.indexOf(m) === n; }).slice(0, 3)));
    stage.innerHTML = '<div class="gamebar"><div class="prog"><i style="width:' + (i / items.length * 100) + '%"></i></div><span class="hearts">' + ar(i + 1) + '/' + ar(items.length) + '</span></div>' +
      '<div class="qcard"><div class="big">' + deHTML(it) + '</div><button class="play sm" id="rp" style="margin:8px auto 0">' + ICON_PLAY + '</button><div class="q">ما معناها؟</div></div><div class="opts">' + opts.map(function(o, n){ return '<button class="opt" data-o="' + n + '">' + esc(o) + '</button>'; }).join('') + '</div>';
    $('#rp').onclick = function(){ play(it); }; play(it);
    $$('[data-o]', stage).forEach(function(b){ b.onclick = function(){ var good = opts[+b.dataset.o] === it.mn; $$('[data-o]', stage).forEach(function(x){ x.disabled = true; if (opts[+x.dataset.o] === it.mn) x.classList.add('ok'); });
      if (good){ ok++; fixMistake(it); } else { b.classList.add('no'); addMistake(it); } srsTouch(it, good); save(); fx(good); setTimeout(function(){ i++; q(); }, good ? 700 : 1300); }; });
  })();
}
/* ---------------- WEEKLY CHALLENGE ---------------- */
var WEEK_GOAL = 300;
function weekStart(){ var d = new Date(); d.setHours(0, 0, 0, 0); var dow = (d.getDay() + 1) % 7; d.setDate(d.getDate() - dow); return d; } /* week starts on Saturday */
function weekXP(){ var d = weekStart(), t = 0; for (var k = 0; k < 7; k++){ var x = new Date(d); x.setDate(d.getDate() + k); t += S.days[dkey(x)] || 0; } return t; }
function weekHTML(){ var x = weekXP(), pct = Math.min(100, Math.round(x / WEEK_GOAL * 100)), wk = dkey(weekStart()), done = x >= WEEK_GOAL;
  if (done && !(S.wk && S.wk[wk])){ S.wk = S.wk || {}; S.wk[wk] = 1; save(); setTimeout(function(){ toast('🏆 أنجزت تحدّي الأسبوع!'); confetti(); checkBadges(); }, 600); }
  var left = 6 - ((new Date().getDay() + 1) % 7);
  return '<div class="wkc' + (done ? ' done' : '') + '"><div class="wkc-t"><b>' + (done ? '🏆 أنجزت تحدّي الأسبوع!' : '🏆 تحدّي الأسبوع') + '</b><span>' + ar(Math.min(x, WEEK_GOAL)) + ' / ' + ar(WEEK_GOAL) + ' نقطة</span></div><div class="prog"><i style="width:' + pct + '%"></i></div><small>' + (done ? 'رائع! تحدٍّ جديد يبدأ يوم السبت.' : 'اجمع ' + ar(WEEK_GOAL) + ' نقطة هذا الأسبوع · ' + (left ? 'باقي ' + plural(left, 'يوم واحد', 'يومان', 'أيام', 'يومًا') : 'اليوم آخر يوم') ) + '</small></div>'; }
/* ---------------- MISTAKES ---------------- */
function addMistake(q){ if (!q || !q.de) return; var k = q.de, m = S.mist[k] || {n:0, it:{de:q.de, ar:q.ar, mn:q.mn, e:q.e, g:q.g, n:q.n, grp:q.grp, say:q.say}}; m.n = Math.min(3, m.n + 1); m.t = today(); S.mist[k] = m; save(); }
function fixMistake(q){ var m = q && S.mist[q.de]; if (!m) return; m.n--; if (m.n <= 0){ delete S.mist[q.de]; S.fixed = (S.fixed || 0) + 1; } save(); }
function viewMistakes(){
  var keys = Object.keys(S.mist), list = keys.map(function(k){ return S.mist[k].it; });
  var html = '<div class="wrap"><div class="ph" style="--c:#E63946"><a class="back" href="#/train">→ التدريب</a><span class="em">🩹</span><h1>كرّاسة أخطائي</h1><div class="g">Meine Fehler</div><p>كل كلمة تخطئ فيها تُحفظ هنا، وتختفي عندما تجيبها صحيحة مرة أو اثنتين.</p></div>' +
    (keys.length ? '<div class="sh"><h2>' + plural(keys.length, 'كلمة واحدة', 'كلمتان', 'كلمات', 'كلمة') + '</h2><span class="cnt">صحّحت ' + ar(S.fixed || 0) + '</span></div><div class="list">' + list.map(function(it, i){ return itemRow(it, i, '#E63946'); }).join('') + '</div>'
      : '<div class="empty"><i>🌟</i>لا توجد أخطاء الآن! العب أي لعبة، وأي كلمة تخطئ فيها ستظهر هنا للمراجعة.<br><br><a class="btn" href="#/play" style="text-decoration:none;display:inline-block">اذهب إلى الألعاب</a></div>') + footer() + '</div>';
  render(html, 'train'); bindItems(list);
}

/* ---------------- JOURNEY ---------------- */
function viewJourney(){
  var si = stationIdx(), n = doneCount(), T = UNITS.length, nx = STATIONS[si + 1];
  var need = nx ? stNeed(si + 1) - n : 0, a = stNeed(si), b = nx ? stNeed(si + 1) : T, frac = nx ? (n - a) / Math.max(1, b - a) : 1;
  var rows = STATIONS.map(function(s, i){ var reached = i <= si;
    return '<div class="jst ' + (reached ? 'got' : '') + (i === si ? ' cur' : '') + '" style="--i:' + i + '"><div class="jp jpic">' + uiPic('st' + i, s.e) + '</div><div class="jt"><b>' + s.a + '</b><small>' + (i === 0 ? 'نقطة البداية' : ar(stNeed(i)) + ' وحدة') + '</small></div>' + (i === si ? '<div class="jr" style="--f:' + frac.toFixed(2) + '">🚀</div>' : '') + '</div>'; }).reverse().join('');
  var o = pathOrder().filter(function(id){ return !S.done[id]; }).slice(0, 4).map(function(id){ return UMAP[id]; });
  var html = '<div class="wrap"><div class="ph space" style="--c:#2B1F86"><a class="back" href="#/">→ الرئيسية</a><span class="em phpic">' + uiPic('tile_journey', '🚀') + '</span><h1>رحلتك الفضائية</h1><div class="g">Deine Weltraumreise</div><p>كل درس تكمله يقرّب صاروخك من المحطة التالية.</p></div>' +
    '<div class="jsum"><div><b>' + ar(n) + '</b><span>وحدة مكتملة</span></div><div><b>' + ar(T) + '</b><span>وحدة في الرحلة</span></div><div><b>' + STATIONS[si].e + '</b><span>' + STATIONS[si].a + '</span></div></div>' +
    (nx ? '<div class="panel center"><b>تبقّى ' + plural(need, 'وحدة واحدة', 'وحدتان', 'وحدات', 'وحدة') + ' للوصول إلى ' + nx.e + ' ' + nx.a + '</b><div class="prog" style="margin-top:10px"><i style="width:' + Math.round(frac * 100) + '%"></i></div></div>' : '<div class="panel center"><b>🎉 أكملت الرحلة كلها! أنت بطل المجرة.</b></div>') +
    '<div class="journey">' + rows + '</div>' +
    '<button class="btn wide flame" id="shareJ">📸 شارك إنجازك</button>' +
    (o.length ? '<div class="sh"><h2>المحطات القادمة في طريقك</h2></div><div class="list">' + o.map(function(u){ return '<a class="it lesson" href="' + u.href + '" style="--c:' + u.color + '"><span class="em">' + u.e + '</span><div class="tx"><b>' + esc(u.title) + '</b><div class="prog thin"><i style="width:' + unitPct(u.id) + '%"></i></div></div><span class="st">‹</span></a>'; }).join('') + '</div>' : '') + footer() + '</div>';
  render(html, 'me');
  $('#shareJ').onclick = shareBadge;
  checkStation();
}
function shareBadge(){
  var name = S.name;
  if (!name){
    var m0 = modal('<div class="big">🧑‍🚀</div><h3>ما اسمك؟</h3><p>سيظهر على صورة إنجازك.</p><input class="inp de" id="bn" placeholder="Your name"><button class="btn wide" id="bgo" style="margin-top:10px">اصنع الصورة</button>');
    $('#bgo', m0).onclick = function(){ var v = $('#bn', m0).value.trim(); if (!v) return toast('اكتب اسمك أولًا'); S.name = v; save(); m0.remove(); shareBadge(); }; return;
  }
  var st = station(), c = document.createElement('canvas'); c.width = 1080; c.height = 1350; var x = c.getContext('2d');
  var g = x.createLinearGradient(0, 0, 0, 1350); g.addColorStop(0, '#2B1F86'); g.addColorStop(.55, '#14103A'); g.addColorStop(1, '#0B0820'); x.fillStyle = g; x.fillRect(0, 0, 1080, 1350);
  for (var i = 0; i < 180; i++){ x.fillStyle = 'rgba(255,255,255,' + (Math.random() * .8 + .2) + ')'; x.beginPath(); x.arc(Math.random()*1080, Math.random()*1350, Math.random()*2 + .3, 0, 7); x.fill(); }
  var pg = x.createRadialGradient(860, 1180, 20, 860, 1230, 360); pg.addColorStop(0, '#FFC53D'); pg.addColorStop(.6, '#FF6B2C'); pg.addColorStop(1, '#9A2E0A'); x.fillStyle = pg; x.beginPath(); x.arc(900, 1300, 330, 0, 7); x.fill();
  x.textAlign = 'center'; x.fillStyle = '#FFC53D'; x.font = '700 54px Outfit, sans-serif'; x.fillText('Sprachrakete', 540, 130);
  x.font = '230px system-ui'; x.fillText(st.e, 540, 450);
  x.direction = 'rtl'; x.fillStyle = '#fff'; x.font = '800 76px system-ui, sans-serif'; x.fillText('وصلتُ إلى ' + st.a + '!', 540, 600);
  x.fillStyle = '#D8D3FF'; x.font = '400 40px system-ui, sans-serif'; x.fillText('في رحلة تعلّم اللغة الألمانية', 540, 670);
  x.direction = 'ltr'; x.fillStyle = '#fff'; x.font = '700 84px Outfit, sans-serif'; x.fillText(S.name, 540, 800);
  x.fillStyle = '#FFC53D'; x.fillRect(340, 830, 400, 5);
  x.direction = 'rtl'; x.fillStyle = '#fff'; x.font = '600 42px system-ui, sans-serif';
  x.fillText('✅ ' + ar(doneCount()) + ' وحدة   ⚡ ' + ar(S.xp) + ' نقطة   🔥 ' + ar(streakNow()) + ' يوم', 540, 930);
  x.font = '160px system-ui'; x.fillText('🚀', 250, 1180);
  x.direction = 'ltr'; x.fillStyle = '#FFC53D'; x.font = '700 44px Outfit, sans-serif'; x.fillText('mohnned7.github.io', 540, 1290);
  c.toBlob(function(blob){
    var url = URL.createObjectURL(blob), file = null; try{ file = new File([blob], 'Sprachrakete.png', {type:'image/png'}); }catch(e){}
    var m = modal('<h3>📸 صورة إنجازك</h3><img src="' + url + '" alt="صورة الإنجاز" style="width:100%;border-radius:16px;margin:6px 0 12px"><button class="btn wide flame" id="doShare">مشاركة</button><a class="btn alt wide" style="display:block;text-decoration:none;margin-top:8px" download="Sprachrakete.png" href="' + url + '">⬇️ حفظ الصورة</a><p style="margin-top:8px;font-size:12.5px">على الآيفون: اضغط على الصورة ضغطة طويلة ثم «حفظ الصورة».</p>');
    var sb = $('#doShare', m);
    if (file && navigator.canShare && navigator.canShare({files:[file]})) sb.onclick = function(){ navigator.share({files:[file], text:'وصلتُ إلى ' + st.a + ' في رحلة تعلّم الألمانية 🚀 جرّب أنت: https://mohnned7.github.io'}).catch(function(){}); };
    else if (navigator.share) sb.onclick = function(){ navigator.share({title:'Sprachrakete', text:'وصلتُ إلى ' + st.a + ' في رحلة تعلّم الألمانية 🚀', url:'https://mohnned7.github.io'}).catch(function(){}); };
    else sb.remove();
  }, 'image/png');
}

/* ---------------- GAMES ---------------- */
var GAMES = [
  {id:'meaning',e:'🎯',c:'#5B3DF5',t:'المعنى الصحيح',d:'كلمة ألمانية و4 اختيارات'},
  {id:'listen',e:'🎧',c:'#FF6B2C',t:'استمع واختر',d:'تسمع الكلمة وتختارها'},
  {id:'match',e:'🔗',c:'#19C79A',t:'صِل',d:'صِل الكلمة بمعناها'},
  {id:'artikel',e:'🎨',c:'#FF3D7F',t:'der · die · das',d:'اختر الأداة بالألوان'},
  {id:'type',e:'⌨️',c:'#3A86FF',t:'اكتبها',d:'اكتب الكلمة بالألمانية'},
  {id:'order',e:'🧩',c:'#C9971C',t:'رتّب الجملة',d:'رتّب الكلمات بشكل صحيح'},
  {id:'memory',e:'🃏',c:'#8338EC',t:'لعبة الذاكرة',d:'اقلب البطاقات وجِد الأزواج'},
  {id:'speed',e:'⏱️',c:'#E63946',t:'تحدّي السرعة',d:'أكبر عدد في 60 ثانية'},
  {id:'cards',e:'🧠',c:'#06A77D',t:'بطاقات الحفظ',d:'تُعيد لك ما نسيته'},
  {id:'rain',e:'☄️',c:'#2B1F86',t:'مطر الكلمات',d:'التقط الكلمة الصحيحة قبل أن تسقط'}
];
var SCENES = [
 {id:'market', ds:'اسأل عن الحليب، املأ السلة، وادفع', t:'في السوبرماركت', de:'Im Supermarkt', c:'#19C79A', pic:'jobs/Verkäufer', e:'🛒', npc:'🧑‍💼', npcPic:'jobs/Verkäufer', grp:'food', steps:[
  {t:'say', de:'Guten Tag! Kann ich Ihnen helfen?', mn:'مرحبًا! هل يمكنني مساعدتك؟', opts:[['Ja, wo ist die Milch, bitte?','نعم، أين الحليب من فضلك؟',1],['Ich heiße Milch.','اسمي حليب.'],['Nein, ich bin müde.','لا، أنا متعب.']]},
  {t:'ask', de:'Die Milch ist da hinten, neben dem Käse.', mn:'الحليب هناك في الخلف، بجانب الجبن.', q:'أين الحليب؟', opts:[['بجانب الجبن',1],['بجانب الخبز'],['عند الباب']]},
  {t:'pick', task:'Milch, Brot und einen Apfel, bitte.', need:['Milch','Brot','Apfel'], shelf:['Käse','Milch','Banane','Brot','Tomate','Apfel','Ei','Saft'], topic:'food'},
  {t:'say', de:'Brauchen Sie eine Tüte?', mn:'هل تحتاج إلى كيس؟', opts:[['Ja, bitte.','نعم، من فضلك.',1],['Ich komme aus Ägypten.','أنا من مصر.'],['Guten Appetit!','بالهناء والشفاء!']]},
  {t:'pay', de:'Das macht sieben Euro fünfzig.', mn:'الحساب سبعة يورو وخمسون سنتًا.', amount:7.5},
  {t:'say', de:'Danke! Schönen Tag noch!', mn:'شكرًا! يومًا سعيدًا!', opts:[['Danke, gleichfalls!','شكرًا، ولك أيضًا!',1],['Gute Nacht, Mama!','تصبحين على خير يا أمي!'],['Ich habe Hunger.','أنا جائع.']]}
 ]},
 {id:'cafe', ds:'اطلب قهوة وكعكة وادفع الحساب', t:'في المقهى', de:'Im Café', c:'#C9971C', pic:'ui/scene_cafe', e:'☕', npc:'🧑‍🍳', grp:'food', steps:[
  {t:'say', de:'Hallo! Was möchten Sie trinken?', mn:'مرحبًا! ماذا تحب أن تشرب؟', opts:[['Einen Kaffee, bitte.','قهوة من فضلك.',1],['Ich trinke ein Brot.','أنا أشرب خبزًا.'],['Ich wohne in Kairo.','أسكن في القاهرة.']]},
  {t:'say', de:'Mit Milch und Zucker?', mn:'بالحليب والسكر؟', opts:[['Mit Milch, ohne Zucker.','بالحليب، بدون سكر.',1],['Ja, ich bin Student.','نعم، أنا طالب.'],['Um acht Uhr.','في الساعة الثامنة.']]},
  {t:'say', de:'Möchten Sie auch etwas essen?', mn:'هل تحب أن تأكل شيئًا أيضًا؟', opts:[['Ja, ein Stück Kuchen, bitte.','نعم، قطعة كعك من فضلك.',1],['Nein, ich spiele Fußball.','لا، ألعب كرة القدم.'],['Das ist mein Bruder.','هذا أخي.']]},
  {t:'ask', de:'Ein Kaffee und ein Kuchen. Das macht sechs Euro.', mn:'قهوة وكعكة. الحساب ستة يورو.', q:'كم الحساب؟', opts:[['6 يورو',1],['16 يورو'],['60 يورو']]},
  {t:'pay', de:'Sechs Euro, bitte.', mn:'ستة يورو من فضلك.', amount:6},
  {t:'say', de:'Vielen Dank! Auf Wiedersehen!', mn:'شكرًا جزيلًا! إلى اللقاء!', opts:[['Tschüss, bis bald!','مع السلامة، إلى اللقاء قريبًا!',1],['Guten Morgen!','صباح الخير!'],['Ich bin krank.','أنا مريض.']]}
 ]},
 {id:'station', ds:'اشترِ تذكرة وافهم إعلانات المحطة', t:'في محطة القطار', de:'Am Bahnhof', c:'#3A86FF', pic:'travel/Bahnhof', e:'🚆', npc:'👩‍💼', grp:'travel', steps:[
  {t:'say', de:'Guten Tag! Wohin möchten Sie fahren?', mn:'مرحبًا! إلى أين تريد أن تسافر؟', opts:[['Nach Berlin, bitte.','إلى برلين من فضلك.',1],['Ich fahre gern Rad.','أحب ركوب الدراجة.'],['Ich bin zwanzig Jahre alt.','عمري عشرون عامًا.']]},
  {t:'say', de:'Einfach oder hin und zurück?', mn:'ذهاب فقط أم ذهاب وعودة؟', opts:[['Hin und zurück, bitte.','ذهاب وعودة من فضلك.',1],['Einen Tee, bitte.','شايًا من فضلك.'],['Ich gehe ins Bett.','أذهب إلى السرير.']]},
  {t:'ask', de:'Das kostet neunundvierzig Euro.', mn:'هذا يكلف تسعة وأربعين يورو.', q:'كم سعر التذكرة؟', opts:[['49 يورو',1],['94 يورو'],['19 يورو']]},
  {t:'pay', de:'Neunundvierzig Euro, bitte.', mn:'تسعة وأربعون يورو من فضلك.', amount:49},
  {t:'ask', de:'Der Zug nach Berlin fährt um zehn Uhr fünfzehn von Gleis drei.', mn:'القطار إلى برلين يغادر الساعة العاشرة والربع من الرصيف 3.', q:'من أي رصيف يغادر القطار؟', opts:[['الرصيف 3',1],['الرصيف 10'],['الرصيف 15']], ann:1},
  {t:'ask', de:'Achtung! Der Zug nach Berlin hat zehn Minuten Verspätung.', mn:'انتباه! القطار إلى برلين متأخر عشر دقائق.', q:'ماذا حدث للقطار؟', opts:[['متأخر 10 دقائق',1],['أُلغي'],['يغادر من الرصيف 10']], ann:1}
 ]},
 {id:'doctor', ds:'قل للطبيب ما يؤلمك وافهم العلاج', t:'عند الطبيب', de:'Beim Arzt', c:'#E63946', pic:'jobs/Arzt', e:'🏥', npc:'👨‍⚕️', npcPic:'jobs/Arzt', grp:'body', steps:[
  {t:'say', de:'Guten Tag! Haben Sie einen Termin?', mn:'مرحبًا! هل لديك موعد؟', opts:[['Ja, um neun Uhr.','نعم، في الساعة التاسعة.',1],['Ja, ich habe Hunger.','نعم، أنا جائع.'],['Nein, ich habe einen Hund.','لا، عندي كلب.']]},
  {t:'body', de:'Was fehlt Ihnen? Wo tut es weh?', mn:'مِمَّ تشكو؟ أين يؤلمك؟', task:'Mein Bauch tut weh.', need:'Bauch', choices:['Kopf','Hand','Bauch','Fuß','Rücken','Auge'], topic:'body', say:'Mein Bauch tut weh.'},
  {t:'say', de:'Seit wann haben Sie die Schmerzen?', mn:'منذ متى لديك هذه الآلام؟', opts:[['Seit zwei Tagen.','منذ يومين.',1],['Mit dem Bus.','بالحافلة.'],['Mein Name ist Mohannad.','اسمي مهند.']]},
  {t:'say', de:'Haben Sie auch Fieber?', mn:'هل لديك حمّى أيضًا؟', opts:[['Ja, ein bisschen.','نعم، قليلًا.',1],['Ja, ich habe einen Bruder.','نعم، عندي أخ.'],['Nein, ich bin Lehrer.','لا، أنا معلم.']]},
  {t:'ask', de:'Nehmen Sie die Tabletten dreimal am Tag.', mn:'تناول الأقراص ثلاث مرات في اليوم.', q:'كم مرة يتناول الدواء؟', opts:[['3 مرات في اليوم',1],['مرة واحدة في اليوم'],['كل ساعتين']]},
  {t:'say', de:'Gute Besserung!', mn:'سلامتك!', opts:[['Danke schön! Auf Wiedersehen.','شكرًا جزيلًا! إلى اللقاء.',1],['Guten Appetit!','بالهناء والشفاء!'],['Herzlichen Glückwunsch!','مبارك!']]}
 ]}
];

function scStars(id){ return (S.scenes && S.scenes[id]) || 0; }
function scPic(key, e){ var u = picUrl(key); return '<span class="pic" data-n="' + key + '">' + (u ? '<img src="' + u + '" alt="" decoding="async">' : '<span class="pe">' + (e || '🔹') + '</span>') + '</span>'; }
function scenesHTML(){ loadPics('food'); loadPics('travel'); loadPics('jobs'); return '<div class="sh"><h2>🎬 ألعاب المواقف</h2><span class="cnt">مواقف من الحياة</span></div><div class="scgrid">' + SCENES.map(function(sc, k){ var st = scStars(sc.id);
  return '<a class="sccard2' + (st ? '' : ' fresh') + '" href="#/scene/' + sc.id + '" style="--c:' + sc.c + '"><span class="scbg">' + scPic(sc.pic, sc.e) + '</span><span class="sctag">🎬 الموقف ' + ar(k + 1) + ' · ❤️ 3</span><span class="scplay">▶</span><span class="scbody"><b>' + sc.t + '</b><small>' + sc.ds + '</small><span class="scs">' + (st ? '<i>' + '★'.repeat(st) + '</i>' + '★'.repeat(3 - st) : '✨ جديد') + '</span></span></a>'; }).join('') + '</div>'; }
function viewScene(id){
  var sc = SCENES.find(function(x){ return x.id === id; }); if (!sc) return go('#/play');
  useAudio('scenes'); useAudio(sc.grp); useAudio('situations'); loadPics(sc.grp === 'body' ? 'body' : 'food'); loadPics('travel'); loadPics('jobs');
  var i = 0, hearts = 3, mistakes = 0, okc = 0, busy = false, lastNpc = null, Q = sc.steps.map(function(s, k){ return k; }), retry = [], inReview = false;
  function reveal(){ var t = lastNpc && lastNpc.querySelector('.tr'); if (t && t.hidden){ t.hidden = false; t.classList.add('trin'); } }
  render('<div class="wrap"><div class="ph sm" style="--c:' + sc.c + '"><a class="back" href="#/play">→ الألعاب</a><span class="em phpic">' + scPic(sc.pic, sc.e) + '</span><h1>' + sc.t + '</h1><div class="g">' + sc.de + '</div></div><div id="scbar"></div><div class="chat" id="chat"></div><div id="act"></div></div>', 'play');
  var chat = $('#chat'), act = $('#act');
  function barH(){ $('#scbar').innerHTML = '<div class="gamebar"><div class="prog' + (inReview ? ' rev' : '') + '"><i style="width:' + (i / Q.length * 100) + '%"></i></div><span class="hrt">' + '❤️'.repeat(hearts) + '<i>' + '🤍'.repeat(3 - hearts) + '</i></span></div>'; }
  function bubble(who, de, mn, ann){ var k = chat.children.length;
    chat.insertAdjacentHTML('beforeend', '<div class="bub2 ' + who + (ann ? ' ann' : '') + '"><span class="av">' + (who === 'me' ? '🙋' : ann ? '📢' : sc.npcPic ? scPic(sc.npcPic, sc.npc) : sc.npc) + '</span><div class="bx"><div class="d de">' + esc(de) + '</div>' + (mn ? '<div class="tr"' + (who === 'me' ? '' : ' hidden') + '>' + esc(mn) + '</div>' : '') + '</div>' + (who === 'npc' ? '<button class="rp" aria-label="استمع">' + ICON_PLAY + '</button>' : '') + '</div>');
    var el = chat.lastElementChild; if (who !== 'me') lastNpc = el;
    var rp = el.querySelector('.rp'); if (rp) rp.onclick = function(){ speak(de); };
    el.scrollIntoView({block:'end', behavior:'smooth'}); return el; }
  function wrong(btn){ mistakes++; hearts--; fx(false); if (btn){ btn.classList.add('no'); } barH(); if (hearts <= 0){ busy = true; setTimeout(fail, 900); return true; } return false; }
  function right(btn){ okc++; fx(true); xpFloat(10); if (btn) btn.classList.add('ok'); reveal(); }
  function nextStep(){ i++; busy = false;
    if (i >= Q.length){ if (!inReview && retry.length){ inReview = true; Q = retry.slice(); i = 0; barH();
        chat.insertAdjacentHTML('beforeend', '<div class="screv">🔁 قبل ما نخلص: راجع ' + plural(Q.length, 'السؤال اللي غلطت فيه', 'السؤالين اللي غلطت فيهم', 'الأسئلة اللي غلطت فيها', 'سؤالًا غلطت فيه') + '</div>'); setTimeout(step, 900); return; }
      barH(); return setTimeout(win, 500); }
    barH(); setTimeout(step, 450); }
  function showRight(b, good, note, onGo){ busy = true; $$('[data-o],[data-b]', act).forEach(function(x){ x.disabled = true; }); if (b) b.classList.add('no'); if (good) good.classList.add('ok');
    if (!inReview){ retry.push(Q[i]); if (wrong(null)) return; } else fx(false);
    act.insertAdjacentHTML('beforeend', '<div class="scfix"><div class="scfix-h">❌ دي مش الإجابة الصح</div><div>' + note + '</div><button class="btn wide" id="scGo">فهمت، تابع ›</button></div>');
    var g = $('#scGo', act); g.scrollIntoView({block:'center', behavior:'smooth'}); g.onclick = function(){ g.disabled = true; onGo(); }; }
  function step(){
    var st = sc.steps[Q[i]]; act.innerHTML = ''; setTimeout(function(){ if (act.firstChild) act.scrollIntoView({block:'end', behavior:'smooth'}); }, 380);
    if (st.t === 'say' || st.t === 'ask'){
      bubble('npc', st.de, st.mn, st.ann); speak(st.de);
      var opts = shuffle(st.opts.slice(), Math.random);
      act.innerHTML = (st.q ? '<div class="scq">' + esc(st.q) + '</div>' : '<div class="scq">ماذا تقول؟' + (st.t === 'say' && SRec ? ' <button class="scmic" id="scMic"><small>🎤 رُدّ بصوتك</small></button>' : '') + '</div><div id="scMr"></div>') + '<div class="opts">' + opts.map(function(o, k){ return '<button class="opt' + (st.t === 'say' ? ' de' : '') + '" data-o="' + k + '">' + esc(o[0]) + '</button>'; }).join('') + '</div>';
      var scm = $('#scMic', act); if (scm) scm.onclick = function(){ var good = opts.find(function(o){ return o[2]; }); micListen(scm, good[0], function(r, e){ if (!r){ $('#scMr').innerHTML = srErrHTML(e); return; }
          var best = opts.map(function(o, k){ return {k:k, sc:simil(wnorm(r.said), wnorm(o[0]))}; }).sort(function(x, y){ return y.sc - x.sc; })[0];
          if (opts[best.k][2] && best.sc >= .5){ $('#scMr').innerHTML = ''; var bt = $('[data-o="' + best.k + '"]', act); if (bt) bt.click(); }
          else $('#scMr').innerHTML = '<div class="pres-x">' + (best.sc >= .5 ? '🤔 ده مش الرد المناسب هنا، جرّب تاني' : '🎙️ سمعتك تقول: <span class="de">' + esc(r.said) + '</span> — جرّب تاني أو اختار الرد') + '</div>'; }); };
      $$('[data-o]', act).forEach(function(b){ b.onclick = function(){ if (busy) return; var o = opts[+b.dataset.o];
        if (o[2] || (st.t === 'ask' && o[1] === 1)){ busy = true; right(b); $$('[data-o]', act).forEach(function(x){ x.disabled = true; });
          if (st.t === 'say'){ bubble('me', o[0], o[1]); speak(o[0], function(){}); setTimeout(nextStep, 900); } else setTimeout(nextStep, 700); }
        else { var gi = opts.findIndex(function(x){ return x[2] || (st.t === 'ask' && x[1] === 1); }), gb = $('[data-o="' + gi + '"]', act), go = opts[gi];
          showRight(b, gb, st.t === 'say' ? 'الرد المناسب هو: <b class="de">' + esc(go[0]) + '</b><br><small>' + esc(go[1] || '') + '</small>' : 'الإجابة الصح: <b>' + esc(go[0]) + '</b>' + (st.mn ? '<br><small>لأن الجملة معناها: ' + esc(st.mn) + '</small>' : ''),
            function(){ reveal(); if (st.t === 'say'){ bubble('me', go[0], go[1]); speak(go[0], function(){}); setTimeout(nextStep, 900); } else nextStep(); }); } }; });
    } else if (st.t === 'pick'){
      act.innerHTML = '<div class="scq">🧺 ضع في السلة ما في القائمة:</div><div class="sclist de">📝 ' + esc(st.task) + '</div><div class="shelf">' + st.shelf.map(function(n, k){ var it = itemsOf(st.topic).find(function(x){ return x.n === n; }) || {de:n, n:n};
        return '<button class="shi" data-s="' + k + '">' + scPic(st.topic + '/' + n, it.e) + '<span class="de" hidden>' + esc(it.de) + '</span></button>'; }).join('') + '</div><div class="basket" id="bk">🛒 السلة: <b>0</b> / ' + st.need.length + '</div>';
      var got = 0;
      $$('[data-s]', act).forEach(function(b){ b.onclick = function(){ if (busy || b.disabled) return; var n = st.shelf[+b.dataset.s], it = itemsOf(st.topic).find(function(x){ return x.n === n; });
        if (st.need.indexOf(n) >= 0){ b.disabled = true; right(b); var lb = b.querySelector('.de'); if (lb) lb.hidden = false; got++; $('#bk b').textContent = got; if (it) speak(it.de); if (got === st.need.length){ busy = true; setTimeout(nextStep, 700); } }
        else { if (it) speak(it.de); b.classList.add('no'); setTimeout(function(){ b.classList.remove('no'); }, 450); wrong(null); } }; });
    } else if (st.t === 'pay'){
      bubble('npc', st.de, st.mn); speak(st.de);
      var paid = 0, M = [0.5, 1, 2, 5, 10, 20, 50];
      var fmt = function(v){ return (Math.round(v * 100) / 100).toFixed(v % 1 ? 2 : 0).replace('.', ',') + ' €'; };
      act.innerHTML = '<div class="scq">💶 ادفع المبلغ بالضبط</div><div class="paid">دفعت: <b id="pd">0 €</b></div><div class="money">' + M.map(function(v){ return '<button class="' + (v < 5 ? 'coin' : 'note') + '" data-m="' + v + '">' + (v < 1 ? '50 ct' : v + ' €') + '</button>'; }).join('') + '</div>' +
        '<div class="row" style="margin-top:12px"><button class="btn alt" id="pclr">↺ مسح</button><button class="btn" id="pgo" style="flex:1">ادفع</button></div>';
      $$('[data-m]', act).forEach(function(b){ b.onclick = function(){ if (busy) return; paid = Math.round((paid + +b.dataset.m) * 100) / 100; $('#pd').textContent = fmt(paid); b.classList.remove('tap'); void b.offsetWidth; b.classList.add('tap'); }; });
      $('#pclr').onclick = function(){ paid = 0; $('#pd').textContent = '0 €'; };
      $('#pgo').onclick = function(){ if (busy) return; if (!paid) return toast('اختر النقود أولًا');
        if (Math.abs(paid - st.amount) < .001){ busy = true; right($('#pgo')); bubble('me', 'Hier, bitte.', 'تفضّل.'); speak('Hier, bitte.'); setTimeout(nextStep, 900); }
        else { toast(paid > st.amount ? 'دفعت أكثر من المطلوب. المطلوب: ' + fmt(st.amount) : 'المبلغ ناقص. المطلوب: ' + fmt(st.amount)); paid = 0; $('#pd').textContent = '0 €'; wrong(null); } };
    } else if (st.t === 'body'){
      bubble('npc', st.de, st.mn); speak(st.de);
      act.innerHTML = '<div class="scq">🩺 قل للطبيب أين الألم. اختر الصورة المناسبة لهذه الجملة:</div><div class="sclist de">🗣️ ' + esc(st.task) + '</div><div class="shelf body">' + st.choices.map(function(n, k){ var it = itemsOf(st.topic).find(function(x){ return x.n === n; }) || {de:n};
        return '<button class="shi" data-b="' + k + '">' + scPic(st.topic + '/' + n, it.e) + '<span class="de" hidden>' + esc(it.de) + '</span></button>'; }).join('') + '</div>';
      $$('[data-b]', act).forEach(function(b){ b.onclick = function(){ if (busy) return; var n = st.choices[+b.dataset.b];
        if (n === st.need){ busy = true; right(b); var lb2 = b.querySelector('.de'); if (lb2) lb2.hidden = false; bubble('me', st.say, ''); speak(st.say); setTimeout(nextStep, 1000); }
        else { var gb2 = $('[data-b="' + st.choices.indexOf(st.need) + '"]', act); if (gb2){ var l3 = gb2.querySelector('.de'); if (l3) l3.hidden = false; }
          showRight(b, gb2, 'الصورة الصح هي اللي باللون الأخضر: <b class="de">' + esc(st.say) + '</b>', function(){ bubble('me', st.say, ''); speak(st.say); setTimeout(nextStep, 1000); }); } }; });
    }
  }
  function fail(){ act.innerHTML = ''; $('#scbar').innerHTML = '';
    act.innerHTML = '<div class="result lvres"><div class="em">💔</div><h2>انتهت القلوب</h2><p class="sub">لا بأس! جرّب الموقف مرة أخرى، وستتحسن في كل مرة.</p><div class="row" style="justify-content:center;margin-top:10px"><button class="btn" id="again">🔁 حاول مرة أخرى</button><a class="btn alt" href="#/play" style="text-decoration:none">الألعاب</a></div></div>';
    $('#again').onclick = function(){ viewScene(id); }; act.scrollIntoView({block:'center'}); }
  function win(){
    var stars = mistakes === 0 ? 3 : mistakes === 1 ? 2 : 1, xp = okc * 10 + stars * 10 + 20;
    S.scenes = S.scenes || {}; S.scenes[id] = Math.max(scStars(id), stars); S.games.scene = 1; save(); addXP(xp); confetti();
    var k = SCENES.indexOf(sc), nx = SCENES[k + 1];
    act.innerHTML = '<div class="result lvres"><div class="em">' + (stars === 3 ? '🏆' : '🎉') + '</div><h2>' + (stars === 3 ? 'أداء مثالي!' : 'أحسنت! أنهيت الموقف') + '</h2>' +
      '<div class="bigstars">' + [1, 2, 3].map(function(n){ return '<span class="' + (n <= stars ? 'on' : '') + '" style="animation-delay:' + (n * .25) + 's">★</span>'; }).join('') + '</div><div class="xpgain">+' + ar(xp) + ' نقطة ⚡</div>' +
      '<p class="sub">راجع المحادثة فوق، وتحت كل جملة ترجمتها.</p>' +
      '<div class="row" style="justify-content:center;margin-top:10px">' + (nx ? '<a class="btn flame" href="#/scene/' + nx.id + '" style="text-decoration:none">▶ ' + nx.t + '</a>' : '') + '<button class="btn alt" id="again">🔁 أعد</button><a class="btn alt" href="#/play" style="text-decoration:none">الألعاب</a></div></div>';
    $('#again').onclick = function(){ viewScene(id); }; act.scrollIntoView({block:'center'}); }
  barH(); step();
}
/* ---------------- adventure map ---------------- */
var ADV_T = ['greet','colors','num','family','food','home','body','animals','jobs','weather','travel','calendar','verbs','intro'];
var ADV_M = [{m:'meaning', t:'المعنى', e:'🎯'}, {m:'listen', t:'الاستماع', e:'🎧'}, {m:'mix', t:'التحدّي', e:'👑'}];
function advLevels(){ var L = []; ADV_T.forEach(function(tid){ var tp = topics().find(function(t){ return t.id === tid; }); if (!tp) return; ADV_M.forEach(function(md, k){ L.push({n:L.length + 1, tid:tid, mode:md.m, mt:md.t, me:md.e, boss:k === 2, topic:tp}); }); }); return L; }
function advStars(n){ return (S.adv && S.adv[n]) || 0; }
function advOpen(n){ return n === 1 || advStars(n - 1) > 0; }
function advTotal(){ var t = 0; for (var k in (S.adv || {})) t += S.adv[k]; return t; }
function viewAdventure(){
  var L = advLevels(), cur = 1; L.forEach(function(l){ if (advOpen(l.n)) cur = l.n; });
  var html = '<div class="wrap"><div class="ph sm" style="--c:#2B1F86"><a class="back" href="#/play">→ الألعاب</a><span class="em phpic">' + uiPic('tile_journey', '🗺️') + '</span><h1>مغامرة الكلمات</h1><div class="g">Wort-Abenteuer</div><p>' + ar(L.length) + ' مرحلة. لكل مرحلة 3 قلوب، واجمع حتى 3 نجوم لتفتح التالية.</p></div>' +
    '<div class="advsum"><span>⭐ ' + ar(advTotal()) + ' من ' + ar(L.length * 3) + '</span><span>🏁 المرحلة ' + ar(cur) + '</span></div><div class="advmap">';
  var last = null;
  L.forEach(function(l, k){
    if (l.tid !== last){ last = l.tid; html += '<div class="advgrp" style="--c:' + l.topic.color + '"><span class="ap">' + uiPic('head_' + l.tid, l.topic.e) + '</span><b>' + esc(l.topic.title) + '</b></div>'; }
    var st = advStars(l.n), open = advOpen(l.n), side = ['c', 'r', 'c', 'l'][k % 4];
    html += '<div class="advrow ' + side + '"><a class="lvl' + (open ? '' : ' lock') + (l.n === cur ? ' cur' : '') + (l.boss ? ' boss' : '') + (st ? ' won' : '') + '" ' + (open ? 'href="#/adv/' + l.n + '"' : 'aria-disabled="true"') + ' style="--c:' + l.topic.color + '">' +
      '<span class="ln">' + (open ? (l.boss ? '👑' : ar(l.n)) : '🔒') + '</span>' + (st || open ? '<span class="ls">' + '★'.repeat(st) + '<i>' + '★'.repeat(3 - st) + '</i></span>' : '') + '</a><span class="lvt">' + l.me + ' ' + l.mt + '</span></div>';
  });
  html += '<div class="advend">🏆 أكمل كل المراحل لتصبح بطل الكلمات!</div></div>' + footer() + '</div>';
  render(html, 'play');
  $$('.lvl.lock').forEach(function(a){ a.onclick = function(e){ e.preventDefault(); toast('🔒 أكمل المرحلة السابقة أولًا'); }; });
  var c = $('.lvl.cur'); if (c) setTimeout(function(){ c.scrollIntoView({block:'center'}); }, 60);
}
function viewAdvLevel(n){
  var l = advLevels()[n - 1]; if (!l) return go('#/adv'); if (!advOpen(n)){ toast('🔒 أكمل المرحلة السابقة أولًا'); return go('#/adv'); }
  viewGame(l.mode === 'listen' ? 'listen' : 'meaning', l.tid, {lv:l, fresh:true});
}
function gameTile(g, topic){ return '<a class="tile" href="#/g/' + g.id + '/' + (topic || 'all') + '" style="--c:' + g.c + '"><span class="em">' + g.e + '</span><b>' + g.t + '</b><span>' + g.d + '</span></a>'; }
var GGROUPS = [{t:'📚 ألعاب الكلمات', ids:['meaning','listen','match','memory','cards']}, {t:'✍️ القواعد والكتابة', ids:['artikel','type','order']}, {t:'⚡ التحدّي', ids:['speed','rain']}];
function nextDaily(){ var d = new Date(), m = new Date(d); m.setHours(24, 0, 0, 0); var s2 = Math.max(0, Math.floor((m - d) / 1000)); return Math.floor(s2 / 3600) + ':' + ('0' + Math.floor(s2 % 3600 / 60)).slice(-2); }
var dailyT = null;
function viewPlay(){
  var lv = lvlOf(S.xp), L = advLevels(), cur = 1; L.forEach(function(l){ if (advOpen(l.n)) cur = l.n; });
  var allDone = advStars(L.length) > 0, cl = L[cur - 1];
  var nodes = []; for (var k = Math.max(1, Math.min(cur - 2, L.length - 4)); k <= Math.min(L.length, Math.max(cur + 2, 5)); k++) nodes.push(k);
  var dd = !!S.daily[today()];
  var html = '<div class="wrap">' +
    '<div class="pcard2"><span class="pav">' + uiPic('tile_journey', '🧑‍🚀') + '</span><div class="pinfo"><div class="pname">' + (S.name ? esc(S.name) : 'رائد الفضاء') + '<span class="plv">Lv ' + ar(lv.n) + '</span></div>' +
      '<div class="pbar"><i style="width:' + Math.round(lv.cur / lv.step * 100) + '%"></i></div><div class="pnext">' + ar(lv.cur) + ' / ' + ar(lv.step) + ' نقطة للمستوى ' + ar(lv.n + 1) + '</div></div>' +
      '<div class="pstats"><span>⭐ ' + ar(starsTotal()) + '</span><span>🔥 ' + ar(streakNow()) + '</span><a href="#/me">🏅 ' + ar(Object.keys(S.badges).length) + '</a></div></div>' +
    '<a class="advprev" href="#/adv' + (allDone ? '' : '/' + cur) + '"><div class="aph"><b>🗺️ مغامرة الكلمات</b><span>⭐ ' + ar(advTotal()) + ' / ' + ar(L.length * 3) + '</span></div><div class="apath">' + nodes.map(function(n){ var st = advStars(n), op = advOpen(n);
      return '<span class="apn' + (n === cur ? ' cur' : '') + (st ? ' won' : '') + (op ? '' : ' lock') + '" style="--c:' + L[n - 1].topic.color + '">' + (op ? (L[n - 1].boss ? '👑' : ar(n)) : '🔒') + '</span>'; }).join('<i class="apl"></i>') + '</div>' +
      '<div class="apgo">' + (allDone ? '🏆 أكملت كل المراحل! العب من الخريطة' : '▶ كمّل المرحلة ' + ar(cur) + ' · ' + esc(cl.topic.title)) + '</div></a>' +
    '<a class="daily2' + (dd ? ' done' : '') + '" href="#/daily"><span class="dch">' + (dd ? '✅' : '🎁') + '</span><div><b>مهمة اليوم</b><span id="dnext">' + (dd ? 'أنهيتها! المهمة الجاية بعد ' + nextDaily() : '10 أسئلة متنوعة · افتح صندوق المكافأة +50') + '</span></div><span class="arr">‹</span></a>' +
    (hidden('scenes') ? '' : scenesHTML()) +
    GGROUPS.map(function(gr){ return '<div class="sh"><h2>' + gr.t + '</h2></div><div class="grow">' + gr.ids.map(function(id){ var g = GAMES.find(function(x){ return x.id === id; }), b = S.best && S.best[id];
      return '<a class="gcard" href="#/g/' + id + '" style="--c:' + g.c + '"><span class="gico">' + g.e + '</span><b>' + g.t + '</b><small>' + g.d + '</small><span class="gbest">' + (b != null ? '⭐ أحسن نتيجة ' + ar(b) + '٪' : (S.games[id] ? '✔ لعبتها' : '✨ جديد')) + '</span></a>'; }).join('') + '</div>'; }).join('') +
    '<a class="bstrip" href="#/me"><div class="bsh"><b>🏅 أوسمتي</b><span>' + ar(Object.keys(S.badges).length) + ' من ' + ar(BADGES.length) + ' ‹</span></div><div class="bsrow">' + BADGES.map(function(b){ return '<span class="bsi' + (S.badges[b.id] ? ' got' : '') + '" title="' + esc(b.t) + '">' + b.e + '</span>'; }).join('') + '</div></a>' +
    footer() + '</div>';
  render(html, 'play');
  clearInterval(dailyT); if (dd) dailyT = setInterval(function(){ var e = $('#dnext'); if (!e){ clearInterval(dailyT); return; } e.textContent = 'أنهيتها! المهمة الجاية بعد ' + nextDaily(); }, 30000);
}
function gameNeed(gid){ return {order: function(x){ var n = x.de.split(' ').length; return n >= 3 && n <= 9 && !/[,·]/.test(x.de); }, artikel: function(x){ return !!x.g; }}[gid]; }
function gameOK(gid, tid){ var pool = itemsOf(tid).filter(function(x){ return x.mn; }), nd = gameNeed(gid); if (nd) pool = pool.filter(nd);
  return uniqBy(pool, function(x){ return x.mn; }).length >= (gid === 'memory' ? 6 : tid === 'mist' ? 4 : 5); }
function topicName(tid){ var t = topics().find(function(x){ return x.id === tid; }); return tid === 'all' ? 'كل الكلمات' : tid === 'mist' ? 'أخطائي' : tid === 'a1' ? 'دروس A1' : tid === 'a2' ? 'دروس A2' : t ? t.title : tid; }
function viewPickTopic(gid){
  var g = GAMES.find(function(x){ return x.id === gid; }); if (!g) return go('#/play');
  var opts = [{id:'all', e:'🌍', title:'كل الكلمات', color:'#5B3DF5'}].concat(Object.keys(S.mist).length >= 4 ? [{id:'mist', e:'🩹', title:'أخطائي', color:'#E63946'}] : []).concat(topics()).concat([{id:'a1', e:'📘', title:'دروس A1', color:'#3A86FF'}, {id:'a2', e:'📗', title:'دروس A2', color:'#19C79A'}]);
  opts = opts.filter(function(t){ return gameOK(gid, t.id); });
  var html = '<div class="wrap"><div class="ph sm" style="--c:' + g.c + '"><a class="back" href="#/play">→ الألعاب</a><span class="em">' + g.e + '</span><h1>' + g.t + '</h1><p>' + g.d + '</p></div>' +
    '<div class="sh"><h2>اختر الموضوع</h2><span class="cnt">' + ar(opts.length) + ' موضوعًا</span></div><div class="tpick">' + opts.map(function(t){
      var u = picUrl('ui/head_' + t.id);
      return '<a class="tpc" href="#/g/' + gid + '/' + t.id + '" style="--c:' + (t.color || '#5B3DF5') + '"><span class="tpi">' + (u ? '<img src="' + u + '" alt="">' : '<span class="pe">' + t.e + '</span>') + '</span><b>' + esc(t.title) + '</b></a>'; }).join('') + '</div>' + footer() + '</div>';
  render(html, 'play');
}
function pickBar(game, cur){
  var opts = [{id:'all', e:'🌍', title:'الكل'}].concat(topics()).concat([{id:'a1', e:'📘', title:'دروس A1'},{id:'a2', e:'📗', title:'دروس A2'}]);
  if (Object.keys(S.mist).length >= 4) opts.splice(1, 0, {id:'mist', e:'🩹', title:'أخطائي'});
  return '<div class="pick">' + opts.map(function(t){ return '<a class="chip ' + (t.id === cur ? 'on' : '') + '" href="#/g/' + game + '/' + t.id + '" style="text-decoration:none">' + t.e + ' ' + esc(t.title) + '</a>'; }).join('') + '</div>';
}
function norm(s){ return String(s).toLowerCase().replace(/ä/g,'ae').replace(/ö/g,'oe').replace(/ü/g,'ue').replace(/ß/g,'ss').replace(/[^a-z0-9 ]/g,' ').replace(/\s+/g,' ').trim(); }
function uniqBy(arr, f){ var s = {}; return arr.filter(function(x){ var k = f(x); if (s[k]) return false; s[k] = 1; return true; }); }

function viewGame(gid, tid, opts){
  opts = opts || {};
  var g = GAMES.find(function(x){ return x.id === gid; }); if (!g) return go('#/play');
  var pool = uniqBy(itemsOf(tid).filter(function(x){ return x.mn; }), function(x){ return x.de; });
  if (tid === 'all') ['abc','num','greet','intro','colors','family','food','home','body','animals','jobs','weather','travel','verbs','calendar'].forEach(useAudio);
  else if (tid === 'mist' || opts.unit != null) pool.forEach(function(x){ useAudio(x.grp); }); else useAudio(tid);
  loadPics(tid === 'mist' || opts.daily || opts.unit != null ? 'all' : tid);
  var need = {order: function(x){ var n = x.de.split(' ').length; return n >= 3 && n <= 9 && !/[,·]/.test(x.de); }, artikel: function(x){ return !!x.g; }}[gid];
  if (need) pool = pool.filter(need);
  var pool2 = uniqBy(pool, function(x){ return x.mn; });
  var distract = pool2.length >= 4 ? pool2 : uniqBy(pool2.concat(itemsOf('all').filter(function(x){ return x.mn; })), function(x){ return x.mn; });
  var LV = opts.lv || null;
  var head = LV ? '<div class="ph sm" style="--c:' + LV.topic.color + '"><a class="back" href="#/adv">→ الخريطة</a><span class="em phpic">' + uiPic('head_' + LV.tid, LV.topic.e) + '</span><h1>المرحلة ' + ar(LV.n) + (LV.boss ? ' 👑' : '') + '</h1><div class="g">' + esc(LV.topic.title) + ' · ' + LV.mt + '</div></div>' :
    opts.unit != null ? '<div class="ph" style="--c:#5B3DF5"><a class="back" href="#/path">→ مساري</a><span class="em">📝</span><h1>اختبار الوحدة ' + ar(opts.unit + 1) + '</h1><div class="g">' + esc(UDEF[opts.unit].t) + '</div><p>10 أسئلة من كلمات وجمل الوحدة. انجح بـ 70٪ أو أكثر.</p></div>' :
    opts.daily ? '<div class="ph" style="--c:#FF3D7F"><a class="back" href="#/">→ الرئيسية</a><span class="em">🎯</span><h1>مهمة اليوم</h1><div class="g">Tagesmission</div><p>10 أسئلة متنوعة. أنهِها واحصل على 50 نقطة إضافية.</p></div>' :
    '<div class="ph" style="--c:' + g.c + '"><a class="back" href="' + (tid === 'mist' ? '#/mistakes' : '#/play') + '">→ ' + (tid === 'mist' ? 'أخطائي' : 'الألعاب') + '</a><span class="em">' + g.e + '</span><h1>' + g.t + '</h1><p>' + g.d + '</p></div>' + (tid === 'mist' ? '' : '<a class="tpill" href="#/g/' + gid + '">📚 الموضوع: <b>' + esc(topicName(tid)) + '</b> · تغيير</a>');
  var minN = gid === 'memory' ? 6 : (tid === 'mist' ? 4 : 5);
  if (pool2.length < minN){
    render('<div class="wrap">' + head + '<div class="empty"><i>🪐</i>' + (tid === 'mist' ? 'تحتاج 4 كلمات على الأقل في كرّاسة الأخطاء لهذه اللعبة.' : 'هذا الموضوع لا يحتوي كلمات كافية لهذه اللعبة. اختر موضوعًا آخر من الأعلى.') + '</div></div>', 'play'); return;
  }
  var KEY = LV ? 'adv:' + LV.n : opts.daily ? 'daily:' + today() : opts.unit != null ? 'unit:' + opts.unit : gid + '/' + tid;
  var saved = S.gs[KEY];
  if (!opts.fresh && !opts.resume && saved && gid !== 'speed' && gid !== 'rain' && saved.i > 0){
    render('<div class="wrap">' + head + '<div class="panel center resume"><div style="font-size:44px">⏸️</div><b>لديك جولة لم تكملها</b><p class="sub">توقفت عند ' + (saved.lbl || 'السؤال ' + ar(saved.i + 1)) + '</p><div class="row" style="justify-content:center"><button class="btn" id="resY">▶ تابع من حيث توقفت</button><button class="btn alt" id="resN">ابدأ من جديد</button></div></div></div>', 'play');
    $('#resY').onclick = function(){ viewGame(gid, tid, Object.assign({}, opts, {resume:true})); };
    $('#resN').onclick = function(){ delete S.gs[KEY]; save(); viewGame(gid, tid, Object.assign({}, opts, {fresh:true})); };
    return;
  }
  if (!opts.resume){ delete S.gs[KEY]; }
  render('<div class="wrap">' + head + (gid === 'speed' || gid === 'match' || gid === 'memory' || gid === 'order' || gid === 'type' || gid === 'artikel' ? '' : '<div class="ctl slim">' + prChip() + '</div>') + '<div id="stage"></div></div>', opts.unit != null ? 'learn' : 'play'); bindCtl();
  var stage = $('#stage');
  var rnd = opts.daily ? seeded('daily' + today()) : Math.random;
  var R = {ok:0, total:0, mistakes:0, bonus:0}, hearts = LV ? 3 : 0, combo = 0;
  function heartsH(){ return hearts || LV ? '<span class="hrt">' + '❤️'.repeat(hearts) + '<i>' + '🤍'.repeat(Math.max(0, 3 - hearts)) + '</i></span>' : ''; }
  function comboH(){ return combo >= 3 ? '<span class="combo">🔥 ×2</span>' : ''; }
  function mascot(mood){ var m = $('#mascot'); if (!m) return; m.className = 'mascot ' + mood; var t = m.querySelector('.say');
    if (t) t.textContent = mood === 'ok' ? (combo >= 3 ? 'نار! 🔥' : ['رائع!','ممتاز!','أحسنت!','صاروخ! 🚀'][Math.floor(Math.random() * 4)]) : mood === 'no' ? ['لا بأس!','حاول مرة أخرى','ركّز 💪'][Math.floor(Math.random() * 3)] : 'هيا بنا!'; }
  var byDe = {}; pool.concat(pool2).forEach(function(x){ byDe[x.de] = x; });
  function st(o){ S.gs[KEY] = o; save(); }
  function finish(extra){
    delete S.gs[KEY];
    if (LV) return finishLevel();
    var pct = R.total ? R.ok / R.total : 0, stars = pct >= .9 ? 3 : pct >= .6 ? 2 : 1, xp = R.ok * 10 + 20 + (extra || 0) + (R.bonus || 0);
    if (R.total >= 5 && R.mistakes === 0){ S.perfect = true; }
    S.games[gid] = 1; if (!opts.daily){ S.best = S.best || {}; S.best[gid] = Math.max(S.best[gid] || 0, Math.round(pct * 100)); } if (opts.daily){ S.daily[today()] = R.ok; xp += 50; }
    save(); addXP(xp); confetti();
    skillAdd(gid === 'listen' ? 'listen' : (gid === 'type' || gid === 'order') ? 'write' : 'read', Math.round(pct * 100));
    if (opts.unit != null){ S.ut = S.ut || {}; S.ut[opts.unit] = Math.max(S.ut[opts.unit] || 0, Math.round(pct * 100)); save(); }
    var unitDone = opts.unit != null ? (pct >= .7 ? '<div class="badge-done">✅ نجحت في اختبار الوحدة ' + ar(opts.unit + 1) + '! <a href="#/path">تابع مسارك ‹</a></div>' : '<div class="badge-done half">تحتاج 70٪ للنجاح. راجع دروس الوحدة وجرّب مرة أخرى 💪</div>') : '';
    if (!opts.daily && opts.unit == null && UMAP['t:' + tid] && R.total >= 5 && pct >= .7 && !S.done['t:' + tid]){ var tu = 't:' + tid; S.pass = S.pass || {}; S.pass[tu] = 1; save();
      if (heardCount(tu) >= UMAP[tu].size){ complete(tu); unitDone = '<div class="badge-done">✅ أكملت موضوع «' + esc(UMAP[tu].title) + '»</div>'; }
      else unitDone = '<div class="badge-done half">✅ نجحت في اللعبة! استمع إلى كل كلمات «' + esc(UMAP[tu].title) + '» (' + ar(heardCount(tu)) + ' من ' + ar(UMAP[tu].size) + ') لتكمل الموضوع وتتقدم في رحلتك.</div>'; }
    stage.innerHTML = (opts.daily ? '<div class="chest" id="chest"><span class="cb">🎁</span><span class="co">+50 ⚡ مكافأة المهمة</span></div>' : '') + '<div class="result"><div class="em">' + (stars === 3 ? '🏆' : stars === 2 ? '🚀' : '🌱') + '</div><h2>' + (stars === 3 ? 'أنت صاروخ!' : stars === 2 ? 'أحسنت!' : 'بداية جيدة!') + '</h2>' +
      '<div class="stars">' + '⭐'.repeat(stars) + '<span style="opacity:.25">' + '⭐'.repeat(3 - stars) + '</span></div><div>' + ar(R.ok) + ' من ' + ar(R.total) + ' صحيحة</div><div class="xpgain">+' + ar(xp) + ' نقطة ⚡</div>' + unitDone +
      (R.mistakes && tid !== 'mist' ? '<div class="sub">الكلمات التي أخطأت فيها حُفظت في <a href="#/mistakes">كرّاسة أخطائي</a></div>' : '') +
      '<div class="row" style="justify-content:center;margin-top:8px"><button class="btn" id="again">🔁 العب مرة أخرى</button><a class="btn alt" href="' + (opts.unit != null ? '#/path' : opts.daily ? '#/' : '#/play') + '" style="text-decoration:none">' + (opts.unit != null ? 'مساري' : opts.daily ? 'الرئيسية' : 'ألعاب أخرى') + '</a></div></div>';
    $('#again').onclick = function(){ viewGame(gid, tid, {daily:opts.daily, unit:opts.unit, fresh:true}); };
    if (opts.daily){ var ch0 = $('#chest'); if (ch0){ setTimeout(function(){ ch0.classList.add('open'); fx(true); confetti(); }, 1100); } }
    if (!S.popup && ytName()){ setTimeout(function(){ if ($('.result') && !S.popup){ S.popup = true; save(); subPopup(); } }, 1500); }
  }
  function bar(i, n){ return '<div class="gamebar"><span class="mascot" id="mascot"><span class="mp">' + uiPic('tile_journey', '🧑‍🚀') + '</span><span class="say">هيا بنا!</span></span><div class="prog"><i style="width:' + (i / n * 100) + '%"></i></div>' + comboH() + (LV ? heartsH() : '<span class="hearts">' + ar(i) + '/' + ar(n) + '</span>') + '</div>'; }
  function failLevel(){
    delete S.gs[KEY]; save(); fx(false);
    stage.innerHTML = '<div class="result lvres"><div class="em">💔</div><h2>انتهت القلوب</h2><p class="sub">أجبت ' + ar(R.ok) + ' إجابات صحيحة. حاول مرة أخرى، أنت قريب!</p>' +
      '<div class="row" style="justify-content:center;margin-top:10px"><button class="btn" id="again">🔁 حاول مرة أخرى</button><a class="btn alt" href="#/adv" style="text-decoration:none">🗺️ الخريطة</a></div></div>';
    $('#again').onclick = function(){ viewAdvLevel(LV.n); };
  }
  function finishLevel(){
    var stars = R.mistakes === 0 ? 3 : R.mistakes === 1 ? 2 : 1, xp = R.ok * 10 + R.bonus + stars * 10 + (LV.boss ? 30 : 0), prev = advStars(LV.n), first = !prev;
    S.adv = S.adv || {}; S.adv[LV.n] = Math.max(prev, stars); S.games.adv = 1; save(); addXP(xp); confetti();
    var nx = advLevels()[LV.n];
    stage.innerHTML = '<div class="result lvres"><div class="em">' + (stars === 3 ? '🏆' : stars === 2 ? '🚀' : '🌟') + '</div><h2>' + (stars === 3 ? 'مرحلة مثالية!' : 'نجحت في المرحلة ' + ar(LV.n) + '!') + '</h2>' +
      '<div class="bigstars">' + [1, 2, 3].map(function(k){ return '<span class="' + (k <= stars ? 'on' : '') + '" style="animation-delay:' + (k * .25) + 's">★</span>'; }).join('') + '</div>' +
      '<div>' + ar(R.ok) + ' من ' + ar(R.total) + ' صحيحة' + (R.bonus ? ' · 🔥 كومبو +' + ar(R.bonus) : '') + '</div><div class="xpgain">+' + ar(xp) + ' نقطة ⚡</div>' +
      (first && nx ? '<div class="badge-done">🔓 فتحت المرحلة ' + ar(nx.n) + '</div>' : '') +
      '<div class="row" style="justify-content:center;margin-top:10px">' + (nx ? '<a class="btn flame" href="#/adv/' + nx.n + '" style="text-decoration:none">▶ المرحلة التالية</a>' : '') + '<button class="btn alt" id="again">🔁 أعد</button><a class="btn alt" href="#/adv" style="text-decoration:none">🗺️ الخريطة</a></div></div>';
    $('#again').onclick = function(){ viewAdvLevel(LV.n); };
  }
  function others(item, n, key){ return shuffle(distract.filter(function(x){ return x[key] !== item[key]; }), rnd).slice(0, n); }
  function judge(ok, q){ fx(ok); srsTouch(q, ok); if (ok){ combo++; var amt = combo >= 3 ? 20 : 10; if (combo >= 3) R.bonus += 10; xpFloat(amt); fixMistake(q); } else { combo = 0; if (tid !== 'mist' || S.mist[q.de]) addMistake(q); } mascot(ok ? 'ok' : 'no'); }

  if (gid === 'meaning' || gid === 'listen' || gid === 'artikel' || gid === 'type' || gid === 'order' || opts.daily){
    var N = LV ? 8 : 10, qs, types, i = 0;
    if (opts.resume && saved && saved.qs){ qs = saved.qs.map(function(d){ return byDe[d]; }).filter(Boolean); types = saved.types; i = saved.i; R = saved.R || R; if (qs.length !== saved.qs.length){ qs = null; i = 0; R = {ok:0,total:0,mistakes:0}; } }
    if (!qs && LV){ qs = shuffle(pool2, rnd).slice(0, N); types = qs.map(function(q, k){ if (LV.mode !== 'mix') return LV.mode; var o = ['meaning', 'listen', q.g ? 'artikel' : 'meaning', 'type']; return o[k % 4]; }); }
    if (!qs){ qs = shuffle(pool2, rnd).slice(0, N); types = (opts.daily || opts.unit != null) ? qs.map(function(q, k){ return q.g && k % 3 === 2 ? 'artikel' : (k % 2 ? 'listen' : 'meaning'); }) : null; }
    var save1 = function(){ st({qs:qs.map(function(q){ return q.de; }), types:types, i:i, R:R, lbl:'السؤال ' + ar(i + 1) + ' من ' + ar(qs.length)}); };
    var next = function(){
      if (i >= qs.length) return finish();
      var q = qs[i], t = types ? types[i] : gid;
      var h = bar(i, qs.length);
      if (t === 'meaning'){
        var ch = shuffle([q].concat(others(q, 3, 'mn')), rnd);
        h += '<div class="qcard"><div class="q">ما معناها؟</div><div class="big">' + deHTML(q) + '</div><div class="pr arp">' + pron(q.ar || '') + '</div><button class="play sm" id="qp" style="margin:8px auto 0">' + ICON_PLAY + '</button></div>' +
          '<div class="opts">' + ch.map(function(c, k){ return '<button class="opt" data-k="' + k + '">' + esc(c.mn) + '</button>'; }).join('') + '</div>';
        stage.innerHTML = h; $('#qp').onclick = function(){ play(q); }; play(q);
        $$('.opt').forEach(function(b){ b.onclick = function(){ answer(ch[+b.dataset.k] === q, b, q); }; });
      } else if (t === 'listen'){
        var ch2 = shuffle([q].concat(others(q, 3, 'de')), rnd);
        h += '<div class="qcard"><div class="q">استمع واختر ما سمعته</div><button class="play" id="qp" style="width:84px;height:84px;margin:8px auto">' + ICON_PLAY + '</button><div class="q">🐢 اضغط مرة أخرى للاستماع ببطء</div></div>' +
          '<div class="opts">' + ch2.map(function(c, k){ return '<button class="opt de" data-k="' + k + '">' + deHTML(c) + '</button>'; }).join('') + '</div>';
        stage.innerHTML = h; var slowNext = false;
        $('#qp').onclick = function(){ var sp = S.set.speed; if (slowNext) S.set.speed = 'slow'; play(q, null, function(){ S.set.speed = sp; }); slowNext = true; }; play(q);
        $$('.opt').forEach(function(b){ b.onclick = function(){ answer(ch2[+b.dataset.k] === q, b, q); }; });
      } else if (t === 'artikel'){
        h += '<div class="qcard">' + qEm(q, '📦') + '<div class="q">der أم die أم das؟</div><div class="big">… ' + esc(q.n) + '</div><div class="m" style="color:var(--mute)">' + esc(q.mn) + '</div></div>' +
          '<div class="arts"><button class="artb m" data-a="m">der</button><button class="artb f" data-a="f">die</button><button class="artb n" data-a="n">das</button></div>' +
          '<div class="tip memo" style="margin-top:12px"><b class="k">🧠</b><span class="art m">der</span> مذكّر · <span class="art f">die</span> مؤنّث · <span class="art n">das</span> محايد. احفظ كل اسم مع أداته ولونه.</div>';
        stage.innerHTML = h;
        $$('.artb').forEach(function(b){ b.onclick = function(){ answer(b.dataset.a === q.g, b, q); }; });
      } else if (t === 'type'){
        h += '<div class="qcard">' + qEm(q, '✍️') + '<div class="q">اكتبها بالألمانية</div><div class="bigar">' + esc(q.mn) + '</div><button class="play sm" id="qp" style="margin:8px auto 0">' + ICON_PLAY + '</button></div>' +
          '<input class="inp de" id="tin" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="اكتب هنا…" aria-label="إجابتك"><div class="row" style="margin-top:10px"><button class="btn wide" id="tchk">تأكيد</button></div>' +
          '<div class="center sub" style="margin-top:6px">لا تجد ä ö ü؟ اكتب ae oe ue وتُقبل الإجابة</div>';
        stage.innerHTML = h; $('#qp').onclick = function(){ play(q); }; var inp = $('#tin'); setTimeout(function(){ inp.focus(); }, 50);
        var chk = function(){ var v = norm(inp.value), full = norm(q.de), noun = q.n ? norm(q.n) : null; var ok = v === full || (noun && v === noun); answer(ok, null, q, ok && noun && v === noun && v !== full ? 'صحيح! لكن لا تنسَ الأداة: ' + ART[q.g] : null); };
        $('#tchk').onclick = chk; inp.onkeydown = function(e){ if (e.key === 'Enter') chk(); };
      } else if (t === 'order'){
        var words = q.de.split(' '), pool3 = shuffle(words.map(function(w, k){ return {w:w, k:k}; }), rnd), built = [];
        if (pool3.map(function(x){ return x.w; }).join(' ') === q.de) pool3.reverse();
        h += '<div class="qcard"><div class="q">رتّب الكلمات لتصبح:</div><div class="bigar" style="font-size:19px">' + esc(q.mn) + '</div></div><div class="slots" id="sl"></div><div class="pool" id="po"></div><div class="row"><button class="btn alt" id="oclr">↺ مسح</button><button class="btn" id="ochk" style="flex:1">تأكيد</button></div>';
        stage.innerHTML = h;
        var draw = function(){ $('#sl').innerHTML = built.map(function(x, k){ return '<button class="wchip" data-s="' + k + '">' + esc(x.w.replace(/[.!?,;:]+$/, '')) + '</button>'; }).join('');
          $('#po').innerHTML = pool3.map(function(x, k){ return built.indexOf(x) >= 0 ? '' : '<button class="wchip" data-p="' + k + '">' + esc(x.w.replace(/[.!?,;:]+$/, '')) + '</button>'; }).join('');
          $$('[data-p]').forEach(function(b){ b.onclick = function(){ built.push(pool3[+b.dataset.p]); draw(); }; });
          $$('[data-s]').forEach(function(b){ b.onclick = function(){ built.splice(+b.dataset.s, 1); draw(); }; }); };
        draw(); $('#oclr').onclick = function(){ built = []; draw(); };
        $('#ochk').onclick = function(){ if (built.length < words.length) return toast('أكمل الكلمات أولًا'); answer(built.map(function(x){ return x.w; }).join(' ') === q.de, null, q); };
      }
    };
    var answer = function(ok, btn, q, note){
      R.total++; if (ok) R.ok++; else R.mistakes++;
      judge(ok, q); i++; save1();
      if (btn) btn.classList.add(ok ? 'ok' : 'no');
      if (!ok){ $$('.opt').forEach(function(b){ if (b.textContent.trim() === q.mn || b.textContent.trim() === (q.g ? ART[q.g] + ' ' + q.n : q.de)) b.classList.add('ok'); }); }
      $$('.opt,.artb').forEach(function(b){ b.disabled = true; });
      if (!ok && LV){ hearts--; var hb = $('.hrt'); if (hb) hb.outerHTML = heartsH(); }
      var cb = $('.combo'); if (cb && combo < 3) cb.remove(); else if (!cb && combo >= 3){ var pg = $('.gamebar .prog'); if (pg) pg.insertAdjacentHTML('afterend', comboH()); }
      showFb(ok, q, note, LV && hearts <= 0 ? failLevel : next);
      if (ok) play(q);
    };
    next(); return;
  }
  if (gid === 'match'){
    var rounds = 3, r = (opts.resume && saved) ? saved.r : 0; if (opts.resume && saved && saved.R) R = saved.R;
    var mround = function(){
      if (r >= rounds) return finish();
      st({r:r, R:R, i:r, lbl:'الجولة ' + ar(r + 1) + ' من ' + ar(rounds)});
      r++; var set = shuffle(pool2, rnd).slice(0, 5), L = shuffle(set, rnd), Rr = shuffle(set, rnd), sel = null, left = 5, wrongOn = {};
      stage.innerHTML = bar(r - 1, rounds) + '<div class="q center sub" style="margin-bottom:10px">اضغط على الكلمة ثم على معناها</div><div class="match"><div class="col">' + L.map(function(x, k){ return '<button class="mb de" data-l="' + k + '">' + deHTML(x) + '</button>'; }).join('') + '</div><div class="col">' + Rr.map(function(x, k){ return '<button class="mb" data-r="' + k + '">' + esc(x.mn) + '</button>'; }).join('') + '</div></div>';
      $$('[data-l]').forEach(function(b){ b.onclick = function(){ $$('[data-l]').forEach(function(x){ x.classList.remove('sel'); }); b.classList.add('sel'); sel = L[+b.dataset.l]; play(sel); }; });
      $$('[data-r]').forEach(function(b){ b.onclick = function(){ if (!sel) return toast('اختر الكلمة الألمانية أولًا');
        var it = Rr[+b.dataset.r]; R.total++;
        if (it === sel){ R.ok++; if (!wrongOn[sel.de]) fixMistake(sel); b.classList.add('done'); $('[data-l].sel').classList.add('done'); sel = null; left--; if (!left){ r < rounds ? st({r:r, R:R, i:r, lbl:'الجولة ' + ar(r + 1) + ' من ' + ar(rounds)}) : 0; setTimeout(mround, 500); } }
        else { R.mistakes++; if (!wrongOn[sel.de]){ wrongOn[sel.de] = 1; addMistake(sel); } b.classList.add('no'); setTimeout(function(){ b.classList.remove('no'); }, 400); } }; });
    };
    mround(); return;
  }
  if (gid === 'memory'){
    var cards, gotK = {}, moves = 0, found = 0;
    if (opts.resume && saved && saved.cards){ cards = saved.cards.map(function(c){ return {k:c.k, t:c.t, it:byDe[c.de]}; }); if (cards.some(function(c){ return !c.it; })) cards = null; else { (saved.got || []).forEach(function(k){ gotK[k] = 1; }); moves = saved.moves || 0; found = Object.keys(gotK).length; } }
    if (!cards){ var set6 = shuffle(pool2, rnd).slice(0, 6); cards = []; set6.forEach(function(x, k){ cards.push({k:k, t:'de', it:x}); cards.push({k:k, t:'mn', it:x}); }); cards = shuffle(cards, rnd); }
    var saveM = function(){ st({cards:cards.map(function(c){ return {k:c.k, t:c.t, de:c.it.de}; }), got:Object.keys(gotK).map(Number), moves:moves, i:found || (moves ? 1 : 0), lbl:'وجدت ' + ar(found) + ' من 6 أزواج'}); };
    var open = [];
    var left = function(){ return 6 - found; };
    stage.innerHTML = '<div class="memhead"><span id="ml">🃏 تبقّى ' + plural(left(), 'زوج واحد', 'زوجان', 'أزواج', 'زوجًا') + '</span><span id="mv">محاولات: ' + ar(moves) + '</span></div><div class="mem">' + cards.map(function(c, k){ return '<button class="mc' + (gotK[c.k] ? ' gone' : '') + '" data-c="' + k + '" aria-label="بطاقة"><span>🚀</span></button>'; }).join('') + '</div>';
    $$('[data-c]').forEach(function(b){ b.onclick = function(){
      var c = cards[+b.dataset.c]; if (b.classList.contains('up') || b.classList.contains('gone') || open.length === 2) return;
      b.classList.add('up'); if (c.t === 'de'){ b.classList.add('de'); b.innerHTML = '<span>' + deHTML(c.it) + '</span>'; play(c.it); } else b.innerHTML = '<span>' + (c.it.e ? c.it.e + ' ' : '') + esc(c.it.mn) + '</span>';
      open.push({b:b, c:c});
      if (open.length === 2){ moves++; $('#mv').textContent = 'محاولات: ' + ar(moves);
        if (open[0].c.k === open[1].c.k){ var pair = open; open = []; found++; gotK[pair[0].c.k] = 1; pair.forEach(function(o){ o.b.classList.add('got'); });
          setTimeout(function(){ pair.forEach(function(o){ o.b.classList.add('gone'); }); }, 650);
          $('#ml').textContent = found === 6 ? '🎉 وجدت كل الأزواج!' : '🃏 تبقّى ' + plural(left(), 'زوج واحد', 'زوجان', 'أزواج', 'زوجًا'); saveM();
          if (found === 6){ R.total = 6; R.ok = Math.max(1, 6 - Math.max(0, Math.floor((moves - 6) / 2))); R.mistakes = moves - 6; setTimeout(finish, 900); } }
        else { saveM(); setTimeout(function(){ open.forEach(function(o){ o.b.classList.remove('up','de'); o.b.innerHTML = '<span>🚀</span>'; }); open = []; }, 900); } } }; });
    return;
  }
  if (gid === 'speed'){
    var end = Date.now() + 60000, timer;
    stage.innerHTML = '<div class="qcard"><div class="em">⏱️</div><b>معك 60 ثانية</b><p class="sub">أجب عن أكبر عدد من الأسئلة. كل إجابة صحيحة = 10 نقاط.</p><button class="btn flame" id="sgo">🚀 ابدأ</button></div>';
    $('#sgo').onclick = function(){
      var q1 = function(){
        var lft = Math.max(0, Math.ceil((end - Date.now()) / 1000)); if (!lft){ clearInterval(timer); return finish(); }
        var q = pool2[Math.floor(rnd() * pool2.length)], ch = shuffle([q].concat(others(q, 3, 'mn')), rnd);
        stage.innerHTML = '<div class="gamebar"><span class="timer" id="tm">' + lft + '</span><div class="prog"><i style="width:' + (lft / 60 * 100) + '%;background:linear-gradient(90deg,#FF6B2C,#FFC53D)"></i></div><span class="hearts">✅ ' + ar(R.ok) + '</span></div>' +
          '<div class="qcard"><div class="big">' + deHTML(q) + '</div></div><div class="opts">' + ch.map(function(c, k){ return '<button class="opt" data-k="' + k + '">' + esc(c.mn) + '</button>'; }).join('') + '</div>';
        $$('.opt').forEach(function(b){ b.onclick = function(){ var ok = ch[+b.dataset.k] === q; R.total++; if (ok) R.ok++; else R.mistakes++; judge(ok, q); b.classList.add(ok ? 'ok' : 'no'); setTimeout(q1, ok ? 250 : 650); }; });
      };
      end = Date.now() + 60000; timer = setInterval(function(){ var t = $('#tm'); if (!t){ clearInterval(timer); return; } var lft = Math.max(0, Math.ceil((end - Date.now()) / 1000)); t.textContent = lft; if (!lft){ clearInterval(timer); finish(); } }, 250);
      q1();
    };
    return;
  }
  if (gid === 'rain'){
    var lives = 3, round = 0, ROUNDS = 15, raf = 0, alive = true, busy = false;
    stage.innerHTML = '<div class="qcard"><div class="em">☄️</div><b>مطر الكلمات</b><p class="sub">تظهر الكلمة بالعربية في الأعلى، وتسقط ثلاث كلمات ألمانية. المس الكلمة الصحيحة قبل أن تصل إلى الأرض! لديك 3 قلوب، والسرعة تزيد.</p><button class="btn flame" id="rgo">🚀 ابدأ</button></div>';
    $('#rgo').onclick = function(){
      stage.innerHTML = '<div class="gamebar"><span class="hrt" id="rh"></span><div class="prog"><i id="rp" style="width:0"></i></div><span class="hearts" id="rs">⚡ 0</span></div><div class="rainq" id="rq"></div><div class="rain" id="rf"><div class="ground"></div></div>';
      var field = $('#rf'), score = 0;
      var hud = function(){ $('#rh').innerHTML = '❤️'.repeat(lives) + '<i>' + '🤍'.repeat(3 - lives) + '</i>'; $('#rs').textContent = '⚡ ' + score; $('#rp').style.width = (round / ROUNDS * 100) + '%'; };
      var stop = function(){ alive = false; cancelAnimationFrame(raf); };
      addEventListener('hashchange', stop, {once:true});
      var drop = function(){
        if (!alive) return; if (lives <= 0 || round >= ROUNDS){ stop(); return finish(); }
        round++; hud(); busy = false;
        var q = pool2[Math.floor(rnd() * pool2.length)], ch = shuffle([q].concat(others(q, 2, 'mn')), rnd);
        $('#rq').innerHTML = '<span>' + (q.e ? q.e + ' ' : '') + esc(q.mn) + '</span>';
        $$('.drop', field).forEach(function(d){ d.remove(); });
        var H = field.clientHeight - 56, speed = 38 + round * 5, y0 = performance.now(), els = [];
        ch.forEach(function(c, k){ var d = document.createElement('button'); d.className = 'drop de'; d.style.left = (k * 33.33 + 1.5) + '%'; d.innerHTML = deHTML(c); field.appendChild(d); els.push(d);
          d.onclick = function(){ if (busy) return; busy = true; var ok = c === q; R.total++; judge(ok, q);
            if (ok){ R.ok++; score += combo >= 3 ? 20 : 10; d.classList.add('hit'); play(q); } else { R.mistakes++; lives--; d.classList.add('miss'); els.forEach(function(x, j){ if (ch[j] === q) x.classList.add('right'); }); }
            hud(); setTimeout(drop, ok ? 450 : 900); }; });
        var tick = function(t){ if (!alive || busy) return; var y = (t - y0) / 1000 * speed; els.forEach(function(d){ d.style.transform = 'translateY(' + y + 'px)'; });
          if (y >= H){ busy = true; R.total++; R.mistakes++; lives--; judge(false, q); els.forEach(function(x, j){ if (ch[j] === q) x.classList.add('right'); }); hud(); setTimeout(drop, 900); return; }
          raf = requestAnimationFrame(tick); };
        raf = requestAnimationFrame(tick);
      };
      hud(); drop();
    };
    return;
  }
  if (gid === 'cards'){
    var deck, ci = 0;
    if (opts.resume && saved && saved.deck){ deck = saved.deck.map(function(d){ return byDe[d]; }).filter(Boolean); ci = saved.ci || 0; R = saved.R || R; if (!deck.length){ deck = null; ci = 0; } }
    if (!deck) deck = pool2.slice().sort(function(a, b){ return (S.cards[a.de] || 0) - (S.cards[b.de] || 0) || (rnd() - .5); }).slice(0, 20);
    var saveC = function(){ st({deck:deck.map(function(q){ return q.de; }), ci:ci, R:R, i:ci, lbl:'البطاقة ' + ar(ci + 1) + ' من ' + ar(deck.length)}); };
    var card = function(){
      if (ci >= deck.length){ R.total = Math.max(R.total, deck.length); return finish(); }
      var q = deck[ci], box = S.cards[q.de] || 0;
      stage.innerHTML = bar(ci, deck.length) + '<div class="flash"><div class="fc" id="fc"><div class="side"><div class="big">' + deHTML(q) + '</div><div class="sub">اضغط لقلب البطاقة</div></div>' +
        '<div class="side back">' + qEm(q, '🃏') + '<div style="font-size:24px;font-weight:800">' + esc(q.mn) + '</div><div class="pr arp">' + pron(q.ar || '') + '</div></div></div></div>' +
        '<div class="row"><button class="btn alt" id="no" style="flex:1">🔁 لم أحفظها بعد</button><button class="btn" id="yes" style="flex:1">✅ عرفتها</button></div><div class="center sub" style="margin-top:8px">الصندوق ' + ar(box) + ' من 5</div>';
      var fc = $('#fc'); fc.onclick = function(){ fc.classList.toggle('flip'); play(q); };
      play(q);
      $('#yes').onclick = function(){ S.cards[q.de] = Math.min(5, box + 1); R.ok++; R.total++; fixMistake(q); ci++; saveC(); card(); };
      $('#no').onclick = function(){ S.cards[q.de] = 0; R.total++; R.mistakes++; addMistake(q); deck.push(q); ci++; if (deck.length > 40) deck.length = 40; saveC(); card(); };
    };
    card(); return;
  }
}
function showFb(ok, q, note, next){
  var fb = $('#fb'); fb.className = 'feedback ' + (ok ? 'ok' : 'no'); var pu = picUrl(picKey(q));
  fb.innerHTML = (pu ? '<span class="fbpic"><img src="' + pu + '" alt=""></span>' : '') + '<b>' + (ok ? (note ? '✅ ' + esc(note) : ['✅ أحسنت!','✅ إجابة صحيحة!','✅ رائع!','✅ ممتاز!'][Math.floor(Math.random()*4)]) : '❌ الإجابة الصحيحة:') + '</b>' +
    '<div class="ans">' + deHTML(q) + '</div><div>' + esc(q.mn) + '</div><button class="btn" id="fbn">' + (ok ? 'متابعة' : 'فهمت، تابع') + '</button>';
  requestAnimationFrame(function(){ fb.classList.add('show'); });
  $('#fbn').onclick = function(){ hideFb(); next(); };
}
function hideFb(){ var fb = $('#fb'); if (fb) fb.classList.remove('show'); }

/* ---------------- placement test ---------------- */
function viewTest(){
  var qs = SR.placement, i = 0, score = 0;
  render('<div class="wrap"><div class="ph" style="--c:#5B3DF5"><a class="back" href="#/train">→ التدريب</a><span class="em">🧭</span><h1>اختبار المستوى</h1><div class="g">Einstufungstest</div><p>12 سؤالًا من السهل إلى الصعب. إن لم تعرف الإجابة فخمّن.</p></div><div id="stage"></div></div>', 'train');
  var st = $('#stage');
  function q(){
    if (i >= qs.length) return done();
    var x = qs[i]; i++;
    var isDe = /^[A-Za-zÄÖÜäöüß]/.test(x[0]) || /^\d/.test(x[0]);
    st.innerHTML = '<div class="gamebar"><div class="prog"><i style="width:' + ((i - 1) / qs.length * 100) + '%"></i></div><span class="hearts">' + ar(i) + '/' + ar(qs.length) + '</span></div>' +
      '<div class="qcard"><div class="' + (isDe ? 'big' : 'bigar') + '" style="font-size:22px">' + esc(x[0]) + '</div></div><div class="opts">' + x[1].map(function(o, k){ return '<button class="opt ' + (/^[A-Za-zÄÖÜäöüß]/.test(o) ? 'de' : '') + '" data-k="' + k + '">' + esc(o) + '</button>'; }).join('') + '</div>';
    $$('.opt').forEach(function(b){ b.onclick = function(){ if (+b.dataset.k === x[2]) score++; q(); }; });
  }
  function done(){
    S.test = score; save(); addXP(20);
    var rec = score <= 4 ? {e:'🌱', t:'ابدأ من الأساسيات', d:'الحروف والتحيات والأرقام ستبني لك أساسًا قويًا.', h:'#/t/abc', b:'ابدأ بالحروف'} :
              score <= 8 ? {e:'🚀', t:'أنت جاهز لمستوى A1', d:'ادخل دروس A1 بالترتيب، وراجع الكلمات بالألعاب.', h:'#/l/a1-1', b:'أول درس A1'} :
                           {e:'🌙', t:'مستواك ممتاز!', d:'راجع A1 بسرعة، ثم ابدأ دروس A2.', h:'#/l/a2-perfekt', b:'دروس A2'};
    st.innerHTML = '<div class="result"><div class="em">' + rec.e + '</div><h2>' + rec.t + '</h2><div>نتيجتك ' + ar(score) + ' من ' + ar(qs.length) + '</div><p class="sub">' + rec.d + '</p><a class="btn" href="' + rec.h + '" style="text-decoration:none;display:inline-block">' + rec.b + '</a></div>';
    confetti();
  }
  q();
}

/* ---------------- ME ---------------- */
function viewMe(){
  var si = stationIdx(), stn = STATIONS[si];
  var html = '<div class="wrap"><div class="ph" style="--c:#14103A"><span class="em">🧑‍🚀</span><h1>' + (S.name ? 'رحلة ' + esc(S.name) : 'رحلتي') + '</h1><div class="g">' + stn.e + ' ' + stn.a + '</div><p>أكملت ' + ar(doneCount()) + ' من ' + ar(UNITS.length) + ' وحدة في رحلتك.</p></div>' +
    '<div class="ribbon" id="ribbon" style="margin-top:0">' + ribbonHTML() + '</div>' + progressHTML() +
    '<a class="jmini" href="#/journey" style="margin-top:12px"><div class="jm-l"><span>🚀</span><b>رحلتك الفضائية</b><small>شاهد أين وصل صاروخك</small></div><div class="prog"><i style="width:' + Math.round(doneCount() / Math.max(1, UNITS.length) * 100) + '%"></i></div></a>' +
    '<a class="mission intro" href="#/tool/intro"><span class="em">🙋</span><div><b>تعريفي بالألمانية</b><span>اكتب بياناتك واحصل على تعريف كامل بنفسك بالألمانية مع الصوت</span></div><span class="arr">‹</span></a>' +
    '<div class="sh"><h2>أوسمتي</h2><span class="cnt">' + ar(Object.keys(S.badges).length) + ' من ' + ar(BADGES.length) + '</span></div><div class="badges">' +
    BADGES.map(function(b){ return '<div class="bd ' + (S.badges[b.id] ? 'got' : '') + '"><i>' + b.e + '</i><b>' + b.t + '</b><span>' + b.d + '</span></div>'; }).join('') + '</div>' +
    '<div class="sh"><h2>شهادتي</h2></div><div class="panel"><p class="sub" style="margin:0 0 10px">اكتب اسمك واحصل على شهادة بمحطتك ونقاطك، تحفظها كصورة وتشاركها.</p><input class="inp de" id="cName" placeholder="Your name" value="' + esc(S.name) + '" aria-label="اسمك"><button class="btn wide flame" id="cert" style="margin-top:10px">🏅 اصنع شهادتي</button></div>' +
    '<div class="sh"><h2>تواصل معي</h2></div>' + contactHTML(false) + footer() + '</div>';
  render(html, 'me'); bindRibbon(); bindPlan();
  $('#cert').onclick = function(){ var n = $('#cName').value.trim(); if (!n) return toast('اكتب اسمك أولًا'); S.name = n; save(); certificate(n); };
}
function settingsSheet(){
  var old = $('.modal'); if (old) old.remove();
  var m = modal('<h3 style="margin:0 0 10px">⚙️ الإعدادات</h3><div class="setlist">' +
    setRow('dark', '🌙 الوضع الليلي', isDark()) + setRow('sp', '🔤 النطق بالحروف العربية', S.set.sp) + setRow('kids', '🔠 خط كبير وأزرار أكبر', S.set.kids) + setRow('fx', '🔊 مؤثرات الصوت والاهتزاز', S.set.fx !== false) +
    '<div class="set"><span>🐢 سرعة الصوت</span><div class="seg"><button data-sp2="slow" class="' + (S.set.speed === 'slow' ? 'on' : '') + '">بطيء</button><button data-sp2="normal" class="' + (S.set.speed !== 'slow' ? 'on' : '') + '">عادي</button></div></div>' +
    '<div class="set"><span>🎯 الهدف اليومي</span><div class="seg">' + GOALS.map(function(g){ return '<button data-goal2="' + g.x + '" class="' + (S.goal === g.x ? 'on' : '') + '">' + g.m + ' د</button>'; }).join('') + '</div></div>' +
    '<div class="set"><span>📲 ثبّت الموقع على شاشتك</span><button class="btn" id="installBtn">تثبيت</button></div>' +
    '<div class="set"><span>⏰ تذكير يومي بالمذاكرة</span><button class="btn" id="remBtn">ضبط</button></div>' +
    '<div class="set"><span>💾 نسخة احتياطية من تقدّمي</span><button class="btn" id="bkBtn">نقل وحفظ</button></div>' +
    '<div class="set"><span>🗑️ ابدأ من جديد</span><button class="btn alt" id="resetBtn">امسح تقدّمي</button></div></div>' +
    '<a class="btn alt wide" href="#/me" style="text-decoration:none;display:block;text-align:center;margin-top:12px">🧑‍🚀 صفحتي ونقاطي</a>', 'sheet'); m.classList.add('msheet');
  $('#resetBtn', m).onclick = function(){ if (confirm('هل أنت متأكد؟ ستُمسح كل النقاط والأوسمة والتقدّم.')){ var keep = S.set, nm = S.name, gl = S.goal; S = blank(); S.set = keep; S.name = nm; S.goal = gl; S.onb = 1; S.lena = 1; S.popup = true; save(); m.remove(); route(); } };
  $$('[data-set]', m).forEach(function(b){ b.onclick = function(){ var k = b.dataset.set; if (k === 'dark'){ S.set.theme = isDark() ? 'light' : 'dark'; } else if (k === 'fx'){ S.set.fx = S.set.fx === false; if (S.set.fx) fx(true); } else S.set[k] = !S.set[k]; save(); applySettings(); b.classList.toggle('on'); }; });
  $$('[data-sp2]', m).forEach(function(b){ b.onclick = function(){ setSpeed(b.dataset.sp2); $$('[data-sp2]', m).forEach(function(x){ x.classList.toggle('on', x === b); }); $$('[data-sp]').forEach(function(x){ x.classList.toggle('on', x.dataset.sp === b.dataset.sp2); }); }; });
  $$('[data-goal2]', m).forEach(function(b){ b.onclick = function(){ S.goal = +b.dataset.goal2; save(); $$('[data-goal2]', m).forEach(function(x){ x.classList.toggle('on', x === b); }); var gc = $('.goal'); if (gc) gc.outerHTML = goalHTML(); toast('🎯 هدفك الجديد: ' + S.goal + ' نقطة يوميًا'); }; });
  $$('a', m).forEach(function(a){ a.addEventListener('click', function(){ m.remove(); }); });
  bindInstall();
  $('#bkBtn', m).onclick = function(){ m.remove(); backupSheet(); };
  $('#remBtn', m).onclick = function(){ m.remove(); reminderSheet(); };
}
/* ---------------- backup / restore ---------------- */
function progCode(){ return 'SR1-' + btoa(unescape(encodeURIComponent(JSON.stringify(S)))); }
function readCode(c){ c = String(c || '').replace(/\s+/g, ''); var i = c.indexOf('SR1-'); if (i < 0) return null; try{ var x = JSON.parse(decodeURIComponent(escape(atob(c.slice(i + 4))))); return x && typeof x === 'object' && x.v ? x : null; }catch(e){ return null; } }
function backupSheet(){
  var code = progCode();
  var m = modal('<h3 style="margin:0 0 6px">💾 نسخة احتياطية من تقدّمي</h3><p class="sub">تقدّمك محفوظ على هذا الجهاز فقط. احفظ الكود في مكان آمن (مثل رسائل واتساب لنفسك)، واستخدمه لنقل تقدّمك إلى جهاز آخر أو استرجاعه إذا مُسح.</p>' +
    '<div class="row" style="gap:8px;flex-wrap:wrap;margin:10px 0"><button class="btn" id="bkCopy">📋 نسخ الكود</button>' + (navigator.share ? '<button class="btn alt" id="bkShare">📤 مشاركة</button>' : '') + '<button class="btn alt" id="bkFile">⬇️ حفظ كملف</button></div>' +
    '<h3 style="margin:16px 0 6px">📥 استرجاع تقدّمي</h3><p class="sub">الصق الكود هنا. سيحلّ محل التقدّم الموجود على هذا الجهاز.</p>' +
    '<textarea id="rsIn" rows="3" dir="ltr" placeholder="SR1-..." style="width:100%;border-radius:12px;padding:10px;font:inherit;font-size:13px"></textarea>' +
    '<button class="btn wide" id="rsGo" style="margin-top:8px">استرجاع</button>', 'sheet'); m.classList.add('msheet');
  $('#bkCopy', m).onclick = function(){ var done = function(){ toast('✅ تم نسخ الكود. احفظه في مكان آمن'); };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(code).then(done, function(){ fallbackCopy(code); done(); }); else { fallbackCopy(code); done(); } };
  var sh = $('#bkShare', m); if (sh) sh.onclick = function(){ navigator.share({title:'تقدّمي في Sprachrakete', text:code}).catch(function(){}); };
  $('#bkFile', m).onclick = function(){ var a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([code], {type:'text/plain'})); a.download = 'Sprachrakete-' + today() + '.txt'; document.body.appendChild(a); a.click(); a.remove(); };
  $('#rsGo', m).onclick = function(){ var x = readCode($('#rsIn', m).value); if (!x) return toast('⚠️ الكود غير صحيح، تأكد أنك نسخته كاملًا');
    if (!confirm('سيُستبدل التقدّم الحالي على هذا الجهاز. هل تريد المتابعة؟')) return;
    try{ localStorage.setItem('sprachrakete', JSON.stringify(x)); }catch(e){} toast('✅ تم استرجاع تقدّمك'); setTimeout(function(){ location.reload(); }, 900); };
}
function fallbackCopy(t){ var ta = document.createElement('textarea'); ta.value = t; ta.style.position = 'fixed'; ta.style.opacity = '0'; document.body.appendChild(ta); ta.select(); try{ document.execCommand('copy'); }catch(e){} ta.remove(); }
/* ---------------- daily reminder (calendar) ---------------- */
function reminderSheet(){
  var t = S.set.rem || '20:00';
  var m = modal('<h3 style="margin:0 0 6px">⏰ تذكير يومي</h3><p class="sub">اختر الوقت المناسب، وسيُضاف تذكير يومي إلى تقويم هاتفك يفتح لك الموقع مباشرة.</p>' +
    '<input type="time" id="remT" value="' + t + '" style="font:inherit;font-size:22px;padding:10px 14px;border-radius:12px;margin:8px 0;width:100%">' +
    '<button class="btn wide" id="remGo">➕ أضف إلى التقويم</button><p class="sub center" style="margin-top:8px">على آيفون: اضغط «إضافة الكل» بعد فتح الملف.</p>', 'sheet'); m.classList.add('msheet');
  $('#remGo', m).onclick = function(){ var v = ($('#remT', m).value || '20:00').split(':'), hh = ('0' + (+v[0] || 0)).slice(-2), mm = ('0' + (+v[1] || 0)).slice(-2);
    S.set.rem = hh + ':' + mm; save();
    var d = new Date(), ds = d.getFullYear() + ('0' + (d.getMonth() + 1)).slice(-2) + ('0' + d.getDate()).slice(-2), url = location.origin + location.pathname;
    var ics = ['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Sprachrakete//AR','CALSCALE:GREGORIAN','BEGIN:VEVENT','UID:sprachrakete-daily-' + ds + '@mohnned7','DTSTAMP:' + ds + 'T000000Z',
      'DTSTART:' + ds + 'T' + hh + mm + '00','DURATION:PT15M','RRULE:FREQ=DAILY','SUMMARY:🚀 وقت الألماني! ' + (S.goal || 30) + ' نقطة اليوم','DESCRIPTION:افتح Sprachrakete وحافظ على سلسلة أيامك: ' + url,'URL:' + url,
      'BEGIN:VALARM','ACTION:DISPLAY','DESCRIPTION:وقت الألماني!','TRIGGER:PT0M','END:VALARM','END:VEVENT','END:VCALENDAR'].join('\r\n');
    var a = document.createElement('a'); a.href = 'data:text/calendar;charset=utf-8,' + encodeURIComponent(ics); a.download = 'Sprachrakete-reminder.ics'; document.body.appendChild(a); a.click(); a.remove();
    toast('⏰ افتح الملف وأضفه إلى التقويم'); };
}
function setRow(k, label, on){ return '<div class="set"><span>' + label + '</span><button class="switch ' + (on ? 'on' : '') + '" data-set="' + k + '" aria-label="' + label + '"></button></div>'; }
function certificate(name){
  var stn = station(), c = document.createElement('canvas'); c.width = 1400; c.height = 990; var x = c.getContext('2d');
  var g = x.createRadialGradient(1100, 0, 50, 700, 500, 1100); g.addColorStop(0, '#4B33D6'); g.addColorStop(.45, '#2B1F86'); g.addColorStop(1, '#14103A'); x.fillStyle = g; x.fillRect(0, 0, 1400, 990);
  for (var i = 0; i < 140; i++){ x.fillStyle = 'rgba(255,255,255,' + (Math.random() * .8 + .2) + ')'; x.beginPath(); x.arc(Math.random()*1400, Math.random()*990, Math.random()*1.8 + .3, 0, 7); x.fill(); }
  x.strokeStyle = '#FFC53D'; x.lineWidth = 6; x.strokeRect(40, 40, 1320, 910); x.lineWidth = 2; x.strokeRect(58, 58, 1284, 874);
  var pg = x.createRadialGradient(170, 860, 10, 170, 860, 200); pg.addColorStop(0, '#FFC53D'); pg.addColorStop(.6, '#FF6B2C'); pg.addColorStop(1, '#C2410C'); x.fillStyle = pg; x.beginPath(); x.arc(170, 880, 170, 0, 7); x.fill();
  x.textAlign = 'center'; x.fillStyle = '#FFC53D'; x.font = '700 46px Outfit, sans-serif'; x.fillText('Sprachrakete', 700, 150);
  x.fillStyle = '#fff'; x.font = '800 64px system-ui, sans-serif'; x.direction = 'rtl'; x.fillText('شهادة إنجاز', 700, 250);
  x.font = '400 32px system-ui, sans-serif'; x.fillStyle = '#D8D3FF'; x.fillText('نشهد بأن رائد الفضاء', 700, 330);
  x.direction = 'ltr'; x.fillStyle = '#fff'; x.font = '700 92px Outfit, sans-serif'; x.fillText(name, 700, 450);
  x.fillStyle = '#FFC53D'; x.fillRect(450, 480, 500, 4);
  x.direction = 'rtl'; x.fillStyle = '#fff'; x.font = '500 34px system-ui, sans-serif'; x.fillText('وصل في رحلة تعلّم اللغة الألمانية إلى ' + stn.a + ' ' + stn.e, 700, 560);
  x.fillStyle = '#D8D3FF'; x.font = '400 30px system-ui, sans-serif'; x.fillText(ar(doneCount()) + ' وحدة مكتملة · ' + ar(S.xp) + ' نقطة · ' + ar(Object.keys(S.badges).length) + ' وسام', 700, 625);
  x.fillText(new Date().toLocaleDateString('ar-EG', {year:'numeric', month:'long', day:'numeric'}), 700, 690);
  x.direction = 'ltr'; x.fillStyle = '#FFC53D'; x.font = '700 30px Outfit, sans-serif'; x.fillText('MOHANNAD · mohnned7.github.io', 900, 860);
  x.direction = 'rtl'; x.fillStyle = 'rgba(255,255,255,.6)'; x.font = '400 20px system-ui, sans-serif'; x.fillText('شهادة تشجيعية من الموقع، وليست شهادة رسمية من جهة امتحانات.', 900, 905);
  x.font = '120px system-ui'; x.fillText('🚀', 1220, 300);
  var url = c.toDataURL('image/png');
  modal('<h3>🏅 شهادتك جاهزة</h3><img src="' + url + '" alt="الشهادة" style="width:100%;border-radius:14px;margin:6px 0 12px"><a class="btn wide" style="display:block;text-decoration:none" download="Sprachrakete-' + name.replace(/[^\w-]/g, '') + '.png" href="' + url + '">⬇️ حفظ الشهادة</a><p style="margin-top:8px;font-size:12.5px">على الآيفون: اضغط على الصورة ضغطة طويلة ثم «حفظ الصورة».</p>');
}

/* ---------------- search ---------------- */
var INDEX = null;
function buildIndex(){
  INDEX = []; topics().forEach(function(t){ itemsOf(t.id).forEach(function(it){ INDEX.push(Object.assign({tid:'t/' + t.id, tt:t.title, te:t.e}, it)); }); });
  SR.a1.concat(SR.a2, SR.b1 || []).forEach(function(l){ var grp = l.id.slice(0, 2); l.items.forEach(function(it){ INDEX.push(Object.assign({tid:'l/' + l.id, tt:l.title, te:'📘', grp:grp}, it)); }); });
}
function stripAr(s){ return String(s).replace(/[ً-ْـ]/g, '').replace(/[أإآ]/g, 'ا').replace(/ى/g, 'ي').replace(/ة/g, 'ه'); }
function viewSearch(q){
  if (!INDEX) buildIndex();
  var html = '<div class="wrap"><div class="ph" style="--c:#3A86FF"><span class="em">🔍</span><h1>بحث</h1><div class="g">Suchen</div><p>اكتب كلمة بالعربية أو بالألمانية.</p></div>' +
    '<input class="inp" id="sq" placeholder="مثلًا: قطة أو Katze" value="' + esc(q || '') + '" autocomplete="off" aria-label="بحث"><div class="res" id="sr"></div></div>';
  render(html, 'search'); var inp = $('#sq'), res = [];
  function run(){ var v = inp.value.trim(); if (!v){ $('#sr').innerHTML = '<div class="empty"><i>🛰️</i>ابدأ الكتابة وستظهر النتائج هنا</div>'; return; }
    var nv = norm(v), av = stripAr(v); res = INDEX.filter(function(it){ return stripAr(it.mn).indexOf(av) >= 0 || (nv && norm(it.de).indexOf(nv) >= 0); }).slice(0, 40);
    $('#sr').innerHTML = res.length ? res.map(function(it, i){ return '<div><div class="srcl"><a href="#/' + it.tid + '">' + it.te + ' ' + esc(it.tt) + ' ‹</a></div>' + itemRow(it, i) + '</div>'; }).join('') : '<div class="empty"><i>🪐</i>لم نجد «' + esc(v) + '». جرّب كلمة أخرى.</div>';
    $$('.it[data-i]').forEach(function(el){ el.onclick = function(e){ var act = e.target.closest && e.target.closest('[data-act]'); if (act){ e.stopPropagation(); return itemAct(act, res[+el.dataset.i]); } play(res[+el.dataset.i], el); }; }); }
  inp.oninput = run; run(); setTimeout(function(){ inp.focus(); }, 60);
}

/* ---------------- owner page ---------------- */
function viewAdmin(){
  var repo = String(CFG.repo || 'mohnned7/mohnned7.github.io').replace(/[^\w.\/-]/g, ''), gh = 'https://github.com/' + repo, code = String(CFG.goatcounter || '').trim().replace(/[^a-z0-9-]/gi, '');
  var words = 0; topics().forEach(function(t){ words += itemsOf(t.id).length; });
  var lessonItems = 0; SR.a1.concat(SR.a2).forEach(function(l){ lessonItems += l.items.length; });
  function row(h, e, t, d){ return '<a class="it lesson" href="' + h + '" target="_blank" rel="noopener" style="--c:#5B3DF5"><span class="em">' + e + '</span><div class="tx"><b>' + t + '</b><div class="m">' + d + '</div></div><span class="st">↗</span></a>'; }
  var cfgView = JSON.stringify({announcement:CFG.announcement, whatsapp:CFG.whatsapp, youtube:CFG.youtube, suggest:CFG.suggest, hide:CFG.hide, goatcounter:CFG.goatcounter, repo:CFG.repo}, null, 2);
  var html = '<div class="wrap"><div class="ph sm" style="--c:#14103A"><span class="em">🔐</span><h1>لوحة المالك</h1><div class="g">MOHANNAD</div><p>صفحة خاصة بك. لا تشارك رابطها.</p></div>' +
    '<div class="jsum"><div><b>' + UNITS.length + '</b><span>وحدة في الموقع</span></div><div><b>' + words + '</b><span>كلمة وجملة</span></div><div><b>' + lessonItems + '</b><span>مثال في الدروس</span></div></div>' +
    '<div class="sh"><h2>📊 الإحصائيات</h2></div>' +
    (code ? '<div id="gcBox"><div class="jsum"><div><b id="gcD">…</b><span>زوار اليوم</span></div><div><b id="gcW">…</b><span>آخر 7 أيام</span></div><div><b id="gcA">…</b><span>كل الزوار</span></div></div><p class="sub">عدد الأشخاص الحقيقي: كل جهاز يُحسب مرة واحدة فقط (بدأ العدّ من 25 أكتوبر).</p>' +
      '<div class="sh"><h2>🔥 أكثر الأقسام زيارة</h2></div><div class="panel gcbars" id="gcTop"><p class="sub">جارٍ التحميل…</p></div><p class="sub center">الأرقام تتحدّث كل بضع ساعات.</p></div>' +
      '<div class="list">' + row('https://' + code + '.goatcounter.com', '📈', 'التفاصيل الكاملة', 'البلدان والأجهزة ومن أين جاء الزوار') + '</div>'
          : '<div class="tip trap"><b class="k">لم تُفعَّل بعد</b>أنشئ حسابًا مجانيًا على goatcounter.com، ثم اكتب اسم الحساب في خانة <b>goatcounter</b> داخل ملف الإعدادات.</div>') +
    '<div class="sh"><h2>⚙️ التحكم</h2></div><div class="list">' +
      row(gh + '/edit/main/config.json', '📝', 'تعديل ملف الإعدادات', 'الإعلان، واتساب، يوتيوب، إخفاء الأقسام، الإحصائيات') +
      row(gh + '/upload/main', '⬆️', 'رفع ملفات', 'رفع تحديث أو ملفات صوت') +
      row(gh + '/actions', '🚦', 'حالة النشر', 'تتأكد أن آخر تحديث نُشر بنجاح') +
      row(gh, '📁', 'كل ملفات الموقع', repo) + '</div>' +
    '<div class="sh"><h2>📖 دليل ملف الإعدادات</h2></div><div class="panel guide">' +
      '<p><b>الإعلان:</b> اكتب النص بين علامتي التنصيص في <span class="de">"text"</span>، فيظهر شريط أعلى الموقع. اتركه فارغًا <span class="de">""</span> لإخفائه. وفي <span class="de">"link"</span> ضع رابطًا إن أردت. الألوان: <span class="de">gold · violet · red · green</span>.</p>' +
      '<p><b>إخفاء قسم:</b> اكتب اسمه داخل <span class="de">"hide"</span> مثل <span class="de">["exam", "speak"]</span>. الأسماء المتاحة:</p><div class="chips">' + Object.keys(HIDE_KEYS).map(function(k){ return '<span class="chip"><span class="de">' + k + '</span> · ' + HIDE_KEYS[k] + '</span>'; }).join('') + '</div>' +
      '<p style="margin-top:10px"><b>بعد التعديل:</b> اضغط <b>Commit changes</b>، وانتظر دقيقة أو دقيقتين حتى يظهر التغيير.</p>' +
      '<p class="sub">احذر: لا تحذف الفواصل <span class="de">,</span> ولا علامات التنصيص <span class="de">"</span>، وإلا سيتجاهل الموقع الملف ويستخدم الإعدادات الأساسية.</p></div>' +
    '<div class="sh"><h2>الإعدادات المطبقة الآن</h2></div><pre class="cfg" dir="ltr">' + esc(cfgView) + '</pre>' + footer() + '</div>';
  render(html, '');
  if (code) gcStats(code);
}
function gcStats(code){
  var base = 'https://' + code + '.goatcounter.com/counter/';
  function get(path, q){ return fetch(base + (path === 'TOTAL' ? 'TOTAL' : encodeURIComponent(path)) + '.json' + (q ? '?' + q : ''), {cache:'no-store'})
    .then(function(r){ if (r.status === 404) return 0; if (!r.ok) throw r.status; return r.json().then(function(j){ return +String(j.count || '0').replace(/[^0-9]/g, '') || 0; }); }); }
  var d = new Date(), td = d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2);
  function set(id, v){ var el = $('#' + id); if (el) el.textContent = ar(v); }
  get('TOTAL').then(function(v){
    get('/_people_all').then(function(x){ set('gcA', x); }).catch(function(){ set('gcA', 0); });
    get('/_people_day', 'start=' + td).then(function(x){ set('gcD', x); }).catch(function(){ set('gcD', 0); });
    get('/_people_week', 'start=week').then(function(x){ set('gcW', x); }).catch(function(){ set('gcW', 0); });
    var P = [['/', '🏠 الرئيسية'], ['/learn/words', '📚 الكلمات'], ['/learn/a1', '📘 دروس A1'], ['/learn/a2', '📗 دروس A2'], ['/play', '🎮 الألعاب'], ['/daily', '🎯 مهمة اليوم'], ['/train', '🎯 التدريب'], ['/exam', '📝 تدريب الامتحان'], ['/test', '🧭 اختبار المستوى'], ['/journey', '🚀 الرحلة'], ['/stories', '📖 القصص'], ['/letters', '✉️ الرسائل'], ['/t/abc', '🔤 الحروف'], ['/t/num', '🔢 الأرقام'], ['/search', '🔍 البحث'], ['/suggest', '💡 الاقتراحات']];
    Promise.all(P.map(function(x){ return get(x[0]).catch(function(){ return 0; }); })).then(function(n){
      var rows = P.map(function(x, i){ return {t:x[1], n:n[i]}; }).filter(function(r){ return r.n > 0; }).sort(function(a, b){ return b.n - a.n; }).slice(0, 8), mx = rows.length ? rows[0].n : 1;
      var box = $('#gcTop'); if (!box) return;
      box.innerHTML = rows.length ? rows.map(function(r){ return '<div class="gcr"><span>' + r.t + '</span><i style="width:' + Math.max(6, Math.round(r.n / mx * 100)) + '%"></i><b>' + ar(r.n) + '</b></div>'; }).join('') : '<p class="sub">لا توجد زيارات بعد.</p>'; });
  }).catch(function(){ var b = $('#gcBox'); if (b) b.innerHTML = '<div class="tip trap"><b class="k">خطوة أخيرة</b>افتح موقع العدّاد ← <b>Settings</b> ← فعّل خيار <b>Allow adding visitor counts on your website</b> ← <b>Save</b>. بعدها ستظهر الأرقام هنا بالعربية.</div>'; });
}

/* ---------------- popups / install ---------------- */
function subPopup(){
  var m = modal('<div class="big">🚀</div><h3>هل أعجبتك الرحلة؟</h3><p>اشترك في قناة اليوتيوب ليصلك كل درس وكل لعبة جديدة.</p><a class="cbtn yt" style="justify-content:center" href="https://www.youtube.com/@' + encodeURIComponent(ytName()) + '?sub_confirmation=1" target="_blank" rel="noopener"><i>▶</i>اشترك في القناة</a><button class="btn alt wide" style="margin-top:10px" id="later">لاحقًا</button>');
  $('#later', m).onclick = function(){ m.remove(); }; m.querySelector('.cbtn').addEventListener('click', function(){ setTimeout(function(){ m.remove(); }, 300); });
}
var deferred = null;
addEventListener('beforeinstallprompt', function(e){ e.preventDefault(); deferred = e; });
function bindInstall(){
  var standalone = (window.matchMedia && matchMedia('(display-mode: standalone)').matches) || navigator.standalone;
  var card = $('#installCard'); if (card && standalone) card.hidden = true;
  $$('#installBtn').forEach(function(b){ b.onclick = function(){
    if (deferred){ deferred.prompt(); deferred.userChoice.then(function(){ deferred = null; }); return; }
    var ios = /iphone|ipad|ipod/i.test(navigator.userAgent);
    var m = modal('<div class="big">📲</div><h3>ثبّت Sprachrakete على شاشتك</h3>' + (ios ?
      '<ol><li>افتح الموقع من <b>Safari</b>.</li><li>اضغط زر المشاركة <b>⬆️</b>.</li><li>اختر <b>«إضافة إلى الشاشة الرئيسية»</b>.</li><li>اضغط <b>«إضافة»</b>، وستجد أيقونة الصاروخ 🚀</li></ol>' :
      '<ol><li>اضغط على <b>⋮</b> في أعلى Chrome.</li><li>اختر <b>«تثبيت التطبيق»</b> أو <b>«إضافة إلى الشاشة الرئيسية»</b>.</li><li>وافق، وستجد أيقونة الصاروخ 🚀</li></ol>') + '<button class="btn wide" id="ok">حسنًا</button>');
    $('#ok', m).onclick = function(){ m.remove(); }; }; });
}

/* ---------------- router ---------------- */
function go(h){ location.hash = h; }

/* ---------------- PHASE 1: plan, path, progress ---------------- */
var WA_SVG = '<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm5.3 14.1c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .2-3.3-.7-2.8-1.1-4.6-4-4.7-4.2-.1-.2-1.1-1.5-1.1-2.9 0-1.4.7-2 1-2.3.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 2c.1.2.1.4 0 .5l-.3.5-.4.4c-.1.2-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.3 2.4 1.5.3.1.5.1.6-.1l.9-1c.2-.3.4-.2.6-.1l1.9.9c.3.1.5.2.5.3.1.2.1.7-.1 1.1z"/></svg>';
var UDEF = [
  {t:'البداية', e:'🌱', lv:'A1', ids:['t:abc','t:num','t:greet','t:intro','l:a1-1','l:a1-2','l:a1-3']},
  {t:'الألوان والعائلة', e:'👨‍👩‍👧', lv:'A1', ids:['t:colors','t:family','l:a1-4','l:a1-5']},
  {t:'الطعام والبيت', e:'🏠', lv:'A1', ids:['t:food','t:home','l:a1-6','l:a1-7']},
  {t:'الجسم والحيوانات', e:'🐾', lv:'A1', ids:['t:body','t:animals','l:a1-8','l:a1-9']},
  {t:'المهن والطقس', e:'💼', lv:'A1', ids:['t:jobs','t:weather','l:a1-10','l:a1-11']},
  {t:'السفر والوقت', e:'✈️', lv:'A1', ids:['t:travel','t:verbs','t:calendar','t:situations']},
  {t:'الماضي وحروف الجر', e:'⏪', lv:'A2', ids:['l:a2-perfekt','l:a2-dativ','l:a2-vergleich']},
  {t:'جمل أطول', e:'🔗', lv:'A2', ids:['l:a2-weil','l:a2-reflexiv']},
  {t:'المستوى المتوسط', e:'🎯', lv:'B1', ids:['l:b1-konj','l:b1-relativ','l:b1-praet']}
];
function uIds(i){ return UDEF[i].ids.filter(function(id){ return UMAP[id]; }); }
function uDone(i){ return uIds(i).filter(function(id){ return S.done[id]; }).length; }
function uComplete(i){ var n = uIds(i).length; return n > 0 && uDone(i) >= n; }
function curUnit(){ for (var i = 0; i < UDEF.length; i++){ if (!uComplete(i) && uIds(i).length) return i; } return UDEF.length - 1; }
function unitItems(i){ var o = []; if (!UDEF[i]) return o;
  uIds(i).forEach(function(id){ var u = UMAP[id];
    if (u.kind === 'topic') o = o.concat(itemsOf(u.key));
    else { var L = (SR[u.kind] || []).find(function(l){ return l.id === u.key; }); if (L) L.items.forEach(function(it){ o.push(Object.assign({grp:u.kind}, it)); }); } });
  return o.filter(function(x){ return x.mn && x.de.length < 60 && x.de.indexOf('·') < 0; }); }
function dayLog(){ if (!S.dl || S.dl.d !== today()) S.dl = {d:today()}; return S.dl; }
var SKILLS = [{k:'listen', e:'🎧', t:'الاستماع'}, {k:'read', e:'📖', t:'القراءة'}, {k:'write', e:'✍️', t:'الكتابة'}, {k:'speak', e:'🗣️', t:'الكلام'}];
function skillAdd(k, pct){ if (pct == null || isNaN(pct)) return; S.sk = S.sk || {}; var o = S.sk[k]; S.sk[k] = o == null ? Math.round(pct) : Math.round(o * .7 + pct * .3); if (S.plan && S.plan.skill === k) dayLog().s = 1; save(); }
var PGOALS = {work:['💼','الشغل'], travel:['✈️','السفر'], life:['🏡','الحياة اليومية'], exam:['📝','الامتحان']};
var PMONTHS = {1:120, 3:60, 6:30};
function planTasks(){
  var nu = nextUnit(), L = dayLog(), sk = S.plan.skill, tp = nu && nu.kind === 'topic' && nu.key !== 'abc' && nu.key !== 'num' ? nu.key : 'all', due = srsDue().length, got = S.days[today()] || 0;
  var lessonDone = (L.h || 0) >= 5 || UNITS.some(function(u){ return S.done[u.id] === today(); });
  var SK = {listen:['🎧', 'تمرين استماع: اسمع واختر', '#/g/listen/' + tp], write:['✍️', 'تمرين كتابة: اكتب الكلمة', '#/g/type/' + tp], read:['📖', 'قراءة: قصة قصيرة', '#/stories'], speak:['🗣️', 'كلام: قل جملتك بصوتك', '#/exam/speak']}[sk] || ['🎧', 'تمرين استماع', '#/g/listen/all'];
  return [
    {e:'📘', t:nu ? 'الدرس: ' + nu.title : 'درس جديد', h:nu ? nu.href : '#/path', ok:lessonDone},
    due ? {e:'🔁', t:'راجع ' + plural(due, 'كلمة واحدة', 'كلمتين', 'كلمات', 'كلمة'), h:'#/review', ok:!!L.r} : {e:'🎯', t:'مهمة اليوم: 10 أسئلة', h:'#/daily', ok:!!S.daily[today()]},
    {e:SK[0], t:SK[1], h:SK[2], ok:!!L.s},
    {e:'⚡', t:'اجمع ' + ar(S.goal || 60) + ' نقطة (' + ar(Math.min(got, S.goal || 60)) + ')', h:'#/daily', ok:got >= (S.goal || 60)}
  ];
}
function planHTML(){
  if (!S.plan) return '<button class="plan0" data-plan><span class="em">🗺️</span><div><b>اعمل خطتك الشخصية</b><small>3 أسئلة بس، وتطلعلك خطة يومية تمشي عليها</small></div><span class="arr">‹</span></button>';
  var T = planTasks(), n = T.filter(function(t){ return t.ok; }).length, g = PGOALS[S.plan.goal] || PGOALS.life, missed = S.last && S.last !== today() && S.last !== yesterday();
  return '<section class="plan"><div class="plan-h"><div><b>📅 خطة اليوم</b><small>' + g[0] + ' هدفك: ' + g[1] + ' · خلال ' + plural(S.plan.months, 'شهر', 'شهرين', 'شهور', 'شهرًا') + '</small></div><span class="plan-n">' + ar(n) + '/4</span></div>' +
    '<div class="prog"><i style="width:' + (n * 25) + '%"></i></div>' +
    (missed ? '<div class="plan-miss">فاتك يوم؟ مش مشكلة، خطتك اتعدلت ونكمل من مكانك 💪</div>' : '') +
    (n === 4 ? '<div class="plan-done">🎉 خلصت خطة النهارده! تعالى بكرة نكمل.</div>' : '') +
    '<div class="ptasks">' + T.map(function(t){ return '<a class="ptask' + (t.ok ? ' ok' : '') + '" href="' + t.h + '"><i>' + (t.ok ? '✓' : '') + '</i><span class="pe">' + t.e + '</span><span class="pt">' + esc(t.t) + '</span><span class="arr">‹</span></a>'; }).join('') + '</div>' +
    '<button class="linkbtn plan-ed" data-plan>✏️ عدّل خطتي</button></section>';
}
function bindPlan(){ $$('[data-plan]').forEach(function(b){ b.onclick = planSheet; }); }
function planSheet(){
  if ($('.modal')) $$('.modal').forEach(function(m){ m.remove(); });
  var d = Object.assign({goal:null, months:3, skill:null}, S.plan || {}), step = 0;
  var m = modal('<div id="pln"></div>', 'onbcard');
  function opt(k, v, e, t, s, on){ return '<button class="onb-o' + (on ? ' on' : '') + '" data-' + k + '="' + v + '"><span>' + e + '</span><b>' + t + '</b>' + (s ? '<small>' + s + '</small>' : '') + '</button>'; }
  function dots(){ return '<div class="onb-dots">' + [0, 1, 2].map(function(i){ return '<i class="' + (i === step ? 'on' : '') + '"></i>'; }).join('') + '</div>'; }
  function draw(){ var b = $('#pln', m);
    if (step === 0){ b.innerHTML = dots() + '<div class="big">🎯</div><h3>بتتعلم ألماني ليه؟</h3><div class="onb-opts">' + opt('g', 'work', '💼', 'الشغل', 'تمريض، فنادق، كول سنتر…', d.goal === 'work') + opt('g', 'travel', '✈️', 'السفر', 'مطار، فندق، مواصلات', d.goal === 'travel') + opt('g', 'life', '🏡', 'الحياة اليومية', 'العيشة والكلام مع الناس', d.goal === 'life') + opt('g', 'exam', '📝', 'الامتحان', 'عايز أنجح في امتحان المستوى', d.goal === 'exam') + '</div>';
      $$('[data-g]', b).forEach(function(o){ o.onclick = function(){ d.goal = o.dataset.g; step = 1; draw(); }; }); }
    else if (step === 1){ b.innerHTML = dots() + '<div class="big">⏳</div><h3>عايز تخلص المستوى إمتى؟</h3><div class="onb-opts">' + opt('m', 1, '🚀', 'خلال شهر', '120 نقطة يوميًا · حوالي 20 دقيقة', d.months == 1) + opt('m', 3, '🏃', 'خلال 3 شهور', '60 نقطة يوميًا · حوالي 10 دقايق', d.months == 3) + opt('m', 6, '🚶', 'خلال 6 شهور', '30 نقطة يوميًا · حوالي 5 دقايق', d.months == 6) + '</div>';
      $$('[data-m]', b).forEach(function(o){ o.onclick = function(){ d.months = +o.dataset.m; step = 2; draw(); }; }); }
    else { b.innerHTML = dots() + '<div class="big">💪</div><h3>أنهي مهارة محتاج تقويها أكتر؟</h3><div class="onb-opts">' + SKILLS.map(function(s){ return opt('s', s.k, s.e, s.t, '', d.skill === s.k); }).join('') + '</div>';
      $$('[data-s]', b).forEach(function(o){ o.onclick = function(){ d.skill = o.dataset.s; d.d = today(); S.plan = {goal:d.goal, months:d.months, skill:d.skill, d:d.d}; S.goal = PMONTHS[d.months] || 60; save(); m.remove(); toast('✅ خطتك جاهزة: ' + S.goal + ' نقطة يوميًا'); route(); }; }); }
  }
  draw();
}
function pathCard(){ var c = curUnit(), n = UDEF.filter(function(u, i){ return uComplete(i); }).length;
  return '<a class="pathc" href="#/path"><span class="em">🗺️</span><div><b>مساري</b><small>أنت في الوحدة ' + ar(c + 1) + ': ' + esc(UDEF[c].t) + '</small><div class="prog"><i style="width:' + Math.round(n / UDEF.length * 100) + '%"></i></div></div><span class="gobtn">تابع ‹</span></a>'; }
function viewPath(){
  var c = curUnit(), tot = UDEF.length, fin = UDEF.filter(function(u, i){ return uComplete(i); }).length;
  var exOk = EXAM_PARTS.filter(function(p){ return S.done['e:' + p.id]; }).length;
  function unitHTML(u, i){ var ids = uIds(i), dn = uDone(i), full = uComplete(i), here = i === c, best = (S.ut || {})[i];
    return '<details class="unitc' + (here ? ' here' : '') + (full ? ' full' : '') + '"' + (here ? ' open' : '') + '><summary><span class="uic">' + (full ? '✅' : u.e) + '</span><div class="utx"><b>الوحدة ' + ar(i + 1) + ' · ' + esc(u.t) + '</b><small>' + u.lv + ' · ' + ar(dn) + ' من ' + ar(ids.length) + (best != null ? ' · الاختبار: ' + ar(best) + '٪' : '') + '</small><div class="prog"><i style="width:' + Math.round(dn / Math.max(1, ids.length) * 100) + '%"></i></div></div>' + (here ? '<em class="uhere">أنت هنا</em>' : '') + '</summary>' +
      '<div class="ulist">' + ids.map(function(id){ var x = UMAP[id], p = unitPct(id); return '<a class="urow' + (S.done[id] ? ' ok' : '') + '" href="' + x.href + '"><span class="ue">' + (S.done[id] ? '✅' : x.kind === 'topic' ? (x.e || '📚') : '📘') + '</span><span class="ut">' + esc(x.title) + '</span><span class="up">' + (S.done[id] ? '' : p ? ar(p) + '٪' : '') + '</span><span class="arr">‹</span></a>'; }).join('') +
      '<a class="btn wide utest" href="#/u/' + i + '">📝 اختبار الوحدة' + (best != null ? (best >= 70 ? ' ✅' : ' · جرّب تاني') : ' · 10 أسئلة') + '</a></div></details>'; }
  var html = '<div class="wrap"><div class="ph sm" style="--c:#5B3DF5"><a class="back" href="#/learn">→ الدروس</a><span class="em">🗺️</span><h1>مساري</h1><div class="g">Mein Lernweg</div><p>امشِ وحدة وحدة. كل وحدة فيها كلمات ودروس، وفي آخرها اختبار قصير.</p></div>' +
    lenaTip('path') + '<div class="pathsum"><b>' + ar(fin) + ' من ' + ar(tot) + ' وحدات</b><div class="prog"><i style="width:' + Math.round(fin / tot * 100) + '%"></i></div></div>' +
    UDEF.map(function(u, i){ var s = unitHTML(u, i);
      if (i === 5) s += '<a class="finalx" href="#/exam"><span class="em">🏁</span><div><b>الامتحان النهائي A1</b><small>' + (exOk >= 4 ? '✅ نجحت في الأجزاء الأربعة، شهادتك جاهزة في صفحتك' : 'استماع، قراءة، كتابة، كلام · نجحت في ' + ar(exOk) + ' من 4') + '</small></div><span class="arr">‹</span></a>';
      return s; }).join('') + footer() + '</div>';
  render(html, 'learn'); bindTip();
}
function progressHTML(){
  var sk = S.sk || {}, has = SKILLS.some(function(s){ return sk[s.k] != null; });
  var weak = Object.keys(S.mist || {}).map(function(k){ return S.mist[k]; }).filter(function(m){ return m && m.it; }).sort(function(a, b){ return b.n - a.n; }).slice(0, 5);
  var c = curUnit(), fin = UDEF.filter(function(u, i){ return uComplete(i); }).length, exh = (S.exh || []).slice(0, 5);
  var PN = {listen:'الاستماع', read:'القراءة', write:'الكتابة', speak:'الكلام'};
  var GN = {listen:['🎧','الاستماع'], read:['📖','القراءة'], write:['✍️','الكتابة'], speak:['🗣️','الكلام']};
  var track = '<div class="orbit">' + UDEF.map(function(u, i){ var st = uComplete(i) ? 'ok' : i === c ? 'here' : ''; return '<a class="ob ' + st + '" href="#/path" title="' + esc(u.t) + '"><span>' + (uComplete(i) ? '✓' : u.e) + '</span><small>' + ar(i + 1) + '</small></a>'; }).join('<i class="ol' + '"></i>') + '</div>';
  return '<section class="cockpit"><div class="ck-h"><span>📈</span><div><b>ملخص تقدّمك</b><small>كل حاجة عن مستواك في مكان واحد</small></div></div>' +
    '<div class="ck-sec">🗺️ الوحدات <em>' + ar(fin) + ' من ' + ar(UDEF.length) + '</em></div>' + track +
    '<a class="ck-cur" href="#/path">📍 إنت دلوقتي في الوحدة ' + ar(c + 1) + ': <b>' + esc(UDEF[c].t) + '</b> ‹</a>' +
    '<div class="ck-sec">💪 مهاراتك الأربع' + (has ? '' : ' <em>تظهر بعد أول تمرين</em>') + '</div><div class="gauges">' +
    SKILLS.map(function(s){ var v = sk[s.k], g = GN[s.k]; return '<div class="gauge' + (v != null && v < 50 ? ' low' : '') + '" style="--p:' + (v || 0) + '"><div class="gz"><b>' + (v == null ? '—' : ar(v)) + '</b></div><span>' + g[0] + ' ' + g[1] + '</span></div>'; }).join('') + '</div>' +
    (S.plan ? '<div class="pplan">📅 خطتك: ' + (PGOALS[S.plan.goal] || PGOALS.life).join(' ') + ' · ' + plural(S.plan.months, 'شهر', 'شهرين', 'شهور', 'شهرًا') + ' · ' + ar(S.goal) + ' نقطة يوميًا <button class="linkbtn" data-plan>تعديل</button></div>' : '<button class="plan0" data-plan><span class="em">🗺️</span><div><b>اعمل خطتك الشخصية</b><small>3 أسئلة وتطلعلك خطة يومية</small></div><span class="arr">‹</span></button>') +
    '<div class="ck-sec">📚 المراجعة</div><div class="pgrid"><a href="#/saved"><span>⭐</span><b>المحفوظات</b><small>' + ar(favCount()) + '</small></a><a href="#/review"><span>🔁</span><b>المراجعة</b><small>' + ar(srsDue().length) + ' اليوم</small></a><a href="#/mistakes"><span>🩹</span><b>أخطائي</b><small>' + ar(Object.keys(S.mist || {}).length) + '</small></a></div>' +
    '<div class="ck-sec">🎯 كلمات محتاجة تركيز' + (weak.length ? ' <a href="' + (Object.keys(S.mist).length >= 4 ? '#/g/meaning/mist' : '#/mistakes') + '">تدرّب عليها ‹</a>' : '') + '</div>' +
    (weak.length ? '<div class="weak">' + weak.map(function(m){ return '<span class="wk"><b class="de">' + esc(m.it.de) + '</b><small>' + esc(m.it.mn || '') + ' · ' + plural(m.n, 'غلطة', 'غلطتين', 'غلطات', 'غلطة') + '</small></span>'; }).join('') + '</div>' : '<p class="sub">مفيش أخطاء دلوقتي، ممتاز 🌟</p>') +
    '<div class="ck-sec">📊 نتائج الامتحانات' + (exh.length ? '' : ' <a href="#/exam">ابدأ أول امتحان ‹</a>') + '</div>' +
    (exh.length ? '<div class="exh">' + exh.map(function(e){ return '<div class="exr"><span>' + (PN[e.p] || e.p) + ' · نموذج ' + ar(e.n || 1) + '</span><small>' + esc(e.d) + '</small><b class="' + (e.pct >= 60 ? 'ok' : 'no') + '">' + ar(e.pct) + '٪</b></div>'; }).join('') + '</div>' : '<p class="sub">لسه ما دخلتش أي امتحان.</p>') +
    '</section>';
}

/* ---------------- PHASE 2: richer lesson cards ---------------- */
var KEYRULE = {'a1-1':'الفعل دائمًا في المكان رقم 2: <de>Heute lerne ich Deutsch.</de>', 'a1-2':'السؤال يبدأ بكلمة استفهام ثم الفعل، أو بالفعل نفسه: <de>Wo wohnst du?</de> · <de>Kommst du?</de>', 'a1-3':'احذف <de>-en</de> وضع نهاية الضمير: <de>ich lerne, du lernst, er lernt</de>', 'a1-4':'<de>kein</de> قبل اسم بلا أداة أو مع <de>ein</de>، و<de>nicht</de> لأي شيء آخر.', 'a1-5':'أداة الجمع دائمًا <de>die</de>: <de>das Buch → die Bücher</de>', 'a1-6':'الفعل المساعد في المكان 2، والفعل الثاني في آخر الجملة: <de>Ich kann gut schwimmen.</de>', 'a1-7':'في المفعول به يتغير المذكر فقط: <de>der → den</de> · <de>ein → einen</de>', 'a1-8':'التاريخ بالعدد الترتيبي: <de>am ersten Mai</de> · <de>am zwanzigsten Juni</de>', 'a1-9':'احفظ الجملة كقطعة واحدة واستخدمها كما هي: <de>Ich hätte gern einen Kaffee.</de>', 'a1-10':'احفظ كل حرف جر داخل مثال جاهز: <de>mit dem Bus</de> · <de>in der Stadt</de>', 'a1-11':'الرسالة = تحية + السبب + الطلب + ختام: <de>Liebe Anna, … Viele Grüße</de>', 'a2-perfekt':'<de>haben</de> أو <de>sein</de> في المكان 2، والتصريف الثالث في الآخر: <de>Ich habe Pizza gegessen.</de>', 'a2-dativ':'بعد <de>mit, bei, zu, von, aus, nach</de> يأتي Dativ: <de>mit dem Auto</de>', 'a2-vergleich':'أضف <de>-er</de> واستخدم <de>als</de>: <de>Kairo ist größer als Berlin.</de>', 'a2-weil':'بعد <de>weil</de> و<de>dass</de> يذهب الفعل إلى الآخر: <de>…, weil ich müde bin.</de>', 'a2-reflexiv':'الفعل يعود على صاحبه: <de>Ich freue mich.</de>', 'b1-konj':'<de>würde</de> + الفعل في الآخر للطلب بأدب: <de>Ich würde gern reisen.</de>', 'b1-relativ':'الجملة الموصولة تشرح الاسم، وفعلها في آخرها: <de>Der Mann, der dort steht, …</de>', 'b1-praet':'في الحكايات نستخدم Präteritum: <de>Ich war müde. Er hatte Zeit.</de>'};
function keyRule(l){ var k = KEYRULE[l.id]; if (!k && !l.mission) return '';
  return '<div class="krule" style="--c:' + l.color + '">' + (l.mission ? '<div class="kr-m"><span>🎯</span><div><small>في نهاية الدرس</small><b>' + esc(l.mission) + '</b></div></div>' : '') + (k ? '<div class="kr-r"><span>💡</span><div><small>القاعدة في سطر</small><b>' + rich(k) + '</b></div></div>' : '') + '</div>'; }
function favOn(de){ return !!(S.fav && S.fav[de]); }
function favCount(){ return Object.keys(S.fav || {}).length; }
function iActs(it){ if (!it || !it.de || it.de.indexOf('·') >= 0) return ''; return '<span class="iacts"><span class="ia star' + (favOn(it.de) ? ' on' : '') + '" data-act="star" role="button" aria-label="احفظ">' + (favOn(it.de) ? '★' : '☆') + '</span><span class="ia" data-act="prac" role="button" aria-label="تدرّب">🎤</span></span>'; }
function favToggle(it){ S.fav = S.fav || {}; if (S.fav[it.de]){ delete S.fav[it.de]; toast('اتشالت من المحفوظات'); } else { S.fav[it.de] = {de:it.de, ar:it.ar, mn:it.mn, e:it.e, g:it.g, n:it.n, grp:it.grp, say:it.say, t:Date.now()}; toast('⭐ اتحفظت في المحفوظات'); } save(); }
function itemAct(el, it){ if (!it) return; if (el.dataset.act === 'star'){ favToggle(it); var on = favOn(it.de); $$('[data-act="star"]').forEach(function(s){ var row = s.closest('.it'); if (row && row === el.closest('.it')){ s.classList.toggle('on', on); s.textContent = on ? '★' : '☆'; } }); return; } practiceSheet(it); }
var VOC = null;
var BASEW = {ich:'أنا', du:'أنت', er:'هو', sie:'هي / هم', es:'هو (محايد)', wir:'نحن', ihr:'أنتم', 'sie/sie':'هم / حضرتك', mich:'نفسي / إياي', dich:'إياك', mir:'لي', dir:'لك', und:'و', oder:'أو', aber:'لكن', nicht:'لا / ليس', kein:'لا يوجد', keine:'لا يوجد', ja:'نعم', nein:'لا', in:'في', im:'في الـ', an:'على / عند', am:'في / على الـ', auf:'على', mit:'مع', nach:'إلى / بعد', zu:'إلى', zur:'إلى الـ', zum:'إلى الـ', von:'من', aus:'من', bei:'عند', für:'لـ / من أجل', um:'في الساعة', ist:'يكون (هو)', bin:'أكون', bist:'تكون', sind:'نكون / يكونون', habe:'عندي', hast:'عندك', hat:'عنده', haben:'عندنا / يملك', ein:'واحد / أداة نكرة', eine:'واحدة / أداة نكرة', einen:'أداة نكرة (مفعول)', der:'الـ (مذكر)', die:'الـ (مؤنث / جمع)', das:'الـ (محايد)', den:'الـ (مفعول مذكر)', dem:'الـ (Dativ)', heute:'اليوم', morgen:'غدًا', gestern:'أمس', hier:'هنا', da:'هناك', sehr:'جدًا', gern:'بكل سرور / أحب', gut:'جيد', auch:'أيضًا', noch:'ما زال / أيضًا', schon:'بالفعل', bitte:'من فضلك', danke:'شكرًا', was:'ماذا', wo:'أين', wer:'من', wie:'كيف', wann:'متى', warum:'لماذا', woher:'من أين', wohin:'إلى أين', mein:'ملكي', meine:'ملكي', dein:'ملكك', deine:'ملكك', sein:'ملكه / يكون', ihre:'ملكها / ملكهم', weil:'لأن', dass:'أنّ', kann:'أستطيع / يستطيع', muss:'يجب', will:'أريد', möchte:'أودّ', würde:'كنتُ سـ', deutsch:'الألمانية', lerne:'أتعلم', lernst:'تتعلم', lernt:'يتعلم'};
function vocMap(){ if (VOC) return VOC; VOC = {}; for (var bw in BASEW) VOC[bw] = {de:bw, mn:BASEW[bw]};
  function add(de, mn, it){ var w = de.replace(/^(der|die|das)\s+/i, '').replace(/[!?.,]/g, '').trim(); if (!w || w.indexOf(' ') >= 0 || !mn) return; var k = w.toLowerCase(); if (!VOC[k]) VOC[k] = {de:de, mn:mn, it:it}; }
  itemsOf('all').forEach(function(it){ add(it.de, it.mn, it); });
  SR.a1.concat(SR.a2, SR.b1 || []).forEach(function(l){ l.items.forEach(function(it){ if (it.de.split(' ').length <= 2) add(it.de, it.mn, it); }); });
  return VOC; }
function wordAudio(w){ var c = [w, w.charAt(0).toUpperCase() + w.slice(1), w.toLowerCase()]; var v = vocMap()[w.toLowerCase()]; if (v) c.unshift(v.de, sayOf(v.it || {de:v.de})); for (var i = 0; i < c.length; i++){ if (c[i] && (AUD[c[i]] || AUDS[c[i]])) return c[i]; } return ''; }
function srsRate(it, lvl){ S.srs = S.srs || {}; var b = {hard:0, mid:1, easy:3}[lvl]; var r = S.srs[it.de] || {it:{de:it.de, ar:it.ar, mn:it.mn, e:it.e, g:it.g, n:it.n, grp:it.grp, say:it.say}}; r.b = b; r.d = dayNo() + SRS_INT[b]; S.srs[it.de] = r; save(); }
function scoreRing(pct){ var c = pct >= 85 ? 'var(--ok)' : pct >= 60 ? 'var(--gold)' : 'var(--flame)'; return '<div class="ring" style="--p:' + pct + ';--rc:' + c + '"><b>' + ar(pct) + '</b></div>'; }
function practiceSheet(it){
  stopAudio(); useAudio(it.grp);
  var words = it.de.replace(/[«»"]/g, '').split(/\s+/).filter(Boolean), multi = words.length > 1;
  var m = modal('<div class="prac"><div class="prac-w de">' + esc(it.de) + '</div>' + (it.ar ? '<div class="prac-p arp">' + pron(it.ar) + '</div>' : '') + '<div class="prac-m">' + esc(it.mn || '') + '</div>' +
    '<div class="prac-b"><button class="btn alt" id="pcPlay">🔊 استماع</button><button class="ia big star' + (favOn(it.de) ? ' on' : '') + '" id="pcStar" aria-label="احفظ">' + (favOn(it.de) ? '★' : '☆') + '</button></div>' +
    (multi ? '<div class="prac-h">اضغط على أي كلمة لتعرف معناها:</div><div class="prac-ws">' + words.map(function(w, i){ return '<button class="wchip de" data-w="' + i + '">' + esc(w) + '</button>'; }).join('') + '</div><div class="prac-wm" id="pcWm"></div>' : '') +
    '<div class="prac-say">' + (SRec ? '<button class="micbig" id="pcMic"><span>🎤</span><small>اضغط وقُلها بصوتك</small></button>' : '<div class="sub">الميكروفون غير مدعوم في هذا المتصفح، اكتبها بدلًا من ذلك.</div>') + '<div id="pcRes"></div></div>' +
    '<button class="linkbtn" id="pcTypeT">⌨️ مش قادر تتكلم دلوقتي؟ اكتبها</button><div id="pcType" hidden><input class="inp de" id="pcIn" placeholder="اكتب الكلمة بالألماني" autocomplete="off" autocapitalize="off" spellcheck="false"><button class="btn wide" id="pcChk" style="margin-top:8px">تحقّق</button><div id="pcTR"></div></div>' +
    '<div class="prac-rate"><span>كيف كانت؟</span><button data-rate="easy">😊 سهلة</button><button data-rate="mid">🤔 متوسطة</button><button data-rate="hard">😓 صعبة</button></div>' +
    (waNum() ? '<a class="prac-rep" href="https://wa.me/' + waNum() + '?text=' + encodeURIComponent('🚩 خطأ في الموقع: ' + it.de + ' — ' + (it.mn || '')) + '" target="_blank" rel="noopener">⚑ إبلاغ عن خطأ</a>' : '') + '</div>', 'pracm');
  $('#pcPlay', m).onclick = function(){ play(it); };
  $('#pcStar', m).onclick = function(){ favToggle(it); var on = favOn(it.de); this.classList.toggle('on', on); this.textContent = on ? '★' : '☆'; $$('.it [data-act="star"]').forEach(function(s){ var row = s.closest('.it'); if (row && row.querySelector('.d') && row.querySelector('.d').textContent.indexOf(it.de) >= 0){ s.classList.toggle('on', on); s.textContent = on ? '★' : '☆'; } }); };
  $$('.wchip', m).forEach(function(b){ b.onclick = function(){ var w = words[+b.dataset.w].replace(/[!?.,:;]/g, ''), v = vocMap()[w.toLowerCase()], au = wordAudio(w);
    $$('.wchip', m).forEach(function(x){ x.classList.toggle('on', x === b); });
    $('#pcWm', m).innerHTML = '<b class="de">' + esc(v ? v.de : w) + '</b> ' + (v ? '= ' + esc(v.mn) : '<span class="sub">— كلمة من الجملة، معناها في الترجمة فوق</span>'); if (au) speak(au); }; });
  $$('[data-rate]', m).forEach(function(b){ b.onclick = function(){ srsRate(it, b.dataset.rate); $$('[data-rate]', m).forEach(function(x){ x.classList.toggle('on', x === b); }); toast(b.dataset.rate === 'hard' ? 'هترجعلك بكرة في المراجعة 💪' : b.dataset.rate === 'mid' ? 'هترجعلك بعد يومين' : 'هترجعلك بعد أسبوع 👍'); }; });
  $('#pcTypeT', m).onclick = function(){ var t = $('#pcType', m); t.hidden = !t.hidden; if (!t.hidden) $('#pcIn', m).focus(); };
  $('#pcChk', m).onclick = function(){ var v = $('#pcIn', m).value.trim(); if (!v) return; var sc = Math.round(simil(v, it.de) * 100), good = sc >= 90;
    $('#pcTR', m).innerHTML = '<div class="sres ' + (good ? 'good' : 'mid') + '"><div class="sres-h">' + (good ? '✅ صح! كتبتها مظبوط' : '✍️ قريب، قارن بالصح') + '</div><div class="sres-r"><span>الصح:</span><div class="de">' + esc(it.de) + '</div></div></div>'; skillAdd('write', sc); };
  $('#pcIn', m).onkeydown = function(e){ if (e.key === 'Enter') $('#pcChk', m).click(); };
  var mic = $('#pcMic', m), rec = null;
  if (mic) mic.onclick = function(){ micListen(mic, it.de, function(r, e){ if (!r){ $('#pcRes', m).innerHTML = srErrHTML(e); return; }
      $('#pcRes', m).innerHTML = '<div class="pres">' + scoreRing(r.pct) + '<div><b>' + (r.pct >= 85 ? 'ممتاز! نطقك واضح جدًا 🎉' : r.pct >= 60 ? 'قريب! جرّب مرة كمان 👍' : 'اسمعها تاني وجرّب 🔁') + '</b><div class="de pres-w">' + r.html + '</div><small>سمعتك تقول: <span class="de">' + esc(r.said) + '</span></small></div></div>'; }); };
  var x = m.querySelector('.x'), close0 = x.onclick; x.onclick = function(){ if (srCur){ try{ srCur.abort(); }catch(e){} srCur = null; } close0(); };
}
function viewSaved(){
  var list = Object.keys(S.fav || {}).map(function(k){ return S.fav[k]; }).sort(function(a, b){ return (b.t || 0) - (a.t || 0); });
  list.forEach(function(it){ useAudio(it.grp); });
  var html = '<div class="wrap"><div class="ph sm" style="--c:#FFB020"><a class="back" href="#/train">→ التدريب</a><span class="em">⭐</span><h1>المحفوظات</h1><div class="g">Gespeichert</div><p>الكلمات والجمل اللي حفظتها بالنجمة ☆. اسمعها وراجعها في أي وقت.</p></div>' +
    (list.length ? ctlBar('<button class="chip go2" id="playAll">▶ تشغيل الكل</button>') + '<div class="list">' + list.map(function(it, i){ return itemRow(it, i, '#FFB020'); }).join('') + '</div>' +
      (list.length >= 4 ? '<a class="btn wide" href="#/review" style="display:block;text-align:center;text-decoration:none;margin-top:12px">🔁 راجعها دلوقتي</a>' : '')
      : '<div class="empty"><i>⭐</i>لسه ما حفظتش حاجة.<br>اضغط ☆ جنب أي كلمة أو جملة في الدروس عشان تحفظها هنا.</div>') + footer() + '</div>';
  render(html, 'train'); bindCtl(); bindItems(list);
  list.forEach(function(it){ S.srs = S.srs || {}; if (!S.srs[it.de]) S.srs[it.de] = {b:0, d:dayNo(), it:{de:it.de, ar:it.ar, mn:it.mn, e:it.e, g:it.g, n:it.n, grp:it.grp, say:it.say}}; }); save();
}

var WORK = [
 {id:'cc1', e:'📦', c:'#3A86FF', f:'الكول سنتر', t:'وصل غير ما طلبت', lv:'A2', me:'e', roles:{e:'الموظف', c:'العميل'},
  lines:[['e','Kundenservice, mein Name ist Lena. Wie kann ich Ihnen helfen?','خدمة العملاء، معك لينا. كيف أستطيع مساعدتك؟'],
   ['c','Guten Tag. Ich habe eine falsche Jacke bekommen.','مرحبًا. وصلتني سترة غير التي طلبتها.'],
   ['e','Das tut mir leid. Wie ist Ihre Bestellnummer, bitte?','آسفة لذلك. ما رقم طلبك من فضلك؟'],
   ['c','Die Nummer ist vier, sieben, zwei, neun.','الرقم أربعة، سبعة، اثنان، تسعة.'],
   ['e','Danke. Sie haben eine blaue Jacke bestellt.','شكرًا. لقد طلبت سترة زرقاء.'],
   ['c','Ja, aber ich habe eine grüne bekommen.','نعم، لكن وصلتني خضراء.'],
   ['e','Wir schicken Ihnen heute die blaue Jacke.','سنرسل لك السترة الزرقاء اليوم.'],
   ['e','Die grüne Jacke holen wir kostenlos ab.','ونستلم السترة الخضراء منك مجانًا.'],
   ['c','Super, vielen Dank!','رائع، شكرًا جزيلًا!'],
   ['e','Kann ich sonst noch etwas für Sie tun?','هل أستطيع مساعدتك في شيء آخر؟'],
   ['c','Nein, danke. Auf Wiederhören!','لا، شكرًا. إلى اللقاء!']],
  quiz:[['العميل اتصل. أول جملة تقولها:',['Kundenservice, mein Name ist Lena. Wie kann ich Ihnen helfen?','Was wollen Sie?','Ich habe keine Zeit.'],'ابدأ دائمًا باسم الشركة واسمك، وبعدها اعرض المساعدة.'],
   ['العميل اشتكى من مشكلة. تعتذر إزاي؟',['Das tut mir leid.','Das ist Ihr Problem.','Na und?'],'الاعتذار السريع يهدّي العميل.'],
   ['محتاج رقم الطلب عشان تفتح الملف:',['Wie ist Ihre Bestellnummer, bitte?','Gib mir die Nummer!','Nummer?'],'اطلب بأدب: Sie + bitte.'],
   ['قول للعميل الحل:',['Wir schicken Ihnen heute die blaue Jacke.','Das geht leider nicht.','Rufen Sie morgen wieder an.'],'العميل عايز حل واضح ومعاه ميعاد.'],
   ['قبل ما تقفل المكالمة:',['Kann ich sonst noch etwas für Sie tun?','Tschüss!','Fertig.'],'سؤال ختامي مهني قبل إنهاء المكالمة.']],
  voc:[['die Bestellung','الطلب'],['die Bestellnummer','رقم الطلب'],['die Lieferung','التوصيل'],['der Kunde','العميل'],['das Paket','الطرد'],['kostenlos','مجانًا'],['umtauschen','يستبدل'],['die Rücksendung','الإرجاع'],['Einen Moment, bitte.','لحظة من فضلك.'],['Auf Wiederhören!','إلى اللقاء (في الهاتف)']]},
 {id:'cc2', e:'🌐', c:'#06A77D', f:'الكول سنتر', t:'الإنترنت لا يعمل', lv:'A2', me:'e', roles:{e:'الموظف', c:'العميل'},
  lines:[['e','Guten Tag, technischer Support. Was kann ich für Sie tun?','مرحبًا، الدعم الفني. ماذا أستطيع أن أفعل لك؟'],
   ['c','Mein Internet funktioniert seit gestern nicht.','الإنترنت عندي لا يعمل منذ أمس.'],
   ['e','Das tut mir leid. Haben Sie den Router schon neu gestartet?','آسف لذلك. هل أعدت تشغيل الراوتر؟'],
   ['c','Ja, aber es geht immer noch nicht.','نعم، لكنه ما زال لا يعمل.'],
   ['e','Leuchtet die Lampe am Router rot oder grün?','هل لمبة الراوتر حمراء أم خضراء؟'],
   ['c','Sie leuchtet rot.','إنها حمراء.'],
   ['e','Ich prüfe Ihre Leitung. Einen Moment, bitte.','سأفحص الخط. لحظة من فضلك.'],
   ['e','Es gibt eine Störung in Ihrer Straße.','يوجد عطل في شارعك.'],
   ['e','Morgen funktioniert alles wieder.','غدًا سيعمل كل شيء من جديد.'],
   ['c','Okay, danke für die Information.','حسنًا، شكرًا على المعلومة.'],
   ['e','Gern. Ich wünsche Ihnen einen schönen Tag.','على الرحب. أتمنى لك يومًا سعيدًا.']],
  quiz:[['اسأل العميل: جرّب يعيد تشغيل الراوتر؟',['Haben Sie den Router schon neu gestartet?','Ist der Router kaputt?','Kaufen Sie einen neuen Router.'],'دايمًا ابدأ بالخطوة الأسهل.'],
   ['هتفحص حاجة، اطلب منه يستنى:',['Einen Moment, bitte.','Warten Sie!','Später.'],'Einen Moment, bitte من أهم جمل الكول سنتر.'],
   ['اشرح له سبب المشكلة:',['Es gibt eine Störung in Ihrer Straße.','Ich weiß es nicht.','Das ist normal.'],'العميل بيرتاح لما يعرف السبب.'],
   ['طمّنه إمتى المشكلة تتحل:',['Morgen funktioniert alles wieder.','Vielleicht nie.','Keine Ahnung.'],'إدي العميل ميعاد واضح.'],
   ['اختم المكالمة:',['Ich wünsche Ihnen einen schönen Tag.','Ende.','Rufen Sie nicht wieder an.'],'ختام مهذب يسيب انطباع حلو.']],
  voc:[['der Router','الراوتر'],['die Leitung','الخط'],['die Störung','العطل'],['funktionieren','يعمل'],['neu starten','يعيد التشغيل'],['prüfen','يفحص'],['der Vertrag','العقد'],['die Rechnung','الفاتورة'],['das Passwort','كلمة المرور'],['der Techniker','الفنّي']]},
 {id:'nurse', e:'🩺', c:'#E63946', f:'التمريض', t:'استقبال مريض', lv:'A2', me:'e', roles:{e:'الممرضة', c:'المريض'},
  lines:[['e','Guten Morgen, ich bin Schwester Lena. Wie geht es Ihnen heute?','صباح الخير، أنا الممرضة لينا. كيف حالك اليوم؟'],
   ['c','Nicht so gut. Ich habe starke Kopfschmerzen.','لست بخير. عندي صداع شديد.'],
   ['e','Seit wann haben Sie die Schmerzen?','منذ متى عندك الألم؟'],
   ['c','Seit gestern Abend.','منذ مساء أمس.'],
   ['e','Ich messe jetzt Ihren Blutdruck.','سأقيس ضغطك الآن.'],
   ['c','Ist alles in Ordnung?','هل كل شيء على ما يرام؟'],
   ['e','Der Blutdruck ist ein bisschen hoch. Ich sage es dem Arzt.','الضغط مرتفع قليلًا. سأخبر الطبيب.'],
   ['e','Haben Sie Allergien gegen Medikamente?','هل عندك حساسية من أي دواء؟'],
   ['c','Nein, ich habe keine Allergien.','لا، ليس عندي حساسية.'],
   ['e','Wenn Sie etwas brauchen, drücken Sie bitte die Klingel.','إذا احتجت شيئًا، اضغط الجرس من فضلك.'],
   ['c','Vielen Dank, Schwester.','شكرًا جزيلًا يا ممرضة.']],
  quiz:[['أول ما تدخل على المريض:',['Guten Morgen, ich bin Schwester Lena. Wie geht es Ihnen heute?','Was ist los mit dir?','Schnell, bitte!'],'عرّف نفسك واسأل عن حاله باحترام (Sie).'],
   ['اسأل من إمتى الألم:',['Seit wann haben Sie die Schmerzen?','Wo ist der Arzt?','Warum haben Sie Schmerzen?'],'Seit wann = منذ متى.'],
   ['قول له إنك هتقيس الضغط:',['Ich messe jetzt Ihren Blutdruck.','Ich messe jetzt Ihr Gewicht.','Ich gebe Ihnen eine Spritze.'],'Blutdruck = ضغط الدم.'],
   ['اسأله عن الحساسية من الأدوية:',['Haben Sie Allergien gegen Medikamente?','Haben Sie Hunger?','Haben Sie Kinder?'],'سؤال مهم جدًا قبل أي دواء.'],
   ['قول له يضغط الجرس لو احتاج حاجة:',['Wenn Sie etwas brauchen, drücken Sie bitte die Klingel.','Rufen Sie mich nicht.','Gehen Sie nach Hause.'],'الجملة دي بتطمّن المريض.']],
  voc:[['der Blutdruck','ضغط الدم'],['das Fieber','الحمّى'],['die Schmerzen','الألم'],['das Medikament','الدواء'],['die Spritze','الحقنة'],['die Allergie','الحساسية'],['der Patient','المريض'],['die Station','القسم'],['die Klingel','الجرس'],['messen','يقيس']]},
 {id:'hotel', e:'🏨', c:'#C9971C', f:'الفنادق', t:'تسجيل دخول ضيف', lv:'A2', me:'e', roles:{e:'موظف الاستقبال', c:'الضيف'},
  lines:[['e','Herzlich willkommen im Hotel Sonne! Mein Name ist Lili. Wie kann ich Ihnen helfen?','أهلًا بك في فندق زونه! اسمي ليلي. كيف أستطيع مساعدتك؟'],
   ['c','Guten Abend. Ich habe ein Zimmer reserviert.','مساء الخير. لقد حجزت غرفة.'],
   ['e','Auf welchen Namen, bitte?','باسم مَن من فضلك؟'],
   ['c','Auf den Namen Hassan.','باسم حسن.'],
   ['e','Ein Einzelzimmer für drei Nächte. Darf ich bitte Ihren Ausweis sehen?','غرفة مفردة لثلاث ليالٍ. هل يمكنني رؤية بطاقتك من فضلك؟'],
   ['c','Hier, bitte. Ist das Frühstück inklusive?','تفضل. هل الإفطار مشمول؟'],
   ['e','Ja, das Frühstück ist von sieben bis zehn Uhr.','نعم، الإفطار من السابعة حتى العاشرة.'],
   ['e','Hier ist Ihre Schlüsselkarte. Ihr Zimmer ist im dritten Stock.','هذا كارت المفتاح. غرفتك في الطابق الثالث.'],
   ['c','Vielen Dank. Gibt es WLAN?','شكرًا جزيلًا. هل يوجد واي فاي؟'],
   ['e','Ja, das Passwort steht auf der Karte. Einen schönen Aufenthalt!','نعم، كلمة السر مكتوبة على الكارت. إقامة سعيدة!']],
  quiz:[['الضيف دخل الفندق:',['Herzlich willkommen! Wie kann ich Ihnen helfen?','Was willst du?','Wir sind voll.'],'الترحيب أول حاجة في الفندق.'],
   ['اسأل الحجز باسم مين:',['Auf welchen Namen, bitte?','Wie heißt du?','Name!'],'السؤال ده بالظبط اللي بيتقال في الفنادق.'],
   ['اطلب بطاقة الهوية:',['Darf ich bitte Ihren Ausweis sehen?','Zeig mir deinen Pass!','Haben Sie Geld?'],'Darf ich…? = هل يمكنني…؟ طلب مؤدب جدًا.'],
   ['قول له غرفته في الدور التالت:',['Ihr Zimmer ist im dritten Stock.','Das Zimmer ist irgendwo.','Suchen Sie selbst.'],'im dritten Stock = في الطابق الثالث.'],
   ['ودّع الضيف:',['Einen schönen Aufenthalt!','Gute Besserung!','Bis gleich, Mama!'],'Gute Besserung تتقال للمريض، مش للضيف 😉']],
  voc:[['das Einzelzimmer','غرفة مفردة'],['das Doppelzimmer','غرفة مزدوجة'],['die Reservierung','الحجز'],['der Ausweis','بطاقة الهوية'],['das Frühstück','الإفطار'],['die Schlüsselkarte','كارت المفتاح'],['der Stock','الطابق'],['der Aufenthalt','الإقامة'],['die Rezeption','الاستقبال'],['auschecken','يغادر الفندق']]},
 {id:'rest', e:'🍽️', c:'#FF6B2C', f:'المطاعم', t:'أخذ الطلب', lv:'A2', me:'e', roles:{e:'النادل', c:'الزبون'},
  lines:[['e','Guten Tag! Haben Sie reserviert?','نهارك سعيد! هل حجزت؟'],
   ['c','Nein. Einen Tisch für zwei Personen, bitte.','لا. طاولة لشخصين من فضلك.'],
   ['e','Gern, hier entlang. Hier ist die Speisekarte.','بكل سرور، من هنا. هذه قائمة الطعام.'],
   ['e','Was möchten Sie trinken?','ماذا تحبون أن تشربوا؟'],
   ['c','Zwei Wasser, bitte.','ماءان من فضلك.'],
   ['e','Haben Sie schon gewählt?','هل اخترتم؟'],
   ['c','Ja, ich nehme die Hähnchensuppe.','نعم، سآخذ شوربة الدجاج.'],
   ['e','Sehr gern. Möchten Sie noch etwas dazu?','بكل سرور. هل تريد شيئًا معها؟'],
   ['c','Nein, danke. Die Rechnung, bitte.','لا، شكرًا. الحساب من فضلك.'],
   ['e','Das macht zusammen achtzehn Euro.','الحساب كله ثمانية عشر يورو.'],
   ['c','Hier sind zwanzig Euro. Stimmt so.','تفضل عشرون يورو. احتفظ بالباقي.'],
   ['e','Vielen Dank! Einen schönen Abend noch!','شكرًا جزيلًا! أتمنى لكم مساءً سعيدًا!']],
  quiz:[['زبون دخل المطعم. تسأله:',['Haben Sie reserviert?','Warum sind Sie hier?','Setzen Sie sich irgendwo.'],'أول سؤال في المطعم: الحجز.'],
   ['تديله القائمة:',['Hier ist die Speisekarte.','Hier ist die Rechnung.','Hier ist die Tür.'],'Speisekarte = قائمة الطعام، Rechnung = الحساب.'],
   ['تسأل عن المشروبات:',['Was möchten Sie trinken?','Trinken Sie Wasser!','Durst?'],'möchten = يحب / يود، أكثر أدبًا.'],
   ['تسأل لو اختاروا الأكل:',['Haben Sie schon gewählt?','Essen Sie jetzt!','Sind Sie satt?'],'gewählt = اخترتم.'],
   ['تقول الحساب كله:',['Das macht zusammen achtzehn Euro.','Geben Sie mir Geld.','Achtzehn.'],'Das macht… = الحساب…']],
  voc:[['die Speisekarte','قائمة الطعام'],['die Rechnung','الحساب'],['der Tisch','الطاولة'],['reservieren','يحجز'],['bestellen','يطلب'],['die Vorspeise','المقبّلات'],['das Hauptgericht','الطبق الرئيسي'],['die Nachspeise','الحلوى'],['das Trinkgeld','البقشيش'],['Stimmt so.','احتفظ بالباقي.']]},
 {id:'job', e:'🤝', c:'#8338EC', f:'مقابلة العمل', t:'مقابلة شغل', lv:'B1', me:'c', roles:{e:'المدير', c:'أنت'},
  lines:[['e','Guten Tag, Herr Mohannad. Bitte nehmen Sie Platz.','نهارك سعيد يا أستاذ مهند. تفضل بالجلوس.'],
   ['c','Guten Tag. Vielen Dank für die Einladung.','نهارك سعيد. شكرًا جزيلًا على الدعوة.'],
   ['e','Erzählen Sie bitte etwas über sich.','حدّثنا عن نفسك من فضلك.'],
   ['c','Ich heiße Mohannad und komme aus Ägypten.','اسمي مهند، وأنا من مصر.'],
   ['c','Ich bin Krankenpfleger und habe vier Jahre Berufserfahrung.','أنا ممرض، ولديّ خبرة أربع سنوات.'],
   ['e','Warum möchten Sie in Deutschland arbeiten?','لماذا تريد العمل في ألمانيا؟'],
   ['c','Ich möchte neue Erfahrungen sammeln.','أريد أن أكتسب خبرات جديدة.'],
   ['e','Was sind Ihre Stärken?','ما نقاط قوتك؟'],
   ['c','Ich bin zuverlässig und arbeite gern im Team.','أنا شخص يُعتمد عليه، وأحب العمل في فريق.'],
   ['e','Haben Sie noch Fragen an uns?','هل لديك أسئلة لنا؟'],
   ['c','Ja. Wann kann ich mit der Arbeit beginnen?','نعم. متى يمكنني أن أبدأ العمل؟'],
   ['e','Wir melden uns nächste Woche bei Ihnen.','سنتواصل معك الأسبوع القادم.']],
  quiz:[['أول ما تقعد، اشكرهم على الدعوة:',['Vielen Dank für die Einladung.','Endlich!','Was gibt es?'],'الشكر في الأول بيسيب انطباع حلو.'],
   ['قالولك احكي عن نفسك:',['Ich heiße Mohannad und komme aus Ägypten.','Das ist privat.','Lesen Sie meinen Lebenslauf.'],'ابدأ باسمك وبلدك، وبعدها شغلك.'],
   ['سألوك عن خبرتك:',['Ich habe vier Jahre Berufserfahrung.','Ich habe vier Jahre.','Erfahrung ist nicht wichtig.'],'Berufserfahrung = خبرة في المهنة.'],
   ['سألوك عن نقاط قوتك:',['Ich bin zuverlässig und arbeite gern im Team.','Ich habe keine Schwächen.','Ich schlafe gern lange.'],'zuverlässig = يُعتمد عليه، كلمة مهمة جدًا في ألمانيا.'],
   ['اسأل سؤال في آخر المقابلة:',['Wann kann ich mit der Arbeit beginnen?','Wie viel Urlaub habe ich sofort?','Nein. Tschüss.'],'السؤال في الآخر بيبيّن إنك مهتم.']],
  voc:[['der Lebenslauf','السيرة الذاتية'],['die Bewerbung','طلب التوظيف'],['die Berufserfahrung','الخبرة المهنية'],['das Vorstellungsgespräch','مقابلة العمل'],['die Stärke','نقطة القوة'],['zuverlässig','يُعتمد عليه'],['das Gehalt','الراتب'],['die Probezeit','فترة التجربة'],['sich bewerben','يتقدّم لوظيفة'],['der Arbeitsvertrag','عقد العمل']]}
];

/* ---------------- PHASE 3: speaking & listening lab ---------------- */
var LABS = [
  {id:'repeat', e:'🔁', c:'#5B3DF5', t:'كرّر بعدي', d:'اسمع وكرّر ×2 أو ×5 أو بلا توقف، واخفِ النص لتحفظ'},
  {id:'speed', e:'🐢', c:'#06A77D', t:'سلّم السرعة', d:'نفس الجملة: بطيء ← عادي ← أسرع'},
  {id:'dict', e:'✍️', c:'#FF6B2C', t:'الإملاء', d:'اسمع الجملة واكتبها، والتصحيح كلمة كلمة'},
  {id:'pairs', e:'👂', c:'#E63946', t:'فرّق بين الكلمات', d:'كلمات نطقها قريب: Hund أم Mund؟'},
  {id:'conj', e:'🧩', c:'#3A86FF', t:'صرّف مع الضمائر', d:'ich, du, er… اختر التصريف الصح'},
  {id:'rule', e:'🗣️', c:'#8338EC', t:'قواعد بالكلام', d:'اقرأ المعنى بالعربي وقل الجملة بالألماني بصوتك'}
];
function labTile(x){ return '<a class="labt" href="#/lab/' + x.id + '" style="--c:' + x.c + '"><span class="labi">' + x.e + '</span><b>' + x.t + '</b><small>' + x.d + '</small></a>'; }
function viewLab(id){
  if (id && LAB_FN[id]) return LAB_FN[id]();
  var html = '<div class="wrap"><div class="ph labph" style="--c:#06A77D"><span class="em">🎤</span><h1>النطق والاستماع</h1><div class="g">Hören & Sprechen</div><p>درّب ودنك ولسانك: اسمع، كرّر، اكتب، واتكلم بصوتك.</p></div>' +
    '<a class="workc" href="#/work"><span class="em">💼</span><div><small>جديد</small><b>ألماني للوظائف</b><span>كول سنتر، تمريض، فنادق، مطاعم، ومقابلة شغل: مكالمات كاملة تتدرب عليها بصوتك</span></div><span class="gobtn">ابدأ ‹</span></a>' +
    lenaTip('lab') + '<div class="sh"><h2>🎧 تمارين السمع والنطق</h2></div><div class="labg">' + LABS.map(labTile).join('') + '</div>' +
    '<div class="sh"><h2>💬 محادثات مع لينا</h2></div><p class="sub" style="margin:-4px 0 10px">لينا بتكلمك في مواقف حقيقية، وإنت ترد بصوتك أو تختار الرد.</p><div class="labg">' +
    SCENES.map(function(s){ return '<a class="labt sm" href="#/scene/' + s.id + '" style="--c:' + s.c + '"><span class="labi">' + s.e + '</span><b>' + esc(s.t) + '</b><small>' + esc(s.ds || '') + '</small></a>'; }).join('') + '</div>' + footer() + '</div>';
  render(html, 'lab'); bindTip();
}
function labHead(id, back){ var x = LABS.find(function(l){ return l.id === id; }); return '<div class="ph sm" style="--c:' + x.c + '"><a class="back" href="' + (back || '#/lab') + '">→ النطق</a><span class="em">' + x.e + '</span><h1>' + x.t + '</h1><p>' + x.d + '</p></div>'; }
function labUnit(){ var u = S.labU != null ? S.labU : curUnit(); return UDEF[u] ? u : 0; }
function labUnitBar(){ return '<div class="ulpick">' + UDEF.map(function(u, i){ return '<button class="chip' + (i === labUnit() ? ' on' : '') + '" data-lu="' + i + '">' + u.e + ' ' + ar(i + 1) + '</button>'; }).join('') + '</div>'; }
function bindUnitBar(again){ $$('[data-lu]').forEach(function(b){ b.onclick = function(){ S.labU = +b.dataset.lu; save(); again(); }; }); }
function labPool(minW, maxW){ var i = labUnit(), items = unitItems(i).filter(function(x){ var n = x.de.split(' ').length; return n >= (minW || 1) && n <= (maxW || 12) && !conjPron(x); });
  uIds(i).forEach(function(id){ var u = UMAP[id]; useAudio(u.kind === 'topic' ? u.key : u.kind); }); return uniqBy(items, function(x){ return x.de; }); }
function clipB64(text, slow){ return slow ? (AUDS[text] || '') : (AUD[text] || ''); }
var labA = null;
function labPlay(text, mode, done){ /* mode: 'slow' | 'normal' | 'fast' — its own player; the site settings are not touched */
  stopAudio(); if (labA){ try{ labA.pause(); }catch(e){} }
  var slow = mode === 'slow', b = slow ? (AUDS[text] || AUD[text]) : AUD[text];
  if (!b){ if (slow && !AUDS[text] && IDX){ } return speak(text, done); }
  var a = new Audio('data:audio/mpeg;base64,' + b); labA = a; a.playbackRate = mode === 'fast' ? 1.18 : (slow && !AUDS[text] ? 0.8 : 1);
  try{ a.preservesPitch = true; a.webkitPreservesPitch = true; }catch(e){}
  a.onended = function(){ if (done) done(); }; a.onerror = function(){ speak(text, done); };
  var pr = a.play(); if (pr && pr.catch) pr.catch(function(err){ if (!err || err.name !== 'AbortError') speak(text, done); });
  leaveHook = function(){ try{ a.pause(); }catch(e){} };
}
function micListen(btn, target, cb){
  var lbl = btn.querySelector('small');
  srListen(function(on){ btn.classList.toggle('live', on); if (lbl) lbl.textContent = on ? 'بسمعك… اضغط لما تخلص' : 'اضغط واتكلم'; }, function(alts, err){
    if (!alts){ cb(null, err); return; }
    var best = alts.map(function(s){ return {s:s, sc:simil(wnorm(s), wnorm(target))}; }).sort(function(a, b){ return b.sc - a.sc; })[0], sw = wnorm(best.s).split(' ').filter(Boolean);
    var mw = target.split(/\s+/), hit = 0, col = mw.map(function(w){ var n = wnorm(w), ok = !n || n.split(' ').every(function(p){ return wHit(p, sw); }); if (ok) hit++; return '<span class="' + (ok ? 'wok' : 'wno') + '">' + esc(w) + '</span>'; }).join(' ');
    var pct = Math.round(Math.max(best.sc, hit / mw.length) * 100); skillAdd('speak', pct); cb({pct:pct, said:best.s, html:col}); });
}
function micResHTML(res, err){ if (!res) return srErrHTML(err);
  return '<div class="pres">' + scoreRing(res.pct) + '<div><b>' + (res.pct >= 85 ? 'ممتاز! نطقك واضح جدًا 🎉' : res.pct >= 60 ? 'قريب! جرّب مرة كمان 👍' : 'اسمعها تاني وجرّب 🔁') + '</b><div class="de pres-w">' + res.html + '</div><small>سمعتك تقول: <span class="de">' + esc(res.said) + '</span></small></div></div>'; }
/* record yourself and listen back */
var recM = null;
function recToggle(btn, out){
  if (recM && recM.state === 'recording'){ recM.stop(); return; }
  if (!navigator.mediaDevices || !window.MediaRecorder){ toast('التسجيل غير مدعوم في هذا المتصفح'); return; }
  stopAudio();
  navigator.mediaDevices.getUserMedia({audio:true}).then(function(st){ var ch = []; recM = new MediaRecorder(st);
    recM.ondataavailable = function(e){ if (e.data && e.data.size) ch.push(e.data); };
    recM.onstop = function(){ st.getTracks().forEach(function(t){ t.stop(); }); btn.classList.remove('live'); btn.innerHTML = '⏺ سجّل صوتك'; var url = URL.createObjectURL(new Blob(ch, {type:recM.mimeType || 'audio/webm'})); out.innerHTML = '<div class="myrec"><span>🎧 صوتك:</span><audio controls src="' + url + '"></audio></div>'; };
    recM.start(); btn.classList.add('live'); btn.innerHTML = '⏹ إيقاف التسجيل';
    leaveHook = function(){ try{ if (recM && recM.state === 'recording') recM.stop(); }catch(e){} };
  }).catch(function(){ toast('اسمح للموقع باستخدام الميكروفون'); });
}
var LAB_FN = {
  repeat: function(){
    var pool = labPool(1, 12), i = 0, reps = S.labRep || 2, hide = false, run = 0;
    render('<div class="wrap">' + labHead('repeat') + labUnitBar() + '<div id="lab"></div></div>', 'lab'); bindUnitBar(LAB_FN.repeat);
    function draw(){ var it = pool[i], box = $('#lab'); if (!it){ box.innerHTML = '<div class="empty"><i>🪐</i>لا توجد جمل في هذه الوحدة.</div>'; return; }
      box.innerHTML = '<div class="rcard2"><div class="rc-n">' + ar(i + 1) + ' / ' + ar(pool.length) + '</div><div class="rc-de de' + (hide ? ' blur' : '') + '" id="rcDe">' + esc(it.de) + '</div><div class="rc-mn">' + esc(it.mn || '') + '</div>' +
        '<div class="seg rc-seg">' + [1, 2, 5, 10, 0].map(function(n){ return '<button data-rp="' + n + '" class="' + (reps === n ? 'on' : '') + '">' + (n ? '×' + n : '∞') + '</button>'; }).join('') + '</div>' +
        '<div class="rc-ctl"><button class="btn alt" id="rcPrev">‹ السابق</button><button class="btn flame rc-go" id="rcGo">▶ ابدأ</button><button class="btn alt" id="rcNext">التالي ›</button></div>' +
        '<label class="rc-hide"><input type="checkbox" id="rcHide"' + (hide ? ' checked' : '') + '> 🙈 إخفاء النص (للحفظ)</label>' +
        '<div class="rc-rec"><button class="btn alt" id="rcRec">⏺ سجّل صوتك</button><div id="rcOut"></div></div></div>';
      $$('[data-rp]', box).forEach(function(b){ b.onclick = function(){ reps = +b.dataset.rp; S.labRep = reps; save(); $$('[data-rp]', box).forEach(function(x){ x.classList.toggle('on', x === b); }); }; });
      $('#rcHide').onchange = function(){ hide = this.checked; $('#rcDe').classList.toggle('blur', hide); };
      $('#rcPrev').onclick = function(){ stop(); i = (i - 1 + pool.length) % pool.length; draw(); };
      $('#rcNext').onclick = function(){ stop(); i = (i + 1) % pool.length; draw(); };
      $('#rcRec').onclick = function(){ recToggle(this, $('#rcOut')); };
      $('#rcGo').onclick = function(){ if (run){ stop(); return; } start(); };
    }
    function stop(){ run = 0; stopAudio(); var g = $('#rcGo'); if (g){ g.textContent = '▶ ابدأ'; g.classList.remove('stopbtn'); } }
    function start(){ var it = pool[i], n = 0, my = ++run; var g = $('#rcGo'); g.textContent = '⏹ إيقاف'; g.classList.add('stopbtn'); dayLog().s = S.plan && S.plan.skill === 'speak' ? 1 : dayLog().s; save();
      (function loop(){ if (run !== my) return; speak(sayOf(it), function(){ if (run !== my) return; n++; var g2 = $('#rcGo'); if (g2) g2.textContent = '⏹ إيقاف (' + ar(n) + (reps ? '/' + ar(reps) : '') + ')';
        if (reps && n >= reps){ stop(); markHeard(it.u || '', null); return; } setTimeout(loop, Math.max(1600, sayOf(it).length * 90)); }); })(); }
    draw();
  },
  speed: function(){
    var pool = labPool(2, 12), i = 0;
    render('<div class="wrap">' + labHead('speed') + labUnitBar() + '<div id="lab"></div></div>', 'lab'); bindUnitBar(LAB_FN.speed);
    if (S.set.speed !== 'slow'){ uIds(labUnit()).forEach(function(id){ var u = UMAP[id], g = u.kind === 'topic' ? u.key : u.kind; if (IDX && IDX[g]) (IDX[g].s || []).forEach(addScript); }); }
    function draw(){ var it = pool[i], box = $('#lab'); if (!it){ box.innerHTML = '<div class="empty"><i>🪐</i>لا توجد جمل في هذه الوحدة.</div>'; return; }
      box.innerHTML = '<div class="rcard2"><div class="rc-n">' + ar(i + 1) + ' / ' + ar(pool.length) + '</div><div class="rc-de de">' + esc(it.de) + '</div><div class="rc-mn">' + esc(it.mn || '') + '</div>' +
        '<div class="ladr"><button data-sp3="slow"><span>🐢</span><b>بطيء</b></button><button data-sp3="normal"><span>🚶</span><b>عادي</b></button><button data-sp3="fast"><span>🚀</span><b>أسرع</b></button></div>' +
        '<button class="btn flame wide" id="spAll">▶ السلّم كله (3 مرات)</button>' +
        '<div class="rc-ctl"><button class="btn alt" id="rcPrev">‹ السابق</button><button class="btn alt" id="rcNext">التالي ›</button></div></div>';
      var t = sayOf(it);
      $$('[data-sp3]', box).forEach(function(b){ b.onclick = function(){ $$('[data-sp3]', box).forEach(function(x){ x.classList.toggle('on', x === b); }); labPlay(t, b.dataset.sp3); }; });
      $('#spAll').onclick = function(){ var bs = $$('[data-sp3]', box), k = 0; (function nx(){ if (k >= 3 || !$('#spAll')) return; bs.forEach(function(x, j){ x.classList.toggle('on', j === k); }); labPlay(t, ['slow', 'normal', 'fast'][k], function(){ k++; setTimeout(nx, 700); }); })(); };
      $('#rcPrev').onclick = function(){ i = (i - 1 + pool.length) % pool.length; draw(); };
      $('#rcNext').onclick = function(){ i = (i + 1) % pool.length; draw(); };
    }
    draw();
  },
  dict: function(){
    var pool = shuffle(labPool(2, 9)).slice(0, 8), i = 0, ok = 0;
    render('<div class="wrap">' + labHead('dict') + labUnitBar() + '<div id="lab"></div></div>', 'lab'); bindUnitBar(LAB_FN.dict);
    function q(){ var box = $('#lab');
      if (!pool.length){ box.innerHTML = '<div class="empty"><i>🪐</i>لا توجد جمل في هذه الوحدة.</div>'; return; }
      if (i >= pool.length){ var pct = Math.round(ok / pool.length * 100); skillAdd('listen', pct); skillAdd('write', pct); addXP(ok * 8 + 10); box.innerHTML = '<div class="result"><div class="em">' + (pct >= 80 ? '🏆' : '✍️') + '</div><h2>' + ar(ok) + ' من ' + ar(pool.length) + '</h2><p class="sub">جمل كتبتها صح تقريبًا.</p><button class="btn" id="dAgain">🔁 جولة جديدة</button></div>'; $('#dAgain').onclick = LAB_FN.dict; return; }
      var it = pool[i];
      box.innerHTML = '<div class="gamebar"><div class="prog"><i style="width:' + (i / pool.length * 100) + '%"></i></div><span class="hearts">' + ar(i + 1) + '/' + ar(pool.length) + '</span></div>' +
        '<div class="rcard2"><button class="play big" id="dPlay" aria-label="استمع">' + ICON_PLAY + '</button><div class="sub">اسمع واكتب اللي سمعته بالألماني</div><button class="linkbtn" id="dSlow">🐢 اسمعها أبطأ</button>' +
        '<textarea class="inp de" id="dIn" rows="2" placeholder="اكتب هنا…" autocapitalize="off" autocomplete="off" spellcheck="false"></textarea><button class="btn wide" id="dChk">تحقّق</button><div id="dRes"></div></div>';
      var t = sayOf(it); $('#dPlay').onclick = function(){ labPlay(t, 'normal'); }; $('#dSlow').onclick = function(){ labPlay(t, 'slow'); }; setTimeout(function(){ labPlay(t, 'normal'); }, 300);
      $('#dChk').onclick = function(){ var v = $('#dIn').value.trim(); if (!v) return toast('اكتب الجملة الأول'); var uw = wnorm(v).split(' ');
        var col = it.de.split(/\s+/).map(function(w){ var n = wnorm(w), good = !n || n.split(' ').every(function(p){ return uw.indexOf(p) >= 0; }); return '<span class="' + (good ? 'wok' : 'wno') + '">' + esc(w) + '</span>'; }).join(' ');
        var sc = simil(v, it.de), good = sc >= .85; if (good) ok++; fx(good); srsTouch(it, good); if (!good) addMistake(it);
        $('#dRes').innerHTML = '<div class="sres ' + (good ? 'good' : 'mid') + '"><div class="sres-h">' + (good ? '✅ ممتاز!' : '✍️ قارن كتابتك بالصح (الأحمر غلط أو ناقص)') + '</div><div class="de" style="font-size:18px">' + col + '</div><small>' + esc(it.mn || '') + '</small></div><button class="btn wide" id="dNext" style="margin-top:10px">التالي ›</button>';
        $('#dChk').disabled = true; $('#dNext').onclick = function(){ i++; q(); }; };
      $('#dIn').onkeydown = function(e){ if (e.key === 'Enter' && !e.shiftKey){ e.preventDefault(); if (!$('#dChk').disabled) $('#dChk').click(); else if ($('#dNext')) $('#dNext').click(); } };
    }
    q();
  },
  pairs: function(){
    var P = [['der Hund','الكلب','animals','der Mund','الفم','body'],['das Haus','البيت','home','die Maus','الفأر','animals'],['der Kuchen','الكعكة','food','die Küche','المطبخ','home'],['das Bett','السرير','home','das Bad','الحمّام','home'],['die Hand','اليد','body','der Hund','الكلب','animals'],['das Ohr','الأذن','body','die Uhr','الساعة','abc'],['der Fisch','السمك','food','der Tisch','الطاولة','home'],['das Brot','الخبز','food','rot','أحمر','colors'],['der Sohn','الابن','family','die Sonne','الشمس','weather'],['der Tee','الشاي','food','zehn','عشرة','num'],['der Bus','الأتوبيس','travel','der Fuß','القدم','body'],['das Ei','البيضة','food','das Eis','الآيس كريم','food'],['zwei','اثنان','num','drei','ثلاثة','num'],['elf','أحد عشر','num','zwölf','اثنا عشر','num'],['blau','أزرق','colors','grau','رمادي','colors'],['der Vater','الأب','family','das Wasser','الماء','food']];
    P.forEach(function(p){ useAudio(p[2]); useAudio(p[5]); });
    var qs = shuffle(P).slice(0, 10), i = 0, ok = 0;
    render('<div class="wrap">' + labHead('pairs') + '<div id="lab"></div></div>', 'lab');
    function q(){ var box = $('#lab');
      if (i >= qs.length){ var pct = Math.round(ok / qs.length * 100); skillAdd('listen', pct); addXP(ok * 6 + 10); box.innerHTML = '<div class="result"><div class="em">' + (pct >= 80 ? '🏆' : '👂') + '</div><h2>' + ar(ok) + ' من ' + ar(qs.length) + '</h2><p class="sub">ودنك بتتحسن مع كل جولة.</p><button class="btn" id="pAgain">🔁 جولة جديدة</button></div>'; $('#pAgain').onclick = LAB_FN.pairs; return; }
      var p = qs[i], pick = Math.random() < .5 ? 0 : 1, ans = pick ? [p[3], p[4]] : [p[0], p[1]], opts = shuffle([[p[0], p[1]], [p[3], p[4]]]);
      box.innerHTML = '<div class="gamebar"><div class="prog"><i style="width:' + (i / qs.length * 100) + '%"></i></div><span class="hearts">' + ar(i + 1) + '/' + ar(qs.length) + '</span></div>' +
        '<div class="rcard2"><button class="play big" id="pPlay" aria-label="استمع">' + ICON_PLAY + '</button><div class="sub">سمعت أنهي كلمة؟</div><div class="pairo">' + opts.map(function(o, k){ return '<button class="opt" data-pp="' + k + '"><b class="de">' + esc(o[0]) + '</b><small>' + esc(o[1]) + '</small></button>'; }).join('') + '</div><div id="pRes"></div></div>';
      $('#pPlay').onclick = function(){ speak(ans[0]); }; setTimeout(function(){ speak(ans[0]); }, 350);
      $$('[data-pp]', box).forEach(function(b){ b.onclick = function(){ var good = opts[+b.dataset.pp][0] === ans[0]; if (good) ok++; fx(good);
        $$('[data-pp]', box).forEach(function(x){ x.disabled = true; if (opts[+x.dataset.pp][0] === ans[0]) x.classList.add('ok'); }); if (!good) b.classList.add('no');
        $('#pRes').innerHTML = '<div class="rc-ctl" style="margin-top:12px"><button class="btn alt" id="pBoth">🔊 اسمع الاتنين</button><button class="btn" id="pNext">التالي ›</button></div>';
        $('#pBoth').onclick = function(){ speak(opts[0][0], function(){ setTimeout(function(){ speak(opts[1][0]); }, 500); }); };
        $('#pNext').onclick = function(){ i++; q(); }; }; });
    }
    q();
  },
  conj: function(){
    var V = [];
    SR.a1.concat(SR.a2, SR.b1 || []).forEach(function(l){ var run = [];
      function flush(){ if (run.length >= 4){ var n = run[0].de.split('·').length; for (var c = 0; c < n; c++){ var f = {}; run.forEach(function(r){ var w = (r.de.split('·')[c] || '').trim().replace(/^(ich|du|er\/sie\/es|sie\/Sie|er|es|sie|wir|ihr)\s+/, ''); if (w) f[conjPron(r)] = {w:w, it:r}; }); if (Object.keys(f).length >= 4){ var wf = (f.wir || f['sie/Sie'] || {w:'?'}).w, inf = wf; for (var ik in IRR){ if (IRR[ik][3] === wf){ inf = ik; break; } } V.push({f:f, inf:inf, l:l}); } } } run = []; }
      l.items.forEach(function(it){ if (conjPron(it)) run.push(Object.assign({grp:l.id.slice(0, 2)}, it)); else flush(); }); flush(); });
    var qs = [], i = 0, ok = 0;
    for (var k = 0; k < 10 && V.length; k++){ var v = V[Math.floor(Math.random() * V.length)], ps = Object.keys(v.f), p = ps[Math.floor(Math.random() * ps.length)]; qs.push({v:v, p:p}); useAudio(v.l.id.slice(0, 2)); }
    render('<div class="wrap">' + labHead('conj') + '<div id="lab"></div></div>', 'lab');
    function q(){ var box = $('#lab');
      if (!qs.length){ box.innerHTML = '<div class="empty"><i>🪐</i>لا توجد أفعال.</div>'; return; }
      if (i >= qs.length){ var pct = Math.round(ok / qs.length * 100); skillAdd('write', pct); addXP(ok * 6 + 10); box.innerHTML = '<div class="result"><div class="em">' + (pct >= 80 ? '🏆' : '🧩') + '</div><h2>' + ar(ok) + ' من ' + ar(qs.length) + '</h2><button class="btn" id="cAgain">🔁 جولة جديدة</button></div>'; $('#cAgain').onclick = LAB_FN.conj; return; }
      var Q = qs[i], right = Q.v.f[Q.p].w, opts = shuffle(uniqBy(Object.keys(Q.v.f).map(function(k){ return Q.v.f[k].w; }), function(x){ return x; })).filter(function(x){ return x !== right; }).slice(0, 3).concat([right]); opts = shuffle(opts);
      box.innerHTML = '<div class="gamebar"><div class="prog"><i style="width:' + (i / qs.length * 100) + '%"></i></div><span class="hearts">' + ar(i + 1) + '/' + ar(qs.length) + '</span></div>' +
        '<div class="rcard2"><div class="sub">الفعل: <b class="de">' + esc(Q.v.inf) + '</b></div><div class="rc-de de"><span class="cjq">' + esc(Q.p) + '</span> ____</div><div class="opts">' + opts.map(function(o, n){ return '<button class="opt de" data-co="' + n + '">' + esc(o) + '</button>'; }).join('') + '</div><div id="cRes"></div></div>';
      $$('[data-co]', box).forEach(function(b){ b.onclick = function(){ var good = opts[+b.dataset.co] === right; if (good) ok++; fx(good); $$('[data-co]', box).forEach(function(x){ x.disabled = true; if (opts[+x.dataset.co] === right) x.classList.add('ok'); }); if (!good) b.classList.add('no');
        var it = Q.v.f[Q.p].it; play(it);
        $('#cRes').innerHTML = '<div class="sres good" style="margin-top:10px"><div class="de" style="font-size:18px">' + esc(Q.p) + ' ' + esc(right) + '</div></div><button class="btn wide" id="cNext" style="margin-top:10px">التالي ›</button>'; $('#cNext').onclick = function(){ i++; q(); }; }; });
    }
    q();
  },
  rule: function(){
    var i0 = labUnit(), ls = uIds(i0).map(function(id){ return UMAP[id]; }).filter(function(u){ return u.kind !== 'topic'; });
    var pool = shuffle(labPool(3, 9)).slice(0, 6), i = 0, sum = 0;
    render('<div class="wrap">' + labHead('rule') + labUnitBar() + '<div id="lab"></div></div>', 'lab'); bindUnitBar(LAB_FN.rule);
    function q(){ var box = $('#lab');
      if (!pool.length){ box.innerHTML = '<div class="empty"><i>🪐</i>لا توجد جمل كافية في هذه الوحدة، اختر وحدة تانية.</div>'; return; }
      if (i >= pool.length){ var pct = Math.round(sum / pool.length); addXP(Math.round(pct / 5) + 10); box.innerHTML = '<div class="result"><div class="em">' + (pct >= 80 ? '🏆' : '🗣️') + '</div><h2>' + ar(pct) + '٪</h2><p class="sub">متوسط نطقك وتركيبك للجمل.</p><button class="btn" id="rAgain">🔁 جولة جديدة</button></div>'; $('#rAgain').onclick = LAB_FN.rule; return; }
      var it = pool[i], L = ls.length ? (SR[ls[0].kind] || []).find(function(x){ return x.id === ls[0].key; }) : null, kr = L && KEYRULE[L.id];
      box.innerHTML = '<div class="gamebar"><div class="prog"><i style="width:' + (i / pool.length * 100) + '%"></i></div><span class="hearts">' + ar(i + 1) + '/' + ar(pool.length) + '</span></div>' +
        (kr ? '<div class="krule" style="--c:#8338EC"><div class="kr-r"><span>💡</span><div><small>افتكر القاعدة</small><b>' + rich(kr) + '</b></div></div></div>' : '') +
        '<div class="rcard2"><div class="sub">قول بالألماني:</div><div class="rc-ar">' + esc(it.mn) + '</div>' +
        '<button class="micbig" id="rMic"><span>🎤</span><small>اضغط واتكلم</small></button><div id="rRes"></div>' +
        '<div class="rc-ctl"><button class="btn alt" id="rShow">👁️ اعرض الجملة</button><button class="btn alt" id="rPlay">🔊 اسمعها</button><button class="btn" id="rNext">التالي ›</button></div><div id="rAns"></div></div>';
      var best = 0;
      $('#rMic').onclick = function(){ micListen(this, it.de, function(r, e){ if (r) best = Math.max(best, r.pct); $('#rRes').innerHTML = micResHTML(r, e); }); };
      $('#rShow').onclick = function(){ $('#rAns').innerHTML = '<div class="sres good" style="margin-top:10px"><div class="de" style="font-size:18px">' + esc(it.de) + '</div></div>'; };
      $('#rPlay').onclick = function(){ play(it); };
      $('#rNext').onclick = function(){ sum += best; i++; q(); };
    }
    q();
  }
};
/* ---------------- work German (4 steps) ---------------- */
function viewWork(id, step){
  if (!id){
    var html = '<div class="wrap"><div class="ph" style="--c:#3A86FF"><a class="back" href="#/lab">→ النطق</a><span class="em">💼</span><h1>ألماني للوظائف</h1><div class="g">Deutsch für den Beruf</div><p>كل مكالمة 4 خطوات: اسمع ← اختار الرد ← اتكلم ← احفظ.</p></div>' +
      '<div class="worklist">' + WORK.map(function(w){ var st = (S.work || {})[w.id] || {}, n = (st.l ? 1 : 0) + (st.q ? 1 : 0) + (st.s ? 1 : 0) + (st.v ? 1 : 0);
        return '<a class="workr" href="#/work/' + w.id + '" style="--c:' + w.c + '"><span class="wre"><img src="work_' + w.id + '.jpg" alt="" loading="lazy" decoding="async"></span><div class="wrt"><small>' + esc(w.f) + ' · ' + w.lv + '</small><b>' + esc(w.t) + '</b><div class="wdots">' + [0, 1, 2, 3].map(function(k){ return '<i class="' + (k < n ? 'on' : '') + '"></i>'; }).join('') + '</div></div><span class="arr">‹</span></a>'; }).join('') + '</div>' +
      '<p class="sub center" style="margin-top:14px">الأسماء والشركات في المكالمات خيالية.</p>' + footer() + '</div>';
    return render(html, 'lab');
  }
  var w = WORK.find(function(x){ return x.id === id; }); if (!w) return go('#/work');
  S.work = S.work || {}; var st = S.work[id] = S.work[id] || {}; step = step || 'l'; useAudio('work');
  var STEPS = [['l', '🎧', 'اسمع'], ['q', '🧩', 'اختار الرد'], ['s', '🎤', 'اتكلم'], ['v', '⭐', 'احفظ']];
  var html = '<div class="wrap"><div class="ph sm" style="--c:' + w.c + '"><a class="back" href="#/work">→ ألماني للوظائف</a><span class="em phpic"><span class="pic"><img src="work_' + w.id + '.jpg" alt="" decoding="async"></span></span><h1>' + esc(w.t) + '</h1><div class="g">' + esc(w.f) + ' · ' + w.lv + '</div></div>' +
    '<div class="wsteps">' + STEPS.map(function(s){ return '<a class="wst' + (s[0] === step ? ' on' : '') + (st[s[0]] ? ' ok' : '') + '" href="#/work/' + id + '/' + s[0] + '"><span>' + (st[s[0]] ? '✅' : s[1]) + '</span>' + s[2] + '</a>'; }).join('') + '</div><div id="wbox"></div>' + footer() + '</div>';
  render(html, 'lab'); var box = $('#wbox');
  function done(k, v){ st[k] = v || 1; save(); }
  function nextBtn(k){ var i = STEPS.findIndex(function(s){ return s[0] === k; }), n = STEPS[i + 1]; return n ? '<a class="btn wide flame" href="#/work/' + id + '/' + n[0] + '" style="display:block;text-align:center;text-decoration:none;margin-top:14px">' + n[1] + ' ' + n[2] + ' ‹</a>' : '<a class="btn wide" href="#/work" style="display:block;text-align:center;text-decoration:none;margin-top:14px">💼 مكالمة تانية</a>'; }
  if (step === 'l'){
    box.innerHTML = '<p class="sub">اسمع المكالمة كاملة. ركّز على جمل <b>' + esc(w.roles[w.me]) + '</b> لأنها اللي هتتدرب عليها.</p><div class="row" style="gap:8px;margin:8px 0 12px"><button class="btn flame" id="wAll">▶ اسمع المكالمة كاملة</button><button class="btn alt" id="wTr">إخفاء الترجمة</button></div>' +
      '<div class="wchat">' + w.lines.map(function(l, k){ return '<button class="wb ' + (l[0] === w.me ? 'me' : 'ot') + '" data-wl="' + k + '"><small>' + esc(w.roles[l[0]]) + '</small><span class="de">' + esc(l[1]) + '</span><em>' + esc(l[2]) + '</em></button>'; }).join('') + '</div>' + nextBtn('l');
    $$('[data-wl]', box).forEach(function(b){ b.onclick = function(){ stopAudio(); $$('.wb.on').forEach(function(x){ x.classList.remove('on'); }); b.classList.add('on'); speak(w.lines[+b.dataset.wl][1]); }; });
    var trOn = true; $('#wTr').onclick = function(){ trOn = !trOn; box.classList.toggle('notr', !trOn); this.textContent = trOn ? 'إخفاء الترجمة' : 'إظهار الترجمة'; };
    paToggle($('#wAll'), function(){ var my = token, k = 0, bs = $$('[data-wl]', box); (function nx(){ if (my !== token) return; if (k >= bs.length){ paEnd(); done('l'); return; } var b = bs[k]; $$('.wb.on').forEach(function(x){ x.classList.remove('on'); }); b.classList.add('on'); b.scrollIntoView({block:'center', behavior:'smooth'}); speak(w.lines[k][1], function(){ if (my === token){ k++; setTimeout(nx, 650); } }); token = my; })(); });
  } else if (step === 'q'){
    var qi = 0, ok = 0;
    (function q(){
      if (qi >= w.quiz.length){ var pct = Math.round(ok / w.quiz.length * 100); if (ok >= 4) done('q', pct); skillAdd('read', pct); addXP(ok * 8 + 10);
        box.innerHTML = '<div class="result"><div class="em">' + (ok >= 4 ? '💪' : '📚') + '</div><h2>' + ar(ok) + ' من ' + ar(w.quiz.length) + '</h2><p class="sub">' + (ok >= 4 ? 'ممتاز! جاهز تتكلم بصوتك 🎤' : 'محتاج 4 إجابات صح على الأقل. راجع الشرح تحت كل سؤال وجرّب تاني.') + '</p>' + (ok >= 4 ? nextBtn('q') : '<button class="btn" id="wqA">🔁 إعادة المحاولة</button>') + '</div>'; var a = $('#wqA'); if (a) a.onclick = function(){ viewWork(id, 'q'); }; return; }
      var Q = w.quiz[qi], right = Q[1][0], opts = shuffle(Q[1].slice());
      box.innerHTML = '<div class="gamebar"><div class="prog"><i style="width:' + (qi / w.quiz.length * 100) + '%"></i></div><span class="hearts">' + ar(qi + 1) + '/' + ar(w.quiz.length) + '</span></div><div class="wq">' + esc(Q[0]) + '</div><div class="opts">' + opts.map(function(o, n){ return '<button class="opt de" data-wq="' + n + '">' + esc(o) + '</button>'; }).join('') + '</div><div id="wqR"></div>';
      $$('[data-wq]', box).forEach(function(b){ b.onclick = function(){ var good = opts[+b.dataset.wq] === right; if (good) ok++; fx(good); $$('[data-wq]', box).forEach(function(x){ x.disabled = true; if (opts[+x.dataset.wq] === right) x.classList.add('ok'); }); if (!good) b.classList.add('no');
        $('#wqR').innerHTML = '<div class="tip tip2" style="margin-top:10px"><span class="tip-i">💡</span><div>' + esc(Q[2]) + '</div></div><div class="rc-ctl"><button class="btn alt" id="wqP">🔊 اسمع العبارة الصحيحة</button><button class="btn" id="wqN">' + (qi + 1 < w.quiz.length ? 'التالي ›' : 'عرض النتيجة') + '</button></div>';
        $('#wqP').onclick = function(){ speak(right); }; $('#wqN').onclick = function(){ qi++; q(); }; }; });
    })();
  } else if (step === 's'){
    var turns = []; w.lines.forEach(function(l, k){ if (l[0] === w.me) turns.push(k); });
    var ti = 0, sum = 0;
    (function t(){
      if (ti >= turns.length){ var pct = Math.round(sum / turns.length); done('s', pct); addXP(Math.round(pct / 4) + 10);
        box.innerHTML = '<div class="result"><div class="em">' + (pct >= 75 ? '🏆' : '🎤') + '</div><h2>' + ar(pct) + '٪</h2><p class="sub">متوسط كلامك في المكالمة. كل ما تعيد، هتلاحظ الفرق.</p>' + nextBtn('s') + '<button class="btn alt" id="wsA" style="margin-top:8px">🔁 أعد المكالمة</button></div>'; $('#wsA').onclick = function(){ viewWork(id, 's'); }; return; }
      var k = turns[ti], prev = k > 0 && w.lines[k - 1][0] !== w.me ? w.lines[k - 1] : null, mine = w.lines[k], best = 0;
      box.innerHTML = '<div class="gamebar"><div class="prog"><i style="width:' + (ti / turns.length * 100) + '%"></i></div><span class="hearts">' + ar(ti + 1) + '/' + ar(turns.length) + '</span></div>' +
        (prev ? '<div class="wb ot on"><small>' + esc(w.roles[prev[0]]) + '</small><span class="de">' + esc(prev[1]) + '</span><em>' + esc(prev[2]) + '</em></div>' : '<div class="sub">إنت اللي تبدأ المكالمة:</div>') +
        '<div class="wturn"><small>دورك (' + esc(w.roles[w.me]) + '): قول بالألماني</small><b>' + esc(mine[2]) + '</b><div class="de wans" id="wAns" hidden>' + esc(mine[1]) + '</div></div>' +
        '<div style="text-align:center"><button class="micbig" id="wMic"><span>🎤</span><small>اضغط واتكلم</small></button></div><div id="wRes"></div>' +
        '<div class="rc-ctl"><button class="btn alt" id="wShow">👁️ اعرض الجملة</button><button class="btn alt" id="wHear">🔊 اسمعها</button><button class="btn" id="wNx">التالي ›</button></div>' +
        '<button class="linkbtn" id="wTypeT" style="display:block;margin:8px auto 0">⌨️ اكتبها بدل الكلام</button><div id="wType" hidden><input class="inp de" id="wIn" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="اكتب جملتك بالألماني"><button class="btn wide" id="wChk" style="margin-top:8px">تحقّق</button></div>';
      if (prev) speak(prev[1]);
      $('#wMic').onclick = function(){ micListen(this, mine[1], function(r, e){ if (r) best = Math.max(best, r.pct); $('#wRes').innerHTML = micResHTML(r, e); }); };
      $('#wShow').onclick = function(){ $('#wAns').hidden = false; };
      $('#wHear').onclick = function(){ speak(mine[1]); };
      $('#wTypeT').onclick = function(){ var x = $('#wType'); x.hidden = !x.hidden; if (!x.hidden) $('#wIn').focus(); };
      $('#wChk').onclick = function(){ var v = $('#wIn').value.trim(); if (!v) return; var sc = Math.round(simil(v, mine[1]) * 100); best = Math.max(best, sc); skillAdd('write', sc); $('#wRes').innerHTML = '<div class="sres ' + (sc >= 85 ? 'good' : 'mid') + '"><div class="sres-h">' + (sc >= 85 ? '✅ ممتاز!' : '✍️ قارن بالصح') + '</div><div class="de">' + esc(mine[1]) + '</div></div>'; };
      $('#wNx').onclick = function(){ sum += best; ti++; t(); };
    })();
  } else {
    var mine2 = w.lines.filter(function(l){ return l[0] === w.me; });
    var list = mine2.map(function(l){ return {de:l[1], mn:l[2], grp:'work', e:'💬'}; }).concat(w.voc.map(function(v){ return {de:v[0], mn:v[1], grp:'work', e:'📌'}; }));
    box.innerHTML = '<p class="sub">عبارات <b>' + esc(w.roles[w.me]) + '</b> وأهم كلمات المجال. احفظها كلها بضغطة واحدة.</p><button class="btn flame wide" id="wSave">⭐ احفظ الكل في المحفوظات</button>' +
      '<div class="sh"><h2>💬 عباراتك</h2></div><div class="list">' + list.slice(0, mine2.length).map(function(it, i){ return itemRow(it, i, w.c); }).join('') + '</div>' +
      '<div class="sh"><h2>📌 كلمات ' + esc(w.f) + '</h2></div><div class="list">' + list.slice(mine2.length).map(function(it, i){ return itemRow(it, i + mine2.length, w.c); }).join('') + '</div>' + nextBtn('v');
    bindItems(list); done('v');
    $('#wSave').onclick = function(){ S.fav = S.fav || {}; list.forEach(function(it){ if (!S.fav[it.de]) S.fav[it.de] = {de:it.de, mn:it.mn, grp:'work', e:it.e, t:Date.now()}; }); save(); toast('⭐ اتحفظ ' + ar(list.length) + ' عبارة وكلمة'); $$('[data-act="star"]', box).forEach(function(s){ s.classList.add('on'); s.textContent = '★'; }); };
  }
}

/* ---------------- PHASE 4: conjugator + videos ---------------- */
var IRR = {
 sein:['bin','bist','ist','sind','seid','sind','gewesen',1], haben:['habe','hast','hat','haben','habt','haben','gehabt'], werden:['werde','wirst','wird','werden','werdet','werden','geworden',1],
 können:['kann','kannst','kann','können','könnt','können','gekonnt'], müssen:['muss','musst','muss','müssen','müsst','müssen','gemusst'], wollen:['will','willst','will','wollen','wollt','wollen','gewollt'],
 dürfen:['darf','darfst','darf','dürfen','dürft','dürfen','gedurft'], sollen:['soll','sollst','soll','sollen','sollt','sollen','gesollt'], mögen:['mag','magst','mag','mögen','mögt','mögen','gemocht'],
 möchten:['möchte','möchtest','möchte','möchten','möchtet','möchten','—'], wissen:['weiß','weißt','weiß','wissen','wisst','wissen','gewusst'],
 essen:['esse','isst','isst','essen','esst','essen','gegessen'], sprechen:['spreche','sprichst','spricht','sprechen','sprecht','sprechen','gesprochen'], lesen:['lese','liest','liest','lesen','lest','lesen','gelesen'],
 sehen:['sehe','siehst','sieht','sehen','seht','sehen','gesehen'], fahren:['fahre','fährst','fährt','fahren','fahrt','fahren','gefahren',1], schlafen:['schlafe','schläfst','schläft','schlafen','schlaft','schlafen','geschlafen'],
 geben:['gebe','gibst','gibt','geben','gebt','geben','gegeben'], nehmen:['nehme','nimmst','nimmt','nehmen','nehmt','nehmen','genommen'], helfen:['helfe','hilfst','hilft','helfen','helft','helfen','geholfen'],
 treffen:['treffe','triffst','trifft','treffen','trefft','treffen','getroffen'], laufen:['laufe','läufst','läuft','laufen','lauft','laufen','gelaufen',1], tragen:['trage','trägst','trägt','tragen','tragt','tragen','getragen'],
 waschen:['wasche','wäschst','wäscht','waschen','wascht','waschen','gewaschen'], vergessen:['vergesse','vergisst','vergisst','vergessen','vergesst','vergessen','vergessen'], gefallen:['gefalle','gefällst','gefällt','gefallen','gefallt','gefallen','gefallen'],
 halten:['halte','hältst','hält','halten','haltet','halten','gehalten'], lassen:['lasse','lässt','lässt','lassen','lasst','lassen','gelassen'], empfehlen:['empfehle','empfiehlst','empfiehlt','empfehlen','empfehlt','empfehlen','empfohlen'],
 gehen:['gehe','gehst','geht','gehen','geht','gehen','gegangen',1], kommen:['komme','kommst','kommt','kommen','kommt','kommen','gekommen',1], bleiben:['bleibe','bleibst','bleibt','bleiben','bleibt','bleiben','geblieben',1],
 trinken:['trinke','trinkst','trinkt','trinken','trinkt','trinken','getrunken'], schreiben:['schreibe','schreibst','schreibt','schreiben','schreibt','schreiben','geschrieben'], finden:['finde','findest','findet','finden','findet','finden','gefunden'],
 fliegen:['fliege','fliegst','fliegt','fliegen','fliegt','fliegen','geflogen',1], schwimmen:['schwimme','schwimmst','schwimmt','schwimmen','schwimmt','schwimmen','geschwommen',1], singen:['singe','singst','singt','singen','singt','singen','gesungen'],
 stehen:['stehe','stehst','steht','stehen','steht','stehen','gestanden'], sitzen:['sitze','sitzt','sitzt','sitzen','sitzt','sitzen','gesessen'], liegen:['liege','liegst','liegt','liegen','liegt','liegen','gelegen'],
 denken:['denke','denkst','denkt','denken','denkt','denken','gedacht'], bringen:['bringe','bringst','bringt','bringen','bringt','bringen','gebracht'], kennen:['kenne','kennst','kennt','kennen','kennt','kennen','gekannt'],
 tun:['tue','tust','tut','tun','tut','tun','getan'], heißen:['heiße','heißt','heißt','heißen','heißt','heißen','geheißen'], beginnen:['beginne','beginnst','beginnt','beginnen','beginnt','beginnen','begonnen'],
 verstehen:['verstehe','verstehst','versteht','verstehen','versteht','verstehen','verstanden'], bekommen:['bekomme','bekommst','bekommt','bekommen','bekommt','bekommen','bekommen'], sterben:['sterbe','stirbst','stirbt','sterben','sterbt','sterben','gestorben',1],
 werfen:['werfe','wirfst','wirft','werfen','werft','werfen','geworfen'], rufen:['rufe','rufst','ruft','rufen','ruft','rufen','gerufen'], ziehen:['ziehe','ziehst','zieht','ziehen','zieht','ziehen','gezogen'], steigen:['steige','steigst','steigt','steigen','steigt','steigen','gestiegen',1],
 passieren:['—','—','passiert','—','—','passieren','passiert',1], reisen:['reise','reist','reist','reisen','reist','reisen','gereist',1], wandern:['wandere','wanderst','wandert','wandern','wandert','wandern','gewandert',1], fallen:['falle','fällst','fällt','fallen','fallt','fallen','gefallen',1]
};
var SEP = ['zurück','fern','weg','ab','an','auf','aus','ein','mit','nach','vor','zu','los','her','hin','um','weiter'];
var INSEP = ['be','ge','er','ver','zer','ent','emp','miss'];
function conjugate(v){
  v = v.trim().toLowerCase().replace(/^sich\s+/, ''); if (!v) return null; var pre = '', base = v;
  if (!IRR[v]) for (var i = 0; i < SEP.length; i++){ if (v.indexOf(SEP[i]) === 0 && v.length > SEP[i].length + 2 && (IRR[v.slice(SEP[i].length)] || /e?n$/.test(v))){ pre = SEP[i]; base = v.slice(pre.length); break; } }
  var f, part, sein = false;
  if (IRR[base]){ f = IRR[base].slice(0, 6); part = IRR[base][6]; sein = !!IRR[base][7]; }
  else {
    if (!/n$/.test(base)) return null;
    var st = base.replace(/e?n$/, ''), e = /(t|d|chn|ffn|gn|tm|dm)$/.test(st) ? 'e' : '', s = /(s|ß|z|x)$/.test(st);
    f = [st + 'e', st + e + (s ? 't' : 'st'), st + e + 't', base, st + e + 't', base];
    if (/ern$|eln$/.test(base)){ f[0] = /eln$/.test(base) ? st.replace(/el$/, 'le') : st + 'e'; }
    var insep = /ieren$/.test(base) || INSEP.some(function(p){ return base.indexOf(p) === 0 && base.length > p.length + 3; });
    part = (insep ? '' : 'ge') + st + e + 't';
  }
  if (pre){ f = f.map(function(x){ return x === '—' ? x : x + ' … ' + pre; }); part = part === '—' ? part : pre + (IRR[base] || /^ge/.test(part) ? part : part); if (!IRR[base] && part.indexOf(pre + 'ge') !== 0 && !/ieren$/.test(base) && !INSEP.some(function(p){ return base.indexOf(p) === 0; })) part = pre + 'ge' + part.replace(/^ge/, ''); if (IRR[base] && IRR[base][6].indexOf('ge') === 0) part = pre + IRR[base][6]; }
  if (['aufstehen','einsteigen','aussteigen','umsteigen','ankommen','einschlafen','aufwachen','ausgehen','weggehen','zurückkommen','umziehen','einziehen','ausziehen'].indexOf(v) >= 0) sein = true;
  return {inf:v, f:f, part:part, aux:sein ? 'sein' : 'haben', known:!!IRR[base], pre:pre};
}
function viewConj(q){
  var html = '<div class="wrap"><div class="ph sm" style="--c:#3A86FF"><a class="back" href="#/learn/tools">→ أدوات</a><span class="em">🧩</span><h1>مُصرِّف الأفعال</h1><div class="g">Verben konjugieren</div><p>اكتب أي فعل ألماني (مثل lernen أو aufstehen) وشوف تصريفه في المضارع والماضي.</p></div>' +
    '<input class="inp de" id="cvq" placeholder="z. B. lernen, fahren, aufstehen" value="' + esc(q || '') + '" autocomplete="off" autocapitalize="off" spellcheck="false">' +
    '<div class="cvsug">' + ['lernen','sein','haben','fahren','essen','arbeiten','aufstehen','können','sprechen','gehen'].map(function(x){ return '<button class="chip" data-cv="' + x + '">' + x + '</button>'; }).join('') + '</div><div id="cvr"></div>' + footer() + '</div>';
  render(html, 'learn');
  var P = ['ich','du','er/sie/es','wir','ihr','sie/Sie'];
  function run(){ var r = conjugate($('#cvq').value), box = $('#cvr'); if (!$('#cvq').value.trim()){ box.innerHTML = ''; return; }
    if (!r){ box.innerHTML = '<div class="empty"><i>🤔</i>اكتب الفعل في المصدر، لازم ينتهي بـ -en أو -n.</div>'; return; }
    box.innerHTML = '<div class="cvcard"><div class="cvh"><b class="de">' + esc(r.inf) + '</b>' + (r.known ? '<em>فعل شاذ ✓</em>' : '<em class="g">قاعدة عامة</em>') + '</div>' +
      '<div class="cvsec">المضارع · Präsens</div><div class="cvt">' + P.map(function(p, i){ return '<div class="cvr"><span>' + p + '</span><b class="de">' + esc(r.f[i]) + '</b></div>'; }).join('') + '</div>' +
      '<div class="cvsec">الماضي في الكلام · Perfekt</div><div class="cvp de">ich ' + (r.aux === 'sein' ? 'bin' : 'habe') + ' … <b>' + esc(r.part) + '</b></div>' +
      (r.pre ? '<div class="tip tip2"><span class="tip-i">💡</span><div>فعل منفصل: البادئة <b class="de">' + r.pre + '</b> تروح آخر الجملة: <span class="de">ich ' + esc(r.f[0].split(' … ')[0]) + ' um sieben Uhr ' + r.pre + '.</span></div></div>' : '') +
      (r.known ? '' : '<div class="tip trap tip2"><span class="tip-i">⚠️</span><div>ده تصريف بالقاعدة العامة. لو الفعل شاذ ممكن يختلف، فراجعه في الدرس.</div></div>') + '</div>'; }
  $('#cvq').oninput = run; $$('[data-cv]').forEach(function(b){ b.onclick = function(){ $('#cvq').value = b.dataset.cv; run(); }; }); run();
}
function viewVideos(){
  var V = Array.isArray(CFG.videos) ? CFG.videos : [], lv = S.vlv || 'all';
  var lvls = ['all', 'A1', 'A2', 'B1'], list = V.filter(function(v){ return lv === 'all' || v.lv === lv; });
  var html = '<div class="wrap"><div class="ph sm" style="--c:#FF3D3D"><a class="back" href="#/learn">→ الدروس</a><span class="em">🎬</span><h1>المحاضرات</h1><div class="g">Videos</div><p>دروس بالفيديو من قناتي على يوتيوب، مرتبة حسب المستوى.</p></div>' +
    (V.length ? '<div class="ulpick">' + lvls.map(function(l){ return '<button class="chip' + (l === lv ? ' on' : '') + '" data-vl="' + l + '">' + (l === 'all' ? 'الكل' : l) + '</button>'; }).join('') + '</div><div class="vlist">' +
      list.map(function(v){ return '<a class="vcard" href="https://www.youtube.com/watch?v=' + encodeURIComponent(v.id) + '" target="_blank" rel="noopener"><span class="vth"><img src="https://i.ytimg.com/vi/' + encodeURIComponent(v.id) + '/mqdefault.jpg" alt="" loading="lazy"><i>▶</i></span><div><small>' + esc(v.lv || '') + '</small><b>' + esc(v.t || '') + '</b></div></a>'; }).join('') + '</div>'
      : '<div class="empty"><i>🎬</i>المحاضرات هتنزل هنا قريبًا.</div>') +
    (ytName() ? '<a class="cbtn yt" style="margin-top:14px" href="https://www.youtube.com/@' + encodeURIComponent(ytName()) + '?sub_confirmation=1" target="_blank" rel="noopener"><i>' + ICON_PLAYC + '</i><div>كل الفيديوهات على القناة<small>اشترك عشان يوصلك كل جديد</small></div></a>' : '') + footer() + '</div>';
  render(html, 'learn'); $$('[data-vl]').forEach(function(b){ b.onclick = function(){ S.vlv = b.dataset.vl; save(); viewVideos(); }; });
}

/* Lena's little tips */
var LTIPS = {home:['ابدأ بخطة اليوم، 10 دقايق كل يوم أحسن من ساعتين مرة في الأسبوع.','اسمع الكلمة وكرّرها بصوت عالي، ودنك ولسانك لازم يتعودوا مع بعض.','لو غلطت، مش مشكلة! الكلمة هترجعلك في المراجعة لحد ما تحفظها.'],
  path:['خلّص الوحدة كلها وبعدين ادخل اختبارها، كده هتنجح من أول مرة.','الوحدة اللي عليها «أنت هنا» هي مكانك دلوقتي، كمّل منها.'],
  lab:['جرّب «كرّر بعدي» مع إخفاء النص، دي أسرع طريقة تحفظ بيها الجمل.','الإملاء بيقوّي السمع والكتابة مع بعض.','اتكلم بصوت واضح وقريب من الموبايل عشان الموقع يسمعك كويس.'],
  train:['اختبار المستوى بيعرّفك تبدأ منين بالظبط.','راجع كرّاسة أخطائك مرة كل يوم، دقيقتين بس.']};
function lenaTip(pg){ var L = LTIPS[pg]; if (!L || (S.ltOff && S.ltOff[pg] === today())) return ''; var t = L[(dayNo() + pg.length) % L.length];
  return '<div class="ltip" data-lt="' + pg + '"><span class="lav">👩🏻‍🏫</span><div><b>نصيحة لينا</b><span>' + t + '</span></div><button class="ltx" aria-label="إخفاء">✕</button></div>'; }
function bindTip(){ $$('.ltip .ltx').forEach(function(b){ b.onclick = function(){ var w = b.closest('.ltip'), pg = w.dataset.lt; S.ltOff = S.ltOff || {}; S.ltOff[pg] = today(); save(); w.remove(); }; }); }

function route(){
  var h = (location.hash || '#/').slice(1), parts = h.split('#'), p = parts[0].split('/').filter(Boolean), anchor = parts[1];
  countView();
  if (!p.length) return viewHome();
  var GUARD = {exam:'exam', test:'test', speak:'speak', mistakes:'mistakes', stories:'stories', story:'stories', letters:'letters', letter:'letters', tool:'tools', play:'games', adv:'games', scene:'games', g:'games', daily:'games', journey:'journey'};
  if ((GUARD[p[0]] && hidden(GUARD[p[0]])) || (p[0] === 'l' && /^a2-/.test(p[1] || '') && hidden('a2'))){ toast('هذا القسم غير متاح حاليًا'); return viewHome(); }
  switch (p[0]){
    case 'words': return viewLearn('words');
    case 'learn': if ((p[1] || anchor) === 'words') return go('#/words'); return viewLearn(p[1] || anchor);
    case 'train': return viewTrain();
    case 't': return viewTopic(p[1]);
    case 'l': return viewLesson(p[1]);
    case 'levels': return viewLevels();
    case 'tool': if (p[1] === 'conj') return viewConj(decodeURIComponent(p[2] || '')); return ({numbers:viewNumTool, clock:viewClock, calendar:viewCalendar, intro:viewIntro}[p[1]] || viewLearn)();
    case 'play': return viewPlay();
    case 'scene': return viewScene(p[1]);
    case 'adv': return p[1] ? viewAdvLevel(+p[1]) : viewAdventure();
    case 'g': return p[2] ? viewGame(p[1], p[2]) : viewPickTopic(p[1]);
    case 'daily': return viewGame('meaning', 'all', {daily:true});
    case 'test': return viewTest();
    case 'me': return viewMe();
    case 'journey': return viewJourney();
    case 'stories': return viewStories();
    case 'story': return viewStory(p[1]);
    case 'letters': return viewLetters();
    case 'letter': return viewLetter(p[1]);
    case 'exam': return p[1] ? viewExamPart(p[1], +p[2] || 0) : viewExam();
    case 'speak': toast('هذه الميزة غير متاحة حاليًا، وستكون متاحة قريبًا 🚀'); return viewTrain();
    case 'mistakes': return viewMistakes();
    case 'review': return viewReview();
    case 'path': return viewPath();
    case 'saved': return viewSaved();
    case 'lab': return viewLab(p[1]);
    case 'work': return viewWork(p[1], p[2]);
    case 'videos': return viewVideos();
    case 'u': return UDEF[+p[1]] ? viewGame('meaning', 'u' + (+p[1]), {unit:+p[1]}) : viewPath();
    case 'search': return viewSearch(decodeURIComponent(p[1] || ''));
    case 'admin-mohannad': return viewAdmin();
    case 'about': return viewAbout();
    case 'suggest': return viewSuggest();
    case 'privacy': return viewPrivacy();
    default: return viewNotFound();
  }
}
buildUnits();
if (!S.station) S.station = stationIdx();
shell(); applySettings(); addEventListener('hashchange', route); route(); loadConfig();
if (S.last && S.last !== today() && S.last !== yesterday() && S.streak){ S.streak = 0; save(); updateRibbon(); }
if ('serviceWorker' in navigator && location.protocol === 'https:'){
  (function(){
    var sw = navigator.serviceWorker, had = !!sw.controller, done = false;
    sw.register('sw.js', {updateViaCache:'none'}).then(function(reg){
      var chk = function(){ reg.update().catch(function(){}); };
      document.addEventListener('visibilitychange', function(){ if (document.visibilityState === 'visible') chk(); });
      setInterval(chk, 30*60*1000);
    }).catch(function(){});
    sw.addEventListener('controllerchange', function(){
      if (!had || done) { had = true; return; }
      done = true;
      location.reload();
    });
  })();
}
})();
