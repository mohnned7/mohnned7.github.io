/* Sprachrakete 🚀 — Deutsch lernen auf Arabisch */
(function(){
'use strict';
var SR = window.SR;
var $ = function(s, r){ return (r||document).querySelector(s); };
var $$ = function(s, r){ return Array.prototype.slice.call((r||document).querySelectorAll(s)); };
function esc(s){ return String(s == null ? '' : s).replace(/[&<>"]/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]; }); }
function pron(s){ return esc(s).replace(/\{u:([^}]*)\}/g,'<span class="uu">$1</span>').replace(/\{o:([^}]*)\}/g,'<span class="oo">$1</span>'); }
function rich(s){ return String(s).replace(/<de>(.*?)<\/de>/g,'<span class="de">$1</span>'); }
function ar(n){ return String(n).replace(/\d/g, function(d){ return '٠١٢٣٤٥٦٧٨٩'[d]; }); }
function shuffle(a, rnd){ a = a.slice(); rnd = rnd || Math.random; for (var i = a.length - 1; i > 0; i--){ var j = Math.floor(rnd() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
function seeded(str){ var h = 1779033703 ^ str.length; for (var i = 0; i < str.length; i++){ h = Math.imul(h ^ str.charCodeAt(i), 3432918353); h = h << 13 | h >>> 19; }
  return function(){ h = Math.imul(h ^ h >>> 16, 2246822507); h = Math.imul(h ^ h >>> 13, 3266489909); h ^= h >>> 16; return (h >>> 0) / 4294967296; }; }
function today(){ var d = new Date(); return d.getFullYear() + '-' + (d.getMonth()+1) + '-' + d.getDate(); }
function yesterday(){ var d = new Date(Date.now() - 864e5); return d.getFullYear() + '-' + (d.getMonth()+1) + '-' + d.getDate(); }
var ICON_PLAY = '<svg viewBox="0 0 24 24"><path d="M3 10v4h4l5 4V6L7 10H3zm13.5 2a4.5 4.5 0 0 0-2.5-4v8a4.5 4.5 0 0 0 2.5-4zM14 3.2v2.1a7 7 0 0 1 0 13.4v2.1a9 9 0 0 0 0-17.6z"/></svg>';
var ART = {m:'der', f:'die', n:'das'};

/* ---------------- storage ---------------- */
var S = (function(){
  var d = {xp:0, streak:0, last:'', days:{}, badges:{}, seen:{}, cards:{}, games:{}, daily:{}, tools:{}, name:'', set:{theme:'', kids:false, sp:true, speed:'slow'}, perfect:false, test:null, popup:false};
  try{ var x = JSON.parse(localStorage.getItem('sprachrakete') || 'null'); if (x){ for (var k in x) d[k] = x[k]; d.set = Object.assign({theme:'', kids:false, sp:true, speed:'slow'}, x.set || {}); } }catch(e){}
  return d;
})();
function save(){ try{ localStorage.setItem('sprachrakete', JSON.stringify(S)); }catch(e){} }

/* ---------------- theme / settings ---------------- */
function applySettings(){
  var dark = S.set.theme ? S.set.theme === 'dark' : (window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches);
  document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
  document.body.classList.toggle('kids', !!S.set.kids);
  document.body.classList.toggle('sp', !!S.set.sp);
  var tb = $('#themeBtn'); if (tb) tb.textContent = dark ? '☀️' : '🌙';
  var kb = $('#kidsBtn'); if (kb) kb.classList.toggle('on', !!S.set.kids);
  var meta = $('meta[name=theme-color]'); if (meta) meta.setAttribute('content', dark ? '#0D0A24' : '#F3F1FF');
}

/* ---------------- audio ---------------- */
var AUD = {}; window.SRA = function(o){ for (var k in o) AUD[k] = o[k]; };
var loaded = {};
function loadAudio(grp){
  var f = SR.audioGroups[grp]; if (!f || loaded[f]) return;
  loaded[f] = 1; var s = document.createElement('script'); s.src = f; s.async = true; s.onerror = function(){ s.remove(); }; document.head.appendChild(s);
}
var synth = window.speechSynthesis, voice = null, curA = null, token = 0;
function pickVoice(){
  if (!synth) return; var v = synth.getVoices() || []; var de = v.filter(function(x){ return /^de/i.test(x.lang); });
  var good = de.filter(function(x){ return /natural|neural|enhanced|premium|google|anna|katja/i.test(x.name); });
  voice = good.find(function(x){ return /de[-_]DE/i.test(x.lang); }) || good[0] || de.find(function(x){ return /de[-_]DE/i.test(x.lang); }) || de[0] || null;
}
if (synth){ pickVoice(); synth.onvoiceschanged = pickVoice; }
function stopAudio(){ token++; if (synth) synth.cancel(); if (curA){ try{ curA.pause(); }catch(e){} curA = null; } }
function speak(text, done){
  if (curA){ try{ curA.pause(); }catch(e){} curA = null; }
  var slow = S.set.speed === 'slow'; var b = AUD[text];
  var fin = false; function end(){ if (fin) return; fin = true; if (done) done(); }
  if (b){
    if (synth) synth.cancel();
    var a = new Audio('data:audio/mpeg;base64,' + b); a.playbackRate = slow ? 0.75 : 0.92;
    try{ a.preservesPitch = true; }catch(e){}
    a.onended = end; a.onerror = function(){ fin = true; tts(text, done); };
    curA = a; a.play().catch(function(){ if (!fin){ fin = true; tts(text, done); } });
    return;
  }
  tts(text, end);
}
function tts(text, done){
  if (!synth){ if (done) setTimeout(done, 600); return; }
  synth.cancel(); var u = new SpeechSynthesisUtterance(text);
  u.lang = voice ? voice.lang : 'de-DE'; if (voice) u.voice = voice;
  u.rate = S.set.speed === 'slow' ? 0.55 : 0.8;
  var fired = false; function f(){ if (fired) return; fired = true; if (done) done(); }
  u.onend = f; u.onerror = f; synth.speak(u);
  setTimeout(f, 1200 + text.length * 160);
}

/* ---------------- XP, streak, badges ---------------- */
var RANKS = [{x:0,e:'🛫',de:'Startrampe',a:'منصة الإطلاق'},{x:100,e:'☁️',de:'Wolken',a:'فوق السحاب'},{x:300,e:'🛰️',de:'Orbit',a:'في المدار'},
  {x:700,e:'🌙',de:'Mond',a:'على القمر'},{x:1500,e:'🔴',de:'Mars',a:'على المريخ'},{x:3000,e:'🌌',de:'Galaxie',a:'في المجرة'}];
function rankOf(xp){ var r = RANKS[0]; RANKS.forEach(function(k){ if (xp >= k.x) r = k; }); return r; }
var BADGES = [
  {id:'start',e:'🚀',t:'الإقلاع',d:'أول نقطة ليك'},
  {id:'test',e:'🧭',t:'عرفت مستواك',d:'عملت اختبار المستوى'},
  {id:'streak3',e:'🔥',t:'ولّعت',d:'٣ أيام ورا بعض'},
  {id:'streak7',e:'☄️',t:'أسبوع نار',d:'٧ أيام ورا بعض'},
  {id:'xp500',e:'🌙',t:'وصلت القمر',d:'٧٠٠ نقطة'},
  {id:'perfect',e:'💯',t:'من غير غلطة',d:'جولة كاملة صح'},
  {id:'games5',e:'🎮',t:'لعيب',d:'جرّبت ٥ ألعاب مختلفة'},
  {id:'cards50',e:'🧠',t:'ذاكرة حديد',d:'حفظت ٥٠ كارت'},
  {id:'daily5',e:'🎯',t:'ملتزم',d:'خلصت ٥ مهمات يومية'},
  {id:'tools',e:'🧰',t:'المخترع',d:'جرّبت الأدوات الأربعة'},
  {id:'explorer',e:'🪐',t:'مستكشف',d:'زرت ١٠ مواضيع'},
  {id:'a1',e:'🏆',t:'بطل A1',d:'فتحت كل دروس A1'}
];
function checkBadges(){
  var got = [];
  function give(id){ if (!S.badges[id]){ S.badges[id] = today(); got.push(id); } }
  if (S.xp > 0) give('start');
  if (S.test != null) give('test');
  if (S.streak >= 3) give('streak3');
  if (S.streak >= 7) give('streak7');
  if (S.xp >= 700) give('xp500');
  if (S.perfect) give('perfect');
  if (Object.keys(S.games).length >= 5) give('games5');
  if (Object.keys(S.cards).filter(function(k){ return S.cards[k] >= 3; }).length >= 50) give('cards50');
  if (Object.keys(S.daily).length >= 5) give('daily5');
  if (['num','clock','cal','intro'].every(function(k){ return S.tools[k]; })) give('tools');
  if (Object.keys(S.seen).filter(function(k){ return k.indexOf('a1-') !== 0; }).length >= 10) give('explorer');
  if (SR.a1.every(function(l){ return S.seen[l.id]; })) give('a1');
  if (got.length){ save(); var b = BADGES.find(function(x){ return x.id === got[0]; }); setTimeout(function(){ toast(b.e + ' وسام جديد: ' + b.t); confetti(); }, 700); }
}
function addXP(n){
  var before = rankOf(S.xp);
  S.xp += n; var t = today();
  if (S.last !== t){ S.streak = (S.last === yesterday()) ? S.streak + 1 : 1; S.last = t; }
  S.days[t] = (S.days[t] || 0) + n; save();
  var after = rankOf(S.xp);
  if (after !== before){ setTimeout(function(){ toast(after.e + ' طلعت لـ ' + after.a + '!'); confetti(); }, 300); }
  checkBadges(); updateRibbon();
}
function touch(tool){ S.tools[tool] = 1; save(); checkBadges(); }

/* ---------------- toast / confetti ---------------- */
var toastT;
function toast(msg){ var t = $('#toast'); t.textContent = msg; t.classList.add('show'); clearTimeout(toastT); toastT = setTimeout(function(){ t.classList.remove('show'); }, 2400); }
function confetti(){
  if (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var c = document.createElement('canvas'); c.className = 'confetti'; document.body.appendChild(c);
  var W = c.width = innerWidth, H = c.height = innerHeight, x = c.getContext('2d');
  var cols = ['#FFC53D','#FF6B2C','#5B3DF5','#19C79A','#FF3D7F','#3A86FF'];
  var P = []; for (var i = 0; i < 120; i++) P.push({x:W/2, y:H/3, vx:(Math.random()-.5)*12, vy:Math.random()*-12-4, r:Math.random()*6+3, c:cols[i%cols.length], a:Math.random()*6});
  var f = 0; (function tick(){ x.clearRect(0,0,W,H); P.forEach(function(p){ p.vy += .35; p.x += p.vx; p.y += p.vy; p.a += .2; x.save(); x.translate(p.x,p.y); x.rotate(p.a); x.fillStyle = p.c; x.fillRect(-p.r/2,-p.r/2,p.r,p.r*.6); x.restore(); });
    if (++f < 110) requestAnimationFrame(tick); else c.remove(); })();
}

/* ---------------- data helpers ---------------- */
function modById(id){ return SR.modules.find(function(m){ return m.id === id; }); }
function topics(){
  var t = [{id:'abc',e:'🔤',color:'#5B3DF5',title:'الحروف',de:'Das Alphabet',desc:'٣٠ حرف باسمهم وصوتهم'},
           {id:'num',e:'🔢',color:'#FF6B2C',title:'الأرقام',de:'Die Zahlen',desc:'من صفر لمليون'}];
  SR.modules.forEach(function(m){ t.push(m); });
  return t;
}
function itemsOf(tid){
  if (tid === 'abc') return SR.letters.map(function(l){ return {de:ART[l.g] + ' ' + l.de, ar:({m:'ديا',f:'دي',n:'داس'})[l.g] + ' ' + l.ar, mn:l.mn, e:l.e, g:l.g, n:l.de, grp:'abc'}; });
  if (tid === 'num') return SR.nums.map(function(n){ return {de:n.de, ar:n.ar, mn:n.mn + ' (' + n.big + ')', e:'🔢', grp:'num'}; });
  if (tid === 'a1') { var o = []; SR.a1.forEach(function(l){ l.items.forEach(function(it){ o.push(Object.assign({grp:'a1'}, it)); }); }); return o; }
  if (tid === 'a2') { var p = []; SR.a2.forEach(function(l){ l.items.forEach(function(it){ p.push(Object.assign({grp:'a2'}, it)); }); }); return p; }
  if (tid === 'all') { var all = []; topics().forEach(function(t){ if (t.id !== 'situations') all = all.concat(itemsOf(t.id)); }); return all; }
  var m = modById(tid); if (!m) return [];
  if (m.dialogs){ var d = []; m.dialogs.forEach(function(x){ x.lines.forEach(function(l){ d.push({de:l.de, ar:l.ar, mn:l.mn, e:x.e, grp:m.id}); }); }); return d; }
  return m.items.map(function(it){ return Object.assign({grp:m.id}, it); });
}
function sayOf(it){ return it.say || it.de; }
function play(it, el, done){
  loadAudio(it.grp); $$('.on.it,.on.bub,.on.lt').forEach(function(x){ x.classList.remove('on'); }); if (el) el.classList.add('on');
  speak(sayOf(it), function(){ if (el) el.classList.remove('on'); if (done) done(); });
}
function deHTML(it){
  if (it.g && it.n){ return '<span class="art ' + it.g + '">' + ART[it.g] + '</span> ' + esc(it.n); }
  return esc(it.de);
}

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
var ROCKET = '<svg viewBox="0 0 88 150" class="rocket" aria-hidden="true"><g class="flame"><path d="M30 118 Q44 150 58 118 Z" fill="#FFC53D"/><path d="M36 118 Q44 140 52 118 Z" fill="#FF6B2C"/></g>'+
  '<path d="M44 4 C66 22 70 60 64 112 H24 C18 60 22 22 44 4 Z" fill="#FFF7E8"/><path d="M44 4 C56 14 62 28 64 42 H24 C26 28 32 14 44 4 Z" fill="#FF6B2C"/>'+
  '<circle cx="44" cy="64" r="11" fill="#5B3DF5" stroke="#14103A" stroke-width="3"/><circle cx="40" cy="60" r="3" fill="#B9AEFF"/>'+
  '<path d="M24 86 L8 112 L24 108 Z" fill="#FF3D7F"/><path d="M64 86 L80 112 L64 108 Z" fill="#FF3D7F"/><rect x="38" y="96" width="12" height="20" rx="4" fill="#FF3D7F"/></svg>';

function shell(){
  document.body.insertAdjacentHTML('afterbegin',
   '<header class="top" id="top"><div class="wrap"><a class="logo" href="#/"><svg viewBox="0 0 40 40"><circle cx="20" cy="20" r="19" fill="#14103A"/><circle cx="31" cy="10" r="1.3" fill="#fff"/><circle cx="9" cy="14" r="1" fill="#fff"/>'+
   '<path d="M20 7c6 5 7 13 5 21h-10c-2-8-1-16 5-21z" fill="#FFF7E8"/><path d="M20 7c3 2 5 5 5.6 9h-11.2C15 12 17 9 20 7z" fill="#FF6B2C"/><circle cx="20" cy="19" r="3" fill="#5B3DF5"/><path d="M17 28q3 8 6 0z" fill="#FFC53D"/></svg>'+
   '<b>Sprach<span>rakete</span></b></a><button class="ibtn" id="kidsBtn" title="وضع الصغار" aria-label="وضع الصغار">🧸</button><button class="ibtn" id="themeBtn" title="ليلي / نهاري" aria-label="ليلي / نهاري">🌙</button></div></header>'+
   '<main id="app"></main>'+
   '<nav class="nav" aria-label="القايمة"><div class="in">'+
   '<a href="#/" data-n="home"><i>🏠</i>الرئيسية</a><a href="#/learn" data-n="learn"><i>📚</i>اتعلّم</a><a href="#/play" data-n="play"><i>🎮</i>العب</a><a href="#/me" data-n="me"><i>🏆</i>أنا</a><a href="#/search" data-n="search"><i>🔍</i>دوّر</a></div></nav>'+
   '<div class="toast" id="toast" role="status"></div><div class="feedback" id="fb"></div>');
  $('#themeBtn').onclick = function(){ var dark = document.documentElement.getAttribute('data-theme') === 'dark'; S.set.theme = dark ? 'light' : 'dark'; save(); applySettings(); };
  $('#kidsBtn').onclick = function(){ S.set.kids = !S.set.kids; save(); applySettings(); toast(S.set.kids ? '🧸 وضع الصغار شغال' : 'وضع الصغار اتقفل'); };
  addEventListener('scroll', function(){ $('#top').classList.toggle('scrolled', scrollY > 6); }, {passive:true});
}
function setNav(n){ $$('.nav a').forEach(function(a){ a.classList.toggle('on', a.dataset.n === n); }); }
function render(html, nav){ stopAudio(); hideFb(); $$('.modal').forEach(function(m){ m.remove(); }); $('#app').innerHTML = html; setNav(nav); window.scrollTo(0, 0); }
function ctlBar(extra){
  return '<div class="ctl"><div class="seg" role="group" aria-label="سرعة الصوت"><button data-sp="slow" class="' + (S.set.speed === 'slow' ? 'on' : '') + '">🐢 بطيء</button><button data-sp="normal" class="' + (S.set.speed !== 'slow' ? 'on' : '') + '">عادي</button></div>' +
    '<button class="chip ' + (S.set.sp ? 'on' : '') + '" data-pr>النطق العربي</button>' + (extra || '') + '</div>';
}
function bindCtl(){
  $$('[data-sp]').forEach(function(b){ b.onclick = function(){ S.set.speed = b.dataset.sp; save(); $$('[data-sp]').forEach(function(x){ x.classList.toggle('on', x === b); }); }; });
  $$('[data-pr]').forEach(function(b){ b.onclick = function(){ S.set.sp = !S.set.sp; save(); applySettings(); b.classList.toggle('on', S.set.sp); }; });
}
function updateRibbon(){ var r = $('#ribbon'); if (r) r.innerHTML = ribbonHTML(); }
function ribbonHTML(){ var rk = rankOf(S.xp);
  return '<div class="stat"><i>⚡</i><div><b>' + ar(S.xp) + '</b><span>نقطة</span></div></div><div class="stat"><i>🔥</i><div><b>' + ar(S.last === today() || S.last === yesterday() ? S.streak : 0) + '</b><span>يوم ورا بعض</span></div></div>' +
    '<div class="stat"><i>' + rk.e + '</i><div><b class="de" style="font-size:15px">' + rk.de + '</b><span>' + rk.a + '</span></div></div>'; }

/* ---------------- HOME ---------------- */
function wordOfDay(){
  var pool = []; SR.modules.forEach(function(m){ (m.items || []).forEach(function(it){ if (it.e && it.de.split(' ').length <= 2 && !/[?!.]/.test(it.de)) pool.push(Object.assign({grp:m.id}, it)); }); });
  return pool[Math.floor(seeded(today())() * pool.length)];
}
function viewHome(){
  var w = wordOfDay(), done = !!S.daily[today()];
  var tp = topics();
  var html = '<section class="hero" id="hero"><div class="stars"></div><div class="planet p1"></div><div class="planet p2"></div>' +
   '<div class="txt"><h1><span class="de">Sprachrakete</span>الألماني بالعربي، من أول حرف لحد ما تتكلم</h1><p>دروس بالصوت، وألعاب، ونقط بتطلّعك من الأرض للمجرة.</p></div>' +
   '<div class="count" id="count" aria-live="polite"></div>' +
   '<div class="launch"><button class="go" id="launch">🚀 عدّ معايا بالألماني</button>' + ROCKET + '</div></section>' +
   '<div class="wrap"><div class="ribbon" id="ribbon">' + ribbonHTML() + '</div>' +
   '<div class="sh"><h2>كلمة النهارده</h2></div>' +
   '<div class="wod"><div class="em">' + (w.e || '⭐') + '</div><div style="flex:1;min-width:0"><div class="w">' + deHTML(w) + '</div><div class="pr arp">' + pron(w.ar) + '</div><div class="m">' + esc(w.mn) + '</div></div><button class="play" id="wodPlay" aria-label="اسمع">' + ICON_PLAY + '</button></div>' +
   '<a class="mission ' + (done ? 'done' : '') + '" href="#/daily"><span class="em">' + (done ? '✅' : '🎯') + '</span><div><b>' + (done ? 'خلّصت مهمة النهارده!' : 'مهمة النهارده') + '</b><span>' + (done ? 'ارجع بكرة عشان السلسلة 🔥 متقطعش' : '١٠ أسئلة سريعة و٥٠ نقطة زيادة') + '</span></div><span class="arr">‹</span></a>' +
   (S.test == null ? '<a class="mission" style="background:linear-gradient(115deg,#5B3DF5,#2B1F86)" href="#/test"><span class="em">🧭</span><div><b>مش عارف تبدأ منين؟</b><span>اختبار ١٢ سؤال يقولك مستواك</span></div><span class="arr">‹</span></a>' : '') +
   '<div class="sh"><h2>كواكب الكلمات</h2><a href="#/learn">كله</a></div><div class="planets">' + tp.slice(0, 6).map(planet).join('') + '</div>' +
   '<div class="sh"><h2>أدوات سحرية</h2></div><div class="tiles">' + toolsHTML() + '</div>' +
   '<div class="sh"><h2>العب واكسب نقط</h2><a href="#/play">كل الألعاب</a></div><div class="tiles">' + GAMES.slice(0, 4).map(gameTile).join('') + '</div>' +
   '<div class="sh"><h2>سلّم المستويات</h2><a href="#/levels">التفاصيل</a></div>' + ladderHTML() +
   '<div class="sh"><h2>خلّيك قريب</h2></div>' + contactHTML() +
   '<div class="foot">Sprachrakete · MOHANNAD 🚀<br>النطق العربي للمساعدة فقط، اعتمد على الصوت.</div></div>';
  render(html, 'home');
  $('#wodPlay').onclick = function(){ play(w); };
  $('#launch').onclick = countdown;
  bindInstall();
}
function planet(t){
  var its = itemsOf(t.id).length, seen = S.seen[t.id];
  return '<a class="pl" href="#/t/' + t.id + '" style="--c:' + t.color + '">' + (seen ? '<span class="done">✅</span>' : '') + '<div class="orb">' + t.e + '</div><b>' + esc(t.title) + '</b><div class="g">' + esc(t.de) + '</div>' +
    '<div class="m" style="font-size:12px;color:var(--mute);margin:2px 0 8px">' + ar(its) + ' كلمة وجملة</div><div class="bar"><i style="width:' + (seen ? 100 : 0) + '%"></i></div></a>';
}
var TOOLS = [{h:'#/tool/numbers',e:'🔢',c:'#FF6B2C',t:'مصنع الأرقام',d:'اكتب أي رقم واسمعه'},{h:'#/tool/clock',e:'🕐',c:'#5B3DF5',t:'الساعة الناطقة',d:'حرّك العقارب واسمع الوقت'},
  {h:'#/tool/calendar',e:'🗓️',c:'#19C79A',t:'التقويم الحي',d:'النهارده بالألماني'},{h:'#/tool/intro',e:'🙋',c:'#FF3D7F',t:'قدّم نفسك',d:'اكتب بياناتك وخد تعريفك'}];
function toolsHTML(){ return TOOLS.map(function(t){ return '<a class="tile" href="' + t.h + '" style="--c:' + t.c + '"><span class="em">' + t.e + '</span><b>' + t.t + '</b><span>' + t.d + '</span></a>'; }).join(''); }
function ladderHTML(){
  return '<div class="ladder">' + SR.levels.map(function(l, i){ var open = l[3] === 'open';
    return '<a class="rung ' + (open ? 'open' : '') + (i === 0 ? ' here' : '') + '" href="#/levels"><span class="lv de">' + l[0] + '</span><div><b>' + esc(l[1]) + '</b><span>' + esc(l[2]) + '</span></div><em>' + (open ? (i === 0 ? '📍 ابدأ هنا' : 'متاح') : 'قريبًا') + '</em></a>'; }).join('') + '</div>';
}
function contactHTML(){
  return '<div class="contact"><a class="cbtn yt" href="https://www.youtube.com/@u0_0z?sub_confirmation=1" target="_blank" rel="noopener"><i>▶</i><div>اشترك في القناة<small>@u0_0z</small></div></a>' +
    '<a class="cbtn wa" href="https://wa.me/201080845228?text=' + encodeURIComponent('أهلًا! جيت من موقع Sprachrakete 🚀') + '" target="_blank" rel="noopener"><i>💬</i><div>كلّمني واتساب<small>+201080845228</small></div></a></div>' +
    '<div class="panel" id="installCard" style="margin-top:12px;display:flex;align-items:center;gap:12px"><span style="font-size:34px">📲</span><div style="flex:1"><b>حط Sprachrakete على شاشتك</b><div style="font-size:13px;color:var(--mute)">يفتح زي التطبيق من غير ما تدوّر عليه</div></div><button class="btn" id="installBtn">تثبيت</button></div>';
}
var running = false;
function countdown(){
  if (running) return; running = true;
  var hero = $('#hero'), c = $('#count'), btn = $('#launch');
  var words = [['10','Zehn'],['9','Neun'],['8','Acht'],['7','Sieben'],['6','Sechs'],['5','Fünf'],['4','Vier'],['3','Drei'],['2','Zwei'],['1','Eins']];
  btn.disabled = true; btn.textContent = '🔊 اسمع وعدّ معايا'; loadAudio('num'); hero.classList.add('firing');
  var i = 0, my = token;
  (function next(){
    if (my !== token){ running = false; return; }
    if (i < words.length){ var w = words[i++]; c.innerHTML = '<div>' + w[0] + '<small>' + w[1] + '</small></div>'; speak(w[1], function(){ setTimeout(next, 120); }); return; }
    c.innerHTML = '<div style="font-size:64px">Start!<small>يلا بينا 🚀</small></div>'; speak('Start!');
    hero.classList.add('lift');
    setTimeout(function(){ c.innerHTML = '<div style="font-size:46px">Los geht\'s!<small>دلوقتي إنت عرفت تعدّ من ١٠ لـ١ 👏</small></div>'; btn.disabled = false; btn.textContent = '🔁 تاني'; running = false;
      if (!S.seen.countdown){ S.seen.countdown = 1; addXP(10); toast('+١٠ نقط ⚡'); }
      hero.classList.remove('lift','firing'); }, 1600);
  })();
}

/* ---------------- LEARN ---------------- */
function viewLearn(){
  var html = '<div class="wrap"><div class="ph" style="--c:#5B3DF5"><span class="em">📚</span><h1>اتعلّم</h1><div class="g">Lernen</div><p>اختار كوكب وابدأ. كل كلمة بصوتها ونطقها ومعناها.</p></div>' +
    '<div class="sh"><h2>كواكب الكلمات</h2></div><div class="planets">' + topics().map(planet).join('') + '</div>' +
    '<div class="sh"><h2>دروس A1</h2><a href="#/levels">إيه هو A1؟</a></div><div class="list">' + SR.a1.map(lessonRow).join('') + '</div>' +
    '<div class="sh"><h2>دروس A2</h2></div><div class="list">' + SR.a2.map(lessonRow).join('') + '</div>' +
    '<div class="sh"><h2>أدوات سحرية</h2></div><div class="tiles">' + toolsHTML() + '</div><div class="foot">النطق العربي للمساعدة فقط، اعتمد على الصوت.</div></div>';
  render(html, 'learn');
}
function lessonRow(l){
  var n = l.num ? ar(l.num) : (l.e || '');
  return '<a class="it" href="#/l/' + l.id + '" style="--c:' + l.color + ';text-decoration:none"><span class="em" style="font-family:Outfit;font-weight:700;color:' + l.color + '">' + n + '</span><div class="tx"><b style="font-size:16px">' + esc(l.title) + '</b><div class="cj">' + esc(l.de) + '</div></div><span>' + (S.seen[l.id] ? '✅' : '‹') + '</span></a>';
}
function itemRow(it, i, c){
  return '<button class="it" data-i="' + i + '" style="--c:' + (c || 'var(--violet)') + '">' + (it.c ? '<span class="sw" style="background:' + it.c + '"></span>' : '<span class="em">' + (it.e || '🔹') + '</span>') +
    '<span class="tx"><span class="d" style="display:block">' + deHTML(it) + '</span><span class="pr arp" style="display:block">' + pron(it.ar) + '</span><span class="m">' + esc(it.mn) + '</span>' +
    (it.conj ? '<span class="cj" style="display:block">' + esc(it.conj) + '</span>' : '') + '</span><span class="play sm" aria-hidden="true">' + ICON_PLAY + '</span></button>';
}
function bindItems(list, c){
  $$('.it[data-i]').forEach(function(el){ el.onclick = function(){ var it = list[+el.dataset.i]; play(it, el); }; });
  var pa = $('#playAll'); if (pa) pa.onclick = function(){ playAllList(list); };
}
function playAllList(list){
  stopAudio(); var my = token, i = 0, els = $$('.it[data-i]');
  (function next(){ if (my !== token || i >= els.length) return; var el = els[i], it = list[+el.dataset.i]; i++; el.scrollIntoView({block:'center', behavior:'smooth'});
    play(it, el, function(){ if (my === token) setTimeout(next, S.set.speed === 'slow' ? 900 : 600); }); token = my; })();
}
function markSeen(id, xp){ if (!S.seen[id]){ S.seen[id] = 1; save(); addXP(xp || 10); } else checkBadges(); }

function viewTopic(id){
  if (id === 'abc') return viewABC(); if (id === 'num') return viewNumbers();
  var m = modById(id); if (!m) return go('#/learn');
  loadAudio(m.id);
  var html = '<div class="wrap"><div class="ph" style="--c:' + m.color + '"><a class="back" href="#/learn">→ اتعلّم</a><span class="em">' + m.e + '</span><h1>' + esc(m.title) + '</h1><div class="g">' + esc(m.de) + '</div><p>' + esc(m.desc) + '</p></div>' +
    ctlBar(m.items ? '<button class="chip go2" id="playAll">▶ شغّل الكل</button>' : '');
  var list = [];
  if (m.dialogs){
    m.dialogs.forEach(function(d){ html += '<div class="dlg" style="--c:' + m.color + '"><h3>' + d.e + ' ' + esc(d.t) + '</h3>';
      d.lines.forEach(function(l){ var k = list.length; list.push({de:l.de, ar:l.ar, mn:l.mn, grp:m.id});
        html += '<button class="bub ' + (l.s === 'A' ? 'a' : 'b') + '" data-b="' + k + '"><div class="who">' + esc(d.who[l.s === 'A' ? 0 : 1]) + '</div><div class="d">' + esc(l.de) + '</div><div class="pr arp">' + pron(l.ar) + '</div><div class="m">' + esc(l.mn) + '</div></button>'; });
      html += '<button class="chip" data-dlg="' + (list.length - d.lines.length) + '-' + list.length + '">▶ شغّل الحوار</button></div>'; });
  } else {
    list = m.items.map(function(it){ return Object.assign({grp:m.id}, it); });
    html += '<div class="list">' + list.map(function(it, i){ return itemRow(it, i, m.color); }).join('') + '</div>';
  }
  html += '<div class="sh"><h2>جرّب نفسك</h2></div><div class="tiles">' + GAMES.slice(0, 4).map(function(g){ return gameTile(g, m.id); }).join('') + '</div><div class="foot">النطق العربي للمساعدة فقط، اعتمد على الصوت.</div></div>';
  render(html, 'learn'); bindCtl(); bindItems(list, m.color);
  $$('[data-b]').forEach(function(b){ b.onclick = function(){ play(list[+b.dataset.b], b); }; });
  $$('[data-dlg]').forEach(function(b){ b.onclick = function(){ var r = b.dataset.dlg.split('-'), a = +r[0], z = +r[1]; stopAudio(); var my = token, i = a;
    (function next(){ if (my !== token || i >= z) return; var el = $('[data-b="' + i + '"]'); var it = list[i]; i++; el.scrollIntoView({block:'center', behavior:'smooth'}); play(it, el, function(){ if (my === token) setTimeout(next, 700); }); token = my; })(); }; });
  markSeen(m.id);
}
function viewABC(){
  loadAudio('abc');
  var html = '<div class="wrap"><div class="ph" style="--c:#5B3DF5"><a class="back" href="#/learn">→ اتعلّم</a><span class="em">🔤</span><h1>الحروف</h1><div class="g">Das Alphabet</div><p>دوس على الحرف: هتسمع اسمه وبعدين كلمة بيه.</p></div>' + ctlBar() +
    '<div class="abc">' + SR.letters.map(function(l, i){ return '<button class="lt" data-l="' + i + '"><div class="L">' + esc(l.L) + '</div><div class="nm">اسمه: <span class="pr">' + pron(l.lp) + '</span></div><span class="em">' + l.e + '</span><div class="w"><span class="art ' + l.g + '">' + ART[l.g] + '</span> ' + esc(l.de) + '</div><div class="nm">' + esc(l.mn) + '</div></button>'; }).join('') + '</div>' +
    '<div class="sh"><h2>العب بالحروف</h2></div><div class="tiles">' + GAMES.slice(0, 4).map(function(g){ return gameTile(g, 'abc'); }).join('') + '</div></div>';
  render(html, 'learn'); bindCtl();
  $$('[data-l]').forEach(function(b){ b.onclick = function(){ var l = SR.letters[+b.dataset.l]; $$('.lt.on').forEach(function(x){ x.classList.remove('on'); }); b.classList.add('on');
    speak(l.ls, function(){ setTimeout(function(){ speak(ART[l.g] + ' ' + l.de, function(){ b.classList.remove('on'); }); }, 250); }); }; });
  markSeen('abc');
}
function viewNumbers(){
  loadAudio('num');
  var list = itemsOf('num');
  var html = '<div class="wrap"><div class="ph" style="--c:#FF6B2C"><a class="back" href="#/learn">→ اتعلّم</a><span class="em">🔢</span><h1>الأرقام</h1><div class="g">Die Zahlen</div><p>احفظ دول، والباقي هيركب لوحده. وجرّب مصنع الأرقام تحت.</p></div>' +
    ctlBar('<button class="chip go2" id="playAll">▶ شغّل الكل</button>') +
    '<a class="mission" href="#/tool/numbers" style="background:linear-gradient(115deg,#FF6B2C,#FFC53D);color:#1A1446;margin:0 0 12px"><span class="em">🏭</span><div><b>مصنع الأرقام</b><span>اكتب أي رقم من ٠ لمليون واسمعه</span></div><span class="arr">‹</span></a>' +
    '<div class="tip memo"><b class="k">🧠 السر</b>من ٢١ لـ٩٩ الألمان بيقولوا الآحاد الأول: <span class="de">einundzwanzig</span> = واحد و<b>عشرين</b>، زي ما بنقول بالعربي بالظبط!</div>' +
    '<div class="list">' + SR.nums.map(function(n, i){ return '<button class="it" data-i="' + i + '" style="--c:#FF6B2C"><span class="em" style="font-family:Outfit;font-weight:700;font-size:24px;color:#FF6B2C">' + n.big + '</span><span class="tx"><span class="d" style="display:block">' + esc(n.de) + '</span><span class="pr arp" style="display:block">' + pron(n.ar) + '</span><span class="m">' + esc(n.mn) + '</span></span><span class="play sm">' + ICON_PLAY + '</span></button>'; }).join('') + '</div></div>';
  render(html, 'learn'); bindCtl(); bindItems(list);
  markSeen('num');
}
function viewLesson(id){
  var l = SR.a1.concat(SR.a2).find(function(x){ return x.id === id; }); if (!l) return go('#/learn');
  var grp = id.indexOf('a1') === 0 ? 'a1' : 'a2'; loadAudio(grp);
  var list = l.items.map(function(it){ return Object.assign({grp:grp}, it); });
  var TK = {tip:'💡 معلومة', trap:'⚠️ فخ', memo:'🧠 احفظها كده'};
  var html = '<div class="wrap"><div class="ph" style="--c:' + l.color + '"><a class="back" href="#/learn">→ اتعلّم</a><span class="em">' + (l.e || '📘') + '</span><h1>' + esc(l.title) + '</h1><div class="g">' + esc(l.de) + '</div>' + (l.mission ? '<p>🎯 ' + esc(l.mission) + '</p>' : '') + '</div>' +
    l.rules.map(function(r){ return '<div class="rule">' + rich(r) + '</div>'; }).join('') +
    (l.tips || []).map(function(t){ return '<div class="tip ' + t.k + '"><b class="k">' + TK[t.k] + '</b>' + rich(t.t) + '</div>'; }).join('') +
    ctlBar('<button class="chip go2" id="playAll">▶ شغّل الكل</button>') + '<div class="list">';
  var last = null;
  list.forEach(function(it, i){ if (it.grp2 !== undefined) {} if (it.grpTitle) {} if (l.items[i].grp && l.items[i].grp !== last){ last = l.items[i].grp; html += '<div class="gh" style="--c:' + l.color + '">' + esc(last) + '</div>'; } html += itemRow(it, i, l.color); });
  var all = SR.a1.concat(SR.a2), k = all.indexOf(l), nx = all[k + 1];
  html += '</div>' + (nx ? '<a class="mission" href="#/l/' + nx.id + '" style="background:linear-gradient(115deg,' + nx.color + ',#14103A)"><span class="em">⏭️</span><div><b>الدرس اللي بعده</b><span>' + esc(nx.title) + '</span></div><span class="arr">‹</span></a>' : '') +
    '<div class="foot">النطق العربي للمساعدة فقط، اعتمد على الصوت.</div></div>';
  render(html, 'learn'); bindCtl(); bindItems(list);
  markSeen(l.id, 15);
}
function viewLevels(){
  var html = '<div class="wrap"><div class="ph" style="--c:#2B1F86"><span class="em">🧗</span><h1>سلّم المستويات</h1><div class="g">A1 → C2</div><p>المستويات دي معيار أوروبي (CEFR) بيستخدموه في الامتحانات والشغل.</p></div>' + ladderHTML() +
    '<div class="sh"><h2>A1 · مبتدئ</h2></div><div class="list">' + SR.a1.map(lessonRow).join('') + '</div>' +
    '<div class="sh"><h2>A2 · أساسي</h2></div><div class="list">' + SR.a2.map(lessonRow).join('') + '</div>' +
    '<div class="panel center" style="margin-top:16px"><div style="font-size:44px">🛸</div><b>B1 وما فوق جايين قريب</b><p style="color:var(--mute);font-size:14px;margin:6px 0 12px">اشترك في القناة عشان يوصلك أول ما ينزلوا.</p>' + contactHTML().split('<div class="panel" id="installCard"')[0] + '</div></div>';
  render(html, 'learn'); bindInstall();
}

/* ---------------- TOOLS ---------------- */
function viewNumTool(){
  loadAudio('num');
  var html = '<div class="wrap"><div class="ph" style="--c:#FF6B2C"><a class="back" href="#/learn">→ اتعلّم</a><span class="em">🏭</span><h1>مصنع الأرقام</h1><div class="g">Zahlen-Fabrik</div><p>اكتب أي رقم من ٠ لـ ١٠٠٠٠٠٠ وشوف إزاي بيتركّب.</p></div>' + ctlBar() +
    '<div class="panel"><input class="inp de" id="nIn" inputmode="numeric" placeholder="مثلًا 2026" value="21" aria-label="الرقم"><div class="bigout" id="nOut"></div><div class="pr arp center" id="nAr" style="font-size:18px"></div>' +
    '<div class="row" style="justify-content:center;margin-top:12px"><button class="btn" id="nPlay">🔊 اسمع</button><button class="btn alt" id="nRand">🎲 رقم عشوائي</button></div></div>' +
    '<div class="panel"><b>🎧 تحدّي: اسمع واكتب الرقم</b><p style="color:var(--mute);font-size:14px;margin:4px 0 10px">هتسمع رقم بالألماني، اكتبه بالأرقام.</p><div class="row"><button class="btn flame" id="qPlay">▶ اسمع الرقم</button><input class="inp de" id="qIn" inputmode="numeric" style="flex:1;min-width:120px" aria-label="إجابتك"><button class="btn" id="qChk">صح؟</button></div><div id="qRes" class="center" style="margin-top:8px;font-weight:800"></div></div></div>';
  render(html, 'learn'); bindCtl(); touch('num');
  function upd(){ var v = parseInt(($('#nIn').value || '').replace(/[^\d]/g,''), 10);
    if (isNaN(v) || v > 1000000){ $('#nOut').textContent = '؟'; $('#nAr').textContent = 'اكتب رقم من ٠ لمليون'; return null; }
    $('#nOut').textContent = numDe(v); $('#nAr').innerHTML = pron(numAr(v)); return v; }
  $('#nIn').oninput = upd; upd();
  $('#nPlay').onclick = function(){ var v = upd(); if (v != null) speak(numDe(v)); };
  $('#nRand').onclick = function(){ var v = Math.random() < .5 ? Math.floor(Math.random()*100) : Math.floor(Math.random()*3000); $('#nIn').value = v; upd(); speak(numDe(v)); };
  var target = null;
  $('#qPlay').onclick = function(){ if (target == null) target = Math.floor(Math.random()*999) + 1; speak(numDe(target)); $('#qRes').textContent = ''; };
  $('#qChk').onclick = function(){ if (target == null) return; var v = parseInt($('#qIn').value, 10);
    if (v === target){ $('#qRes').innerHTML = '✅ صح! ' + target + ' = <span class="de">' + numDe(target) + '</span>'; addXP(5); target = null; $('#qIn').value = ''; }
    else $('#qRes').textContent = '❌ مش هو، اسمعه تاني'; };
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
  var html = '<div class="wrap"><div class="ph" style="--c:#5B3DF5"><a class="back" href="#/learn">→ اتعلّم</a><span class="em">🕐</span><h1>الساعة الناطقة</h1><div class="g">Wie spät ist es?</div><p>غيّر الساعة والدقايق، وشوف الوقت بالطريقتين.</p></div>' + ctlBar() +
    '<div class="panel"><div class="clockwrap" id="ck"></div><div class="steps"><button class="btn alt" data-d="h-1">− ساعة</button><button class="btn alt" data-d="h1">+ ساعة</button><button class="btn alt" data-d="m-5">− ٥ د</button><button class="btn alt" data-d="m5">+ ٥ د</button></div></div>' +
    '<div class="panel"><b>💬 في الكلام العادي</b><div class="bigout sm" id="inf"></div><div class="pr arp center" id="infAr"></div><div class="row" style="justify-content:center;margin-top:8px"><button class="btn" id="pInf">🔊 اسمع</button></div></div>' +
    '<div class="panel"><b>🚉 الرسمي (المواعيد والقطارات)</b><div class="bigout sm" id="frm"></div><div class="pr arp center" id="frmAr"></div><div class="row" style="justify-content:center;margin-top:8px"><button class="btn" id="pFrm">🔊 اسمع</button></div></div>' +
    '<div class="tip trap"><b class="k">⚠️ فخ</b><span class="de">halb acht</span> مش تمانية ونص! معناها «نص ساعة قبل ٨» يعني ٧:٣٠.</div></div>';
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
  loadAudio('calendar');
  var d = new Date(), wd = (d.getDay() + 6) % 7, day = SR.days[wd], mon = SR.months[d.getMonth()], dn = d.getDate(), y = d.getFullYear();
  var sDe = 'Heute ist ' + day[0] + ', der ' + ordDe(dn) + ' ' + mon[0] + ' ' + numDe(y) + '.';
  var sAr = 'هويته ايست ' + day[1] + '، ديا ' + ordAr(dn) + ' ' + mon[1] + ' ' + numAr(y) + '.';
  var first = new Date(y, d.getMonth(), 1), off = (first.getDay() + 6) % 7, dim = new Date(y, d.getMonth() + 1, 0).getDate(), cells = '';
  ['Mo','Di','Mi','Do','Fr','Sa','So'].forEach(function(x){ cells += '<span class="h">' + x + '</span>'; });
  for (var i = 0; i < off; i++) cells += '<span></span>';
  for (var k = 1; k <= dim; k++) cells += '<span class="' + (k === dn ? 't' : '') + '">' + k + '</span>';
  var html = '<div class="wrap"><div class="ph" style="--c:#19C79A"><a class="back" href="#/learn">→ اتعلّم</a><span class="em">🗓️</span><h1>التقويم الحي</h1><div class="g">' + esc(day[0]) + ' · ' + esc(mon[0]) + '</div><p>تاريخ النهارده والساعة دلوقتي، بالألماني.</p></div>' + ctlBar() +
    '<div class="panel"><b>📍 النهارده</b><div class="bigout sm">' + esc(sDe) + '</div><div class="pr arp center">' + pron(sAr) + '</div><div class="row" style="justify-content:center;margin-top:8px"><button class="btn" id="pD">🔊 اسمع</button></div>' +
    '<div class="center" style="font-family:Outfit;font-weight:700;margin-top:14px">' + esc(mon[0]) + ' ' + y + '</div><div class="cal">' + cells + '</div></div>' +
    '<div class="panel"><b>⏰ الساعة دلوقتي</b><div class="bigout sm" id="tNow"></div><div class="pr arp center" id="tAr"></div><div class="row" style="justify-content:center;margin-top:8px"><button class="btn" id="pT">🔊 اسمع</button></div></div>' +
    '<div class="tip memo"><b class="k">🧠 احفظها كده</b>التاريخ بيتقال برقم ترتيبي: <span class="de">der erste, der zweite, der dritte</span>… ومن ٢٠ وطالع بنزوّد <span class="de">-ste</span>.</div>' +
    '<a class="mission" href="#/t/calendar"><span class="em">🗓️</span><div><b>كل الأيام والشهور</b><span>بالصوت والنطق</span></div><span class="arr">‹</span></a></div>';
  render(html, 'learn'); bindCtl(); touch('cal');
  function tick(){ if (!$('#tNow')) return clearInterval(iv); var n = new Date(), s = formal(n.getHours(), n.getMinutes()); $('#tNow').textContent = s; $('#tAr').innerHTML = pron(sentAr(s)); }
  var iv = setInterval(tick, 15000); tick();
  $('#pD').onclick = function(){ speak(sDe); };
  $('#pT').onclick = function(){ speak($('#tNow').textContent); };
}
function viewIntro(){
  var st = {name:S.name || '', g:'m', c:0, city:'', age:'', job:0, langs:{0:1, 3:1}};
  var html = '<div class="wrap"><div class="ph" style="--c:#FF3D7F"><a class="back" href="#/learn">→ اتعلّم</a><span class="em">🙋</span><h1>قدّم نفسك</h1><div class="g">Ich stelle mich vor</div><p>املا بياناتك، وخد تعريف نفسك بالألماني جاهز بالصوت.</p></div>' + ctlBar() +
    '<div class="panel form"><label for="iN">اسمك (بالإنجليزي أحسن)</label><input class="inp de" id="iN" placeholder="Ali" value="' + esc(st.name) + '">' +
    '<label>أنا</label><div class="seg" style="width:max-content"><button data-gg="m" class="on">👦 ولد</button><button data-gg="f">👧 بنت</button></div>' +
    '<label for="iC">بلدك</label><select class="inp" id="iC">' + SR.countries.map(function(c, i){ return '<option value="' + i + '">' + c[3] + ' ' + c[2] + '</option>'; }).join('') + '</select>' +
    '<label for="iT">مدينتك</label><input class="inp de" id="iT" placeholder="Kairo">' +
    '<label for="iA">سنك</label><input class="inp de" id="iA" inputmode="numeric" placeholder="20">' +
    '<label for="iJ">شغلك أو دراستك</label><select class="inp" id="iJ">' + SR.jobs.map(function(j, i){ return '<option value="' + i + '">' + j[4] + '</option>'; }).join('') + '</select>' +
    '<label>بتتكلم لغات إيه؟</label><div class="chips" id="iL">' + SR.langs.map(function(l, i){ return '<button class="chip ' + (st.langs[i] ? 'on' : '') + '" data-l="' + i + '">' + l[2] + '</button>'; }).join('') + '</div></div>' +
    '<div class="panel out" id="iOut"></div><div class="row"><button class="btn wide" id="iPlay">🔊 اسمع تعريفك كله</button></div></div>';
  render(html, 'learn'); bindCtl();
  var lines = [];
  function build(){
    st.name = $('#iN').value.trim(); st.city = $('#iT').value.trim(); st.age = parseInt($('#iA').value, 10); st.c = +$('#iC').value; st.job = +$('#iJ').value;
    var c = SR.countries[st.c], j = SR.jobs[st.job], L = SR.langs.filter(function(x, i){ return st.langs[i]; });
    lines = [];
    lines.push(['Hallo! Ich heiße ' + (st.name || '…') + '.', 'هالو! ايش هايسه ' + (st.name || '…') + '.', 'أهلًا! اسمي ' + (st.name || '…') + '.']);
    lines.push(['Ich komme aus ' + c[0] + '.', 'ايش كومه اوس ' + c[1] + '.', 'أنا من ' + c[2] + '.']);
    if (st.city) lines.push(['Ich wohne in ' + st.city + '.', 'ايش ڤونه ان ' + st.city + '.', 'ساكن في ' + st.city + '.']);
    if (st.age > 0 && st.age < 120) lines.push(['Ich bin ' + numDe(st.age) + ' Jahre alt.', 'ايش بين ' + numAr(st.age) + ' ياغه الت.', 'عندي ' + ar(st.age) + ' سنة.']);
    lines.push(['Ich bin ' + (st.g === 'f' ? j[2] : j[0]) + '.', 'ايش بين ' + (st.g === 'f' ? j[3] : j[1]) + '.', 'أنا ' + j[4] + (st.g === 'f' ? 'ة' : '') + '.']);
    if (L.length){ var de = L.map(function(x){ return x[0]; }), arp = L.map(function(x){ return x[1]; }), mn = L.map(function(x){ return x[2]; });
      var jd = de.length > 1 ? de.slice(0, -1).join(', ') + ' und ' + de[de.length-1] : de[0], ja = arp.length > 1 ? arp.slice(0, -1).join('، ') + ' اونت ' + arp[arp.length-1] : arp[0];
      lines.push(['Ich spreche ' + jd + '.', 'ايش شبغيشه ' + ja + '.', 'بتكلم ' + mn.join(' و') + '.']); }
    lines.push(['Freut mich!', 'فغويت ميش!', 'اتشرفت بيك!']);
    $('#iOut').innerHTML = lines.map(function(l, i){ return '<button class="it" data-x="' + i + '" style="--c:#FF3D7F"><span class="tx"><span class="d" style="display:block">' + esc(l[0]) + '</span><span class="pr arp" style="display:block">' + pron(l[1]) + '</span><span class="m">' + esc(l[2]) + '</span></span><span class="play sm">' + ICON_PLAY + '</span></button>'; }).join('');
    $$('[data-x]').forEach(function(b){ b.onclick = function(){ $$('.it.on').forEach(function(x){ x.classList.remove('on'); }); b.classList.add('on'); speak(lines[+b.dataset.x][0], function(){ b.classList.remove('on'); }); }; });
  }
  ['#iN','#iT','#iA'].forEach(function(s){ $(s).oninput = build; }); ['#iC','#iJ'].forEach(function(s){ $(s).onchange = build; });
  $$('[data-gg]').forEach(function(b){ b.onclick = function(){ st.g = b.dataset.gg; $$('[data-gg]').forEach(function(x){ x.classList.toggle('on', x === b); }); build(); }; });
  $$('#iL [data-l]').forEach(function(b){ b.onclick = function(){ var i = +b.dataset.l; st.langs[i] = !st.langs[i]; b.classList.toggle('on', !!st.langs[i]); build(); }; });
  $('#iPlay').onclick = function(){ if (st.name){ S.name = st.name; save(); } touch('intro'); stopAudio(); var my = token, i = 0, els = $$('[data-x]');
    (function next(){ if (my !== token || i >= lines.length) return; var el = els[i]; $$('.it.on').forEach(function(x){ x.classList.remove('on'); }); el.classList.add('on'); speak(lines[i++][0], function(){ el.classList.remove('on'); if (my === token) setTimeout(next, 500); }); token = my; })(); };
  build();
}

/* ---------------- GAMES ---------------- */
var GAMES = [
  {id:'meaning',e:'🎯',c:'#5B3DF5',t:'المعنى الصح',d:'كلمة ألماني و٤ اختيارات'},
  {id:'listen',e:'🎧',c:'#FF6B2C',t:'اسمع واختار',d:'تسمع الكلمة وتلاقيها'},
  {id:'match',e:'🔗',c:'#19C79A',t:'وصّل',d:'وصّل الكلمة بمعناها'},
  {id:'artikel',e:'🎨',c:'#FF3D7F',t:'der · die · das',d:'اختار الأداة بالألوان'},
  {id:'type',e:'⌨️',c:'#3A86FF',t:'اكتبها',d:'اكتب الكلمة بالألماني'},
  {id:'order',e:'🧩',c:'#C9971C',t:'رتّب الجملة',d:'رتّب الكلمات صح'},
  {id:'memory',e:'🃏',c:'#8338EC',t:'لعبة الذاكرة',d:'اقلب ولاقي الأزواج'},
  {id:'speed',e:'⏱️',c:'#E63946',t:'تحدّي السرعة',d:'أكبر عدد في ٦٠ ثانية'},
  {id:'cards',e:'🧠',c:'#06A77D',t:'بطاقات الحفظ',d:'بتفتكر اللي نسيته'}
];
function gameTile(g, topic){ return '<a class="tile" href="#/g/' + g.id + '/' + (topic || 'all') + '" style="--c:' + g.c + '"><span class="em">' + g.e + '</span><b>' + g.t + '</b><span>' + g.d + '</span></a>'; }
function viewPlay(){
  var html = '<div class="wrap"><div class="ph" style="--c:#FF6B2C"><span class="em">🎮</span><h1>العب</h1><div class="g">Spielen</div><p>كل إجابة صح = ١٠ نقط. اختار لعبة، وبعدها اختار الموضوع.</p></div>' +
    '<a class="mission ' + (S.daily[today()] ? 'done' : '') + '" href="#/daily" style="margin-top:0"><span class="em">🎯</span><div><b>مهمة النهارده</b><span>' + (S.daily[today()] ? 'خلّصتها ✅' : '١٠ أسئلة متنوعة + ٥٠ نقطة') + '</span></div><span class="arr">‹</span></a>' +
    '<div class="sh"><h2>الألعاب</h2></div><div class="tiles">' + GAMES.map(function(g){ return gameTile(g); }).join('') + '</div></div>';
  render(html, 'play');
}
function pickBar(game, cur){
  var opts = [{id:'all', e:'🌍', title:'كله'}].concat(topics()).concat([{id:'a1', e:'📘', title:'دروس A1'},{id:'a2', e:'📗', title:'دروس A2'}]);
  return '<div class="pick">' + opts.map(function(t){ return '<a class="chip ' + (t.id === cur ? 'on' : '') + '" href="#/g/' + game + '/' + t.id + '" style="text-decoration:none">' + t.e + ' ' + esc(t.title) + '</a>'; }).join('') + '</div>';
}
function norm(s){ return String(s).toLowerCase().replace(/ä/g,'ae').replace(/ö/g,'oe').replace(/ü/g,'ue').replace(/ß/g,'ss').replace(/[^a-z0-9 ]/g,' ').replace(/\s+/g,' ').trim(); }
function uniqBy(arr, f){ var s = {}; return arr.filter(function(x){ var k = f(x); if (s[k]) return false; s[k] = 1; return true; }); }

function viewGame(gid, tid, opts){
  opts = opts || {};
  var g = GAMES.find(function(x){ return x.id === gid; }); if (!g) return go('#/play');
  var pool = uniqBy(itemsOf(tid).filter(function(x){ return x.mn; }), function(x){ return x.de; });
  if (tid === 'all') ['abc','num','greet','intro','colors','family','food','home','body','animals','jobs','weather','travel','verbs','calendar'].forEach(loadAudio); else loadAudio(tid);
  var need = {order: function(x){ var n = x.de.split(' ').length; return n >= 3 && n <= 9 && !/[,·]/.test(x.de); }, artikel: function(x){ return !!x.g; }}[gid];
  if (need) pool = pool.filter(need);
  var pool2 = uniqBy(pool, function(x){ return x.mn; });
  var head = opts.daily ? '<div class="ph" style="--c:#FF3D7F"><a class="back" href="#/">→ الرئيسية</a><span class="em">🎯</span><h1>مهمة النهارده</h1><div class="g">Tagesmission</div><p>١٠ أسئلة متنوعة. خلّصها وخد ٥٠ نقطة زيادة.</p></div>' :
    '<div class="ph" style="--c:' + g.c + '"><a class="back" href="#/play">→ العب</a><span class="em">' + g.e + '</span><h1>' + g.t + '</h1><p>' + g.d + '</p></div>' + pickBar(gid, tid);
  if (pool2.length < (gid === 'memory' ? 6 : 5)){
    render('<div class="wrap">' + head + '<div class="empty"><i>🪐</i>الموضوع ده مفيهوش كلمات كفاية للعبة دي. اختار موضوع تاني من فوق.</div></div>', 'play'); return;
  }
  render('<div class="wrap">' + head + '<div id="stage"></div></div>', 'play');
  var stage = $('#stage');
  var rnd = opts.daily ? seeded('daily' + today()) : Math.random;
  var R = {ok:0, total:0, mistakes:0};
  function finish(extra){
    var pct = R.total ? R.ok / R.total : 0, stars = pct >= .9 ? 3 : pct >= .6 ? 2 : 1, xp = R.ok * 10 + 20 + (extra || 0);
    if (R.total >= 5 && R.mistakes === 0){ S.perfect = true; }
    S.games[gid] = 1; if (opts.daily){ S.daily[today()] = R.ok; xp += 50; }
    save(); addXP(xp); confetti();
    stage.innerHTML = '<div class="result"><div class="em">' + (stars === 3 ? '🏆' : stars === 2 ? '🚀' : '🌱') + '</div><h2>' + (stars === 3 ? 'إنت صاروخ!' : stars === 2 ? 'برافو عليك!' : 'بداية حلوة!') + '</h2>' +
      '<div class="stars">' + '⭐'.repeat(stars) + '<span style="opacity:.25">' + '⭐'.repeat(3 - stars) + '</span></div><div>' + ar(R.ok) + ' من ' + ar(R.total) + ' صح</div><div class="xpgain">+' + ar(xp) + ' نقطة ⚡</div>' +
      '<div class="row" style="justify-content:center;margin-top:8px"><button class="btn" id="again">🔁 العب تاني</button><a class="btn alt" href="' + (opts.daily ? '#/' : '#/play') + '" style="text-decoration:none">' + (opts.daily ? 'الرئيسية' : 'ألعاب تانية') + '</a></div></div>';
    $('#again').onclick = function(){ viewGame(gid, tid, opts); };
    if (!S.popup){ setTimeout(function(){ if ($('.result') && !S.popup){ S.popup = true; save(); subPopup(); } }, 1500); }
  }
  function bar(i, n){ return '<div class="gamebar"><div class="prog"><i style="width:' + (i / n * 100) + '%"></i></div><span class="hearts">' + ar(i) + '/' + ar(n) + '</span></div>'; }
  function others(item, n, key){ return shuffle(pool2.filter(function(x){ return x[key] !== item[key]; }), rnd).slice(0, n); }

  if (gid === 'meaning' || gid === 'listen' || gid === 'artikel' || gid === 'type' || gid === 'order' || opts.daily){
    var N = 10, qs = shuffle(pool2, rnd).slice(0, N), i = 0;
    var types = opts.daily ? qs.map(function(q, k){ return q.g && k % 3 === 2 ? 'artikel' : (k % 2 ? 'listen' : 'meaning'); }) : null;
    var next = function(){
      if (i >= qs.length) return finish();
      var q = qs[i], t = types ? types[i] : gid; i++;
      var h = bar(i - 1, qs.length);
      if (t === 'meaning'){
        var ch = shuffle([q].concat(others(q, 3, 'mn')), rnd);
        h += '<div class="qcard"><div class="em">' + (q.e || '💬') + '</div><div class="q">يعني إيه؟</div><div class="big">' + deHTML(q) + '</div><div class="pr arp">' + pron(q.ar) + '</div><button class="play sm" id="qp" style="margin:8px auto 0">' + ICON_PLAY + '</button></div>' +
          '<div class="opts">' + ch.map(function(c, k){ return '<button class="opt" data-k="' + k + '">' + esc(c.mn) + '</button>'; }).join('') + '</div>';
        stage.innerHTML = h; $('#qp').onclick = function(){ play(q); }; play(q);
        $$('.opt').forEach(function(b){ b.onclick = function(){ answer(ch[+b.dataset.k] === q, b, q); }; });
      } else if (t === 'listen'){
        var ch2 = shuffle([q].concat(others(q, 3, 'de')), rnd);
        h += '<div class="qcard"><div class="q">اسمع واختار اللي سمعته</div><button class="play" id="qp" style="width:84px;height:84px;margin:8px auto">' + ICON_PLAY + '</button><div class="q">🐢 دوس تاني لو عايز تسمع أبطأ</div></div>' +
          '<div class="opts">' + ch2.map(function(c, k){ return '<button class="opt de" data-k="' + k + '">' + deHTML(c) + '</button>'; }).join('') + '</div>';
        stage.innerHTML = h; var slowNext = false;
        $('#qp').onclick = function(){ var sp = S.set.speed; if (slowNext) S.set.speed = 'slow'; play(q, null, function(){ S.set.speed = sp; }); slowNext = true; }; play(q);
        $$('.opt').forEach(function(b){ b.onclick = function(){ answer(ch2[+b.dataset.k] === q, b, q); }; });
      } else if (t === 'artikel'){
        h += '<div class="qcard"><div class="em">' + (q.e || '📦') + '</div><div class="q">der ولا die ولا das؟</div><div class="big">… ' + esc(q.n) + '</div><div class="m" style="color:var(--mute)">' + esc(q.mn) + '</div></div>' +
          '<div class="arts"><button class="artb m" data-a="m">der</button><button class="artb f" data-a="f">die</button><button class="artb n" data-a="n">das</button></div>' +
          '<div class="tip memo" style="margin-top:12px"><b class="k">🧠</b><span style="color:#2F6BFF;font-weight:800">der</span> مذكر · <span style="color:#FF3D7F;font-weight:800">die</span> مؤنث · <span style="color:#12A877;font-weight:800">das</span> محايد. احفظ كل اسم بأداته ولونه.</div>';
        stage.innerHTML = h;
        $$('.artb').forEach(function(b){ b.onclick = function(){ answer(b.dataset.a === q.g, b, q); }; });
      } else if (t === 'type'){
        h += '<div class="qcard"><div class="em">' + (q.e || '✍️') + '</div><div class="q">اكتبها بالألماني</div><div class="bigar">' + esc(q.mn) + '</div><button class="play sm" id="qp" style="margin:8px auto 0">' + ICON_PLAY + '</button></div>' +
          '<input class="inp de" id="tin" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="اكتب هنا…" aria-label="إجابتك"><div class="row" style="margin-top:10px"><button class="btn wide" id="tchk">تأكيد</button></div>' +
          '<div class="center" style="font-size:12.5px;color:var(--mute);margin-top:6px">مش لاقي ä ö ü؟ اكتب ae oe ue عادي</div>';
        stage.innerHTML = h; $('#qp').onclick = function(){ play(q); }; var inp = $('#tin'); setTimeout(function(){ inp.focus(); }, 50);
        var chk = function(){ var v = norm(inp.value), full = norm(q.de), noun = q.n ? norm(q.n) : null; var ok = v === full || (noun && v === noun); answer(ok, null, q, ok && noun && v === noun ? 'صح! بس متنساش الأداة: ' + ART[q.g] : null); };
        $('#tchk').onclick = chk; inp.onkeydown = function(e){ if (e.key === 'Enter') chk(); };
      } else if (t === 'order'){
        var words = q.de.split(' '), pool3 = shuffle(words.map(function(w, k){ return {w:w, k:k}; }), rnd), built = [];
        if (pool3.map(function(x){ return x.w; }).join(' ') === q.de) pool3.reverse();
        h += '<div class="qcard"><div class="q">رتّب الكلمات عشان تبقى:</div><div class="bigar" style="font-size:19px">' + esc(q.mn) + '</div></div><div class="slots" id="sl"></div><div class="pool" id="po"></div><div class="row"><button class="btn alt" id="oclr">↺ امسح</button><button class="btn" id="ochk" style="flex:1">تأكيد</button></div>';
        stage.innerHTML = h;
        var draw = function(){ $('#sl').innerHTML = built.map(function(x, k){ return '<button class="wchip" data-s="' + k + '">' + esc(x.w) + '</button>'; }).join('');
          $('#po').innerHTML = pool3.map(function(x, k){ return built.indexOf(x) >= 0 ? '' : '<button class="wchip" data-p="' + k + '">' + esc(x.w) + '</button>'; }).join('');
          $$('[data-p]').forEach(function(b){ b.onclick = function(){ built.push(pool3[+b.dataset.p]); draw(); }; });
          $$('[data-s]').forEach(function(b){ b.onclick = function(){ built.splice(+b.dataset.s, 1); draw(); }; }); };
        draw(); $('#oclr').onclick = function(){ built = []; draw(); };
        $('#ochk').onclick = function(){ if (built.length < words.length) return toast('كمّل الكلمات الأول'); answer(built.map(function(x){ return x.w; }).join(' ') === q.de, null, q); };
      }
    };
    var answer = function(ok, btn, q, note){
      R.total++; if (ok) R.ok++; else R.mistakes++;
      if (btn) btn.classList.add(ok ? 'ok' : 'no');
      if (!ok){ $$('.opt').forEach(function(b){ if (b.textContent.trim() === q.mn || b.textContent.trim() === (q.g ? ART[q.g] + ' ' + q.n : q.de)) b.classList.add('ok'); }); }
      $$('.opt,.artb').forEach(function(b){ b.disabled = true; });
      showFb(ok, q, note, next);
      if (ok) play(q);
    };
    next(); return;
  }
  if (gid === 'match'){
    var rounds = 3, r = 0;
    var mround = function(){
      if (r >= rounds) return finish();
      r++; var set = shuffle(pool2, rnd).slice(0, 5), L = shuffle(set, rnd), Rr = shuffle(set, rnd), sel = null, left = 5;
      stage.innerHTML = bar(r - 1, rounds) + '<div class="q center" style="color:var(--mute);margin-bottom:10px">دوس على الكلمة وبعدين على معناها</div><div class="match"><div class="col">' + L.map(function(x, k){ return '<button class="mb de" data-l="' + k + '">' + deHTML(x) + '</button>'; }).join('') + '</div><div class="col">' + Rr.map(function(x, k){ return '<button class="mb" data-r="' + k + '">' + esc(x.mn) + '</button>'; }).join('') + '</div></div>';
      $$('[data-l]').forEach(function(b){ b.onclick = function(){ $$('[data-l]').forEach(function(x){ x.classList.remove('sel'); }); b.classList.add('sel'); sel = L[+b.dataset.l]; play(sel); }; });
      $$('[data-r]').forEach(function(b){ b.onclick = function(){ if (!sel) return toast('اختار الكلمة الألماني الأول');
        var it = Rr[+b.dataset.r]; R.total++;
        if (it === sel){ R.ok++; b.classList.add('done'); $('[data-l].sel').classList.add('done'); sel = null; left--; if (!left) setTimeout(mround, 500); }
        else { R.mistakes++; b.classList.add('no'); setTimeout(function(){ b.classList.remove('no'); }, 400); } }; });
    };
    mround(); return;
  }
  if (gid === 'memory'){
    var set6 = shuffle(pool2, rnd).slice(0, 6), cards = [];
    set6.forEach(function(x, k){ cards.push({k:k, t:'de', it:x}); cards.push({k:k, t:'mn', it:x}); }); cards = shuffle(cards, rnd);
    var open = [], found = 0, moves = 0;
    stage.innerHTML = '<div class="q center" style="color:var(--mute);margin-bottom:10px">اقلب كارتين: الكلمة الألماني ومعناها</div><div class="mem">' + cards.map(function(c, k){ return '<button class="mc" data-c="' + k + '" aria-label="كارت">🚀</button>'; }).join('') + '</div><div class="center" id="mv" style="margin-top:10px;color:var(--mute)"></div>';
    $$('[data-c]').forEach(function(b){ b.onclick = function(){
      var c = cards[+b.dataset.c]; if (b.classList.contains('up') || open.length === 2) return;
      b.classList.add('up'); if (c.t === 'de'){ b.classList.add('de'); b.innerHTML = deHTML(c.it); play(c.it); } else b.textContent = (c.it.e ? c.it.e + ' ' : '') + c.it.mn;
      open.push({b:b, c:c});
      if (open.length === 2){ moves++; $('#mv').textContent = 'محاولات: ' + ar(moves);
        if (open[0].c.k === open[1].c.k){ open.forEach(function(o){ o.b.classList.add('got'); }); open = []; found++; if (found === 6){ R.total = 6; R.ok = Math.max(1, 6 - Math.max(0, moves - 6) / 2 | 0); R.mistakes = moves - 6; setTimeout(finish, 600); } }
        else setTimeout(function(){ open.forEach(function(o){ o.b.classList.remove('up','de'); o.b.textContent = '🚀'; }); open = []; }, 900); } }; });
    return;
  }
  if (gid === 'speed'){
    var end = Date.now() + 60000, timer;
    stage.innerHTML = '<div class="qcard"><div class="em">⏱️</div><b>معاك ٦٠ ثانية</b><p style="color:var(--mute)">جاوب أكبر عدد من الأسئلة. كل إجابة صح = ١٠ نقط.</p><button class="btn flame" id="sgo">🚀 ابدأ</button></div>';
    $('#sgo').onclick = function(){
      var q1 = function(){
        var left = Math.max(0, Math.ceil((end - Date.now()) / 1000)); if (!left){ clearInterval(timer); return finish(); }
        var q = pool2[Math.floor(rnd() * pool2.length)], ch = shuffle([q].concat(others(q, 3, 'mn')), rnd);
        stage.innerHTML = '<div class="gamebar"><span class="timer" id="tm">' + left + '</span><div class="prog"><i style="width:' + (left / 60 * 100) + '%;background:linear-gradient(90deg,#FF6B2C,#FFC53D)"></i></div><span class="hearts">✅ ' + ar(R.ok) + '</span></div>' +
          '<div class="qcard"><div class="em">' + (q.e || '💬') + '</div><div class="big">' + deHTML(q) + '</div></div><div class="opts">' + ch.map(function(c, k){ return '<button class="opt" data-k="' + k + '">' + esc(c.mn) + '</button>'; }).join('') + '</div>';
        $$('.opt').forEach(function(b){ b.onclick = function(){ var ok = ch[+b.dataset.k] === q; R.total++; if (ok) R.ok++; else R.mistakes++; b.classList.add(ok ? 'ok' : 'no'); setTimeout(q1, ok ? 250 : 650); }; });
      };
      end = Date.now() + 60000; timer = setInterval(function(){ var t = $('#tm'); if (!t){ clearInterval(timer); return; } var left = Math.max(0, Math.ceil((end - Date.now()) / 1000)); t.textContent = left; if (!left){ clearInterval(timer); finish(); } }, 250);
      q1();
    };
    return;
  }
  if (gid === 'cards'){
    var deck = pool2.slice().sort(function(a, b){ return (S.cards[a.de] || 0) - (S.cards[b.de] || 0) || (rnd() - .5); }).slice(0, 20), ci = 0;
    var card = function(){
      if (ci >= deck.length){ R.total = deck.length; return finish(); }
      var q = deck[ci], box = S.cards[q.de] || 0;
      stage.innerHTML = bar(ci, deck.length) + '<div class="flash"><div class="fc" id="fc"><div class="side"><div class="em">' + (q.e || '🃏') + '</div><div class="big">' + deHTML(q) + '</div><div style="color:var(--mute);font-size:13px">دوس عشان تقلب</div></div>' +
        '<div class="side back"><div class="em">' + (q.e || '🃏') + '</div><div style="font-size:24px;font-weight:800">' + esc(q.mn) + '</div><div class="pr">' + pron(q.ar) + '</div></div></div></div>' +
        '<div class="row"><button class="btn alt" id="no" style="flex:1">🔁 لسه</button><button class="btn" id="yes" style="flex:1">✅ عرفتها</button></div><div class="center" style="color:var(--mute);font-size:12.5px;margin-top:8px">صندوق ' + ar(box) + ' من ٥</div>';
      var fc = $('#fc'); fc.onclick = function(){ fc.classList.toggle('flip'); play(q); };
      play(q);
      $('#yes').onclick = function(){ S.cards[q.de] = Math.min(5, box + 1); R.ok++; save(); ci++; card(); };
      $('#no').onclick = function(){ S.cards[q.de] = 0; save(); deck.push(q); ci++; if (deck.length > 40) deck.length = 40; card(); };
    };
    card(); return;
  }
}
function showFb(ok, q, note, next){
  var fb = $('#fb'); fb.className = 'feedback ' + (ok ? 'ok' : 'no');
  fb.innerHTML = '<b>' + (ok ? (note ? '✅ ' + esc(note) : ['✅ برافو!','✅ صح كده!','✅ عاش!','✅ ممتاز!'][Math.floor(Math.random()*4)]) : '❌ الإجابة الصح:') + '</b>' +
    '<div class="ans">' + deHTML(q) + '</div><div>' + esc(q.mn) + '</div><button class="btn" id="fbn">' + (ok ? 'كمّل' : 'فهمت، كمّل') + '</button>';
  requestAnimationFrame(function(){ fb.classList.add('show'); });
  $('#fbn').onclick = function(){ hideFb(); next(); };
}
function hideFb(){ var fb = $('#fb'); if (fb) fb.classList.remove('show'); }

/* ---------------- placement test ---------------- */
function viewTest(){
  var qs = SR.placement, i = 0, score = 0;
  render('<div class="wrap"><div class="ph" style="--c:#5B3DF5"><a class="back" href="#/">→ الرئيسية</a><span class="em">🧭</span><h1>اختبار المستوى</h1><div class="g">Einstufungstest</div><p>١٢ سؤال من السهل للصعب. لو مش عارف، خمّن عادي.</p></div><div id="stage"></div></div>', 'home');
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
    var rec = score <= 4 ? {e:'🌱', t:'ابدأ من الأساسيات', d:'الحروف والتحيات والأرقام هيبنولك أساس قوي.', h:'#/t/abc', b:'ابدأ بالحروف'} :
              score <= 8 ? {e:'🚀', t:'إنت جاهز لـ A1', d:'ادخل دروس A1 بالترتيب، وراجع الكلمات بالألعاب.', h:'#/l/a1-1', b:'أول درس A1'} :
                           {e:'🌙', t:'مستواك عالي!', d:'راجع A1 بسرعة، وابدأ دروس A2.', h:'#/l/a2-perfekt', b:'دروس A2'};
    st.innerHTML = '<div class="result"><div class="em">' + rec.e + '</div><h2>' + rec.t + '</h2><div>جبت ' + ar(score) + ' من ' + ar(qs.length) + '</div><p style="color:var(--mute)">' + rec.d + '</p><a class="btn" href="' + rec.h + '" style="text-decoration:none;display:inline-block">' + rec.b + '</a></div>';
    confetti();
  }
  q();
}

/* ---------------- ME ---------------- */
function viewMe(){
  var rk = rankOf(S.xp), top = 3000, pct = Math.min(100, S.xp / top * 100);
  var html = '<div class="wrap"><div class="ph" style="--c:#14103A"><span class="em">🧑‍🚀</span><h1>' + (S.name ? esc(S.name) : 'رحلتي') + '</h1><div class="g">' + rk.de + '</div><p>' + rk.e + ' إنت دلوقتي ' + rk.a + '</p></div>' +
    '<div class="ribbon" id="ribbon" style="margin-top:0">' + ribbonHTML() + '</div>' +
    '<div class="sh"><h2>الارتفاع</h2></div><div class="panel alt"><div class="altimeter"><i style="height:' + pct + '%"></i></div><div class="ranks">' +
    RANKS.map(function(r){ return '<div class="rk ' + (S.xp >= r.x ? 'got' : '') + (r === rk ? ' cur' : '') + '"><i>' + r.e + '</i><div><b>' + r.de + '</b><div style="font-size:12px">' + r.a + '</div></div><span>' + ar(r.x) + ' نقطة</span></div>'; }).join('') + '</div></div>' +
    '<div class="sh"><h2>أوسمتي</h2><span style="color:var(--mute);font-size:13px">' + ar(Object.keys(S.badges).length) + ' من ' + ar(BADGES.length) + '</span></div><div class="badges">' +
    BADGES.map(function(b){ return '<div class="bd ' + (S.badges[b.id] ? 'got' : '') + '"><i>' + b.e + '</i><b>' + b.t + '</b><span>' + b.d + '</span></div>'; }).join('') + '</div>' +
    '<div class="sh"><h2>شهادتي</h2></div><div class="panel"><p style="margin:0 0 10px;color:var(--mute);font-size:14px">اكتب اسمك وخد شهادة بمستواك ونقطك، تنزل صورة تشاركها.</p><input class="inp de" id="cName" placeholder="Your name" value="' + esc(S.name) + '" aria-label="اسمك"><button class="btn wide flame" id="cert" style="margin-top:10px">🏅 اعمل شهادتي</button></div>' +
    '<div class="sh"><h2>الإعدادات</h2></div><div class="panel">' +
    setRow('dark', '🌙 الوضع الليلي', document.documentElement.getAttribute('data-theme') === 'dark') + setRow('sp', '🔤 النطق العربي', S.set.sp) + setRow('kids', '🧸 وضع الصغار', S.set.kids) +
    '<div class="set"><span>🐢 سرعة الصوت</span><div class="seg"><button data-sp="slow" class="' + (S.set.speed === 'slow' ? 'on' : '') + '">بطيء</button><button data-sp="normal" class="' + (S.set.speed !== 'slow' ? 'on' : '') + '">عادي</button></div></div>' +
    '<div class="set"><span>📲 حط الموقع على شاشتك</span><button class="btn" id="installBtn">تثبيت</button></div>' +
    '<div class="set"><span>🗑️ ابدأ من الأول</span><button class="btn alt" id="reset">امسح تقدّمي</button></div></div>' + contactHTML().split('<div class="panel" id="installCard"')[0] +
    '<div class="foot">Sprachrakete · MOHANNAD 🚀</div></div>';
  render(html, 'me'); bindCtl(); bindInstall();
  $$('[data-set]').forEach(function(b){ b.onclick = function(){ var k = b.dataset.set;
    if (k === 'dark'){ S.set.theme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'; }
    else S.set[k] = !S.set[k];
    save(); applySettings(); b.classList.toggle('on'); }; });
  $('#reset').onclick = function(){ if (confirm('متأكد؟ كل النقط والأوسمة هتتمسح.')){ var keep = S.set; S = {xp:0, streak:0, last:'', days:{}, badges:{}, seen:{}, cards:{}, games:{}, daily:{}, tools:{}, name:'', set:keep, perfect:false, test:null, popup:true}; save(); viewMe(); } };
  $('#cert').onclick = function(){ var n = $('#cName').value.trim(); if (!n) return toast('اكتب اسمك الأول'); S.name = n; save(); certificate(n); };
}
function setRow(k, label, on){ return '<div class="set"><span>' + label + '</span><button class="switch ' + (on ? 'on' : '') + '" data-set="' + k + '" aria-label="' + label + '"></button></div>'; }
function certificate(name){
  var rk = rankOf(S.xp), c = document.createElement('canvas'); c.width = 1400; c.height = 990; var x = c.getContext('2d');
  var g = x.createRadialGradient(1100, 0, 50, 700, 500, 1100); g.addColorStop(0, '#4B33D6'); g.addColorStop(.45, '#2B1F86'); g.addColorStop(1, '#14103A'); x.fillStyle = g; x.fillRect(0, 0, 1400, 990);
  for (var i = 0; i < 140; i++){ x.fillStyle = 'rgba(255,255,255,' + (Math.random() * .8 + .2) + ')'; x.beginPath(); x.arc(Math.random()*1400, Math.random()*990, Math.random()*1.8 + .3, 0, 7); x.fill(); }
  x.strokeStyle = '#FFC53D'; x.lineWidth = 6; x.strokeRect(40, 40, 1320, 910); x.lineWidth = 2; x.strokeRect(58, 58, 1284, 874);
  var pg = x.createRadialGradient(170, 860, 10, 170, 860, 200); pg.addColorStop(0, '#FFC53D'); pg.addColorStop(.6, '#FF6B2C'); pg.addColorStop(1, '#C2410C'); x.fillStyle = pg; x.beginPath(); x.arc(170, 880, 170, 0, 7); x.fill();
  x.textAlign = 'center'; x.fillStyle = '#FFC53D'; x.font = '700 46px Outfit, sans-serif'; x.fillText('Sprachrakete', 700, 150);
  x.fillStyle = '#fff'; x.font = '800 64px system-ui, sans-serif'; x.direction = 'rtl'; x.fillText('شهادة إنجاز', 700, 250);
  x.font = '400 32px system-ui, sans-serif'; x.fillStyle = '#D8D3FF'; x.fillText('بنشهد إن رائد الفضاء', 700, 330);
  x.direction = 'ltr'; x.fillStyle = '#fff'; x.font = '700 92px Outfit, sans-serif'; x.fillText(name, 700, 450);
  x.fillStyle = '#FFC53D'; x.fillRect(450, 480, 500, 4);
  x.direction = 'rtl'; x.fillStyle = '#fff'; x.font = '500 34px system-ui, sans-serif'; x.fillText('وصل في رحلة تعلّم الألماني لـ ' + rk.a + ' ' + rk.e, 700, 560);
  x.fillStyle = '#D8D3FF'; x.font = '400 30px system-ui, sans-serif'; x.fillText(ar(S.xp) + ' نقطة · ' + ar(Object.keys(S.badges).length) + ' وسام · سلسلة ' + ar(S.streak) + ' يوم', 700, 625);
  x.fillText(new Date().toLocaleDateString('ar-EG', {year:'numeric', month:'long', day:'numeric'}), 700, 690);
  x.direction = 'ltr'; x.fillStyle = '#FFC53D'; x.font = '700 30px Outfit, sans-serif'; x.fillText('MOHANNAD · YouTube @u0_0z', 900, 860);
  x.direction = 'rtl'; x.fillStyle = 'rgba(255,255,255,.6)'; x.font = '400 20px system-ui, sans-serif'; x.fillText('شهادة تشجيعية من الموقع، وليست شهادة رسمية من جهة امتحانات.', 900, 905);
  x.font = '120px system-ui'; x.fillText('🚀', 1220, 300);
  var url = c.toDataURL('image/png');
  var m = document.createElement('div'); m.className = 'modal';
  m.innerHTML = '<div class="mcard"><button class="x" aria-label="قفل">✕</button><h3>🏅 شهادتك جاهزة</h3><img src="' + url + '" alt="الشهادة" style="width:100%;border-radius:14px;margin:6px 0 12px"><a class="btn wide" style="display:block;text-decoration:none" download="Sprachrakete-' + name.replace(/[^\w-]/g, '') + '.png" href="' + url + '">⬇️ نزّل الشهادة</a><p style="margin-top:8px;font-size:12.5px">على الآيفون: دوس على الصورة دوسة طويلة واختار «حفظ الصورة».</p></div>';
  document.body.appendChild(m); m.querySelector('.x').onclick = function(){ m.remove(); }; m.onclick = function(e){ if (e.target === m) m.remove(); };
}

/* ---------------- search ---------------- */
var INDEX = null;
function buildIndex(){
  INDEX = []; topics().forEach(function(t){ itemsOf(t.id).forEach(function(it){ INDEX.push(Object.assign({tid:t.id, tt:t.title, te:t.e}, it)); }); });
  SR.a1.concat(SR.a2).forEach(function(l){ var grp = l.id.indexOf('a1') === 0 ? 'a1' : 'a2'; l.items.forEach(function(it){ INDEX.push(Object.assign({tid:'l/' + l.id, tt:l.title, te:'📘', grp:grp}, it)); }); });
}
function viewSearch(q){
  if (!INDEX) buildIndex();
  var html = '<div class="wrap"><div class="ph" style="--c:#3A86FF"><span class="em">🔍</span><h1>دوّر</h1><div class="g">Suchen</div><p>اكتب كلمة بالعربي أو بالألماني.</p></div>' +
    '<input class="inp" id="sq" placeholder="مثلًا: قطة أو Katze" value="' + esc(q || '') + '" autocomplete="off" aria-label="بحث"><div class="res" id="sr"></div></div>';
  render(html, 'search'); var inp = $('#sq'), res = [];
  function run(){ var v = inp.value.trim(); if (!v){ $('#sr').innerHTML = '<div class="empty"><i>🛰️</i>ابدأ اكتب وهتظهر النتايج هنا</div>'; return; }
    var nv = norm(v); res = INDEX.filter(function(it){ return it.mn.indexOf(v) >= 0 || (nv && norm(it.de).indexOf(nv) >= 0); }).slice(0, 40);
    $('#sr').innerHTML = res.length ? res.map(function(it, i){ return '<div><div style="font-size:12px;color:var(--mute);margin:0 4px 3px"><a href="#/' + (it.tid.indexOf('l/') === 0 ? it.tid : 't/' + it.tid) + '" style="text-decoration:none">' + it.te + ' ' + esc(it.tt) + ' ‹</a></div>' + itemRow(it, i) + '</div>'; }).join('') : '<div class="empty"><i>🪐</i>ملقيناش «' + esc(v) + '». جرّب كلمة تانية.</div>';
    $$('.it[data-i]').forEach(function(el){ el.onclick = function(){ play(res[+el.dataset.i], el); }; }); }
  inp.oninput = run; run(); setTimeout(function(){ inp.focus(); }, 60);
}

/* ---------------- popups / install ---------------- */
function subPopup(){
  var m = document.createElement('div'); m.className = 'modal';
  m.innerHTML = '<div class="mcard"><button class="x" aria-label="قفل">✕</button><div class="big">🚀</div><h3>عجبتك الرحلة؟</h3><p>اشترك في قناة اليوتيوب عشان يوصلك كل درس وكل لعبة جديدة.</p><a class="cbtn yt" style="justify-content:center" href="https://www.youtube.com/@u0_0z?sub_confirmation=1" target="_blank" rel="noopener"><i>▶</i>اشترك في القناة</a><button class="btn alt wide" style="margin-top:10px" id="later">بعدين</button></div>';
  document.body.appendChild(m); function close(){ m.remove(); } m.querySelector('.x').onclick = close; $('#later').onclick = close; m.querySelector('.cbtn').addEventListener('click', function(){ setTimeout(close, 300); });
}
var deferred = null;
addEventListener('beforeinstallprompt', function(e){ e.preventDefault(); deferred = e; });
function bindInstall(){
  var standalone = (window.matchMedia && matchMedia('(display-mode: standalone)').matches) || navigator.standalone;
  var card = $('#installCard'); if (card && standalone) card.hidden = true;
  $$('#installBtn').forEach(function(b){ b.onclick = function(){
    if (deferred){ deferred.prompt(); deferred.userChoice.then(function(){ deferred = null; }); return; }
    var ios = /iphone|ipad|ipod/i.test(navigator.userAgent);
    var m = document.createElement('div'); m.className = 'modal';
    m.innerHTML = '<div class="mcard"><button class="x" aria-label="قفل">✕</button><div class="big">📲</div><h3>حط Sprachrakete على شاشتك</h3>' + (ios ?
      '<ol><li>افتح الموقع من <b>Safari</b>.</li><li>دوس زرار المشاركة <b>⬆️</b> اللي تحت.</li><li>اختار <b>«إضافة إلى الشاشة الرئيسية»</b>.</li><li>دوس <b>«إضافة»</b>، وهتلاقي أيقونة الصاروخ 🚀</li></ol>' :
      '<ol><li>دوس على <b>⋮</b> فوق في Chrome.</li><li>اختار <b>«تثبيت التطبيق»</b> أو <b>«إضافة إلى الشاشة الرئيسية»</b>.</li><li>وافق، وهتلاقي أيقونة الصاروخ 🚀</li></ol>') + '<button class="btn wide" id="ok">تمام</button></div>';
    document.body.appendChild(m); function close(){ m.remove(); } m.querySelector('.x').onclick = close; $('#ok').onclick = close; }; });
}

/* ---------------- router ---------------- */
function go(h){ location.hash = h; }
function route(){
  var h = (location.hash || '#/').slice(1), p = h.split('/').filter(Boolean);
  if (!p.length) return viewHome();
  switch (p[0]){
    case 'learn': return viewLearn();
    case 't': return viewTopic(p[1]);
    case 'l': return viewLesson(p[1]);
    case 'levels': return viewLevels();
    case 'tool': return ({numbers:viewNumTool, clock:viewClock, calendar:viewCalendar, intro:viewIntro}[p[1]] || viewLearn)();
    case 'play': return viewPlay();
    case 'g': return viewGame(p[1], p[2] || 'all');
    case 'daily': return viewGame('meaning', 'all', {daily:true});
    case 'test': return viewTest();
    case 'me': return viewMe();
    case 'search': return viewSearch(decodeURIComponent(p[1] || ''));
    default: return viewHome();
  }
}
shell(); applySettings(); addEventListener('hashchange', route); route();
if (S.last && S.last !== today() && S.last !== yesterday() && S.streak){ S.streak = 0; save(); updateRibbon(); }
if ('serviceWorker' in navigator && location.protocol === 'https:'){ navigator.serviceWorker.register('sw.js').catch(function(){}); }
})();
