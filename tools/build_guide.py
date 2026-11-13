# Builds public/guide.html (常见问题 + 外星生物) from the FAQ list.
# Usage: python3 tools/build_guide.py tools/faq.json public/guide.html
# The alien species cards are rendered on the page from public/steps.js (SPECIES_INFO), so they stay in step with the room page.
import html, sys, json
faq_src, out = sys.argv[1], sys.argv[2]
FM = 'https://filemanager.czechgames.com/storage/files/'
SRC = {'rb': ('规则书', FM + 'seti-search-for-extraterrestrial-intelligence/rules/SE%20rulebook%20ZH-S%2006.pdf'),
       'aliens': ('外星生物说明', FM + 'seti-search-for-extraterrestrial-intelligence/other-downloads/alien-species/SE%20aliens%20ZH-S%2005.pdf'),
       'sa': ('《群星计画》规则书', FM + 'seti-space-agencies/rules/SE2%20rulebook%20ZH-S%2002.pdf'),
       'faq': ('CGE 官方 FAQ', 'https://boardgamegeek.com/thread/3392878'),
       'bgg': ('CGE 在 BGG 的裁定', None)}
faq = json.load(open(faq_src))
def cite(f):
    name, url = SRC[f['src']]
    url = f.get('url') or url
    label = f'来源：{name}' + (f'第 {f["p"]} 页' if f.get('p') else '')
    return f'<a href="{url}" target="_blank" rel="noopener">{label}</a>'
cats = list(dict.fromkeys(f['cat'] for f in faq))
faq_html = ''.join(f'<h3 class="fq-cat">{html.escape(c)}</h3>' + ''.join(
    f'<details class="card fq"><summary>{html.escape(f["q"])}</summary><p>{html.escape(f["a"])} {cite(f)}</p></details>'
    for f in faq if f['cat'] == c) for c in cats)
toc = ''.join(f'<a href="#c{i}">{html.escape(c)}</a>' for i, c in enumerate(cats)) + '<a class="fqa" href="#aliens">外星生物</a>'
for i, c in enumerate(cats):
    faq_html = faq_html.replace(f'<h3 class="fq-cat">{html.escape(c)}</h3>', f'<h3 class="fq-cat" id="c{i}">{html.escape(c)}</h3>', 1)
open(out, 'w').write(f'''<!doctype html>
<html lang="zh-CN">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="theme-color" content="#0b1426">
<title>常见问题 · 星空觅迹</title>
<meta property="og:title" content="常见问题 · 星空觅迹">
<meta property="og:image" content="https://seti.leisurecat.cloud/img/icon-512.jpg">
<link rel="icon" href="img/icon-64.png">
<link rel="apple-touch-icon" href="img/icon-180.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Oswald:wght@500;600&family=Noto+Serif+SC:wght@600;900&display=swap" rel="stylesheet">
<link rel="stylesheet" href="style.css">
</head>
<body>
<div style="position:absolute;width:0;height:0;overflow:hidden"><img src="img/icon-512.jpg" alt=""></div>
<div class="hero with-back"><div class="back-row"><a class="back-nav" href="/" data-html2canvas-ignore>‹ 返回</a></div><div class="en">SETI</div><h1>常见问题</h1><div class="orn"></div></div><div class="band"></div>
<div class="wrap guide">
<p class="note">依据 CGE 官方规则书（简体中文版）、外星生物说明和官方 FAQ，用自己的话整理，有疑问以规则书为准。官方规则书可在 <a href="https://czechgames.com/en/seti/" target="_blank" rel="noopener">CGE 官网</a>下载。第一次玩先看 <a href="teach">6 分钟讲规则</a>。</p>
<nav class="toc">{toc}</nav>
<h2 class="h" id="faq">常见问题<small>{len(faq)} 条</small></h2>
{faq_html}
<h2 class="h" id="aliens">外星生物<small>发现时再看</small></h2>
<p class="note">每局只用 2 个，开局背面朝上，不用提前全讲。房间里点「发现了新的外星生物」，所有人手机会弹出同样的内容。</p>
<div id="species"></div>
<a class="btn" href="./">返回首页</a>
<footer>非官方玩家工具 · 规则版权归 Czech Games Edition 所有</footer>
</div>
<script type="module">
import {{ SPECIES }} from './logic.js';
import {{ SPECIES_INFO }} from './steps.js';
const li = a => `<ul class="steps">${{a.map(t => `<li><span>${{t}}</span></li>`).join('')}}</ul>`;
document.getElementById('species').innerHTML = Object.entries(SPECIES_INFO).map(([k, I]) => `<details class="card fq"><summary>${{SPECIES[k].zh}} <small>${{SPECIES[k].en}}${{SPECIES[k].x ? ' · 群星计画' : ''}}</small></summary>
  <div class="spx"><h4>翻开后马上做</h4>${{li(I.setup)}}<h4>新规则</h4>${{li(I.rules)}}${{I.end ? `<h4>终局</h4>${{li([I.end])}}` : ''}}${{I.traps.length ? `<h4>容易错</h4>${{li(I.traps)}}` : ''}}<p class="src">来源：${{I.src}}（种 = 外星生物说明，扩种 = 群星计画外星生物说明）</p></div></details>`).join('');
</script>
<script type="module" src="chat.js"></script>
</body>
</html>
''')
