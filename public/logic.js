// Game rules shared by the room server (Durable Object) and the page.
// SETI: Search for Extraterrestrial Intelligence (CGE 2024), Simplified Chinese edition 《星空觅迹》; expansion Space Agencies 《群星计画》.
// Terms follow CGE's official Simplified Chinese rulebooks. Page numbers: 规 = base rulebook, 种 = alien species sheets,
// 扩 = expansion rulebook, 扩种 = expansion alien sheets, FAQ = CGE's official FAQ (BGG thread 3392878).
// 5 rounds; each round everyone takes turns until all have passed (规 7, 19). With organizations: rounds 2–5 only (扩 4).

export const LAST_ROUND = 5;
export const COLOR_ORDER = ['green', 'purple', 'orange', 'white'];
export const COLOR_ZH = { green: '绿色', purple: '紫色', orange: '橙色', white: '白色' };
export const RIVAL = 'rival';   // the solo rival research institution (规 22–26)

// Alien species. x: from the expansion 《群星计画》 (mixed in with the base ones whenever the expansion is used, 扩 3).
export const SPECIES = {
  mascamites: { zh: '硫铵虫', en: 'Mascamites' },
  anomalies: { zh: '异常点', en: 'Anomalies' },
  oumuamua: { zh: '奥陌陌', en: '‘Oumuamua' },
  centaurians: { zh: '半人马族', en: 'Centaurians' },
  exertians: { zh: '钻探者', en: 'Exertians' },
  arkhos: { zh: '起源方舟', en: 'Arkhos', x: true },
  glyphids: { zh: '符文族', en: 'Glyphids', x: true },
  amoeba: { zh: '阿米巴', en: 'Amoeba', x: true }
};

// Gold scoring tiles (规 21): each has two faces; points for the first marker, the second, and everyone after.
export const GOLD = {
  tech: { zh: '科技', faces: {
    a: { t: '三种科技各一块算一组', pts: [11, 8, 5] },
    b: { t: '每两块科技算一对', pts: [7, 5, 3] } } },
  mission: { zh: '任务', faces: {
    a: { t: '每张完成的任务', pts: [4, 3, 2] },
    b: { t: '每两张“完成的任务或终局计分牌”', pts: [8, 6, 4] } } },
  income: { zh: '收入', faces: {
    a: { t: '插入的信用点、能量、卡牌收入各一张算一组', pts: [11, 8, 5] },
    b: { t: '插入的信用点或能量收入，取多的那种的张数', pts: [5, 4, 3] } } },
  other: { zh: '其他', faces: {
    a: { t: '三种颜色生命迹象各一个算一组', pts: [8, 6, 4] },
    b: { t: '赢得的扇区与人造卫星 / 着陆器配成一对', pts: [8, 6, 4] } } }
};
export const GOLD_KEYS = Object.keys(GOLD);
export const GOLD_MILESTONES = [25, 50, 70];   // 规 18
export const GLYPH_PTS = [0, 1, 3, 5, 8, 11, 15, 20];   // 扩种 4: a set of 1–7 different unplaced glyph tokens
export const RIVAL_GLYPH_PTS = 3, RIVAL_OBJ_PTS = 5;  // 扩种 4; 规 26

// Score fields. list: one value per item, summed. Gold tiles: <tile>P = which marker slot (0 none, 1 first, 2 second, 3 later), <tile>N = sets.
export const LIST_KEYS = ['cards', 'ex', 'glyph'];
const GOLD_FIELDS = GOLD_KEYS.flatMap(k => [k + 'P', k + 'N']);
export const PLAYER_KEYS = ['track', 'cards', ...GOLD_FIELDS, 'ex', 'danger', 'glyph'];
export const RIVAL_KEYS = ['track', 'obj', 'ex', 'danger', 'glyphN'];

export function initialState() {
  return {
    v: 0, stage: 'setup', n: 4,
    players: COLOR_ORDER.map(c => ({ id: c, name: '' })),
    start: 'green', sa: false, org: false, solo: { first: 'me', diff: 1 },
    gold: { tech: null, mission: null, income: null, other: null },
    round: 1, passed: [], passLog: [], back: [], found: [], score: {}
  };
}

// Whole number ≥ min (≤ 9999); empty counts as 0; anything else is null.
export function num(v, min = 0) {
  if (v === '' || v == null) return 0;
  const n = Number(v);
  return Number.isInteger(n) && n >= min && n <= 9999 ? n : null;
}

const clone = o => JSON.parse(JSON.stringify(o));
export const seated = S => S.players.slice(0, S.n);
export const humans = S => seated(S).map(p => p.id);
export const solo = S => S.n === 1;
export const firstRound = S => S.org ? 2 : 1;           // 扩 4: with organizations play only rounds 2–5
export const rounds = S => LAST_ROUND - firstRound(S) + 1;
export const speciesOk = (S, k) => !!SPECIES[k] && (!SPECIES[k].x || S.sa);
export const found = (S, k) => S.found.includes(k);
const rotate = (a, i) => [...a.slice(i), ...a.slice(0, i)];
// Who passes each round: the players, plus the rival in a solo game (the rival passes too, 规 26).
export const passers = S => solo(S) ? [humans(S)[0], RIVAL] : humans(S);
// Turn order of a round: the start player marker moves one place to the left (clockwise) between rounds (规 19).
// Solo: the starting player alternates between you and the rival (规 22).
export function turnOrder(S, round = S.round) {
  const k = round - firstRound(S);
  if (solo(S)) { const a = S.solo.first === 'rival' ? [RIVAL, humans(S)[0]] : [humans(S)[0], RIVAL]; return rotate(a, k % 2); }
  const h = humans(S);
  return rotate(rotate(h, Math.max(0, h.indexOf(S.start))), k % h.length);
}
const cleanText = (v, max) => String(v ?? '').replace(/[\u0000-\u001f]/g, '').slice(0, max);
const BACK_MAX = 40;   // undo steps kept
const flow = S => ({ stage: S.stage, round: S.round, passed: S.passed, passLog: S.passLog });

// Applies one action. Returns the new state, or null when the action is invalid or stale.
export function reduce(s, a) {
  if (!a || typeof a !== 'object') return null;
  const S = clone(s);
  const done = () => { S.v = s.v + 1; return S; };
  const ids = () => humans(S);
  const setup = S.stage === 'setup';

  switch (a.t) {
    case 'setN':
      if (!setup || ![1, 2, 3, 4].includes(a.n)) return null;
      S.n = a.n;
      if (!ids().includes(S.start)) S.start = S.players[0].id;
      return done();

    case 'opt':     // sa: the expansion's cards, aliens and signal tokens; org: also play with its organizations (4 rounds)
      if (!setup || !['sa', 'org'].includes(a.key) || typeof a.on !== 'boolean' || (a.key === 'org' && a.on && !S.sa)) return null;
      S[a.key] = a.on;
      if (!S.sa) S.org = false;
      return done();

    case 'solo':    // solo: who starts (random, 规 22) and the rival's difficulty (stars on its player board)
      if (!setup) return null;
      if (a.first !== undefined) { if (!['me', 'rival'].includes(a.first)) return null; S.solo.first = a.first; }
      if (a.diff !== undefined) { if (![1, 2, 3, 4, 5].includes(a.diff)) return null; S.solo.diff = a.diff; }
      return done();

    case 'gold':    // which face of each gold scoring tile is up (setup: random faces, 规 5); can be fixed later too
      if (!GOLD[a.tile] || ![null, 'a', 'b'].includes(a.face)) return null;
      S.gold[a.tile] = a.face;
      return done();

    case 'player': {
      const p = S.players[a.i]; if (!p || a.i >= S.n) return null;
      if (!setup && a.color !== undefined) return null;   // after the start only names can change
      if (a.name !== undefined) p.name = cleanText(a.name, 12).trim();
      if (a.color !== undefined) {
        const other = S.players.find(o => o.id === a.color);
        if (!other || (other !== p && S.players.indexOf(other) < S.n)) return null;
        if (S.start === p.id) S.start = a.color;
        else if (S.start === a.color) S.start = p.id;
        other.id = p.id; p.id = a.color;
      }
      return done();
    }

    case 'move': {
      const { i, j } = a;
      if (!setup || ![i, j].every(k => Number.isInteger(k) && k >= 0 && k < S.n)) return null;
      [S.players[i], S.players[j]] = [S.players[j], S.players[i]];
      return done();
    }

    case 'first':   // setup: the start player
      if (!setup || !ids().includes(a.id)) return null;
      S.start = a.id; return done();

    case 'begin':
      if (!setup) return null;
      Object.assign(S, { stage: 'play', round: firstRound(S), passed: [], passLog: [], back: [], found: [], score: {},
        gid: Date.now().toString(36) + Math.random().toString(36).slice(2, 6) });   // gid names this game in the archive
      return done();

    case 'pass': {  // this player (or the solo rival) has passed for the rest of the round
      if (S.stage !== 'play' || a.round !== S.round || !passers(S).includes(a.id) || S.passed.includes(a.id)) return null;
      S.back = [...S.back.slice(1 - BACK_MAX), flow(s)];
      S.passed = [...S.passed, a.id];
      return done();
    }

    case 'next':    // everyone has passed: next round, or final scoring after round 5
      if (S.stage !== 'play' || a.round !== S.round || S.passed.length !== passers(S).length) return null;
      S.back = [...S.back.slice(1 - BACK_MAX), flow(s)];
      S.passLog = [...S.passLog, S.passed];
      S.passed = [];
      if (S.round === LAST_ROUND) S.stage = 'over'; else S.round += 1;
      return done();

    case 'undo':
      if (!S.back.length) return null;
      Object.assign(S, S.back.pop());   // flow only: scores and discovered species stay
      return done();

    case 'found': { // an alien species was discovered (tap again to take it back); at most the 2 boards in play
      if (setup || !speciesOk(S, a.k)) return null;
      if (S.found.includes(a.k)) S.found = S.found.filter(k => k !== a.k);
      else { if (S.found.length >= 2) return null; S.found = [...S.found, a.k]; }
      return done();
    }

    case 'score': {
      const keys = a.id === RIVAL ? (solo(S) ? RIVAL_KEYS : []) : ids().includes(a.id) ? PLAYER_KEYS : [];
      if (setup || !keys.includes(a.key)) return null;
      let v = a.value;
      if (LIST_KEYS.includes(a.key)) {
        if (!Array.isArray(v) || v.length > 40 || !v.every(x => Number.isInteger(x) && x >= -99 && x <= 99)) return null;
      } else if (a.key.endsWith('P') && GOLD[a.key.slice(0, -1)]) {
        if (![0, 1, 2, 3].includes(v)) return null;
      } else v = cleanText(v, 6);
      (S.score[a.id] ||= {})[a.key] = v;
      return done();
    }

    case 'reset':   // back to setup, keeping players and options
      Object.assign(S, { stage: 'setup', round: 1, passed: [], passLog: [], back: [], found: [], score: {} });
      return done();
  }
  return null;
}

/* ---------- scoring (规 21; 种 10 钻探者; 扩种 4 符文族; solo 规 26) ---------- */
const sum = a => (a || []).reduce((x, y) => x + y, 0);
export const goldPts = (S, tile, pos) => pos && S.gold[tile] ? GOLD[tile].faces[S.gold[tile]].pts[pos - 1] : 0;

// One side's score parts before the Exertians danger penalty, or null if a number field is invalid.
function base(S, id) {
  const d = S.score[id] || {};
  const n = k => num(d[k]);
  if (id === RIVAL) {
    const vals = { track: n('track'), obj: n('obj'), danger: n('danger'), glyphN: n('glyphN') };
    if (Object.values(vals).some(v => v === null)) return null;
    const p = { track: vals.track, cards: 0, gold: 0, obj: vals.obj * RIVAL_OBJ_PTS,
      ex: found(S, 'exertians') ? sum(d.ex) : 0, glyph: found(S, 'glyphids') ? vals.glyphN * RIVAL_GLYPH_PTS : 0,
      danger: found(S, 'exertians') ? vals.danger : 0, goldBy: {} };
    p.sub = p.track + p.obj + p.ex + p.glyph;
    return p;
  }
  const track = n('track'), danger = n('danger');
  if (track === null || danger === null) return null;
  const goldBy = {};
  for (const k of GOLD_KEYS) {
    const sets = n(k + 'N'); if (sets === null) return null;
    goldBy[k] = goldPts(S, k, d[k + 'P'] || 0) * sets;
  }
  const p = { track, cards: sum(d.cards), gold: sum(Object.values(goldBy)), obj: 0,
    ex: found(S, 'exertians') ? sum(d.ex) : 0, glyph: found(S, 'glyphids') ? sum((d.glyph || []).map(k => GLYPH_PTS[k] ?? 0)) : 0,
    danger: found(S, 'exertians') ? danger : 0, goldBy };
  p.sub = p.track + p.cards + p.gold + p.ex + p.glyph;
  return p;
}

// Everyone's parts with totals. Exertians: whoever has the most danger loses a tenth of their points (rounded down),
// after all other scoring; a tie for the most loses it too; nobody loses points when the most danger is 0 (种 10; CGE, BGG 3441681).
export function allParts(S) {
  const ids = solo(S) ? [humans(S)[0], RIVAL] : humans(S);
  const out = {};
  for (const id of ids) { const p = base(S, id); if (!p) return null; out[id] = p; }
  const maxD = Math.max(...ids.map(id => out[id].danger));
  for (const id of ids) {
    const p = out[id];
    p.minus = found(S, 'exertians') && maxD > 0 && p.danger === maxD ? Math.floor(p.sub / 10) : 0;
    p.total = p.sub - p.minus;
  }
  return out;
}
export const parts = (S, id) => allParts(S)?.[id] ?? null;

// How many gold tiles a score allows: one per gold milestone (25, 50, 70) reached during the game (规 18).
// The score track value before final scoring is the most a player can have reached.
export const goldAllowed = track => GOLD_MILESTONES.filter(m => track >= m).length;

// Final standings (ties share the place: "they have earned that tie", 规 21) and a few achievements.
export function results(S) {
  const P = allParts(S);
  if (!P) return { error: true };
  const rows = humans(S).map(id => {
    const passes = S.passLog.map(r => r.indexOf(id));
    return { id, ...P[id], firstOut: passes.filter(k => k === 0).length, lastOut: passes.filter(k => k === passers(S).length - 1).length };
  });
  const sorted = rows.slice().sort((a, b) => b.total - a.total);
  sorted.forEach((r, i) => { const p = sorted[i - 1]; r.place = p && p.total === r.total ? p.place : i + 1; });
  const rival = solo(S) ? P[RIVAL] : null;

  const best = (val, opts = {}) => {
    const vs = rows.map(val), max = Math.max(...vs);
    if (!(max > (opts.min ?? 0)) || (rows.length > 1 && vs.every(v => v === max))) return [];
    return rows.filter((r, i) => vs[i] === max).map(r => r.id);
  };
  const multi = S.n > 1, played = S.passLog.length > 0 && multi;
  const ach = [
    { k: 'mvp', ch: '冠', name: '首次接触', desc: '最终排名第一', who: multi ? sorted.filter(r => r.place === 1).map(r => r.id) : [] },
    { k: 'gold', ch: '金', name: '金牌规划师', desc: '金色计分板块得分最高', who: multi ? best(r => r.gold) : [] },
    { k: 'cards', ch: '牌', name: '收官大师', desc: '终局计分牌得分最高', who: multi ? best(r => r.cards) : [] },
    { k: 'track', ch: '程', name: '一路领跑', desc: '终局计分前分数最高', who: multi ? best(r => r.track) : [] },
    { k: 'safe', ch: '安', name: '安全第一', desc: '危险度最低', who: multi && found(S, 'exertians') ? best(r => -r.danger, { min: -Infinity }) : [] },
    { k: 'early', ch: '早', name: '早早收工', desc: '第一个跳过的轮数最多', who: played ? best(r => r.firstOut) : [] },
    { k: 'late', ch: '晚', name: '最后的观测者', desc: '最后一个跳过的轮数最多', who: played ? best(r => r.lastOut) : [] }
  ].filter(a => a.who.length);
  return { rows: sorted, ach, rival };
}

// Which content a game used, for the archive and the score references.
export const expKey = S => S.org ? 'org' : S.sa ? 'sa' : 'base';
export const EXP_ZH = { base: '基础版', sa: '含群星计画', org: '群星计画 · 研究机构' };

// What the archive keeps for a finished game. Null while a score field is invalid.
export function gameRecord(S) {
  const R = results(S);
  if (R.error) return null;
  return {
    gid: S.gid, n: S.n, exp: expKey(S), found: S.found, gold: S.gold,
    rival: R.rival ? { total: R.rival.total, diff: S.solo.diff } : null,
    players: R.rows.map(r => {
      const p = S.players.find(x => x.id === r.id);
      return { id: r.id, name: p.name, place: r.place, total: r.total, track: r.track, cards: r.cards, gold: r.gold, alien: r.ex + r.glyph, minus: r.minus };
    })
  };
}
