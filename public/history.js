import { COLOR_ZH, SPECIES, EXP_ZH } from './logic.js';

const COLORS = { green: 'var(--p-green)', purple: 'var(--p-purple)', orange: 'var(--p-orange)', white: 'var(--p-white)' };
const CATS = [
  { k: 'track', n: '分数条', c: 'var(--c-track)' }, { k: 'cards', n: '终局牌', c: 'var(--c-cards)' },
  { k: 'gold', n: '金色板块', c: 'var(--c-gold)' }, { k: 'alien', n: '外星生物', c: 'var(--c-alien)' }
];
const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const pname = p => p.name || `${COLOR_ZH[p.id]}玩家`;
const por = (p, cls) => `<span class="por ${cls}" style="--c:${COLORS[p.id]}" data-c="${p.id}"><img src="img/${p.id}.jpg" alt=""></span>`;
const when = t => new Date(t).toLocaleString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false });

function game(g) {
  const ps = g.players;
  const max = Math.max(1, ...ps.map(p => CATS.reduce((a, c) => a + Math.max(0, p[c.k]), 0)));
  const aliens = (g.found || []).map(k => SPECIES[k]?.zh).filter(Boolean).join('、');
  return `<details class="card game">
    <summary><div class="gh"><b>${esc(g.code)}</b><span>${when(g.ended)} · ${g.n} 人 · ${EXP_ZH[g.exp]}${aliens ? ` · ${aliens}` : ''}${g.rival ? ` · 对手 ${g.rival.total}` : ''}</span></div>
      <div class="gp">${ps.map(p => `<span class="${p.place === 1 && g.n > 1 ? 'win' : ''}">${por(p, 'xs')}<i>${esc(pname(p))}</i><em>${p.total}</em></span>`).join('')}</div></summary>
    <div class="gd rk">${ps.map(p => `
      <div class="row"><div class="stepn">${p.place}</div>${por(p, 'sm')}
        <div class="who"><div class="nm">${esc(pname(p))} <span class="fg" style="display:inline">${COLOR_ZH[p.id]}</span></div>
          <div class="stack">${CATS.map(c => `<i style="width:${Math.max(0, p[c.k]) / max * 100}%;background:${c.c}"></i>`).join('')}</div>
          <div class="parts">${CATS.filter(c => p[c.k]).map(c => `<em style="background:${c.c}"></em>${c.n} ${p[c.k]}`).join(' ')}${p.minus ? ` <span class="mn">危险度 −${p.minus}</span>` : ''}</div></div>
        <div class="tot">${p.total}</div></div>`).join('')}
      ${g.rival ? `<div class="parts" style="padding:2px 8px">单人对手（${g.rival.diff} 星）：${g.rival.total} 分</div>` : ''}</div>
  </details>`;
}

async function load(q) {
  const box = document.getElementById('games');
  box.innerHTML = '<div class="empty">加载中…</div>';
  try {
    const r = await fetch('/api/games' + (q ? '?q=' + encodeURIComponent(q) : ''));
    if (!r.ok) throw new Error(r.status);
    const list = await r.json();
    box.innerHTML = list.length ? list.map(game).join('') : `<div class="empty">${q ? '没有找到相关对局' : '暂无记录'}</div>`;
  } catch {
    box.innerHTML = '<div class="empty">加载失败，请稍后重试</div>';
  }
}

// Score references per player count × expansion; with a searched name, that player's own best and average.
async function stats(name) {
  const box = document.getElementById('stats');
  try {
    const r = await fetch('/api/stats' + (name ? '?name=' + encodeURIComponent(name) : ''));
    if (!r.ok) throw new Error(r.status);
    const list = await r.json();
    const mine = name && list.some(g => g.me.games);
    box.innerHTML = list.length ? `<table class="st"><thead><tr><th>配置</th><th>局数</th><th>平均分</th><th>冠军平均</th><th>最高分</th>${mine ? `<th>${esc(name)}</th>` : ''}</tr></thead><tbody>${list.map(g => `
      <tr><td>${g.n} 人<small>${EXP_ZH[g.exp]}</small></td><td>${g.games}</td><td>${g.avg}</td><td>${g.n > 1 ? g.avgWin : '—'}</td>
        <td><b>${g.best.total}</b><small>${esc(g.best.name || COLOR_ZH[g.best.id] + '玩家')}</small></td>
        ${mine ? `<td>${g.me.games ? `最高 <b>${g.me.best}</b><small>平均 ${g.me.avg} · ${g.me.games} 局</small>` : '—'}</td>` : ''}</tr>`).join('')}</tbody></table>
      ${name && !mine ? `<p class="note">没有名为「${esc(name)}」的玩家记录；个人成绩按玩家名完全一致统计。</p>` : ''}` : '<div class="empty">暂无记录</div>';
  } catch {
    box.innerHTML = '<div class="empty">加载失败，请稍后重试</div>';
  }
}

document.getElementById('search').addEventListener('submit', e => { e.preventDefault(); const q = document.getElementById('q').value.trim(); load(q); stats(q); });
load('');
stats('');
