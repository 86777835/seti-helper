// Two phones in one room play a full 3-player game with the expansion (5 rounds), discover two species, then score it.
// Usage: node tests/test_room.mjs <baseUrl> <outDir>    (against local wrangler dev: it leaves a game in the archive)
import { chromium } from 'playwright-core';
const [,, BASE, OUT] = process.argv;
const b = await chromium.launch({ channel: 'chrome' });
const mk = async () => {
  const ctx = await b.newContext({ viewport: { width: 390, height: 760 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  const p = await ctx.newPage(); p.errs = [];
  p.on('pageerror', e => p.errs.push(String(e))); p.on('console', m => m.type() === 'error' && !m.text().includes('fonts.g') && !m.text().startsWith('Failed to load resource') && p.errs.push(m.text()));
  p.on('dialog', d => d.accept());
  await p.route(/fonts\.(googleapis|gstatic)\.com/, r => r.abort());
  return p;
};
const A = await mk(), B = await mk();
let fails = 0;
const eq = (name, got, want) => { const ok = JSON.stringify(got) === JSON.stringify(want); if (!ok) fails++; console.log(ok ? 'PASS' : 'FAIL', name, ok ? '' : `got ${JSON.stringify(got)} want ${JSON.stringify(want)}`); };
const wait = ms => new Promise(r => setTimeout(r, ms));
const shot = (p, n, full = false) => p.screenshot({ path: `${OUT}/${n}.png`, fullPage: full });
const noHScroll = p => p.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1);

await A.goto(BASE); await wait(800); await shot(A, '00_landing');
eq('cover credit in footer', (await A.textContent('footer')).includes('Czech Games Edition'), true);
eq('rate link goes to the hub', (await A.getAttribute('.rate-nav', 'href')).startsWith('https://boardgame.leisurecat.cloud/?rate=seti&back='), true);
eq('teach entry', await A.textContent('.teachgo b'), '第一次玩？6 分钟讲规则');
await A.click('[data-act="create"]');
await A.waitForURL(/\?r=[A-Z0-9]{4}/);
const url = A.url(); console.log('room', url);
await B.goto(url); await B.waitForSelector('.chip');

// setup
await A.click('[data-act="n"][data-n="3"]'); await wait(300);
eq('B sees 3 seats', await B.$$eval('[data-k^="seat-"]', r => r.length), 3);
await B.click('[data-act="opt"][data-key="sa"]'); await wait(300);
eq('A sees the expansion and the org option', await A.$$eval('[data-act="opt"]', c => c.map(x => x.textContent)), ['群星计画', '使用研究机构']);
await A.fill('[data-name="0"]', '小林'); await B.fill('[data-name="1"]', '阿哲'); await B.press('[data-name="1"]', 'Enter'); await wait(700);
eq('B sees name', await B.inputValue('[data-name="0"]'), '小林');
await B.click('[data-act="color"][data-i="2"][data-col="white"]'); await wait(300);
eq('A sees seat 3 turned white', await A.getAttribute('[data-k="seat-2"] .por', 'data-c'), 'white');
await A.click('[data-act="first"][data-id="purple"]'); await wait(300);
eq('order link', (await A.$('[data-act="order"]')) !== null, true);
for (const [k, f] of [['tech', 'a'], ['mission', 'b'], ['income', 'a'], ['other', 'b']]) { await A.click(`[data-act="gold"][data-tile="${k}"][data-face="${f}"]`); await wait(150); }
await wait(300);
eq('B sees 4 gold faces', await B.$$eval('.gface.on', x => x.length), 4);
eq('setup no h-scroll', await noHScroll(A), true);
await shot(A, '01_setup', true);
await A.click('[data-act="setup"]'); await A.waitForSelector('.sheet .sl');
eq('setup list: 3p neutral milestone', (await A.textContent('.sheet .sl')).includes('各放 1 个中立标记'), true);
eq('setup list: start scores by seat', (await A.textContent('.sheet .sl')).includes('小林 1 分'), false);   // purple (阿哲) starts
eq('setup list: start player 1 point', (await A.textContent('.sheet .sl')).includes('阿哲 1 分'), true);
await shot(A, '02_checklist');
await A.click('.sheet [data-act="close"]');
await B.click('[data-act="begin"]'); await A.waitForSelector('.tabs');

// round 1
eq('track order starts with 阿哲', await A.$$eval('.slot .n', s => s.map(x => x.textContent)), ['阿哲', '白色玩家', '小林']);
eq('first pass note before anyone passes', (await A.textContent('[data-k="ph-act"]')).includes('本轮第一个跳过'), true);
await A.click('[data-act="rot"]'); await A.waitForSelector('.rot img');
eq('rotation picture loads', await A.$eval('.rot img', i => i.complete && i.naturalWidth > 0), true);
await shot(A, '03_flow', true);
await B.click('[data-act="pass"][data-id="white"]'); await wait(400);
eq('A sees who passed first', (await A.textContent('.firstp')).includes('白色玩家'), true);
eq('later steps drop the rotation', (await A.textContent('[data-k="ph-act"] .steps')).includes('转太阳系'), false);

// a species is discovered on phone A: phone B pops its notes
await A.click('[data-act="spick"]'); await A.waitForSelector('.spg');
eq('8 species with the expansion', await A.$$eval('.spg button', x => x.length), 8);
await A.click('[data-act="found"][data-k="anomalies"]'); await B.waitForSelector('.sheet h3');
eq('B pops the species', (await B.textContent('.sheet h3')).includes('异常点'), true);
await shot(B, '04_species');
await B.click('.sheet [data-act="close"]');
eq('the discovering phone sees it too', (await A.textContent('.sheet h3')).includes('异常点'), true);
await A.click('.sheet [data-act="close"]');
eq('anomaly check added to the first pass note', (await A.textContent('.firstp')).includes('异常点'), true);
for (const id of ['green', 'purple']) { await A.click(`[data-act="pass"][data-id="${id}"]`); await wait(250); }
await wait(300);
eq('between rounds shows income', (await B.textContent('[data-k="ph-end-1"]')).includes('拿收入'), true);
await B.click('[data-act="next"]'); await wait(400);
eq('round 2', await A.textContent('.status .medal'), '2');
eq('round 2 order', await A.$$eval('.slot .n', s => s.map(x => x.textContent)), ['白色玩家', '小林', '阿哲']);
await A.click('[data-act="undo"]'); await wait(400);
eq('undo back to round 1', await B.textContent('.status .medal'), '1');
await B.click('[data-act="next"]'); await wait(400);
for (let r = 2; r <= 5; r++) {
  for (const id of ['green', 'purple', 'white']) { await (r % 2 ? A : B).click(`[data-act="pass"][data-id="${id}"]`); await wait(200); }
  await wait(300);
  if (r === 3) { await B.click('[data-act="spick"]'); await B.waitForSelector('.spg'); await B.click('[data-act="found"][data-k="exertians"]'); await A.waitForSelector('.sheet h3'); await A.click('.sheet [data-act="close"]'); await B.click('.sheet [data-act="close"]'); }
  if (r === 5) eq('round 5: no income', (await A.textContent('[data-k="ph-end-5"]')).includes('不再拿收入'), true);
  await A.click('[data-act="next"]'); await wait(400);
}
eq('game over banner', (await A.textContent('.banner')).includes('游戏结束'), true);

// scoring: each phone fills its own
const key = async (p, digits) => { for (const d of digits) await p.click(`.keys [data-k="${d}"]`); await p.click('.keys [data-k="ok"]'); await wait(250); };
await A.click('[data-act="tab"][data-tab="score"]'); await A.click('[data-act="me"][data-id="green"]'); await wait(200);
await A.click('[data-k="ms-track"] .cell'); await key(A, '82');
await A.click('[data-k="ms-cards"] .cell'); await key(A, '4+6');
await A.click('[data-act="gpos"][data-id="green"][data-tile="tech"][data-p="1"]'); await wait(300);
await A.click('[data-k="gi-tech"] .gres .cell'); await key(A, '2');
await A.click('[data-act="gpos"][data-id="green"][data-tile="other"][data-p="2"]'); await wait(300);
await A.click('[data-k="gi-other"] .gres .cell'); await key(A, '3');
eq('A: one more gold tile expected', (await A.textContent('[data-k="tab-score"]')).includes('应该标了 3 块'), true);
await A.click('[data-k="ms-ex"] .cell'); await key(A, '5');
await A.click('[data-k="ms-danger"] .cell'); await key(A, '9');
eq('A total 82+10+22+18+5 = 137, minus 13', await A.textContent('[data-tt="green"]'), '124');
await shot(A, '05_myscore', true);

await B.click('[data-act="tab"][data-tab="score"]'); await B.click('[data-act="me"][data-id="purple"]'); await wait(200);
await B.click('[data-k="ms-track"] .cell'); await key(B, '20');
await B.click('[data-act="gpos"][data-id="purple"][data-tile="tech"][data-p="1"]'); await wait(300);
eq('B warned: two gold tiles over the score', (await B.textContent('[data-k="ms-track"]')).includes('最多标 0 块'), true);
eq('B warned: slot 1 taken by 小林', (await B.textContent('[data-k="gi-tech"]')).includes('小林 也填了第 1 个'), true);
await B.click('[data-act="gpos"][data-id="purple"][data-tile="tech"][data-p="0"]'); await wait(200);
await B.click('[data-k="ms-track"] .cell'); await B.click('.keys [data-k="clr"]'); await key(B, '96');
await B.click('[data-act="view"][data-v="all"]'); await wait(200);
await B.click('[data-act="gsheet"][data-id="white"][data-tile="mission"]'); await B.waitForSelector('.sheet .gpos');
await B.click('.sheet [data-act="gpos"][data-p="1"]'); await wait(300);
await B.click('.sheet .gres .cell'); await key(B, '2');
eq('back to the gold sheet after the keypad', await B.$('.sheet .gpos') !== null, true);
await B.click('.sheet [data-act="close"]');
await B.click('[data-k="sr-track"] td:nth-child(4) .cell'); await key(B, '70');
eq('table total for white 70 + 8×2', await B.textContent('[data-tt="white"]'), '86');
eq('table no h-scroll', await noHScroll(B), true);
await shot(B, '06_table', true);

// results
await A.click('[data-act="tab"][data-tab="mvp"]'); await wait(300);
eq('winner', await A.textContent('.mvp .nm'), '小林');
eq('ranking', await A.$$eval('.rk [data-k^="rk-"]', r => r.map(x => x.dataset.k)), ['rk-green', 'rk-purple', 'rk-white']);
eq('danger penalty shown', (await A.textContent('[data-k="rk-green"]')).includes('危险度 −13'), true);
await shot(A, '07_results', true);
await A.click('[data-act="save"]'); await A.waitForSelector('.shotv img', { timeout: 15000 });
eq('long image made', await A.$eval('.shotv img', i => i.src.startsWith('data:image/jpeg')), true);
await A.click('.shotv button');

eq('no page errors', [...A.errs, ...B.errs], []);
await b.close();
console.log(fails ? `\n${fails} FAILED` : '\nALL PASS');
process.exit(fails ? 1 : 0);
