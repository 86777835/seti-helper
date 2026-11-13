// 6-minute teach page: entry on the landing page, every term opens its note, the 「问」 buttons ask the rules
// assistant that exact question, the icon guide, phone width. /api/chat is mocked, so this never asks a real model.
// Usage: node tests/test_teach.mjs <base-url> <shots-dir>   (safe against the live site too: it writes nothing)
import { chromium } from 'playwright-core';
const [base, out] = process.argv.slice(2);
let fails = 0;
const eq = (name, got, want) => { const ok = JSON.stringify(got) === JSON.stringify(want); if (!ok) fails++; console.log(ok ? 'PASS' : 'FAIL', name, ok ? '' : `got ${JSON.stringify(got)} want ${JSON.stringify(want)}`); };

const b = await chromium.launch({ channel: 'chrome' });
const page = await (await b.newContext({ viewport: { width: 375, height: 667 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true })).newPage();
const errs = []; page.on('pageerror', e => errs.push(e.message));
const asked = [];
await page.route('**/api/chat', async r => {
  const q = JSON.parse(r.request().postData()).messages.at(-1).content; asked.push(q);
  await r.fulfill({ contentType: 'text/event-stream', body: `data: ${JSON.stringify({ choices: [{ delta: { content: `答：${q}` } }] })}\n\ndata: [DONE]\n\n` });
});

await page.goto(base); await page.waitForSelector('.teachgo');
eq('landing shows the teach entry', (await page.textContent('.teachgo b')), '第一次玩？6 分钟讲规则');
await page.click('.teachgo'); await page.waitForSelector('.tpart');
eq('teach page opened', new URL(page.url()).pathname, '/teach');
eq('eight parts plus 注意事项', await page.$$eval('.tpart h2', l => l.map(h => h.querySelector('span').textContent.replace(/^\S+?(?=[一-龥])/, ''))),
  ['怎么赢', '一轮怎么走', '版图和资源', '探测器：发射、绕行、着陆', '望远镜：扫描和数据', '打牌、科技和公转', '外星生物', '里程碑和终局', '注意事项']);
// two modes: base game by default, or with the expansion 《群星计画》
const modeOn = () => page.$eval('.tmode [aria-pressed="true"]', b => b.textContent);
const script = () => page.$$eval('.tline', l => l.map(p => p.textContent).join(''));
const noteCount = () => page.$$eval('#later details', l => l.length);
eq('base game by default', await modeOn(), '只玩基础');
const BASE_WORDS = ['太阳系版图', '圆盘', '扇区', '行星版图', '科技版图', '玩家版图', '信用点', '能量', '推广', '数据', '计算机', '卡牌', '增加收入', '条件任务', '触发任务', '终局计分牌', '起始收入牌', '跳过本轮', '一轮结束牌', '发射', '移动', '小行星', '绕行', '人造卫星', '着陆', '着陆器', '扫描', '信号', '赢得扇区', '分析数据', '打出卡牌', '研究科技', '科技板块', '转太阳系', '公转计数标记', '生命迹象', '发现位置', '外星生物说明', '外星生物卡牌', '金色里程碑', '金色计分板块', '中立里程碑', '免费行动', '共享胜利'];
const X_WORDS = ['群星计画', '研究机构', '快速起始牌', '信号标记', '第 2–5 轮'];
const read = await script(), baseNotes = await noteCount();
console.log(`  base game: ${read.length} characters, ${baseNotes} notes`);
eq('base script about six minutes (under 1700 characters)', read.length < 1700, true);
for (const w of BASE_WORDS) if (!read.includes(w)) { fails++; console.log('FAIL base script mentions', w); }
eq('base script has nothing from the expansion', ['群星计画', '研究机构', '快速起始牌', '信号标记'].filter(w => read.includes(w)), []);
eq('base: 18 notes, none tagged, no expansion icons', [baseNotes, await page.$$eval('#later .tnw', l => l.length), await page.$$eval('.tic[data-t="org"]', l => l.length)], [18, 0, 0]);
await page.click('.tmode [data-mode="x"]');
const xRead = await script(), xNotes = await noteCount();
console.log(`  with expansions: ${xRead.length} characters, ${xNotes} notes`);
eq('expansion script under 2000 characters', xRead.length < 2000, true);
for (const w of [...BASE_WORDS.filter(w => w !== '起始收入牌'), ...X_WORDS]) if (!xRead.includes(w)) { fails++; console.log('FAIL expansion script mentions', w); }   // organizations replace the starting income card
eq('expansion notes: base ones plus 3 tagged', [xNotes, await page.$$eval('#later summary .tnw', l => l.length)], [21, 3]);
await page.screenshot({ path: out + '/teach_top.png' });

// every term in the script and every icon in the guide opens a note with a name, an icon and both texts
const ids = await page.$$eval('[data-t]', l => [...new Set(l.map(x => x.dataset.t))]);
const bad = [];
for (const id of ids) {
  await page.evaluate(id => document.querySelector(`[data-t="${id}"]`).click(), id);
  const n = await page.$eval('.tsheet', s => ({ open: !s.classList.contains('hidden'), name: s.querySelector('.tshd b')?.textContent, icon: s.querySelector('.tshd img')?.complete !== false && !!s.querySelector('.tshd img'), ps: [...s.querySelectorAll('p')].map(p => p.textContent.length) }));
  if (!n.open || !n.name || !n.icon || n.ps.length !== 2 || n.ps.some(x => x < 8)) bad.push([id, n]);
  await page.click('.tsx');
}
console.log(`  ${ids.length} terms checked`);
eq('every term opens a note with its picture and text', bad, []);
eq('the note closes', await page.$eval('.tsheet', s => s.classList.contains('hidden')), true);
const term = page.locator('.tpart .term').first();
await term.scrollIntoViewIfNeeded(); await term.click();
await page.screenshot({ path: out + '/teach_note.png' });

// asking from a note: closes the note, opens the assistant, sends the question
const nm = await page.textContent('.tshd b');
await page.click('.tsask'); await page.waitForSelector('.cm.a:not(:has(.cdots))');
eq('note → assistant asked about that term', [asked.at(-1), await page.isVisible('.cpanel'), await page.$eval('.tsheet', s => s.classList.contains('hidden'))],
  [`「${nm}」是什么，怎么用？`, true, true]);
await page.screenshot({ path: out + '/teach_ask.png' });
await page.click('.cx');

// a 「问」 button sends exactly its question and the answer shows
const q = await page.$eval('#p2 .tq', x => x.dataset.q);
await page.locator('#p2 .tq').first().click(); await page.waitForFunction(n => document.querySelectorAll('.cm.a').length > n && !document.querySelector('.cm.a:last-child .cdots'), 1);
eq('「问」 sends its question', [asked.at(-1), await page.$$eval('.cm.a', l => l.at(-1).textContent)], [q, `答：${q}`]);
await page.click('.cx');
// 注意事项: after the script, 10–15 items, each a title and a written answer, closed until tapped;
// 「还有疑问？」 asks the assistant about that item
const notes = await page.$$eval('#later details', l => l.map(d => ({ open: d.open, t: d.querySelector('summary').firstChild.nextSibling.textContent, a: d.querySelector('p').textContent.length, q: d.querySelector('.tmore')?.dataset.q })));
console.log(`  ${notes.length} notes`);
eq('注意事项 has at least 15 items', notes.length >= 15, true);
eq('every note has a title and a 2–4 sentence answer, closed at first', notes.filter(n => n.open || n.t.length < 2 || n.a < 40 || n.a > 260), []);
eq('every note asks about its own title', notes.filter(n => n.q !== `「${n.t}」这一条我还有疑问，请再讲讲。`), []);
eq('注意事项 comes after the script and ends with the AI hint', await page.$eval('#later', s => [!!s.previousElementSibling?.matches('#p8'), s.querySelector('h2 span').textContent.endsWith('注意事项'), s.lastElementChild.textContent]),
  [true, true, '注意事项里没有的，点右下角「规则」问 AI，本站资料查不到会联网找。']);
const n3 = page.locator('#later details').nth(2);
await n3.locator('summary').click();
eq('tapping a note opens it', [await n3.evaluate(d => d.open), await n3.locator('p').isVisible(), await n3.locator('.tmore').isVisible()], [true, true, true]);
await n3.scrollIntoViewIfNeeded(); await page.screenshot({ path: out + '/teach_notes.png' });
await n3.locator('.tmore').click(); await page.waitForFunction(n => document.querySelectorAll('.cm.a').length > n && !document.querySelector('.cm.a:last-child .cdots'), 2);
eq('「还有疑问？」 sends that note\'s question', asked.at(-1), notes[2].q);
await page.click('.cx');
eq('no button inside a button', await page.$$eval('button button', l => l.length), 0);

// icon guide: every picture loads and has a name
await page.evaluate(() => Promise.all([...document.querySelectorAll('.tic img')].map(i => i.complete ? 0 : new Promise(r => { i.onload = i.onerror = r; }))));
const tiles = await page.$$eval('.tic', l => l.map(t => [t.dataset.t, t.querySelector('img')?.naturalWidth > 0, t.textContent.trim().length > 0]));
eq('icon guide: every picture loads', tiles.filter(t => !t[1] || !t[2]), []);
console.log(`  icon guide: ${tiles.length} icons`);
await page.locator('#icons').scrollIntoViewIfNeeded(); await page.screenshot({ path: out + '/teach_icons.png' });

eq('no sideways scrolling at 375 px', await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
eq('「去建房间」 goes to the landing page', await page.getAttribute('.tgo', 'href'), '/');
// the choice is remembered in this browser (the page is in the expansions mode now)
await page.reload(); await page.waitForSelector('.tpart');
eq('expansion mode remembered after reload', [await modeOn(), await noteCount()], ['带群星计画', 21]);
eq('no page errors', errs, []);
await b.close();
console.log(fails ? `${fails} FAILED` : 'ALL PASS'); process.exit(fails ? 1 : 0);
