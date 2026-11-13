import { LAST_ROUND, COLOR_ORDER, COLOR_ZH, RIVAL, SPECIES, GOLD, GOLD_KEYS, GLYPH_PTS, RIVAL_GLYPH_PTS, RIVAL_OBJ_PTS,
  num, parts, allParts, results, goldPts, goldAllowed, turnOrder, humans, seated, solo, passers, firstRound, found } from './logic.js';
import { setupList, passSteps, ROTATE, betweenRounds, dontForget, SPECIES_INFO, speciesOrder } from './steps.js';

const COLORS = { green: 'var(--p-green)', purple: 'var(--p-purple)', orange: 'var(--p-orange)', white: 'var(--p-white)', rival: 'var(--p-rival)' };
const CATS = [
  { k: 'track', n: '分数条', c: 'var(--c-track)' }, { k: 'cards', n: '终局牌', c: 'var(--c-cards)' },
  { k: 'gold', n: '金色板块', c: 'var(--c-gold)' }, { k: 'alien', n: '外星生物', c: 'var(--c-alien)' }, { k: 'obj', n: '目标', c: 'var(--c-obj)' }
];
// Score sheet rows (规 21). list: one value per item, summed.
const FIELD = {
  track: { n: '分数条上的分数', hint: '终局计分之前，分数指示物停在几分（过了 100 / 200 分，加上 100 / 200 分标记）。先填这个，再算下面几项。' },
  cards: { n: '终局计分牌', hint: '打出的每张金框卡牌按卡上的条件算分，逐张输入（如 4+6）。只算你自己的东西。', list: true },
  ex: { n: '钻探者牌', hint: '翻开自己打出的钻探者牌，达成条件的按牌上分数逐张输入，没达成的不算。每张只算一次。', list: true },
  danger: { n: '危险度', hint: '打出的钻探者牌上的危险度，加上钻探者版图上你的标记（下层每个 3、中层 2、上层 1）。危险度最高的人自动扣总分的十分之一。' },
  glyph: { n: '符文族符文', hint: '没放上破译版图的符文标记分组，每组里的符文都不一样。每组输入它有几种（1–7），如 5+3+1。每组按 1 / 3 / 5 / 8 / 11 / 15 / 20 分计。', list: true },
  goldN: { n: '达成几组', hint: '' }
};
const RFIELD = {
  track: { n: '分数条上的分数', hint: '对手的分数指示物停在几分（含 100 分标记）。对手不算金色计分板块。' },
  obj: { n: '没完成的目标', hint: `目标列和目标牌堆里还没完成的目标块数，每块对手得 ${RIVAL_OBJ_PTS} 分（1 星难度没有目标；《群星计画》的长期目标不算）。`, count: true, mult: RIVAL_OBJ_PTS },
  ex: { n: '钻探者牌', hint: '对手打出的钻探者牌都算达成，按牌上分数逐张输入。', list: true },
  danger: { n: '危险度', hint: '对手钻探者牌上的危险度，加上钻探者版图上对手的标记。和你比较，高的扣十分之一。' },
  glyphN: { n: '符文标记', hint: `对手持有的符文标记个数，每个 ${RIVAL_GLYPH_PTS} 分，不分种类。`, count: true, mult: RIVAL_GLYPH_PTS }
};
const fieldOf = (id, k) => k.endsWith('N') && GOLD[k.slice(0, -1)] ? { ...FIELD.goldN, n: `${GOLD[k.slice(0, -1)].zh} · 达成几组`, hint: goldHint(k.slice(0, -1)) } : (id === RIVAL ? RFIELD : FIELD)[k];
const playerRows = () => ['track', 'cards', ...(found(S, 'exertians') ? ['ex', 'danger'] : []), ...(found(S, 'glyphids') ? ['glyph'] : [])];
const rivalRows = () => ['track', 'obj', ...(found(S, 'exertians') ? ['ex', 'danger'] : []), ...(found(S, 'glyphids') ? ['glyphN'] : [])];

// Tips per gold tile face (规 21; FAQ; BGG 3474497, 3516879, 3386825).
const GOLD_TIP = {
  tech: { a: '三种颜色里数量最少的那种有几块，就是几组。', b: '科技总数除以 2，向下取整。' },
  mission: { a: '条件任务、触发任务都算；触发任务要所有圆圈都盖满。半人马族、钻探者的牌不算任务。', b: '完成的任务和打出的终局计分牌（0 分的也算）合起来除以 2，向下取整。' },
  income: { a: '只数插在起始收入牌下面的牌，不算收入牌本身印的 3 信用点、2 能量、1 张牌。', b: '只数插入的信用点牌和能量牌，取多的那种；不算收入牌本身印的。' },
  other: { a: '紫、橙、蓝三色生命迹象，三种颜色里最少的那种有几个就是几组；冗余位置上的也算，不分种族。', b: '赢得扇区的次数（同一扇区赢多次都算）和人造卫星 + 着陆器（含卫星上的）总数，取小的那个。' }
};
const goldHint = k => S.gold[k] ? `${GOLD[k].faces[S.gold[k]].t}。${GOLD_TIP[k][S.gold[k]]}` : '先选这块板块朝上的是哪一面。';

const $ = s => document.querySelector(s);
const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const store = {
  get(k) { try { return localStorage.getItem(k); } catch { return null; } },
  set(k, v) { try { localStorage.setItem(k, v); } catch {} }
};

let code = cleanCode(new URLSearchParams(location.search).get('r'));
let S = null, noRoom = false, online = false, ws = null, queue = [], retry = 0;
// rn: rename inputs on the results tab; df: "don't forget" open; rot: how-to-rotate open; chk: ticked steps (this phone only); rv: rating form
const ui = { tab: store.get('seti-tab') || 'flow', sheet: null, err: '', busy: false, rooms: null, rn: false, saving: false, df: false, rot: false, chk: {}, rv: null };

function mine() {
  try { const v = JSON.parse(store.get('seti-mine')); if (Array.isArray(v)) return v; } catch {}
  return [];
}
const remember = c => store.set('seti-mine', JSON.stringify([c, ...mine().filter(x => x !== c)].slice(0, 8)));
const forget = c => store.set('seti-mine', JSON.stringify(mine().filter(x => x !== c)));
function ago(t) {
  const m = Math.floor((Date.now() - t) / 60000);
  return m < 1 ? '刚刚' : m < 60 ? `${m} 分钟前` : m < 1440 ? `${Math.floor(m / 60)} 小时前` : `${Math.floor(m / 1440)} 天前`;
}

async function loadRooms() {
  if (code) return;
  try { const r = await fetch('/api/rooms'); if (r.ok) { ui.rooms = await r.json(); render(); } } catch {}
}
setInterval(() => { if (!code && !document.hidden) loadRooms(); }, 8000);
const pending = new Map(); // debounced text inputs: key -> {timer, flush}

function cleanCode(v) { const c = String(v || '').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 4); return c.length === 4 ? c : null; }

/* ---------- connection ---------- */
function connect() {
  if (!code) return;
  ws = new WebSocket(`${location.protocol === 'https:' ? 'wss' : 'ws'}://${location.host}/api/room/${code}/ws`);
  ws.onopen = () => { retry = 0; online = true; queue.splice(0).forEach(m => ws.send(m)); render(); };
  ws.onmessage = e => {
    if (e.data === 'pong') return;
    const m = JSON.parse(e.data);
    if (m.type === 'state') {
      const newly = S && S.stage !== 'setup' ? m.state.found.filter(k => !S.found.includes(k)) : [];
      S = m.state; remember(code);
      if (newly.length) ui.sheet = { kind: 'species', k: newly.at(-1), fresh: true };   // every phone shows the discovered species
      render();
    }
    else if (m.type === 'error' && m.error === 'noroom') { noRoom = true; forget(code); ws.close(); render(); }
  };
  ws.onclose = () => {
    online = false; render();
    if (!noRoom && code) setTimeout(connect, Math.min(5000, 400 * 2 ** retry++));
  };
}
setInterval(() => { if (ws && ws.readyState === 1) ws.send('ping'); }, 25000);
document.addEventListener('visibilitychange', () => {
  if (!document.hidden && code && !noRoom && (!ws || ws.readyState > 1)) { retry = 0; connect(); }
});
function send(action) {
  const m = JSON.stringify({ action });
  if (ws && ws.readyState === 1) ws.send(m); else queue.push(m);
}
function debounced(key, fn, delay = 350) {
  const old = pending.get(key); if (old) clearTimeout(old.timer);
  const entry = { flush() { clearTimeout(entry.timer); pending.delete(key); fn(); } };
  entry.timer = setTimeout(entry.flush, delay);
  pending.set(key, entry);
}
const flushAll = () => [...pending.values()].forEach(p => p.flush());

/* ---------- helpers ---------- */
const P = id => S.players.find(p => p.id === id);
const pname = id => id === RIVAL ? '对手' : P(id).name || `${COLOR_ZH[id]}玩家`;
const por = (id, cls = '') => `<span class="por ${cls}" style="--c:${COLORS[id]}" data-c="${id}"><b>${id === RIVAL ? '对' : esc((P(id).name || COLOR_ZH[id])[0])}</b></span>`;
const expName = s => s.org ? '群星计画 · 研究机构' : s.sa ? '含群星计画' : '基础版';
function toast(t) { const el = $('#toast'); el.innerHTML = `<div class="toast">${esc(t)}</div>`; clearTimeout(toast.t); toast.t = setTimeout(() => el.innerHTML = '', 1800); }
const src = s => s ? `<i class="src">${esc(s)}</i>` : '';
const stepList = (items, key) => `<ul class="steps">${items.map((it, i) => {
  const k = key && `${key}-${i}`, on = k && ui.chk[k];
  return `<li class="${key ? 'ck' : ''}${on ? ' on' : ''}" ${key ? `data-act="chk" data-ck="${k}"` : ''}>${key ? '<span class="box"></span>' : ''}<span>${it.t}${src(it.src)}</span></li>`;
}).join('')}</ul>`;
const tileImg = (k, f) => `<img class="gt" src="img/gold/${k}-${f}.webp" alt="">`;

/* ---------- render (DOM morph keeps focus and typed text) ---------- */
function morph(a, b) {
  const ac = [...a.childNodes], bc = [...b.childNodes];
  bc.forEach((y, i) => {
    const x = ac[i];
    if (!x) { a.appendChild(y); return; }
    if (x.nodeType !== y.nodeType || x.nodeName !== y.nodeName || (x.nodeType === 1 && x.getAttribute('data-k') !== y.getAttribute('data-k'))) { a.replaceChild(y, x); return; }
    if (x.nodeType !== 1) { if (x.nodeValue !== y.nodeValue) x.nodeValue = y.nodeValue; return; }
    for (const at of [...x.attributes]) if (!y.hasAttribute(at.name)) x.removeAttribute(at.name);
    for (const at of [...y.attributes]) if (x.getAttribute(at.name) !== at.value) x.setAttribute(at.name, at.value);
    if (x.tagName === 'INPUT') {
      const v = y.getAttribute('value') ?? '';
      if (x !== document.activeElement && !pending.has(x.dataset.pk) && x.value !== v) x.value = v;
      return;
    }
    if ('disabled' in x) x.disabled = y.hasAttribute('disabled');
    morph(x, y);
  });
  while (a.childNodes.length > bc.length) a.removeChild(a.lastChild);
}
function render() {
  const t = document.createElement('div');
  t.innerHTML = view();
  morph($('#app'), t);
  $('#sheet').innerHTML = ui.sheet ? sheetView() : '';
}

function view() {
  if (!code) return landing();
  if (noRoom) return `${hero()}<div class="wrap"><h2 class="h">房间 ${code} 不存在</h2><p class="note">房间码可能输错了，或者房间已失效。</p><button class="btn" data-act="leave">返回首页</button></div>`;
  if (!S) return `${hero()}<div class="wrap"><h2 class="h">正在连接房间 ${code}…</h2></div>`;
  return bar() + `<div class="wrap" data-k="stage-${S.stage === 'setup' ? 'setup' : 'play'}">` + (S.stage === 'setup' ? setupView() : playView()) + '</div>';
}
const homeNav = () => `<div class="back-row"><button class="back-nav" data-act="leave" data-html2canvas-ignore>‹ 首页</button></div>`;
const hero = () => `<div class="hero with-back" data-k="hero">${homeNav()}<div class="en">SETI</div><h1>星空觅迹小助手</h1><div class="orn"></div></div><div class="band"></div>`;
const bar = () => `<div class="bar" data-k="bar">${homeNav()}<span class="ttl">星空觅迹</span>
  <button class="room" data-act="share"><small>房间</small>${code}<small>邀请</small></button><span class="conn ${online ? 'on' : ''}" title="${online ? '已连接' : '重新连接中'}"></span></div>`;

function landing() {
  const rooms = ui.rooms;
  const stageText = r => r.stage === 'setup' ? '准备中' : r.stage === 'over' ? '已结束' : `第 ${r.round} / ${LAST_ROUND} 轮`;
  const my = mine();
  const tag = c => my.includes(c) ? '<em>我的</em>' : '';
  const listed = rooms && rooms.slice().sort((a, b) => my.includes(b.code) - my.includes(a.code));
  const unlisted = rooms ? my.filter(c => !rooms.some(r => r.code === c)) : [];
  const lp = p => `<span class="por xs" style="--c:${COLORS[p.id]}" data-c="${p.id}"><b>${esc((p.name || COLOR_ZH[p.id])[0])}</b></span>`;
  const roomList = rooms === null ? '<div class="empty">加载中…</div>' : listed.length + unlisted.length ? listed.map(r => `
      <button class="card lobby" data-act="rejoin" data-code="${r.code}" data-k="lb-${r.code}">
        <span class="lc">${r.code}${tag(r.code)}</span>
        <span class="lp">${r.players.map(lp).join('')}</span>
        <span class="ls"><b class="st st-${r.stage}">${stageText(r)}</b><small>${r.online ? `<i class="od on"></i>${r.online} 人在线` : ago(r.updated)}</small></span>
      </button>`).join('') + unlisted.map(c => `
      <button class="card lobby" data-act="rejoin" data-code="${c}" data-k="lb-${c}">
        <span class="lc">${c}${tag(c)}</span><span class="lp"></span><span class="ls"><small>点击进入</small></span>
      </button>`).join('') : '<div class="empty">暂无进行中的房间</div>';
  return `<div class="hero-art cover" data-k="hero"><div class="back-row"><a class="back-nav" href="https://boardgame.leisurecat.cloud" data-html2canvas-ignore>‹ 全部游戏</a></div><div class="back-row rate-row"><a class="back-nav rate-nav" href="https://boardgame.leisurecat.cloud/?rate=seti&back=${encodeURIComponent(location.href)}" data-html2canvas-ignore>★ 写评价</a></div><img src="img/cover-bg.jpg" alt=""><img class="cv" src="img/cover.jpg" alt="《星空觅迹》游戏盒封面"><div class="ht">
      <div class="hz">星空觅迹小助手</div><div class="hs">开局不漏 · 轮次不乱 · 计分不错</div></div></div>
    <div class="wrap" data-k="landing">
    <div class="card start">
      <button class="btn" data-act="create" ${ui.busy ? 'disabled' : ''}>创建新房间</button>
      <div class="or">或输入房间码加入</div>
      <div class="join"><input id="joinCode" maxlength="4" autocomplete="off" autocapitalize="characters" placeholder="房间码"><button class="btn navy" data-act="join">加入</button></div>
      ${ui.err ? `<div class="err">${esc(ui.err)}</div>` : ''}
    </div>
    <a class="card teachgo" href="teach"><span class="tg-i">讲</span><span><b>第一次玩？${TEACH_MIN} 分钟讲规则</b>照着念就能开局，不懂的词点一下</span><i>›</i></a>
    <div class="tiles">
      <a class="card tile" href="guide"><span class="ti rec">问</span><span><b>常见问题</b>易错规则与外星生物</span></a>
      <a class="card tile" href="history"><span class="ti rec">录</span><span><b>往期对局</b>战绩与成绩参照</span></a>
    </div>
    <h2 class="h">房间<small>${rooms && rooms.length ? `${rooms.length} 个` : ''}</small></h2>
    <div class="list">${roomList}</div>
    <footer>非官方玩家工具 · 封面版权归 Czech Games Edition 所有</footer></div>`;
}
const TEACH_MIN = 6;

/* ---------- setup ---------- */
function goldPicker() {
  return `<div class="golds">${GOLD_KEYS.map(k => `<div class="card gpick" data-k="gp-${k}"><b>${GOLD[k].zh}</b><div class="gfaces">${['a', 'b'].map(f => `
    <button class="gface${S.gold[k] === f ? ' on' : ''}" data-act="gold" data-tile="${k}" data-face="${S.gold[k] === f ? '' : f}">${tileImg(k, f)}<span>${GOLD[k].faces[f].t}<small>${GOLD[k].faces[f].pts.join(' / ')} 分</small></span></button>`).join('')}</div></div>`).join('')}</div>`;
}
function setupView() {
  const used = seated(S).map(p => p.id);
  const chip = (on, act, attrs, label) => `<button class="chip${on ? ' on' : ''}" data-act="${act}" ${attrs}>${label}</button>`;
  const goldSet = GOLD_KEYS.filter(k => S.gold[k]).length;
  return `
    <h2 class="h">扩展</h2>
    <div class="chips">${chip(S.sa, 'opt', `data-key="sa" data-on="${!S.sa}"`, '群星计画')}${S.sa ? chip(S.org, 'opt', `data-key="org" data-on="${!S.org}"`, '使用研究机构') : ''}</div>
    ${S.sa ? `<p class="note">《群星计画》的新牌、3 种新外星生物和信号标记直接混进基础游戏。${S.org ? '<b>用研究机构时只打 4 轮（第 2–5 轮）</b>，推广从 0 开始，收入在第 3、4、5 轮开始时拿。' : '研究机构可选，用的话只打 4 轮。'}</p>` : ''}
    <h2 class="h">玩家人数</h2>
    <div class="chips">${[1, 2, 3, 4].map(k => chip(k === S.n, 'n', `data-n="${k}"`, `${k} 人`)).join('')}</div>
    ${solo(S) ? `<h2 class="h">单人<small>对手 · 竞争研究机构</small></h2>
      <div class="chips">${[1, 2, 3, 4, 5].map(k => chip(S.solo.diff === k, 'diff', `data-d="${k}"`, `${k} 星`)).join('')}</div>
      <p class="note">难度看对手玩家版图背面的星数。第一次玩建议 1 星（没有目标）。对手的行动由它的行动牌决定，这里只帮你开局和计分。</p>
      <div class="chips" style="margin-top:8px">${chip(S.solo.first === 'me', 'sfirst', 'data-f="me"', '我先手')}${chip(S.solo.first === 'rival', 'sfirst', 'data-f="rival"', '对手先手')}<button class="chip" data-act="sflip">随机</button></div>` : ''}
    <h2 class="h">${S.n > 1 ? '座位与颜色<small>按顺时针排列</small>' : '玩家'}</h2>
    <div class="list">${seated(S).map((p, i) => `
      <div class="card row" data-k="seat-${i}">
        ${S.n > 1 ? `<div class="stepn">${i + 1}</div>` : ''}
        ${por(p.id)}
        <div class="who">
          <input class="pn" data-pk="name-${i}" data-name="${i}" value="${esc(p.name)}" placeholder="玩家名" maxlength="12" enterkeyhint="done">
          <div class="dots">${COLOR_ORDER.map(c => `<button class="dot${c === p.id ? ' on' : ''}" style="--c:${COLORS[c]}" data-c="${c}" data-act="color" data-i="${i}" data-col="${c}" ${c !== p.id && used.includes(c) ? 'disabled' : ''} aria-label="${COLOR_ZH[c]}"></button>`).join('')}
            ${S.n > 1 ? `<button class="fst${S.start === p.id ? ' on' : ''}" data-act="first" data-id="${p.id}">${S.start === p.id ? '起始玩家' : '设为起始'}</button>` : ''}</div>
        </div>
        ${S.n > 1 ? `<button class="ib" data-act="move" data-i="${i}" data-j="${i - 1}" ${i === 0 ? 'disabled' : ''} aria-label="上移">↑</button>
        <button class="ib" data-act="move" data-i="${i}" data-j="${i + 1}" ${i === S.n - 1 ? 'disabled' : ''} aria-label="下移">↓</button>` : ''}
      </div>`).join('')}</div>
    ${S.n > 1 ? `<p class="note">规则书：最近见过 UFO 的人当起始玩家。起始分按座位：起始玩家 1 分，顺时针依次 2、3、4 分。</p>
      <div class="btns"><button class="btn ghost" data-act="order">手指轮盘 / 抽签定起始玩家 ›</button></div>` : ''}
    <h2 class="h">金色计分板块<small>${goldSet}/4 已选</small></h2>
    <p class="note">4 块都随机一面朝上。摆好后点一下每块朝上的那一面，终局计分会用到（之后在计分页也能改）。</p>
    ${goldPicker()}
    <button class="btn ghost" data-act="setup">看布置清单</button>
    <button class="btn" data-act="begin">开始游戏</button>`;
}

/* ---------- play ---------- */
function playView() {
  const tabs = [['flow', '流程'], ['score', '计分'], ['mvp', '结算']];
  if (!tabs.some(t => t[0] === ui.tab)) ui.tab = 'flow';
  return `<div class="tabs">${tabs.map(([k, n]) => `<button class="tab${ui.tab === k ? ' on' : ''}" data-act="tab" data-tab="${k}">${n}</button>`).join('')}</div>
    ${status()}${banner()}
    <div data-k="tab-${ui.tab}">${ui.tab === 'flow' ? flowTab() : ui.tab === 'score' ? scoreTab() : mvpTab()}</div>`;
}

function status() {
  if (S.stage === 'over') return `<div class="status"><span class="medal">终</span><div><div class="t">游戏结束</div><div class="s">第 5 轮已结束，开始终局计分</div></div></div>`;
  const left = passers(S).length - S.passed.length, f = firstRound(S);
  const pips = Array.from({ length: LAST_ROUND - f + 1 }, (_, i) => `<i class="${i + f < S.round ? 'done' : i + f === S.round ? 'cur' : ''}"></i>`).join('');
  return `<div class="status"><span class="medal" style="font-size:19px">${S.round}</span>
    <div><div class="t">第<b>${S.round}</b>轮${S.org ? ' · 共 4 轮（第 2–5 轮）' : ` / ${LAST_ROUND}`}</div><div class="s">${left ? `还有 ${left} ${solo(S) ? '方' : '人'}没跳过` : S.round === LAST_ROUND ? '都跳过了：进入终局计分' : '都跳过了：轮次之间'}</div></div>
    <div class="pips">${pips}</div></div>`;
}

function banner() {
  if (S.stage === 'over' && ui.tab !== 'mvp')
    return `<div class="banner"><div style="flex:1"><b>游戏结束</b>，请填写终局计分</div><button data-act="goto" data-tab="${ui.tab === 'score' ? 'mvp' : 'score'}">${ui.tab === 'score' ? '看结算' : '去计分'}</button></div>`;
  return '';
}

function aliensCard() {
  const list = S.found;
  return `<div class="card ph aliens" data-k="aliens"><div class="phh"><span class="phn">外</span><b>外星生物</b><small>${list.length}/2 已发现</small></div><div class="phb">
    ${list.length ? `<div class="sps">${list.map(k => `<button class="sp" data-act="sp" data-k="${k}"><b>${SPECIES[k].zh}</b><small>${SPECIES[k].en} · 规则要点</small></button>`).join('')}</div>` : ''}
    ${list.length < 2 ? `<p>某块外星生物版图下的 3 个发现位置都填满了，回合结束后翻开它，点下面的名字：大家的手机都会弹出这个种族的摆放和规则。</p>
      <button class="btn ghost" data-act="spick">发现了新的外星生物</button>` : ''}</div></div>`;
}

function flowTab() {
  const order = turnOrder(S);
  const k = id => S.passed.indexOf(id);
  const track = `<div class="track"><div class="t">${solo(S) ? '单人 · 你和对手轮流先手' : '行动顺序 · 从起始玩家起顺时针'}</div><div class="slots">${order.map((id, i) => `
    <div class="slot${k(id) >= 0 ? ' out' : ''}" data-k="slot-${id}"><div class="o">${i + 1}</div>${por(id)}<div class="n">${esc(pname(id))}</div>${k(id) >= 0 ? `<span class="m">第 ${k(id) + 1} 个跳过</span>` : i === 0 ? '<span class="m">起始</span>' : ''}</div>`).join('')}</div></div>`;
  const tools = `<div class="btns"><button class="btn ghost" data-act="undo" ${S.back.length ? '' : 'disabled'}>撤销上一步</button><button class="btn ghost" data-act="setup">布置清单</button><button class="btn ghost" data-act="reset">重新开局</button></div>`;
  if (S.stage === 'over') return track + aliensCard() + tools;
  const all = S.passed.length === passers(S).length, last = S.round === LAST_ROUND;
  const first = S.passed[0];
  const passBtns = `<div class="pick passes">${passers(S).map(id => `<button class="${k(id) >= 0 ? 'on' : ''}" data-act="pass" data-id="${id}" ${k(id) >= 0 ? 'disabled' : ''}>${por(id, 'sm')}<span>${esc(pname(id))}${k(id) >= 0 ? ' · 已跳过' : ' 跳过'}</span></button>`).join('')}</div>`;
  const rotHelp = `<button class="tbh df" data-act="rot"><b>太阳系怎么转</b><span>${ui.rot ? '收起' : '展开'}</span></button>${ui.rot ? `<div class="rot"><img src="img/teach/rotate.webp" alt="太阳系公转示意">${stepList(ROTATE.map(t => ({ t, src: '规 16' })))}</div>` : ''}`;
  const firstNote = first ? `<div class="firstp">${por(first, 'xs')}<span><b>${esc(pname(first))}</b> 是本轮第一个跳过的：${first === RIVAL ? '替对手' : ''}转太阳系了吗？${found(S, 'anomalies') ? '转完检查异常点。' : ''}</span></div>` : '';
  return `${track}
    <div class="card ph${all ? ' done' : ' cur'}" data-k="ph-act"><div class="phh"><span class="phn">1</span><b>轮流行动</b><small>${all ? '都跳过了' : '每回合 1 个主要行动 + 任意免费行动'}</small></div>
      ${all ? '' : `<div class="phb"><p>不再行动了，就点自己的「跳过」${solo(S) ? '（对手的行动牌用完时替它点）' : ''}，按下面的步骤做。</p>${passBtns}
      ${firstNote}
      <h4 class="sh">${first ? '之后跳过的人' : '跳过时'}按顺序做</h4>${stepList(passSteps(S, !first))}
      ${rotHelp}
      <button class="tbh df" data-act="df"><b>别忘了</b><span>${ui.df ? '收起' : `展开 ${dontForget(S).length} 条`}</span></button>${ui.df ? stepList(dontForget(S)) : ''}</div>`}</div>
    ${aliensCard()}
    <div class="card ph${all ? ' cur' : ' off'}" data-k="ph-end-${S.round}"><div class="phh"><span class="phn">2</span><b>${last ? '第 5 轮结束' : '轮次之间'}</b><small>${all ? '点一条勾一条' : '全员跳过后进行'}</small></div>
      ${all ? `<div class="phb">${stepList(betweenRounds(S), `r${S.round}`)}</div>` : ''}</div>
    <button class="btn" data-act="next" ${all ? '' : 'disabled'}>${!all ? '等所有人跳过' : last ? '进入终局计分' : `开始第 ${S.round + 1} 轮`}</button>
    ${tools}`;
}

/* ---------- scoring ---------- */
const meKey = () => `seti-me-${code}`;
const myId = () => { const m = store.get(meKey()); return humans(S).includes(m) ? m : null; };

function scoreTab() {
  const views = [['me', '我的计分'], ['all', '全桌总览'], ...(solo(S) ? [['rival', '对手']] : [])];
  const view = views.some(v => v[0] === ui.view) ? ui.view : 'me', me = solo(S) ? humans(S)[0] : myId();
  const seg = `<div class="seg">${views.map(([k, n]) => `<button class="${k === view ? 'on' : ''}" data-act="view" data-v="${k}">${n}</button>`).join('')}</div>`;
  if (view === 'me' && !me) return seg + `<h2 class="h">你是哪位玩家？</h2><p class="note">选好后这台手机只填你自己的分数，其他人在各自手机上填，结果实时汇总。</p>
    <div class="pick me">${humans(S).map(id => `<button data-act="me" data-id="${id}">${por(id, 'sm')}<span>${esc(pname(id))}</span></button>`).join('')}</div>`;
  return seg + (view === 'me' ? myScore(me) : view === 'rival' ? rivalScore() : fullTable());
}

const marked = id => GOLD_KEYS.filter(k => ((S.score[id] || {})[k + 'P'] || 0) > 0);
// Things worth checking before the totals are trusted (community-reported mistakes, see docs/调研).
function warnOf(id, key) {
  const d = (S.score[id] || {})[key];
  if (key === 'glyph' && Array.isArray(d) && d.some(v => v < 1 || v > 7)) return '每组只能有 1–7 种不同的符文';
  if (key === 'track') {
    const t = num(d), m = marked(id).length;
    if (t !== null && m > goldAllowed(t)) return `分数条 ${t} 分，只到过 ${goldAllowed(t)} 个金色里程碑（25 / 50 / 70），最多标 ${goldAllowed(t)} 块，现在标了 ${m} 块`;
  }
  return '';
}
function goldWarn(id, k) {
  const pos = (S.score[id] || {})[k + 'P'] || 0;
  if (pos !== 1 && pos !== 2) return '';
  const others = humans(S).filter(o => o !== id && ((S.score[o] || {})[k + 'P'] || 0) === pos);
  return others.length ? `${others.map(pname).join('、')} 也填了第 ${pos} 个：每块板块的第 1、第 2 格各只有一个人` : '';
}

function cellBtn(id, key) {
  const f = fieldOf(id, key), d = (S.score[id] || {})[key], warn = warnOf(id, key) ? ' warn' : '';
  if (f.list) { const t = key === 'glyph' ? (d || []).reduce((a, b) => a + (GLYPH_PTS[b] ?? 0), 0) : (d || []).reduce((a, b) => a + b, 0); return `<button class="cell ${d && d.length ? '' : 'empty'}${warn}" data-act="cell" data-id="${id}" data-key="${key}">${d && d.length ? t : '加'}</button>`; }
  const filled = d !== undefined && d !== '';
  const bad = filled && num(d) === null;
  return `<button class="cell ${filled ? '' : 'empty'} ${bad ? 'bad' : ''}${warn}" data-act="cell" data-id="${id}" data-key="${key}">${filled ? esc(d) + (f.count ? '<small>个</small>' : '') : '0'}</button>`;
}
const rowName = (id, k) => { const f = fieldOf(id, k); return `${f.n}${f.count ? `<small>每个 ×${f.mult}</small>` : ''}`; };

function goldItem(id, k) {
  const d = S.score[id] || {}, pos = d[k + 'P'] || 0, face = S.gold[k], w = goldWarn(id, k);
  const head = `<div class="ms-t"><b>${GOLD[k].zh}${face ? ` <small>${GOLD[k].faces[face].pts.join(' / ')}</small>` : ''}</b>`;
  if (!face) return `<div class="card ms gold" data-k="gi-${k}">${head}<div class="ms-h">还没选这块朝上的是哪一面：</div>
    <div class="gfaces">${['a', 'b'].map(f => `<button class="gface" data-act="gold" data-tile="${k}" data-face="${f}">${tileImg(k, f)}<span>${GOLD[k].faces[f].t}</span></button>`).join('')}</div></div></div>`;
  const pts = goldPts(S, k, pos) * (num(d[k + 'N']) ?? 0);
  return `<div class="card ms gold" data-k="gi-${k}">${tileImg(k, face)}${head}<div class="ms-h">${goldHint(k)}</div>
    <div class="gpos">${['没标', '第 1 个', '第 2 个', '之后'].map((n, i) => `<button class="${pos === i ? 'on' : ''}" data-act="gpos" data-id="${id}" data-tile="${k}" data-p="${i}">${n}${i ? `<small>${GOLD[k].faces[face].pts[i - 1]}</small>` : ''}</button>`).join('')}</div>
    ${w ? `<div class="ms-w">${esc(w)}</div>` : ''}</div>
    ${pos ? `<div class="gres">${cellBtn(id, k + 'N')}<small>组 = ${pts} 分</small></div>` : ''}</div>`;
}

function myScore(id) {
  const p = parts(S, id);
  const item = k => {
    const w = warnOf(id, k), d = (S.score[id] || {})[k], f = FIELD[k];
    const detail = f.list && d && d.length > 1 ? `<div class="ms-ex">${d.map((v, i) => (i ? ' + ' : '') + v).join('')}${k === 'glyph' ? ` 种 → ${d.map(v => GLYPH_PTS[v] ?? '?').join(' + ')} 分` : ''}</div>` : '';
    return `<div class="card ms" data-k="ms-${k}"><div class="ms-t"><b>${rowName(id, k)}</b><div class="ms-h">${f.hint}</div>${detail}${w ? `<div class="ms-w">${esc(w)}</div>` : ''}</div>${cellBtn(id, k)}</div>`;
  };
  const t = num((S.score[id] || {}).track), m = marked(id).length, allow = t ? goldAllowed(t) : 0;
  const others = humans(S).filter(o => o !== id).map(o => { const q = parts(S, o); return `<span>${por(o, 'xs')}${esc(pname(o))} <b>${q ? q.total : '—'}</b></span>`; }).join('');
  return `<div class="ms-who">${por(id, 'sm')}<div><b>${esc(pname(id))}</b><small>只填你自己的分数</small></div>${solo(S) ? '' : '<button class="tbh" data-act="me" data-id=""><span>换人</span></button>'}</div>
    <div class="list" style="margin-top:10px">${['track', 'cards'].map(item).join('')}</div>
    <h2 class="h">金色计分板块<small>标记位置的分数 × 组数</small></h2>
    ${t && allow > m ? `<p class="note">分数条 ${t} 分，到过 ${allow} 个金色里程碑，应该标了 ${allow} 块，现在只填了 ${m} 块，确认没漏。</p>` : ''}
    <div class="list">${GOLD_KEYS.map(k => goldItem(id, k)).join('')}</div>
    ${playerRows().length > 2 ? `<h2 class="h">外星生物</h2><div class="list">${playerRows().slice(2).map(item).join('')}</div>` : ''}
    <div class="ms-tot card"><span>我的合计</span><b data-tt="${id}">${p ? p.total : '—'}</b></div>
    ${p && p.minus ? `<p class="note">危险度最高，扣 ${p.minus} 分（十分之一，向下取整）。</p>` : ''}
    <div class="ms-others">${others}${solo(S) ? `<span>${por(RIVAL, 'xs')}对手 <b>${parts(S, RIVAL)?.total ?? '—'}</b></span>` : ''}</div>`;
}

function rivalScore() {
  const p = parts(S, RIVAL);
  const item = k => `<div class="card ms" data-k="rs-${k}"><div class="ms-t"><b>${rowName(RIVAL, k)}</b><div class="ms-h">${RFIELD[k].hint}</div></div>${cellBtn(RIVAL, k)}</div>`;
  return `<div class="ms-who">${por(RIVAL, 'sm')}<div><b>对手</b><small>按单人规则计分：不算金色计分板块</small></div></div>
    <div class="list" style="margin-top:10px">${rivalRows().map(item).join('')}</div>
    <div class="ms-tot card"><span>对手合计</span><b data-tt="rival">${p ? p.total : '—'}</b></div>
    ${p && p.minus ? `<p class="note">对手危险度最高，扣 ${p.minus} 分。</p>` : ''}`;
}

function fullTable() {
  const order = humans(S), all = allParts(S);
  const row = (k, name) => `<tr data-k="sr-${k}"><th>${name}</th>${order.map(id => `<td>${cellBtn(id, k)}</td>`).join('')}</tr>`;
  const goldRow = k => `<tr data-k="sr-g-${k}"><th>${GOLD[k].zh}<small>${S.gold[k] ? GOLD[k].faces[S.gold[k]].pts.join('/') : '未选面'}</small></th>${order.map(id => {
    const pos = (S.score[id] || {})[k + 'P'] || 0, v = all ? all[id].goldBy[k] : '—';
    return `<td><button class="cell ${pos ? '' : 'empty'}${goldWarn(id, k) ? ' warn' : ''}" data-act="gsheet" data-id="${id}" data-tile="${k}">${pos ? v : '—'}</button></td>`;
  }).join('')}</tr>`;
  const head = t => `<tr class="grp" data-k="g-${t}"><td colspan="${order.length + 1}">${t}</td></tr>`;
  const warns = order.flatMap(id => [warnOf(id, 'track') && `${pname(id)}：${warnOf(id, 'track')}`, ...GOLD_KEYS.map(k => goldWarn(id, k) && `${pname(id)} · ${GOLD[k].zh}：${goldWarn(id, k)}`)]).filter(Boolean);
  return `<table class="sc"><thead><tr><th></th>${order.map(id => `<th><div class="pv">${por(id, 'xs')}<span>${esc(pname(id))}</span></div></th>`).join('')}</tr></thead>
    <tbody>${row('track', '分数条')}${row('cards', '终局牌')}${head('金色计分板块')}${GOLD_KEYS.map(goldRow).join('')}
    ${playerRows().length > 2 ? head('外星生物') + playerRows().slice(2).map(k => row(k, FIELD[k].n)).join('') : ''}
    ${found(S, 'exertians') ? `<tr data-k="sr-minus"><th>危险扣分</th>${order.map(id => `<td class="mn">${all && all[id].minus ? '−' + all[id].minus : '0'}</td>`).join('')}</tr>` : ''}
    <tr data-k="sr-total"><th>合计</th>${order.map(id => `<td class="tt" data-tt="${id}">${all ? all[id].total : '—'}</td>`).join('')}</tr></tbody></table>
    ${warns.map(w => `<p class="note">${esc(w)}</p>`).join('')}
    <p class="legend">金色计分板块点格子选标在第几个、填达成几组，自动相乘。没手机的玩家可以由别人在这里代填。</p>`;
}

/* ---------- results ---------- */
function mvpTab() {
  const R = results(S);
  if (R.error) return `<p class="note">计分里有无效数字，请先到「计分」修正。</p>`;
  const one = solo(S), top = R.rows.filter(r => r.place === 1), champ = top[0];
  const val = (r, k) => k === 'alien' ? r.ex + r.glyph : r[k];
  const maxSum = Math.max(1, ...R.rows.map(r => CATS.reduce((a, c) => a + Math.max(0, val(r, c.k)), 0)), R.rival ? CATS.reduce((a, c) => a + Math.max(0, val(R.rival, c.k)), 0) : 0);
  const rkRow = (r, place) => `
      <div class="card row" data-k="rk-${r.id}"><div class="stepn">${place}</div>${por(r.id, 'sm')}
        <div class="who"><div class="nm">${esc(pname(r.id))}${r.id !== RIVAL ? ` <span class="fg" style="display:inline">${COLOR_ZH[r.id]}</span>` : ''}</div>
          <div class="stack">${CATS.map(c => `<i style="width:${Math.max(0, val(r, c.k)) / maxSum * 100}%;background:${c.c}"></i>`).join('')}</div>
          <div class="parts">${CATS.filter(c => val(r, c.k)).map(c => `<em style="background:${c.c}"></em>${c.n} ${val(r, c.k)}`).join(' ')}${r.minus ? ` <span class="mn">危险度 −${r.minus}</span>` : ''}</div></div>
        <div class="tot">${r.total}</div></div>`;
  const ranked = one ? [{ ...champ, place: champ.total >= R.rival.total ? 1 : 2 }, { ...R.rival, id: RIVAL, place: R.rival.total >= champ.total ? 1 : 2 }].sort((a, b) => a.place - b.place) : R.rows;
  const win = one && champ.total > R.rival.total;
  return `<div id="shot">
    <div class="mvp" style="margin-top:8px">
      <div class="crown">${one ? (win ? '首 次 接 触' : champ.total === R.rival.total ? '与 对 手 平 分' : '对 手 领 先') : top.length > 1 ? '并 列 第 一' : 'M V P · 首 次 接 触'}</div>
      ${por(champ.id)}
      <div class="nm">${top.map(r => esc(pname(r.id))).join(' · ')}</div>
      <div class="fg">${S.n} 人局 · ${expName(S)}${S.found.length ? ` · ${S.found.map(k => SPECIES[k].zh).join('、')}` : ''}${one ? ` · 对手 ${S.solo.diff} 星` : ''}</div>
      <div class="pts">${champ.total}<small>分${one ? ` · 对手 ${R.rival.total}` : ''}</small></div>
    </div>
    <div class="btns sv" data-html2canvas-ignore><button class="btn ghost" data-act="rn">${ui.rn ? '收起改名' : '修改玩家名'}</button><button class="btn navy" data-act="save" ${ui.saving ? 'disabled' : ''}>${ui.saving ? '正在生成…' : '保存结算长图'}</button></div>
    ${ui.rn ? `<div class="card" data-k="rn" data-html2canvas-ignore style="margin-top:8px;padding:2px 10px 8px">${humans(S).map(id => { const i = S.players.findIndex(p => p.id === id); return `<div class="tb">${por(id, 'xs')}<input class="pn" data-pk="name-${i}" data-name="${i}" value="${esc(P(id).name)}" placeholder="玩家名" maxlength="12" enterkeyhint="done"></div>`; }).join('')}</div>` : ''}
    ${!one && top.length > 1 ? '<p class="note">最高分平手就共享胜利，规则书没有其他判定（“这是一个能打到上百分的游戏，平手是你们挣来的”）。</p>' : ''}
    <h2 class="h">排名与得分构成</h2>
    <div class="list rk">${ranked.map(r => rkRow(r, r.place)).join('')}</div>
    <p class="legend">${CATS.filter(c => c.k !== 'obj' || one).map(c => `<em class="lg" style="background:${c.c}"></em>${c.n}`).join(' ')}</p>
    ${R.ach.length ? `<h2 class="h">成就</h2>
    <div class="achs">${R.ach.map(a => `
      <div class="card ach" data-k="ach-${a.k}"><span class="medal">${a.ch}</span><div style="min-width:0"><div class="an">${a.name}</div><div class="ad">${a.desc}</div>
        <div class="aw">${a.who.map(id => por(id, 'xs')).join('')}${a.who.length === 1 ? `<span class="fg" style="align-self:center;margin-left:3px">${esc(pname(a.who[0]))}</span>` : ''}</div></div></div>`).join('')}</div>` : ''}</div>
    ${reviewCard()}`;
}

/* ---------- rating this game (stars + comment), shown on the hub boardgame.leisurecat.cloud ---------- */
const REVIEW_API = 'https://boardgame.leisurecat.cloud/api/reviews';
const STAR_TXT = ['点星星打分', '不推荐', '一般', '还行', '好玩', '超好玩'];
const savedReview = () => { try { return JSON.parse(store.get('seti-rv-' + code)) || {}; } catch { return {}; } };
function reviewCard() {
  if (ui.rv?.room !== code) ui.rv = { who: solo(S) ? humans(S)[0] : myId(), stars: 0, text: '', state: '', err: '', ...savedReview(), room: code };
  const rv = ui.rv;
  if (rv.state === 'sent') return `<div class="card rv" data-k="rv"><div class="rv-done">${'★'.repeat(rv.stars)}${'☆'.repeat(5 - rv.stars)}</div>
    <p>谢谢 ${esc(rv.who && humans(S).includes(rv.who) ? pname(rv.who) : '')} 的评价！</p><div class="btns"><button class="btn ghost" data-act="rv-edit">修改评价</button><a class="btn navy" href="https://boardgame.leisurecat.cloud">看大家的评价</a></div></div>`;
  return `<h2 class="h">给这款游戏打个分</h2><div class="card rv" data-k="rv">
    <div class="rv-l">我是</div><div class="rv-who">${humans(S).map(id => `<button class="${rv.who === id ? 'on' : ''}" data-act="rv-who" data-id="${id}">${por(id, 'xs')}<span>${esc(pname(id))}</span></button>`).join('')}</div>
    <div class="rv-st">${[1, 2, 3, 4, 5].map(n => `<button class="${n <= rv.stars ? 'on' : ''}" data-act="rv-star" data-n="${n}" aria-label="${n} 星">★</button>`).join('')}<span>${STAR_TXT[rv.stars]}</span></div>
    <textarea data-rv placeholder="说说这局的感受（可不填）" maxlength="300">${esc(rv.text)}</textarea>
    <button class="btn" data-act="rv-send" ${!rv.who || !rv.stars || rv.state === 'sending' ? 'disabled' : ''}>${rv.state === 'sending' ? '提交中…' : '提交评价'}</button>
    ${rv.err ? `<p class="err">${esc(rv.err)}</p>` : ''}
    <p class="note">评价和玩家名会显示在「桌游小助手」首页，并计入这款游戏的整体评分。同一局再次提交会覆盖之前的评价。</p></div>`;
}
async function sendReview() {
  const rv = ui.rv;
  rv.state = 'sending'; rv.err = ''; render();
  try {
    const r = await fetch(REVIEW_API, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ game: 'seti', stars: rv.stars, name: pname(rv.who), text: rv.text, room: code }) });
    if (!r.ok) throw new Error((await r.json().catch(() => ({}))).error || `提交失败（${r.status}）`);
    rv.state = 'sent';
    store.set('seti-rv-' + code, JSON.stringify({ who: rv.who, stars: rv.stars, text: rv.text, state: 'sent' }));
  } catch (e) {
    rv.state = ''; rv.err = e.message === 'Failed to fetch' ? '网络连接失败，请稍后再试' : e.message;
  }
  render();
}

/* ---------- results as one long image ---------- */
const loadScript = src => new Promise((ok, fail) => {
  if (window.html2canvas) return ok();
  const el = document.createElement('script');
  el.src = src; el.onload = ok; el.onerror = () => fail(new Error('截图组件加载失败'));
  document.head.appendChild(el);
});
async function saveImage() {
  ui.saving = true; render();
  try {
    await loadScript('vendor/html2canvas.min.js');
    const canvas = await window.html2canvas($('#shot'), {
      scale: Math.max(2, window.devicePixelRatio || 1), backgroundColor: '#eef2f8',
      onclone: doc => {
        const c = doc.getElementById('shot');
        c.style.cssText = 'margin:0 -14px;padding:18px 14px 14px';   // grow outward so the content keeps its on-screen width
        c.insertAdjacentHTML('afterbegin', `<div style="text-align:center;padding-bottom:6px"><div style="font:900 22px var(--serif);color:var(--red);letter-spacing:4px">星空觅迹</div>
          <div style="font:500 12px var(--sans);color:var(--ink2);margin-top:4px">终局结算 · 房间 ${code} · ${new Date().toLocaleDateString('zh-CN')}</div></div>`);
        c.insertAdjacentHTML('beforeend', `<div style="text-align:center;font:500 11px var(--sans);color:var(--ink2);margin-top:16px">星空觅迹小助手 · ${location.host}</div>`);
      }
    });
    showImage(canvas.toDataURL('image/jpeg', 0.92));
  } catch (e) { toast('生成长图失败：' + e.message); }
  ui.saving = false; render();
}
function showImage(url) {
  const el = document.createElement('div');
  el.className = 'shotv';
  el.innerHTML = `<div class="sv-top"><span>长按图片保存到相册</span><a href="${url}" download="星空觅迹结算-${code}.jpg">下载</a><button type="button">关闭</button></div><img src="${url}" alt="结算长图">`;
  el.querySelector('button').onclick = () => el.remove();
  document.body.appendChild(el);
}

/* ---------- start player: the hub's finger chooser / bag draw, then 「返回」 comes back here ---------- */
const orderUrl = n => `https://boardgame.leisurecat.cloud/?order=${n}&back=${encodeURIComponent(location.href)}`;

/* ---------- sheets: keypad, setup checklist, species ---------- */
function speciesSheet(k) {
  const I = SPECIES_INFO[k], sp = SPECIES[k];
  return `<div class="mask" data-act="close"></div><div class="sheet tall"><h3>${ui.sheet.fresh ? '发现了：' : ''}${sp.zh}<small>${sp.en}${sp.x ? ' · 群星计画' : ''}</small></h3>
    <div class="hint">按外星生物说明页（${I.src}）用自己的话整理，以官方说明页为准。</div>
    <div class="sl"><h4>翻开后马上做</h4>${stepList(I.setup.map(t => ({ t })), `sp-${k}`)}
    <h4>新规则</h4>${stepList(I.rules.map(t => ({ t })))}
    ${I.end ? `<h4>终局</h4>${stepList([{ t: I.end }])}` : ''}
    ${I.traps.length ? `<h4>容易错</h4>${stepList(I.traps.map(t => ({ t })))}` : ''}</div>
    <div class="btns"><button class="btn ghost" data-act="ask" data-q="${esc(`${sp.zh}（${sp.en}）有哪些容易玩错的地方？`)}">问规则助手</button><button class="btn" data-act="close">知道了</button></div></div>`;
}
function sheetView() {
  const s = ui.sheet;
  if (s.kind === 'setup') {
    const secs = setupList(S, pname);
    return `<div class="mask" data-act="close"></div><div class="sheet tall"><h3>布置清单</h3>
      <div class="hint">${S.n} 人 · ${expName(S)}。点一条勾一条，只在这台手机上记。来源页码：规 = 规则书，扩 = 群星计画规则书。</div>
      <div class="sl">${secs.map((sec, i) => `<h4>${sec.h}</h4>${stepList(sec.items, `s${i}`)}`).join('')}</div>
      <button class="btn ghost" data-act="close">关闭</button></div>`;
  }
  if (s.kind === 'species') return speciesSheet(s.k);
  if (s.kind === 'spick') {
    const left = speciesOrder(S).filter(k => !found(S, k));
    return `<div class="mask" data-act="close"></div><div class="sheet"><h3>翻开的是哪个外星生物？</h3>
      <div class="hint">所有人的手机都会弹出它的摆放和规则。点错了在「外星生物」里再点一次它的名字，可以取消。</div>
      <div class="spg">${left.map(k => `<button data-act="found" data-k="${k}"><b>${SPECIES[k].zh}</b><small>${SPECIES[k].en}${SPECIES[k].x ? ' · 群星计画' : ''}</small></button>`).join('')}</div>
      <button class="btn ghost" data-act="close">取消</button></div>`;
  }
  if (s.kind === 'gpos') {   // full table: gold tile slot + sets for one player
    const pos = (S.score[s.id] || {})[s.tile + 'P'] || 0, face = S.gold[s.tile];
    if (!face) return `<div class="mask" data-act="close"></div><div class="sheet"><h3>${GOLD[s.tile].zh}</h3><div class="hint">先选这块板块朝上的是哪一面：</div>
      <div class="gfaces">${['a', 'b'].map(f => `<button class="gface" data-act="gold" data-tile="${s.tile}" data-face="${f}">${tileImg(s.tile, f)}<span>${GOLD[s.tile].faces[f].t}</span></button>`).join('')}</div></div>`;
    return `<div class="mask" data-act="close"></div><div class="sheet"><h3>${esc(pname(s.id))} · ${GOLD[s.tile].zh}</h3><div class="hint">${goldHint(s.tile)}</div>
      <div class="gpos">${['没标', '第 1 个', '第 2 个', '之后'].map((n, i) => `<button class="${pos === i ? 'on' : ''}" data-act="gpos" data-id="${s.id}" data-tile="${s.tile}" data-p="${i}">${n}${i ? `<small>${GOLD[s.tile].faces[face].pts[i - 1]}</small>` : ''}</button>`).join('')}</div>
      ${pos ? `<div class="gres" style="margin-top:12px">${cellBtn(s.id, s.tile + 'N')}<small>组</small></div>` : ''}
      <button class="btn ghost" data-act="close" style="margin-top:12px">完成</button></div>`;
  }
  const f = fieldOf(s.id, s.key);
  return `<div class="mask" data-act="close"></div><div class="sheet">
    <h3>${esc(pname(s.id))} · ${f.n}</h3><div class="hint">${f.hint}</div>
    <div class="disp"><div class="ex">${esc(exprText(s)) || '&nbsp;'}</div><div class="cur">= ${s.key === 'glyph' ? `${s.terms.concat(s.cur ? [Number(s.cur)] : []).reduce((a, b) => a + (GLYPH_PTS[b] ?? 0), 0)} 分` : exprTotal(s) + (f.count ? ` 个 · ${exprTotal(s) * f.mult} 分` : '')}</div></div>
    <div class="keys">
      <button data-act="k" data-k="7">7</button><button data-act="k" data-k="8">8</button><button data-act="k" data-k="9">9</button><button class="op" data-act="k" data-k="+">+</button>
      <button data-act="k" data-k="4">4</button><button data-act="k" data-k="5">5</button><button data-act="k" data-k="6">6</button><button class="op" data-act="k" data-k="-" ${f.list ? '' : 'disabled'}>−</button>
      <button data-act="k" data-k="1">1</button><button data-act="k" data-k="2">2</button><button data-act="k" data-k="3">3</button>
      <button class="ok" data-act="k" data-k="ok">完成</button>
      <button class="fn" data-act="k" data-k="clr">清空</button><button data-act="k" data-k="0">0</button><button class="fn" data-act="k" data-k="bs">⌫</button>
    </div></div>`;
}

// Calculator: committed signed terms, then the operator being typed (op) and its digits (cur).
const exprTotal = s => s.terms.reduce((a, b) => a + b, 0) + (s.cur ? (s.op === '-' ? -1 : 1) * Number(s.cur) : 0);
function exprText(s) {
  let out = s.terms.map((t, i) => (i === 0 ? (t < 0 ? '−' : '') : t < 0 ? ' − ' : ' + ') + Math.abs(t)).join('');
  if (s.cur || s.opShown) out += (s.terms.length ? (s.op === '-' ? ' − ' : ' + ') : s.op === '-' ? '−' : '') + s.cur;
  return out;
}

function keypad(k) {
  const s = ui.sheet, f = fieldOf(s.id, s.key);
  const commit = () => { if (s.cur !== '') { s.terms.push((s.op === '-' ? -1 : 1) * Number(s.cur)); s.cur = ''; } };
  if (/^\d$/.test(k)) { if (s.cur.length < 4) s.cur = (s.cur === '0' ? '' : s.cur) + k; }
  else if (k === '+' || k === '-') { if (!f.list) return; commit(); s.op = k; s.opShown = true; }
  else if (k === 'bs') {
    if (s.cur) s.cur = s.cur.slice(0, -1);
    else if (s.opShown) s.opShown = false;
    else if (s.terms.length) { const t = s.terms.pop(); s.cur = String(Math.abs(t)); s.op = t < 0 ? '-' : '+'; s.opShown = t < 0 || s.terms.length > 0; }
  }
  else if (k === 'clr') { s.terms = []; s.cur = ''; s.op = '+'; s.opShown = false; }
  else if (k === 'ok') {
    const empty = !s.terms.length && s.cur === '';
    commit();
    const value = f.list ? s.terms : empty ? '' : String(s.terms.reduce((a, b) => a + b, 0));
    send({ t: 'score', id: s.id, key: s.key, value });
    ui.sheet = s.back || null;
  }
  render();
}

/* ---------- events ---------- */
async function createRoom() {
  ui.busy = true; ui.err = ''; render();
  try {
    const r = await fetch('/api/room', { method: 'POST' });
    const j = await r.json();
    if (!r.ok) throw new Error(j.error || '创建失败');
    enterRoom(j.code);
  } catch (e) { ui.err = '创建房间失败：' + e.message; }
  ui.busy = false; render();
}
function enterRoom(c) {
  code = c; noRoom = false; S = null; ui.err = ''; ui.chk = {};
  history.replaceState(null, '', '/?r=' + c);
  connect(); render();
}
function leave() {
  code = null; S = null; noRoom = false; if (ws) { ws.onclose = null; ws.close(); }
  history.replaceState(null, '', '/'); ui.rooms = null; render(); loadRooms();
}
async function share() {
  const url = `${location.origin}/?r=${code}`;
  const text = `星空觅迹小助手｜开局不漏，轮次不乱，计分不错\n邀请你加入《星空觅迹》房间 ${code}，点开链接就能和大家同步流程与计分（无需下载）：`;
  if (navigator.share) { try { await navigator.share({ title: '星空觅迹 · 房间 ' + code, text, url }); return; } catch (e) { if (e.name === 'AbortError') return; } }
  try { await navigator.clipboard.writeText(`${text}\n${url}`); toast('邀请已复制，发给朋友即可'); } catch { toast('房间码 ' + code); }
}
function openCell(id, key, back) {
  const f = fieldOf(id, key), v = (S.score[id] || {})[key];
  const n0 = f.list ? null : num(v);
  ui.sheet = f.list
    ? { kind: 'key', id, key, terms: [...(v || [])], cur: '', op: '+', opShown: (v || []).length > 0, back }
    : { kind: 'key', id, key, terms: [], cur: n0 ? String(n0) : '', op: '+', opShown: false, back };
  render();
}

document.addEventListener('click', e => {
  const t = e.target.closest('[data-act]'); if (!t || t.disabled) return;
  const d = t.dataset;
  switch (d.act) {
    case 'create': createRoom(); break;
    case 'join': { const c = cleanCode($('#joinCode').value); if (c) enterRoom(c); else { ui.err = '请输入 4 位房间码'; render(); } break; }
    case 'rejoin': enterRoom(d.code); break;
    case 'leave': leave(); break;
    case 'share': share(); break;
    case 'n': send({ t: 'setN', n: +d.n }); break;
    case 'opt': send({ t: 'opt', key: d.key, on: d.on === 'true' }); break;
    case 'diff': send({ t: 'solo', diff: +d.d }); break;
    case 'sfirst': send({ t: 'solo', first: d.f }); break;
    case 'sflip': { const f = Math.random() < 0.5 ? 'me' : 'rival'; send({ t: 'solo', first: f }); toast(f === 'me' ? '随机结果：你先手' : '随机结果：对手先手'); break; }
    case 'gold': send({ t: 'gold', tile: d.tile, face: d.face || null }); break;
    case 'gpos': send({ t: 'score', id: d.id, key: d.tile + 'P', value: +d.p }); break;
    case 'gsheet': ui.sheet = { kind: 'gpos', id: d.id, tile: d.tile }; render(); break;
    case 'color': send({ t: 'player', i: +d.i, color: d.col }); break;
    case 'first': send({ t: 'first', id: d.id }); break;
    case 'move': flushAll(); send({ t: 'move', i: +d.i, j: +d.j }); break;
    case 'order': flushAll(); setTimeout(() => { location.href = orderUrl(S.n); }, 150); break;   // let the name edits reach the room first
    case 'begin': flushAll(); ui.chk = {}; send({ t: 'begin' }); break;
    case 'setup': ui.sheet = { kind: 'setup' }; render(); break;
    case 'tab': ui.tab = d.tab; store.set('seti-tab', d.tab); render(); window.scrollTo(0, 0); break;
    case 'goto': ui.tab = d.tab; render(); window.scrollTo(0, 0); break;
    case 'df': ui.df = !ui.df; render(); break;
    case 'rot': ui.rot = !ui.rot; render(); break;
    case 'chk': ui.chk[d.ck] = !ui.chk[d.ck]; render(); break;
    case 'rn': ui.rn = !ui.rn; render(); break;
    case 'save': if (!ui.saving) saveImage(); break;
    case 'pass': send({ t: 'pass', round: S.round, id: d.id }); break;
    case 'next': send({ t: 'next', round: S.round }); window.scrollTo({ top: 0, behavior: 'smooth' }); break;
    case 'undo': send({ t: 'undo' }); break;
    case 'reset': if (confirm('重新开局？本房间的流程和计分都会清空，所有人同步。')) send({ t: 'reset' }); break;
    case 'spick': ui.sheet = { kind: 'spick' }; render(); break;
    case 'found': send({ t: 'found', k: d.k }); ui.sheet = null; render(); break;
    case 'sp': ui.sheet = { kind: 'species', k: d.k }; render(); break;
    case 'ask': ui.sheet = null; render(); window.askRules?.(d.q); break;
    case 'view': ui.view = d.v; render(); break;
    case 'me': store.set(meKey(), d.id); ui.view = 'me'; render(); window.scrollTo(0, 0); break;
    case 'rv-who': ui.rv.who = d.id; render(); break;
    case 'rv-star': ui.rv.stars = +d.n; render(); break;
    case 'rv-send': sendReview(); break;
    case 'rv-edit': ui.rv.state = ''; render(); break;
    case 'cell': openCell(d.id, d.key, ui.sheet?.kind === 'gpos' ? ui.sheet : null); break;
    case 'k': keypad(d.k); break;
    case 'close': ui.sheet = null; render(); break;
  }
});

document.addEventListener('input', e => {
  const el = e.target, d = el.dataset;
  if (d.name !== undefined) debounced(d.pk, () => send({ t: 'player', i: +d.name, name: el.value }));
  else if (d.rv !== undefined) ui.rv.text = el.value;
});
document.addEventListener('focusout', e => { const k = e.target.dataset?.pk; if (k) pending.get(k)?.flush(); });
document.addEventListener('keydown', e => {
  if (e.key === 'Enter' && e.target.id === 'joinCode') document.querySelector('[data-act="join"]').click();
  if (e.key === 'Enter' && e.target.dataset?.pk) e.target.blur();
});

render();
connect();
loadRooms();
