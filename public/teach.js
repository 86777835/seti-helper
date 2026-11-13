// N-minute teach: a script the teacher reads aloud to start a first game, written from CGE's official rulebooks
// (same wording as tools/讲解稿.md). It names every important element in a sentence and leaves the fine rulings to the
// rules assistant. Terms in {text|id} open a note with a picture cropped from the official Simplified Chinese rulebook
// or quick reference (img/teach/<icon>.webp); the 「问」 buttons and each note's 「问规则助手」 ask the rules assistant (chat.js).
// Two modes, chosen at the top and remembered: base game (default) or with the expansion 《群星计画》.
// A line, question or note is for both, or {b} base only / {x} expansion only. After the script, 注意事项 (NOTES)
// lists the easy-to-get-wrong points.
const ICON = (id, cls = '') => id ? `<img class="ico ${cls}" src="img/teach/${id}.webp" alt="">` : '';

// id: name, where you see it on the table, what it means. icon: a picture in img/teach/.
const TERMS = {
  solarboard: { name: '太阳系版图', icon: 'solarboard', where: '主版图中间的半圆，中心是太阳，外面一圈是 8 个扇区。', what: '探测器在上面移动。中间 3 层圆盘会转动，行星跟着绕太阳公转。' },
  discs: { name: '太阳系圆盘', icon: 'discs', where: '太阳系版图中间叠着的 3 层可转动板块。', what: '开局随机摆放。研究科技和每轮第一个跳过时转一次，上面的探测器跟着转。' },
  planetboard: { name: '行星版图', icon: 'planetboard', where: '主版图上排列着各大行星的那一块，边上是两块外星生物版图的槽。', what: '绕行和着陆时把模型放到这里对应的行星上，拿上面印的奖励。' },
  techboard: { name: '科技版图', icon: 'techboard', where: '主版图上放 12 叠科技板块的那一块，还有公转计数格和一轮结束牌的位置。', what: '研究科技时从这里拿板块；公转计数标记也在这里。' },
  playerboard: { name: '玩家版图', icon: 'playerboard', where: '每人面前一长条双层版图。', what: '上面有数据池、计算机和放三种科技的槽，左边是你的行动参考。' },
  startcard: { name: '起始收入牌', icon: 'startcard', where: '每人一张自己颜色的牌，背面印开局资源。', what: '开局拿背面的资源；正面是第 2 轮起每轮的基础收入：3 信用点、2 能量、1 张牌。' },
  tuck: { name: '插入收入', icon: 'tuck', where: '插在起始收入牌下面、只露出右下角的牌。', what: '“增加收入”时把手牌插到这里，立即拿右下角的资源，以后每轮收入也多这一份。' },
  income: { name: '增加收入', icon: 'income', where: '向上箭头的图标，常见于行星绕行奖励、计算机第 4 格。', what: '可以从手牌插 1 张到起始收入牌下面，立即拿它右下角的资源。插不插可以选。' },
  credit: { name: '信用点', icon: 'credit', where: '金色的钱币图标和标记。', what: '发射、绕行、扫描、打牌主要花它。开局 4 个。' },
  energy: { name: '能量', icon: 'energy', where: '绿色闪电图标和标记。', what: '移动、绕行、着陆、扫描、分析数据花它。开局 3 个；1 能量能换 1 点移动。' },
  publicity: { name: '推广', icon: 'publicity', where: '红色麦克风图标；太阳系旁的推广条记录你有多少。', what: '开局 4，最多 10。研究科技花 6，买牌花 3。经过行星、彗星等也能拿。' },
  data: { name: '数据', icon: 'data', where: '蓝色圆片，开局放满每颗邻近恒星的凹槽。', what: '标信号时拿到，先进数据池（最多 6 个），再放进计算机；计算机上排放满就能分析。' },
  computer: { name: '数据池和计算机', icon: 'computer', where: '玩家版图下半部分：左边是数据池，右边一排格子是计算机。', what: '数据随时（免费行动）从左往右放进计算机，盖到第 2 格得推广，第 4 格增加收入。' },
  card: { name: '拿 1 张牌', icon: 'card', where: '带“1”的卡牌图标。', what: '从卡牌供应区（翻开的 3 张）或牌库顶拿 1 张。' },
  randcard: { name: '随机牌', icon: 'randcard', where: '带问号的卡牌图标。', what: '只能从牌库顶摸，不能挑供应区的。' },
  vp: { name: '分数', icon: 'vp', where: '绿色月桂圆章。', what: '马上在分数条上走对应格数。这个游戏大部分分数是游戏中拿的。' },
  move: { name: '移动', icon: 'move', where: '箭头加探测器的图标，常在卡牌左上角。', what: '让探测器走到相邻一格。移动力拿到就要用，不能留到后面。' },
  cardanatomy: { name: '卡牌', icon: 'cardanatomy', where: '主牌库的牌：左上角免费行动，左边费用，中间效果，右上角扇区颜色，右下角收入。', what: '一张牌只能选一种用法：付费打出执行效果、弃掉拿左上角、或插入收入。' },
  launch: { name: '发射探测器', icon: 'launch', where: '主要行动图标：橙色火箭。', what: '花 2 信用点，在地球格放 1 个探测器。太空中默认最多 1 个探测器。' },
  orbit: { name: '绕行', icon: 'orbit', where: '主要行动图标：绿色卫星。', what: '探测器在某颗行星的格里时，花 1 信用点 + 1 能量变成人造卫星，拿行星上方的奖励；第一个绕行的另得 3 分。' },
  land: { name: '着陆', icon: 'land', where: '主要行动图标：黄色着陆器。', what: '探测器在行星格里时花 3 能量（已有人造卫星只要 2）变成着陆器，拿行星中间的奖励和一个橙色生命迹象。不用先绕行。' },
  scan: { name: '扫描邻近恒星', icon: 'scan', where: '主要行动图标：粉色射电望远镜。', what: '花 1 信用点 + 2 能量：地球所在扇区标 1 个信号，再从供应区弃 1 张牌，在它颜色的扇区标 1 个。' },
  analyze: { name: '分析数据', icon: 'analyze', where: '主要行动图标：蓝色计算机。', what: '计算机上排 6 格放满时，花 1 能量清空计算机，标 1 个蓝色生命迹象。' },
  play: { name: '打出卡牌', icon: 'play', where: '主要行动图标：一张牌。', what: '付卡牌左边的费用，执行中间的效果。牌上的行动不再付标准费用。' },
  research: { name: '研究科技', icon: 'research', where: '主要行动图标：彩色芯片。', what: '花 6 推广。先转太阳系，再拿一种你还没有的科技板块和上面的奖励。' },
  pass: { name: '跳过本轮', icon: 'pass', where: '主要行动图标：红叉。', what: '这一轮不再行动：弃到 4 张手牌，第一个跳过的人转太阳系，再选一张一轮结束牌。' },
  signal: { name: '信号', icon: 'signal', where: '灰色声波图标；带颜色的表示指定扇区颜色。', what: '在扇区里标信号：拿走最左边的数据进数据池，换上你的标记。标信号是强制的。' },
  signalsectors: { name: '扇区颜色', icon: 'signalsectors', where: '卡牌右上角的颜色，和扇区上的颜色对应。', what: '扫描时弃掉供应区这张牌，就在这个颜色的扇区标信号。' },
  sector: { name: '扇区', icon: 'sector', where: '太阳系外圈 8 块，每块有一颗邻近恒星和一排数据凹槽。', what: '数据被拿光就完成：标记最多的赢（平手后放的赢），拿奖励和紫色生命迹象；有标记的人都得 1 推广。' },
  winsector: { name: '赢得扇区', icon: 'winsector', where: '扇区图标加对勾。', what: '完成扇区时标记最多的人赢；赢家在恒星旁放标记。赢的次数终局可能计分。' },
  trace_p: { name: '紫色生命迹象', icon: 'trace_p', where: '粉紫色三角图标。', what: '主要靠赢得扇区（扫描）拿到。' },
  trace_y: { name: '橙色生命迹象', icon: 'trace_y', where: '橙黄色三角图标。', what: '主要靠在行星上着陆拿到。' },
  trace_b: { name: '蓝色生命迹象', icon: 'trace_b', where: '蓝色三角图标。', what: '主要靠分析数据拿到。' },
  trace_any: { name: '通用生命迹象', icon: 'trace_any', where: '三色拼在一起的三角图标。', what: '可以当任意一种颜色用。' },
  overflow: { name: '发现位置和冗余位置', icon: 'overflow', where: '每块外星生物版图下方的 3 个彩色位置，再下面是冗余位置。', what: '拿到生命迹象放这里：发现位置 5 分 + 1 推广，3 个都满就发现这个外星生物；颜色都满了放冗余位置得 3 分。' },
  alienrules: { name: '外星生物说明', icon: 'alienrules', where: '盒里每个外星生物一张说明页，配一套卡牌和配件。', what: '每局只随机用 2 个，背面朝上，发现时才翻开读。本站房间里点「发现了新的外星生物」会弹出要点。' },
  aliencard: { name: '外星生物卡牌', icon: 'aliencard', where: '带外星人头像的卡牌图标。', what: '从发现了的外星生物那里拿的牌，比普通牌略强，在手里和普通牌一样用。' },
  tech: { name: '科技板块', icon: 'tech', where: '科技版图上 12 叠：橙色探测器、紫色望远镜、蓝色计算机各 4 种。', what: '研究后翻面放到玩家版图上，永久生效。同一种只能有一块；某叠第一个拿走的另得 2 分。' },
  rotate: { name: '太阳系公转', icon: 'rotate', where: '旋转的圆盘图标，常和科技图标一起出现。', what: '按公转计数标记转一层圆盘，逆时针一个扇区。研究科技先转再拿。' },
  rotcounter: { name: '公转计数标记', icon: 'rotcounter', where: '科技版图上的公转计数格。', what: '指向 1、2、3，表示这次转哪一层；转完前进一格。' },
  endround: { name: '一轮结束牌', icon: 'endround', where: '科技版图旁 4 叠牌，每叠人数 + 1 张。', what: '跳过时从本轮那叠选 1 张拿走。越早跳过选择越多。' },
  mission_trig: { name: '触发任务', icon: 'mission_trig', where: '卡牌下方一排带图标的圆圈。', what: '打出之后做到对应的事，就盖住一个圆圈拿奖励；全盖满才算完成。' },
  mission_cond: { name: '条件任务', icon: 'mission_cond', where: '卡牌下方灰色框加箭头。', what: '满足条件时作为免费行动完成，拿奖励。' },
  endgame: { name: '终局计分牌', icon: 'endgame', where: '金色文本框的卡牌。', what: '打出后留在面前，游戏结束时按条件计分。' },
  orbiter: { name: '人造卫星', icon: 'orbiter', where: '行星轨道上的你的模型。', what: '绕行后变成的。不能再动，也不能再着陆；让这颗行星的着陆便宜 1 能量。' },
  lander: { name: '着陆器', icon: 'lander', where: '行星表面上的你的模型。', what: '着陆后变成的。卫星默认不能着陆，要靠科技或卡牌。' },
  goldmilestone: { name: '金色里程碑', icon: 'goldmilestone', where: '分数条上 25、50、70 分的金色格。', what: '达到或越过的那回合结束时，选一块金色计分板块放标记。标记时不得分。' },
  goldtile: { name: '金色计分板块', icon: 'goldtile', where: '版图旁 4 块金色板块（科技、任务、收入、其他），开局随机一面朝上。', what: '终局按“你达成的组数 × 你标记所在格的分数”计分。越早标在同一块上，格子分越高。' },
  neutralmilestone: { name: '中立里程碑', icon: 'neutralmilestone', where: '1–3 人局分数条 20、30 分上方的中立标记。', what: '有人越过时，移 1 个中立标记到最左边空着的发现位置，帮忙发现外星生物。4 人局不用。' },
  // expansion 《群星计画》 (pictures from its Simplified Chinese rulebook)
  org: { name: '研究机构', icon: 'org', where: '《群星计画》的 11 张大卡，每人发 2 张选 1。', what: '代替起始收入牌：各有起始资源、收入和特殊能力。用研究机构只打第 2–5 轮。' },
  quickstart: { name: '快速起始牌', icon: 'quickstart', where: '《群星计画》的半张开局牌，每人发 3 张选 2。', what: '上半部分照放人造卫星、信号或生命迹象（不拿奖励），下半部分给开局资源。' },
  signaltoken: { name: '信号标记', icon: 'signaltoken', where: '《群星计画》的粉色小板块。', what: '扫描时每弃 1 个，多从供应区弃 1 张牌标信号，一次扫描最多 2 个。' }
};

// The script: what to read aloud. Every important element gets one sentence; how it is ruled exactly is for the assistant.
const PARTS = [
  { title: '怎么赢', sec: 35, lines: [
    { b: '这局玩《星空觅迹》。我先讲一遍主流程，讲完再一条条过注意事项。', x: '这局玩《星空觅迹》，带扩展《群星计画》。我先讲一遍主流程，讲完再一条条过注意事项。' },
    '我们各是一个太空探索机构，用现实里的技术寻找外星生命：发射探测器、扫描恒星、分析数据，最终发现外星生物。',
    { b: '一共 5 轮，最后分最高的人赢。分数大多在游戏中直接走{分数|vp}，终局再加金框卡牌和{金色计分板块|goldtile}。', x: '用研究机构时只打第 2–5 轮共 4 轮，最后分最高的人赢。分数大多在游戏中直接走{分数|vp}，终局再加金框卡牌和{金色计分板块|goldtile}。' }
  ], ask: ['终局怎么计分？', '平分怎么判胜负？'] },
  { title: '一轮怎么走', sec: 45, xsec: 60, lines: [
    '从起始玩家开始顺时针轮流，每回合只做 1 个主要行动；免费行动不限次数，前后、中途都能做，但只能在自己回合做。',
    '不想做了就{跳过本轮|pass}：弃到 4 张手牌，从本轮那叠{一轮结束牌|endround}选 1 张。每轮第一个跳过的人还要转一次太阳系。',
    { b: '所有人都跳过，这一轮结束：拿收入（{起始收入牌|startcard}正面加上{插入收入|tuck}的牌），起始玩家左移。第 5 轮之后不拿收入。', x: '所有人都跳过，这一轮结束：拿收入（研究机构上的加上{插入收入|tuck}的牌），起始玩家左移。收入在第 3、4、5 轮开始时拿，最后一轮之后不拿。' },
    { x: '每人一张{研究机构|org}代替起始收入牌，开局再用 2 张{快速起始牌|quickstart}，推广从 0 开始。' }
  ], ask: ['一回合能做几件事？', '跳过之后还能做事吗？', '手牌有上限吗？'] },
  { title: '版图和资源', sec: 55, lines: [
    '中间是{太阳系版图|solarboard}，3 层{圆盘|discs}会转，外圈分 8 个{扇区|sector}；上方是{行星版图|planetboard}，旁边是{科技版图|techboard}。',
    '每人一块{玩家版图|playerboard}。资源有{信用点|credit}、{能量|energy}、{推广|publicity}（最多 10）和{数据|data}；数据先进{数据池和计算机|computer}。',
    '{卡牌|cardanatomy}一张三用：付费打出执行效果；或弃掉拿左上角的小效果；或拿到{增加收入|income}时插到收入牌下面，立刻拿右下角资源，以后每轮都有。',
    '牌上还有{条件任务|mission_cond}、{触发任务|mission_trig}和{终局计分牌|endgame}，完成了拿奖励。'
  ], ask: ['一张牌能既打出又弃掉吗？', '增加收入一定要插牌吗？'] },
  { title: '探测器：发射、绕行、着陆', sec: 55, lines: [
    '{发射|launch}：花 2 信用点在地球放一个探测器，太空中默认只能有 1 个。',
    '{移动|move}：1 能量走一格，或弃掉左上角带移动的牌；离开小行星多花 1 点，进入行星、彗星等格得 1 推广。移动力拿到就要用完。',
    '{绕行|orbit}：在行星格里花 1 信用点 + 1 能量，变成{人造卫星|orbiter}，拿行星上方的奖励；第一个绕行的另得 3 分。',
    '{着陆|land}：花 3 能量（已有人造卫星只要 2）变成{着陆器|lander}，拿行星中间的分数和一个{橙色生命迹象|trace_y}。不用先绕行。'
  ], ask: ['移动力可以留到回合后面用吗？', '着陆一定要先绕行吗？', '经过行星就能拿推广吗？'] },
  { title: '望远镜：扫描和数据', sec: 55, xsec: 65, lines: [
    '{扫描|scan}：花 1 信用点 + 2 能量，在地球所在扇区标 1 个{信号|signal}，再从供应区弃 1 张牌，在它{颜色|signalsectors}的扇区标 1 个。',
    '标信号就是拿走扇区最左边的数据，换上你的标记。数据拿光扇区就完成：标记最多的{赢得扇区|winsector}，拿奖励和{紫色生命迹象|trace_p}，有标记的人都得 1 推广。',
    '数据放进计算机，上排 6 格放满就能{分析数据|analyze}：花 1 能量清空计算机，拿一个{蓝色生命迹象|trace_b}。',
    { x: '《群星计画》的{信号标记|signaltoken}：扫描时每弃 1 个，多弃 1 张供应区的牌标信号。' }
  ], ask: ['扇区什么时候结算？平手谁赢？', '扫描时弃的牌什么时候补？', '计算机要放满才能分析吗？'] },
  { title: '打牌、科技和公转', sec: 55, lines: [
    '{打出卡牌|play}：付左边的费用执行效果，牌上的行动不再付标准费用。',
    '{研究科技|research}：花 6 推广，拿一种你还没有的{科技板块|tech}：橙色管探测器，紫色管望远镜，蓝色管计算机。',
    '研究科技要先{转太阳系|rotate}再拿；每轮第一个跳过的人也转。看{公转计数标记|rotcounter}转哪一层，逆时针转一格，探测器跟着动。'
  ], ask: ['研究科技先转还是先拿？', '太阳系怎么转？探测器会被推走吗？'] },
  { title: '外星生物', sec: 40, xsec: 45, lines: [
    '三种生命迹象：紫色靠赢扇区，橙色靠着陆，蓝色靠分析；还有{通用生命迹象|trace_any}。',
    '拿到就标在外星生物版图下的{发现位置|overflow}，每个 5 分 + 1 推广；某块下面 3 个都满了，回合结束后翻开它，读{外星生物说明|alienrules}，之后能拿{外星生物卡牌|aliencard}。',
    { b: '每局只有 2 个外星生物，开局背面朝上，发现了再讲它的规则。', x: '每局只有 2 个外星生物，《群星计画》的 3 个新种族也混在里面抽，发现了再讲它的规则。' }
  ], ask: ['发现位置都满了怎么办？', '发现时谁拿奖励？'] },
  { title: '里程碑和终局', sec: 40, lines: [
    '分数到 25、50、70 的那回合结束时触发{金色里程碑|goldmilestone}：选一块{金色计分板块|goldtile}放标记，越早标格子分越高，但标的时候不得分。',
    '1–3 人局还有{中立里程碑|neutralmilestone}，会帮忙填发现位置。',
    '最后一轮所有人跳过后终局计分：金框卡牌、金色计分板块，再加个别外星生物的分。平分就共享胜利。本站「计分」页每人填自己的，自动算。'
  ], ask: ['放金色里程碑标记时得分吗？', '金色计分板块怎么算分？'] }
];

// After the script: the points people get wrong, with answers (rulebook, CGE's FAQ and rulings, see tools/faq.json).
// [title, answer, mode] — mode 'x' only with the expansion.
const NOTES = [
  ['移动力不能存着用', 'CGE 2025 年 12 月正式裁定：拿到的移动力要马上用，用不完作废。唯一例外是离开小行星要 2 点时，可以马上花能量或弃牌补足第 2 点。很多早期视频讲错了。'],
  ['研究科技先转太阳系，再拿科技', '卡牌给的科技也一样。牌上同时画着公转和科技也只转一次；那种颜色拿满了拿不到科技，仍然要转。'],
  ['第一个跳过的人转太阳系，第 5 轮也要转', '跳过时先弃到 4 张手牌，再（第一个跳过的）转太阳系，最后选一轮结束牌。第 5 轮没有一轮结束牌，也不再拿收入。'],
  ['标信号是强制的，扫描至少 2 个', '地球所在扇区 1 个、供应区弃牌对应颜色的扇区 1 个，哪怕会帮对手完成扇区。凹槽满了还能继续标，多出的不给数据但算进争夺。供应区等扫描结束再补。'],
  ['扇区在主要行动结束时结算', '不是回合结束。标记最多的赢，平手时后放标记的赢；每个有标记的人得 1 推广。之后第二名留 1 个标记，其余退回，重新放满数据。'],
  ['着陆不需要先绕行', '任何人的人造卫星都让这颗行星的着陆便宜 1 能量。绕行后的探测器不能再动，也不能再着陆。'],
  ['“访问行星”要移动进去', '打牌时已经站在那一格不算。同一回合重复进入同一格，每次都拿推广。人造卫星和着陆器不算探测器。'],
  ['手牌只在跳过时检查', '轮中手牌没有上限，跳过时弃到 4 张。推广最多 10，数据池最多 6，多出的作废。'],
  ['免费行动只能在自己回合做', '不能在别人回合或回合之间做，也不能打断另一个免费行动。资源转换是同种 2 换 1。'],
  ['里程碑和发现都在回合结束后结算', '不是马上结算。同一回合有里程碑和发现，先结算里程碑。终局计分时越过的里程碑不触发。'],
  ['放金色里程碑标记不得分', '终局才按“组数 × 标记所在格的分数”算。同一块板块每人只能标一次，标到 70 分时你在 3 块上有标记。'],
  ['收入板块不算起始收入牌上印的', '收入那块金色计分板块只数插在起始收入牌下面的牌，不算收入牌本身印的 3 信用点、2 能量、1 张牌。外星生物给的推广、数据等特殊收入也不算。'],
  ['条件任务和触发任务不一样', '条件任务看状态，打出时已满足也能完成（先结算完牌的主效果）；触发任务只认打出之后的事，一次触发只能盖一个圆圈。卡牌条件只算你自己的东西。'],
  ['生命迹象颜色满了放冗余位置', '冗余位置 3 分，即使还有空位也可以主动放。发现奖励只给发现位置上的人，冗余位置不算。'],
  ['2 人局中立里程碑一次只放 1 个', '每次有人越过 20 或 30 分，只移 1 个中立标记到最左边空着的发现位置。4 人局没有中立里程碑。'],
  ['一次发射只放 1 个探测器', '“太空中 2 个探测器”的科技只是提高上限。已经在地球格上的探测器也算在太空中。'],
  ['科技每种 4 块都放，不按人数减', '12 种科技每种 4 块，2 人局也全放，每叠顶上放 1 块 2 分板块。科技版图上缺角的方向印错了，以板块奖励面朝上为准。'],
  ['平分共享胜利', '最高分平手就并列第一，规则书没有其他判定（它开玩笑说卡尔·萨根的头号粉丝获胜，紧接着说是开玩笑的）。本站结算页也按并列显示。'],
  ['用研究机构只打 4 轮', '只玩第 2–5 轮，推广从 0 开始，一轮结束牌只做第 2、3、4 轮的。官方不建议用研究机构打 5 轮。', 'x'],
  ['研究机构“每轮一次”的能力', '用过就在研究机构上做标记，拿收入时拿掉。研究机构的收入在第 3、4、5 轮开始时拿。', 'x'],
  ['快速起始牌的上半部分不拿奖励', '照放人造卫星、生命迹象或信号，但不拿任何奖励；下半部分才拿资源和效果。之后“增加收入”时可以用发到的 4 张主牌插入。', 'x']
];

// Icon reference at the bottom, grouped by where they are on the table. [group, ids, mode]
const GROUPS = [
  ['主版图', ['solarboard', 'discs', 'planetboard', 'techboard', 'sector', 'rotcounter', 'endround']],
  ['主要行动', ['launch', 'orbit', 'land', 'scan', 'analyze', 'play', 'research', 'pass']],
  ['资源与图标', ['credit', 'energy', 'publicity', 'data', 'card', 'randcard', 'vp', 'move', 'income', 'rotate', 'signal', 'winsector']],
  ['你面前', ['playerboard', 'computer', 'startcard', 'tuck', 'cardanatomy', 'mission_cond', 'mission_trig', 'endgame', 'tech', 'orbiter', 'lander']],
  ['外星生物', ['trace_p', 'trace_y', 'trace_b', 'trace_any', 'overflow', 'alienrules', 'aliencard']],
  ['计分', ['goldmilestone', 'goldtile', 'neutralmilestone']],
  ['群星计画', ['org', 'quickstart', 'signaltoken'], 'x']
];

const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const term = (text, id) => `<button type="button" class="term" data-t="${id}">${ICON(TERMS[id].icon)}${esc(text)}</button>`;
const line = s => esc(s).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>').replace(/\{([^|}]+)\|(\w+)\}/g, (_, t, id) => term(t, id));
// inside a button the terms show their icon but are not buttons themselves
const label = s => esc(s).replace(/\{([^|}]+)\|(\w+)\}/g, (_, t, id) => `<span class="tlab">${ICON(TERMS[id].icon)}${esc(t)}</span>`);
const askBtn = (text, q) => `<button type="button" class="tq" data-q="${esc(q)}">问 <span>${label(text)}</span></button>`;

// mode: 'b' base game (default), 'x' with 《群星计画》; remembered in this browser
let mode = 'b';
try { if (localStorage.getItem('seti-teach-mode') === 'x') mode = 'x'; } catch {}
const pick = x => typeof x === 'string' ? x : x[mode];          // a line or question for both modes, or {b, x}
const only = list => list.map(pick).filter(Boolean);
const notes = () => NOTES.filter(n => !n[2] || n[2] === mode);
const secs = p => mode === 'x' && p.xsec ? p.xsec : p.sec;
const RULES_ZH = 'https://filemanager.czechgames.com/storage/files/seti-search-for-extraterrestrial-intelligence/rules/SE%20rulebook%20ZH-S%2006.pdf';
const AID_ZH = 'https://filemanager.czechgames.com/storage/files/seti-search-for-extraterrestrial-intelligence/other-downloads/player-aid/SE%20player%20aid%20ZH-S%2003.pdf';
const SA_ZH = 'https://filemanager.czechgames.com/storage/files/seti-space-agencies/rules/SE2%20rulebook%20ZH-S%2002.pdf';

function render() {
  const total = PARTS.reduce((t, p) => t + secs(p), 0) / 60;
  document.getElementById('teach').innerHTML = `
  <div class="tmode" role="group" aria-label="这局怎么玩"><span>这局</span>
    <button type="button" data-mode="b" aria-pressed="${mode === 'b'}">只玩基础</button><button type="button" data-mode="x" aria-pressed="${mode === 'x'}">带群星计画</button></div>
  <p class="tlead">讲的人照着念，约 ${Math.round(total)} 分钟就能开局。<b>带下划线的词</b>点一下看图和解释；有疑问点「问」，规则助手马上回答。</p>
  <nav class="tnav">${PARTS.map((p, i) => `<a href="#p${i + 1}"><i>${i + 1}</i>${p.title}</a>`).join('')}<a href="#later">注意事项</a><a href="#icons">图标速查</a></nav>
  ${PARTS.map((p, i) => `<section class="card tpart" id="p${i + 1}">
    <h2 class="h"><span><i>${i + 1}</i>${p.title}</span><small>约 ${secs(p)} 秒</small></h2>
    ${only(p.lines).map(s => `<p class="tline">${line(s)}</p>`).join('')}
    <div class="tasks"><em>桌上常见疑问</em>${only(p.ask).map(q => askBtn(q, q)).join('')}</div>
  </section>`).join('')}
  <section class="card tpart" id="later">
    <h2 class="h"><span><i>!</i>注意事项</span><small>${notes().length} 条</small></h2>
    <p class="tnote">流程讲完后，一条一条过一遍。这些是主流程之外容易出错、容易争的地方，点开念答案。</p>
    ${notes().map(([t, a, m], i) => `<details class="fq tnotei"><summary><i>${i + 1}</i>${esc(t)}${m === 'x' ? '<em class="tnw">扩展</em>' : ''}</summary><p>${esc(a)}</p>
      <button type="button" class="tq tmore" data-q="${esc(`「${t}」这一条我还有疑问，请再讲讲。`)}">还有疑问？问规则助手</button></details>`).join('')}
    <p class="tnote">注意事项里没有的，点右下角「规则」问 AI，本站资料查不到会联网找。</p>
  </section>
  <a class="btn tgo" href="/">讲完了，去建房间</a>
  <h2 class="h" id="icons">图标速查<small>点图标看解释</small></h2>
  ${GROUPS.filter(g => !g[2] || g[2] === mode).map(([g, ids]) => `<div class="card tgrid"><h3>${g}</h3><div>${ids.map(id => `<button type="button" class="tic" data-t="${id}">${ICON(TERMS[id].icon)}<span>${TERMS[id].name}</span></button>`).join('')}</div></div>`).join('')}
  <footer>依据 CGE 官方规则书 · 图片截自 CGE 官方简体中文版<a href="${RULES_ZH}" target="_blank" rel="noopener">规则书</a>、<a href="${AID_ZH}" target="_blank" rel="noopener">快速参考</a>和<a href="${SA_ZH}" target="_blank" rel="noopener">《群星计画》规则书</a>，版权归 Czech Games Edition 所有 · 非官方玩家工具</footer>`;
}
render();

// The note for a term: a sheet from the bottom with the picture, where it is and what it means.
const sheet = document.createElement('div');
sheet.className = 'tsheet hidden';
document.body.appendChild(sheet);
const close = () => sheet.classList.add('hidden');
function show(id) {
  const t = TERMS[id];
  sheet.innerHTML = `<div class="tsbg"></div><div class="tsbox" role="dialog" aria-label="${esc(t.name)}">
    <div class="tshd">${ICON(t.icon, 'big')}<b>${esc(t.name)}</b><button type="button" class="tsx" aria-label="关闭">×</button></div>
    <p><em>在哪儿看到</em>${esc(t.where)}</p><p><em>什么意思</em>${esc(t.what)}</p>
    <button type="button" class="btn navy tsask" data-q="${esc(`「${t.name}」是什么，怎么用？`)}">还不懂？问规则助手</button></div>`;
  sheet.classList.remove('hidden');
}
const ask = q => { close(); window.askRules?.(q); };
document.addEventListener('click', e => {
  const m = e.target.closest('[data-mode]');
  if (m) {
    if (m.dataset.mode === mode) return;
    mode = m.dataset.mode;
    try { localStorage.setItem('seti-teach-mode', mode); } catch {}
    return render();
  }
  const t = e.target.closest('[data-t]');
  if (t) return show(t.dataset.t);
  const q = e.target.closest('[data-q]');
  if (q) return ask(q.dataset.q);
  if (e.target.closest('.tsx,.tsbg')) close();
});
addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
