# SETI: Search for Extraterrestrial Intelligence · BGG 社区调研

调研日期：2026-11-13
对象：SETI: Search for Extraterrestrial Intelligence（CGE 2024，设计 Tomáš Holek）
BGG id **418059 已核实**：https://boardgamegeek.com/boardgame/418059/seti-search-for-extraterrestrial-intelligence
简中版名：**《星空觅迹：探寻地外文明计划》**（Broadway Toys LTD，2025）；扩展简中名《星空觅迹：群星计画》（2026）

---

## 0. 方法与局限（先读）

- **BGG XML API（xmlapi2 和旧版 xmlapi）现在都返回 `Unauthorized`，需要注册 token**，没用上。改用 BGG 网页前端在用的 JSON 接口 `api.geekdo.com/api/...`，拿到的是原始数据，不是网页摘要。
- **抓取范围**
  - **Rules 区：551 个主题全部抓取**（含全部回帖，约 3,700 帖）。
  - General / Strategy / Variants / News / Sessions：按“回帖 + 点赞”排名，前 120 个主题，另加约 25 个按关键词挑选的主题（App、扩展、BGA、计分等）。
  - **Files 区：62 个文件全部列出**（含点赞数）。
  - Geeklists：只看了“最热”前 50 个列表，又点开 3 个相关条目。
  - 另读了扩展 Space Agencies 的官方 FAQ 主题。
- **官方身份识别**：发帖人 ID 逐个查了 BGG 用户资料里的 publisherid / designerid。认定为官方的账号：
  - `CzechGamesEdition`（CGE 官方号）
  - `uhlik`（Tomáš Uhlíř，CGE；他自己承认 CGE 官方号的帖子也是他写的）
  - `thesunshineraven`、`NathanMeunier`、`Elwen`（CGE）
  - `Tomas_Holek`（设计师）

  以上账号在已抓主题里共发了 91 帖。`Scooperman`、`Michael_Murphy` 等是活跃的资深玩家，不是官方。其中 Michael_Murphy 自称曾试图删改规则书里的一句话，可能参与过校对，但没有核实。
- **规则书 PDF 没能直接读**：CGE 官网 PDF 超过 10 MB，抓取工具拒收。开局和计分的细节来自两处：rulespal.com 转录的规则书文本，以及论坛里引用规则书的原文。**页码均为转引**，正式做站前要拿实体规则书或官网 PDF 逐条核对。
- **频次统计是关键词归类**：只按主题标题匹配，一个主题可以同时算进多类。数字是数量级参考，不是精确比例。

---

## 1. 基本数据（BGG，2026-11-13 读取）

| 项 | 数值 |
|---|---|
| 人数 | 1–4（社区投票 757 票：**最佳 3 人**，1–4 人都推荐） |
| 时长 | 盒标 40–160 分钟；设计师说“平均每人约 40 分钟”（[Designer Diary 1](https://boardgamegeek.com/thread/3273914)） |
| 实际时长（[How long are your games?](https://boardgamegeek.com/thread/3710531)，35 帖） | 多数报“每人 30–60 分钟”，4 人局 2.5–4 小时；有 AP 玩家或首局教学时 5–7 小时 |
| 年龄 | 14+ |
| 重度 | **3.84 / 5**（1,173 票）。CGE 在测试期估计 3.2–3.4，设计师估计 3.6–3.8 |
| 评分 / 排名 | 平均 8.41，23,122 人评分；总榜第 14，策略榜第 11 |
| 拥有 / 记录对局 | 35,944 人拥有，87,090 次对局 |
| 语言依赖 | “中等，需要对照表或贴纸” |
| 机制标签 | Area Majority、End Game Bonuses、Income、Multi-Use Cards、Resource to Move、Solo、Progressive Turn Order、Variable Set-up |

**盒子尺寸**（BGG 版本页，原数据单位为英寸，已换算）：

| 版本 | 长 × 宽 × 高 | 重量 |
|---|---|---|
| 英文版（CGE 2024） | **37.0 × 25.5 × 7.0 cm** | 未填 |
| 简中版、法 / 匈 / 葡 / 塞版 | 同英文版，37.0 × 25.5 × 7.0 cm | 未填 |
| 德文版 | 37.0 × 25.8 × 7.3 cm | 未填 |
| 波兰版 | 36.8 × 25.8 × 7.4 cm | 3.37 kg |
| 西班牙版 | 37.0 × 25.5 × 7.0 cm | 2.83 kg |
| 扩展 Space Agencies（英 / 德 / 荷 / 简中等） | **25.3 × 18.4 × 5.5 cm** | 0.69 kg |

社区说 SETI 和《阿纳克遗迹》用同款盒子（[3638895](https://boardgamegeek.com/thread/3638895)）。

---

## 2. 论坛总体与频次

各区规模：

| 分区 | 主题数 | 帖子数 |
|---|---|---|
| Rules | 551 | 3,703 |
| General | 382 | 4,638 |
| Variants | 71 | 1,022 |
| Strategy | 41 | 828 |
| Reviews | 49 | 354 |
| Sessions | 15 | 199 |
| News | 17 | 111 |

扩展 Space Agencies 另有 Rules 80 个主题、General 111 个主题。

### 2.1 Rules 区 551 个主题按标题关键词归类

可多类重复计数。

| 类别 | 主题数 | 占比 | 回帖合计 |
|---|---|---|---|
| 外星种族（发现、痕迹、5 个种族名） | 136 | 25% | 864 |
| 单人模式（Rival、目标） | 85 | 15% | 477 |
| 扫描、信号、扇区胜负 | 83 | 15% | 528 |
| 具体某张卡的澄清（#编号或卡名） | 74 | 13% | 404 |
| 时机、结算顺序、自由行动、主行动 | 65 | 12% | 524 |
| 探测器移动、小行星、发射上限 | 61 | 11% | 414 |
| 收入、资源、手牌、宣传、补牌 | 51 | 9% | 379 |
| 入轨、登陆、卫星（moon） | 48 | 9% | 348 |
| 任务（条件任务 / 触发任务） | 43 | 8% | 298 |
| 科技板块 | 38 | 7% | 271 |
| 金色计分板块、终局计分 | 31 | 6% | 241 |
| 数据、电脑、分析 | 25 | 5% | 120 |
| pass、轮末流程 | 24 | 4% | 151 |
| 太阳系旋转 | 20 | 4% | 157 |
| 里程碑、中立标记 | 13 | 2% | 74 |
| 开局、人数 | 10 | 2% | 114 |

另一种口径是“标题 + 首帖正文”。按这个口径，提到“移动 / 探测器”的主题约 35%，提到“外星种族”的约 31%，提到“回合 / pass / 时机”的约 30%，提到“扫描”的约 26%。

**解读**

- 问得最多的是三类：外星种族（每局随机、规则在单独的说明页上）、单人 Rival 自动机、扫描与扇区的结算细节。
- “时机 / 先后顺序”类主题回帖密度最高（65 个主题，524 帖），说明大家对时机争论最多。
- 太阳系旋转主题不多（20 个），但每个都有图例和争论，属于“一旦碰上就卡住”的问题。

### 2.2 Rules 区回帖最多的主题（证据）

| 回帖 | 点赞 | 主题 |
|---|---|---|
| 126 | 119 | [Official FAQ + cards clarification](https://boardgamegeek.com/thread/3392878)（CGE 官方 FAQ，置顶） |
| 58 | 3 | [Is Probe Movement Saved During My Turn?](https://boardgamegeek.com/thread/3621540)（2025-12 CGE 正式裁定） |
| 44 | 0 | [errata on tech Bonus](https://boardgamegeek.com/thread/3634135)（实为 2 人局摆科技摆错） |
| 36 | 4 | [Exertians - No players have danger! Does anyone lose points?](https://boardgamegeek.com/thread/3441681)（CGE 裁定） |
| 32 | 3 | [Question about "draw an alien card" icon](https://boardgamegeek.com/thread/3418340) |
| 27 | 1 | [End of Game Scoring - Completed Missions](https://boardgamegeek.com/thread/3514424) |
| 25 | 1 | [Timing trigger: multiple movement from separate mission triggers](https://boardgamegeek.com/thread/3496465) |
| 24 | 3 | [Solo questions: Bot taking cards, …](https://boardgamegeek.com/thread/3711304) |
| 24 | 0 | [So, no special rules/setup for 2p games?](https://boardgamegeek.com/thread/3487882) |
| 23 | 1 | [Getting points for marking gold scoring tiles](https://boardgamegeek.com/thread/3474497) |
| 22 | 1 | [Can I rotate the map to check hidden asteroids/comets](https://boardgamegeek.com/thread/3507628) |
| 22 | 1 | [Can you use other players' orbiters to land? Land without orbit?](https://boardgamegeek.com/thread/3421549) |
| 21 | 1 | [probe becoming orbiter and lander](https://boardgamegeek.com/thread/3416864) |
| 20 | 5 | [When to resolve a completed sector](https://boardgamegeek.com/thread/3459324) |
| 20 | 1 | [Final Income, why?](https://boardgamegeek.com/thread/3444223) |
| 19 | 2 | [Rival life trace marking](https://boardgamegeek.com/thread/3448605) |
| 18 | 0 | [initial scoring on Gold scoring tiles](https://boardgamegeek.com/thread/3460542) |
| 18 | 6 | [Order of executing card actions](https://boardgamegeek.com/thread/3386154)（设计师答） |
| 17 | 35 | [Unofficial SETI FAQ](https://boardgamegeek.com/thread/3388591)（已被官方 FAQ 取代） |
| 2 | 17 | [rulebook revisions?](https://boardgamegeek.com/thread/3597269)（规则书各版本差异对比） |
| 1 | 17 | [Defining "Probe", "Orbiter" and "Lander"](https://boardgamegeek.com/thread/3460666) |

---

## 3. 线下最繁琐、最易错、最易忘的环节

按“对线上助手的价值”排序。

### 3.1 太阳系旋转：何时转、转哪一层、探测器怎么被推

**什么时候转**
- **研究科技**（花 6 宣传，或卡牌给科技）时转一次，**先转再拿科技**。
- **每轮第一个 pass 的玩家**转一次，这是 pass 动作的一部分。第 5 轮照样要转，只是旋转提示标记直接弃掉（[3453249](https://boardgamegeek.com/thread/3453249)、[3438617](https://boardgamegeek.com/thread/3438617)，引规则书 p.19）。
- **卡上同时有“旋转”和“科技”图标时只转一次**，旋转图标只是提醒（官方 FAQ）。
- 有人以为“拿科技本身不转，只有花 6 宣传才转”（[3416169](https://boardgamegeek.com/thread/3416169) 里有争论）。按官方 FAQ，每次研究科技都先转。

**转哪一层**
- 按“1 → 2 → 3 → 1……”循环：
  - 第 1 次只转最上层圆盘；
  - 第 2 次转第 2 层，第 1 层随之一起转；
  - 第 3 次转第 3 层，所有层一起转。
- 每次逆时针转一个扇区（rulespal 转录的规则书）。
- **容易忘“下一次轮到哪层”**。设计师在 [Designer Diary 2](https://boardgamegeek.com/thread/3278529) 里专门解释过：下层转动时会带动上面所有层。

**探测器怎么被推**
- 探测器**永远不换环**。被凸起部分顶到，就移到同环的下一格；处在大缺口里则原地不动（[3394839](https://boardgamegeek.com/thread/3394839)）。
- 被“剪刀口”夹住的情况，答复就是“推到下一格”（[3434772](https://boardgamegeek.com/thread/3434772)，5 赞）。
- 两层缺口叠在一起时同样被推（[3443882](https://boardgamegeek.com/thread/3443882)、[3756467](https://boardgamegeek.com/thread/3756467)，2026-08 仍有人问）。
- **只会被推到彗星或小行星上，不会被推到行星上**（CGE 在官方 FAQ 主题内的回复，article 45515231）。
- 被推进小行星或彗星格**可以拿宣传**。在自己回合被推进小行星，才能触发 #129（官方 FAQ）。

**能不能翻开查看被遮住的格子**
- 社区共识是“可以，信息是公开的”（[3507628](https://boardgamegeek.com/thread/3507628)，22 帖）。

**开局摆放**
- 不用 App 时，圆盘的**扇区分界线必须对齐**，保证每个扇区各有一颗近邻恒星（[3621364](https://boardgamegeek.com/thread/3621364)）。官方提供了随机生成器（见 §6）。

### 3.2 每轮流程、pass、收入

**pass 的顺序**
1. 手牌超过 4 张的，弃到 4 张。
2. 若是本轮第一个 pass，旋转太阳系。
3. 从本轮的轮末牌堆里选 1 张。牌堆有 4 叠，每叠张数 = 人数 + 1。越早 pass，可选的牌越多。

**两轮之间**
1. 所有人拿收入。
2. 起始玩家标记左移一位。
3. 旋转提示标记移到下一叠牌上。

**常见错误**
- **第 5 轮结束后还拿收入**：不拿，因为收入在“两轮之间”，没有第 6 轮（[3444223](https://boardgamegeek.com/thread/3444223)）。玩家助手卡上写的是“End of Round”，和规则书的 “Between Rounds” 不一致，这是混淆的来源。
- **以为手牌全程上限 4 张**：只在 pass 时弃到 4 张（[3371487](https://boardgamegeek.com/thread/3371487)、[3455192](https://boardgamegeek.com/thread/3455192)，官方 FAQ）。法文版规则在这一点上译错了（[3420063](https://boardgamegeek.com/thread/3420063)）。
- **pass 后什么时候能拿收入**：规则允许 pass 之后提前结算收入以加快速度，但要先把 pass 的全部步骤做完（[3522018](https://boardgamegeek.com/thread/3522018)）。
- **轮末牌可以看正面再选**（[3471584](https://boardgamegeek.com/thread/3471584)）。没被选的那张面朝上弃掉（[3583318](https://boardgamegeek.com/thread/3583318)）。
- **收入塞牌**：塞牌时**立刻**拿到该牌右下角的资源，之后从第 2 轮起每轮再拿一次（[3449998](https://boardgamegeek.com/thread/3449998)）。“增加收入”时可以选择不塞牌（官方 FAQ）。
- **“抽 1 张随机牌”**：从牌堆顶摸（[3447389](https://boardgamegeek.com/thread/3447389)）。
- **补卡列的时机**：拿牌（自由动作或花 3 宣传买牌）后**立刻补**；扫描时弃卡列的牌标信号，则**扫描动作结束后再补**。这条是设计师答复（[3380765](https://boardgamegeek.com/thread/3380765)），后写入官方 FAQ。
  - 2025 版规则书 p.12 加了一句 “Refill the card row afterward”，被认为和 FAQ 有歧义（[3597269](https://boardgamegeek.com/thread/3597269)、[3597279](https://boardgamegeek.com/thread/3597279)）。
- **自由动作**
  - 只能在自己回合内做。可以打断主行动，但**不能打断另一个自由动作**（官方 FAQ）。
  - 放数据进电脑不限次数（[3537377](https://boardgamegeek.com/thread/3537377)）。

### 3.3 扫描、信号、扇区

**扫描动作**
- 至少标 **2 个信号**：一个在**地球当前所在扇区**，一个在与卡列中某张牌右上角颜色**相同的扇区**（弃掉那张牌）。
- **标信号是强制的**，哪怕会帮对手完成扇区。
- 可以**超额标记**：超出的格不给数据，但计入扇区多数（CGE 答复，[3382157](https://boardgamegeek.com/thread/3382157)）。

**扇区结算**
- 时机是“**主行动结束时**”（规则书 p.13），不是回合结束。非官方 FAQ 和一些教学视频曾说成回合结束（[3459324](https://boardgamegeek.com/thread/3459324)）。
- 顺序：标记 → 完成并结算 → 重置。
- **平票时，后放标记的玩家胜**（官方 FAQ）。
- 赢下扇区所放的标记**不算信号**（官方 FAQ）。
- 第一次赢的人拿小格奖励，之后再赢的人拿大格奖励（[3422907](https://boardgamegeek.com/thread/3422907)）。

**2 人局扫描很难完成扇区**，是社区头号争议（[3487882](https://boardgamegeek.com/thread/3487882)、[2 players scaling?](https://boardgamegeek.com/thread/3373577) 52 帖、[2P signal variant](https://boardgamegeek.com/thread/3396324) 71 帖）。常见做法是变体：在每个扇区预放一个中立标记，或者扇区容量减 1。

### 3.4 探测器移动、轨道、登陆

- **移动**
  - 只能走正交相邻格。
  - 离开小行星格要 2 点移动（有科技可减免）。
  - 多点移动可以分给不同探测器（官方 FAQ）。
- **移动点不能存到回合后面再用**：这是 CGE 在 [3621540](https://boardgamegeek.com/thread/3621540)（58 帖）里的正式裁定（2025-12，2026-01 补充了例子）。
  - 唯一例外：离开小行星时，可以立刻用能量或弃牌补足第 2 点移动，算同一串操作。
  - 此前社区普遍把移动当作“本回合内可存的点数”（[3496465](https://boardgamegeek.com/thread/3496465)）。**这是被官方推翻的高频误解。**
- **发射**
  - 每次发射动作只发 1 个探测器。
  - 太空中探测器的上限默认 1 个，有橙色科技 #1 时为 2 个（CGE，[3382228](https://boardgamegeek.com/thread/3382228)）。
  - 已放在地球格上的探测器也算“在太空中”（CGE，[3390957](https://boardgamegeek.com/thread/3390957)）。
- **入轨、登陆**
  - **入轨后不能再登陆，也不能再移动**（官方 FAQ、[3416864](https://boardgamegeek.com/thread/3416864)）。
  - **登陆不需要先入轨**。**任何人**的入轨器都给登陆减 1 能量的折扣（[3421549](https://boardgamegeek.com/thread/3421549)，官方 FAQ）。
  - 登陆卫星（moon）需要科技，同样享受这个折扣。
- **入轨器、着陆器不再算“探测器”**：卡上说“扇区里的探测器”时，它们不算（官方 FAQ）。
- **“访问行星”必须移动进入那一格**：出牌时已经站在那里不算。同一回合重复访问，每次都拿宣传（官方 FAQ；设计师在 [3382478](https://boardgamegeek.com/thread/3382478) 答“得 4 宣传 2 分”）。

### 3.5 数据、电脑、科技

- **分析数据**
  - 电脑**顶行 6 格放满**即可分析，底行（来自电脑科技）不要求放满。
  - 分析后清空顶行和底行，数据池里的不动（官方 FAQ）。
  - 数据池上限 6 个。
- **蓝色电脑科技**
  - 不必从左到右放。
  - 可以压在已有数据的格子下面，但那格的 2 分拿不到（官方 FAQ）。
  - 必须放进**空的**科技槽，不能覆盖已有科技（uhlik，[3621422](https://boardgamegeek.com/thread/3621422)）。
- **科技板块**
  - **不论人数，每种都摆 4 块**（[3605217](https://boardgamegeek.com/thread/3605217)）。
  - [3634135](https://boardgamegeek.com/thread/3634135) 的“勘误”争吵，起因就是 2 人局每种只摆了 2 块。
  - 科技板上缺角的印刷方向错了，板块应**奖励面朝上**放（CGE 承认，[3392400](https://boardgamegeek.com/thread/3392400)，7 赞）。
- **紫色科技 #4**（扫描时发射）：只付 1 能量，不付 2 信用（官方 FAQ）。

### 3.6 任务

**条件任务和触发任务的区别**是第一大困惑（[3511007](https://boardgamegeek.com/thread/3511007)、[3447503](https://boardgamegeek.com/thread/3447503)、[3388606](https://boardgamegeek.com/thread/3388606) 等）。

- **条件任务**：灰框加向右箭头。只要条件成立，就能在自己回合任意时刻作为自由动作完成，打出前已经满足的也算。
- **触发任务**：触发图标指向下方奖励。只认打出之后发生的事，一次触发只能盖一格。
- **NIAC 裁定**（2025-11）：必须先**完整结算卡的主效果**，再把卡放到面前，之后才能完成任务。规则书里那句 “can complete it immediately” 是误导性写法（官方 FAQ 主题内 CGE 帖 46871126）。
- 完成任务的奖励可以不拿；但“已完成的任务数”只认真正完成的（[3514424](https://boardgamegeek.com/thread/3514424)）。
- 卡牌条件**只算自己的东西**，除非卡上写明（规则书 2025 版 p.14 新增这句；[3384708](https://boardgamegeek.com/thread/3384708)、[3541846](https://boardgamegeek.com/thread/3541846)）。

### 3.7 里程碑、金色计分、中立标记

- **金色里程碑**：分数达到或越过 25 / 50 / 70 时，在**回合结束时**选一块金色计分板块放标记，同一块不能放两次（据 rulespal 转录）。
- **标记时不得分**，终局按“标记位置的分值 × 套数”计分（[3474497](https://boardgamegeek.com/thread/3474497)、[3460542](https://boardgamegeek.com/thread/3460542)），这是高频误解。
- **中立里程碑**
  - 1–2 人局：20 分和 30 分格上方各放 2 个中立标记；3 人局各放 1 个；4 人局没有。
  - **每个玩家越过时只放 1 个**中立标记，放进最左边的空“发现格”（先放第一个种族下方的格子）（uhlik，[3373577](https://boardgamegeek.com/thread/3373577)、[3386868](https://boardgamegeek.com/thread/3386868)；官方 FAQ）。
- **所有里程碑都在回合结束时结算**；同一回合多人到达时，从当前玩家起顺时针依次结算。**终局计分时越过的里程碑一律不触发**，包括金色、Centaurians、Exertians（CGE 在 FAQ 主题内答复 45278689；[3514229](https://boardgamegeek.com/thread/3514229)、[3494193](https://boardgamegeek.com/thread/3494193)、[3439450](https://boardgamegeek.com/thread/3439450)）。

### 3.8 起始玩家、回合顺序

- 后手玩家开局多拿几分作为补偿（[Turn order imbalance](https://boardgamegeek.com/thread/3554858)，39 帖）。资深玩家多认为影响不大。
- 起始收入选择：社区认为同时选即可（[3597927](https://boardgamegeek.com/thread/3597927)）。

---

## 4. 最常见规则误解 Top 20（附官方答复）

| # | 常见误解 | 正确规则 | 依据 |
|---|---|---|---|
| 1 | 放金色计分标记时就拿分 | 标记时不得分；终局按“位置分值 × 套数”计 | 规则书 p.18/21；[3474497](https://boardgamegeek.com/thread/3474497)、[3460542](https://boardgamegeek.com/thread/3460542) |
| 2 | 移动点本回合可以存着，最后一起用 | **不能存**；只有离开小行星时可以连续补足 | **CGE 正式裁定** [3621540](https://boardgamegeek.com/thread/3621540)（uhlik 2025-12-11 / 2026-01-05） |
| 3 | 第 5 轮结束还拿收入 / 第 5 轮首个 pass 者不转太阳系 | 不拿收入；照样转（提示标记弃掉） | [3444223](https://boardgamegeek.com/thread/3444223)、[3453249](https://boardgamegeek.com/thread/3453249)（规则书 p.19） |
| 4 | 卡上有旋转加科技图标，就转两次 | 只转一次；研究科技一律先转 | 官方 FAQ（[3392878](https://boardgamegeek.com/thread/3392878)） |
| 5 | 扫描可以只标 1 个，或放弃不利的信号 | 至少标 2 个，强制标；可超额 | CGE thesunshineraven [3382157](https://boardgamegeek.com/thread/3382157) |
| 6 | 扫描弃卡列牌后立刻补牌 | 扫描动作结束后再补；拿牌、买牌才立刻补 | 设计师 [3380765](https://boardgamegeek.com/thread/3380765)；官方 FAQ |
| 7 | 扇区在回合结束时结算 | 主行动结束时结算；平票后放者胜 | 规则书 p.13；[3459324](https://boardgamegeek.com/thread/3459324)；官方 FAQ |
| 8 | 入轨器以后还能登陆 / 必须先入轨才能登陆 | 入轨后永远不动；登陆不需要入轨；任何人的入轨器都给折扣（卫星也适用） | 官方 FAQ；[3421549](https://boardgamegeek.com/thread/3421549)、[3416864](https://boardgamegeek.com/thread/3416864) |
| 9 | 打牌时已站在目标行星上，算“访问” | 必须移动进入；入轨器、着陆器也不算 | 官方 FAQ 卡牌部分（#1–4、#19–25 等） |
| 10 | 卡牌效果顺序随意 | 从左到右、从上到下；不能执行的跳过 | 设计师 [3386154](https://boardgamegeek.com/thread/3386154)；uhlik [3433385](https://boardgamegeek.com/thread/3433385) |
| 11 | 所有效果都可以不做 / 都必须做 | 可跳过：移动、塞牌、任务奖励。不可跳过：旋转、标信号、拿科技、获得资源、得分、标痕迹、按卡执行主行动、里程碑 | 官方 FAQ 第一条；[3382088](https://boardgamegeek.com/thread/3382088) |
| 12 | 自由动作可以随时插入，包括别人回合或另一个自由动作中途 | 只在自己回合；可打断主行动，不可打断自由动作 | 官方 FAQ |
| 13 | 条件任务也像触发任务一样不追溯 / 打出瞬间就能完成 | 条件任务看状态，可追溯，但必须先结算完主效果；触发任务不追溯，一次只盖一格 | 官方 FAQ；uhlik [3447503](https://boardgamegeek.com/thread/3447503)；NIAC 裁定 2025-11 |
| 14 | 终局计分卡、任务条件把别人的入轨器 / 着陆器也算上 | 只算自己的 | CGE [3384708](https://boardgamegeek.com/thread/3384708)；官方 FAQ |
| 15 | 手牌上限全程 4 张 | 只在 pass 时弃到 4 张 | 官方 FAQ；[3371487](https://boardgamegeek.com/thread/3371487) |
| 16 | 2 人局到达中立里程碑时，两个中立标记一起放 | 一人只放一个；放最左边的空发现格；4 人局没有 | uhlik [3373577](https://boardgamegeek.com/thread/3373577)、[3386868](https://boardgamegeek.com/thread/3386868)；官方 FAQ |
| 17 | 终局计分越过里程碑时还能触发（金色、Centaurians、Exertians） | 不触发，游戏已经结束 | CGE（FAQ 主题 45278689）；[3514229](https://boardgamegeek.com/thread/3514229)、[3494193](https://boardgamegeek.com/thread/3494193) |
| 18 | 收入类金色板块把起始收入卡上印的资源、种族给的特殊收入也算上 | 只算塞在下面的信用、能量、随机牌这三种 | 官方 FAQ；CGE 帖 45073050；[3516879](https://boardgamegeek.com/thread/3516879) |
| 19 | 有“2 探测器”科技后，一次发射能发 2 个 | 一次只发 1 个，科技只是提高上限 | CGE [3382228](https://boardgamegeek.com/thread/3382228)；官方 FAQ |
| 20 | Exertians 全员危险值为 0 时，所有人扣 10% | 危险值为 0 的人不扣分（包括打出 0 危险卡 #ET.52 的情况） | **CGE 正式裁定** [3441681](https://boardgamegeek.com/thread/3441681)（2025-01-23） |

**次常见、可作为“注意事项”的补充**
- 电脑科技必须放空槽（[3621422](https://boardgamegeek.com/thread/3621422)）。
- 科技板缺角印错（[3392400](https://boardgamegeek.com/thread/3392400)）。
- \#58、#60、#112 的条件包含卫星（moon），官方 FAQ 承认卡面漏写。
- \#29 詹姆斯·韦伯望远镜放 3 个信号（FAQ 主题内 CGE 答复）。
- 资源兑换是 2 换 1；外星种族标记不能拿来兑换；外星卡可以用（Exertian 卡除外）（CGE [3383424](https://boardgamegeek.com/thread/3383424)）。

---

## 5. 终局计分

### 5.1 计分分项

局中得分是**当场推进分数轨**的（有新手以为只算终局的部分，见 [3531912](https://boardgamegeek.com/thread/3531912)）。

局中得分来源：
- 首个入轨（3 分）
- 扇区奖励
- 发现格（5 分 + 1 宣传）
- 痕迹格
- 科技顶上的 2 分标记
- 电脑格
- 访问行星
- 任务奖励
- 种族卡
- 等等

终局（第 5 轮所有人 pass 后）依次结算：

1. **已打出的终局计分卡**（金色框卡牌）。只算自己的东西。
2. **金色计分板块**：共 4 块双面板块，每局通过金色里程碑最多标 3 块。得分 = 所在位置分值 × 套数。各面内容（据 rulespal 转录，官方 FAQ 有对应条目）：
   - 科技：每套“三色科技各一”／每对科技
   - 任务：每个已完成任务／每“2 个已完成任务或终局计分卡”
   - 收入：每套“信用、能量、随机牌三种收入各一”／收入塞牌最多的一种（只限信用或能量）
   - 其他：每套“三色生命痕迹各一”（溢出格也算）／每组“扇区胜利 + 入轨器或着陆器”，取两者较小数
3. **外星种族的额外终局步骤**
   - Exertians：危险值最高者扣分。论坛说扣总分的 1/10，未在规则原文核对。危险值为 0 的人不扣分。
   - Exertians 卡在终局按条件计分，每张只计一次（官方 FAQ）。
4. **平局**：共享胜利（rulespal 转录）。

### 5.2 计分常见错误

- 放金色标记时就加分（见 §4 第 1 条）。
- 把别人的棋子算进终局卡和金色板块。
- 收入板块误计起始收入卡印刷的资源，或误计种族给的宣传、数据收入。
- “已完成任务”的判定：
  - 未完成的任务不算；
  - 0 分的终局卡也算进“2× 任务 / 终局卡”那一面；
  - Centaurians、Exertians 卡不算任务；
  - 只拿卡不完成不算（官方 FAQ、[3514424](https://boardgamegeek.com/thread/3514424)）。
- “扇区胜利 + 入轨 / 着陆”这一面：
  - 同一扇区赢多次，每次都算；
  - 卫星上的着陆器也算；
  - 入轨器、着陆器不要求在对应扇区（[3386825](https://boardgamegeek.com/thread/3386825)、[3484072](https://boardgamegeek.com/thread/3484072)，官方 FAQ）。
- 终局计分时越过里程碑，以为还能打 Exertians 卡、触发 Centaurians 信息标记、再标金色板块。
- 没完成的扇区终局不计多数（[3487882](https://boardgamegeek.com/thread/3487882)）。
- 单人模式：Rival 不给金色板块计分，只占据第一格；玩家每有一个未完成的目标，Rival 得 5 分（官方 FAQ）。
- \#113 Solvay Conference：可计一块自己没标的金色板块，按最低档（最右格）计（官方 FAQ）。

### 5.3 社区计分表

- **只找到 1 份专门的计分表**：[SETI: Extended A4 Scoring Sheet (with Space Agencies)](https://boardgamegeek.com/filepage/326771)，RazvanOltu，2026-08，**17 赞**。
- 另有 [Starting game state for a session report](https://boardgamegeek.com/filepage/310545)（xlsx，2 赞），用于记录开局状态。
- 有玩家认为“没什么需要 App 追踪的”（[3476947](https://boardgamegeek.com/thread/3476947)）。计分需求在社区里不算强。

---

## 6. 玩家自制工具与官方 App、数字版

### 6.1 官方

- **太阳系随机生成器网页**：https://seti-solarsystem.czechgames.com 。规则书 p.4 和版图上都印有二维码（[3451142](https://boardgamegeek.com/thread/3451142)）。
  - 只负责开局随机摆放太阳系和近邻恒星。有人请求加入金色板块随机，社区认为没必要（[3507914](https://boardgamegeek.com/thread/3507914)）。
- **没有官方计分或流程 App**。
- **数字版**
  - 2025-07-31，CGE 的 Elwen 明确说“SETI **尚未宣布**数字版”，CGE Digital 当时专注于 Codenames Duet 扩展和 Steam 上的《阿纳克遗迹》（[3551084](https://boardgamegeek.com/thread/3551084)）。
  - 2024-10，CGE 称“正在讨论如何把 SETI 带到线上”（[3383047](https://boardgamegeek.com/thread/3383047)）。
  - **截至 2026-11，没有 BGA 或 Steam 版**。有一个 TTS 模组（[3449314](https://boardgamegeek.com/thread/3449314)，59 帖）。
- **官方实物升级件**：金属信用币、亚克力能量标记（CGE 商店 “SETI Upgraded Components”）；CGE 出品的 3D 打印资源标记包（[3623029](https://boardgamegeek.com/thread/3623029)）。

### 6.2 玩家自制（按热度排列）

| 工具 | 形式 | 热度 | 说明 |
|---|---|---|---|
| [brdgm.me SETI Solo Helper](https://boardgamegeek.com/thread/3496749)（https://brdgm.me/seti/） | 网页 PWA，开源 | 95 赞，41 帖 | 代替单人 Rival 的牌堆和玩家板，管理资源和大部分决策，可断点续玩，有英文和德文 |
| [SETI 卡牌列表站](https://boardgamegeek.com/thread/3469355)（seti.ender-wiggin.com） | 网页 | 43 赞 | 全部卡牌和 5 个种族（剧透折叠），多语言 |
| [SETI Card Editor](https://boardgamegeek.com/thread/3482739) | 网页 DIY 卡牌编辑器 | 67 赞 | 同上作者 |
| [Tabletop Setup Wizard](https://boardgamegeek.com/thread/3700356)（ttsetupwizard.com/games/seti） | 网页 | 20 赞 | 随机金色板块、2 个种族（隐藏）、每人发 2 个机构、太阳系随机 |
| [3D 打印收纳](https://boardgamegeek.com/thread/3426490) | 实物 | 152 帖，127 赞 | General 区第一热帖 |
| [科技板块架](https://boardgamegeek.com/thread/3592743)、[收入卡托](https://boardgamegeek.com/thread/3647239)、[玩家控制台](https://boardgamegeek.com/thread/3777135) | 实物 | 65 / 39 / 38 赞 | 说明线下“收入塞牌看不清”“板子乱”是痛点 |
| TTS 模组 | 数字桌面 | 59 帖 | 无规则执行 |

**Files 区玩家辅助类**（共 62 个文件）
- [德文 FAQ / 术语表](https://boardgamegeek.com/filepage/289427)：**202 赞**，全区第一。
- [德文单人助手](https://boardgamegeek.com/filepage/289296)：74 赞。
- [Learn to Play Overview](https://boardgamegeek.com/filepage/291610)：39 赞。
- [Player Aid IN A WINK](https://boardgamegeek.com/filepage/307522)：37 赞。
- [Solo rules reminders](https://boardgamegeek.com/filepage/291566)：29 赞。
- [Reference Helper](https://boardgamegeek.com/filepage/292364)：25 赞。
- [种族收纳盒](https://boardgamegeek.com/filepage/297871)：20 赞。
- [种族随机卡](https://boardgamegeek.com/filepage/293751)：18 赞。
- [5 页游戏辅助](https://boardgamegeek.com/filepage/297337)：18 赞。
- [4 页精简 FAQ](https://boardgamegeek.com/filepage/319262)：13 赞。
- [种族规则二维码卡](https://boardgamegeek.com/filepage/316649)：13 赞。
- [Teaching Script（教学讲稿）](https://boardgamegeek.com/filepage/323760)：10 赞。

**Geeklist**：SETI 被收入 [Games with web based automas/AI/Helpers](https://boardgamegeek.com/geeklist/270846)，条目即 brdgm.me。[色盲与桌游](https://boardgamegeek.com/geeklist/68906) 里有红绿色盲玩家反映：玩家标记颜色太接近，判断扫描多数很费劲。

---

## 7. 扩展、促销卡、FAQ、勘误、规则书版本

### 7.1 扩展：SETI: Space Agencies（BGG [445048](https://boardgamegeek.com/boardgame/445048)）

- **时间线**：2025-04-30 宣布（[News 3504792](https://boardgamegeek.com/thread/3504792)，87 赞）；SPIEL 2025 首发；2025 年第四季度起各地陆续上市，美国到 2026 年初仍难买到。
- **评价**：BGG 平均 8.85（2,493 人），重度 3.74。获 Golden Geek 扩展类第 1 名（CGE 2026-05-13 公告）。设计者同为 Tomáš Holek。
- **内容**
  - **11 个非对称机构**：Orbital Dynamics、Fenwick Research Center、Stratus Core、Deep Sky Survey、Turing Systems、Cosmos Strategy Group、Sentinel Probe Network、Mission Relay、Xenolab、Futurespan Institute、Helion Assembly。
  - **3 个新种族**：Amoeba 出现在官方 FAQ 里；Glyphids、Arkhos 是论坛帖里的叫法，未与官方材料核对。
  - 40 多张新项目卡。
  - Quick Start 卡：零售商描述为 18 张，可跳过慢热的第 1 轮。
  - 信号标记（Signal tokens）。
  - 新的 Rival 行动卡。
- **规则要点**（官方 FAQ）
  - 用机构时**只玩 4 轮**，不建议 5 轮。
  - 机构取代起始收入卡。
  - 只用 Quick Start、不用机构，会偏弱。
- **2 人局**：扩展加了一种可选开局，用 Quick Start 卡在版图上预放中立探测器、信号、痕迹（[3605255](https://boardgamegeek.com/thread/3605255)、[3583533](https://boardgamegeek.com/thread/3583533)）。玩家反馈对扫描的改善有限。
- **扩展官方 FAQ**：[thread 3602459](https://boardgamegeek.com/thread/3602459)（CGE，2025-10-31 起，47 帖）。尚未出 PDF，uhlik 2025-12 说以后会出（[3627587](https://boardgamegeek.com/thread/3627587)）。
- **第二个扩展：截至 2026-11 未宣布**（[3780964](https://boardgamegeek.com/thread/3780964)、[3712671](https://boardgamegeek.com/thread/3712671)、[3638895](https://boardgamegeek.com/thread/3638895)）。

### 7.2 促销卡

| 卡 | 编号 | 来源 |
|---|---|---|
| Pluto | SE EN 01 | SPIEL 2024；官方 FAQ 有专条 |
| Gateway to Mars | SE EN 02 | 2025 Dice Tower 礼包 |
| Space Agencies 预购卡 | SE EN 03 | 预购扩展 |
| DLR | — | SPIEL 2025 |
| Drake Equation | — | Gen Con 2026 |

### 7.3 官方 FAQ

- [Official FAQ + cards clarification](https://boardgamegeek.com/thread/3392878)：CGE 2024-10-24 开帖，最后编辑 2025-11-11，126 帖，119 赞。
  - 分节：行动、登陆、扫描、分析数据、探测器、科技、任务、里程碑、金色板块、外星种族、卡牌、单人模式、逐卡说明（基础卡、外星卡、促销卡）。
- PDF 版（2024-11-19）：[彩色版](https://boardgamegeek.com/filepage/289979)，51 赞；[打印版](https://boardgamegeek.com/filepage/289980)，29 赞。**PDF 比帖子旧**，之后的修订只在帖子里。
- [种族规则页（英文）](https://boardgamegeek.com/filepage/292021)。
- 法文 FAQ 由 IELLO 提供（filepage 311886）。

### 7.4 勘误与印刷问题

- 科技板缺角方向印反（[3392400](https://boardgamegeek.com/thread/3392400)）。
- \#58、#60、#112 漏写“包括卫星”（官方 FAQ 致歉）。
- 官方 FAQ 自身的修正：#134 的“2 个信号”应为 1 个；#136 第二段是误粘贴，应删除（CGE 帖 45540201、46344060）。
- 扩展卡 ET.3 第一版印刷图标错误：应为六边形，表示“执行入轨或登陆动作”（扩展 FAQ）。
- 玩家助手卡写 “End of Round”，规则书写 “Between Rounds”（[3444223](https://boardgamegeek.com/thread/3444223)）。
- 规则书原话 “If you already meet the condition … complete it immediately” 有误导性（NIAC 裁定，见 §3.6）。
- 各语言版本的问题：
  - 西班牙 Devir 版勘误汇总：[3449218](https://boardgamegeek.com/thread/3449218)，95 帖，48 赞，持续更新到 2026-03-30。问题包括行星版图未翻译、科技区印反、缺卡等。
  - 法文规则：手牌上限译错（[3420063](https://boardgamegeek.com/thread/3420063)）。
  - IELLO 版 Pluto 促销卡译错（[3422220](https://boardgamegeek.com/thread/3422220)）。
  - 德文版终局卡没写“你的”（[3400750](https://boardgamegeek.com/thread/3400750)）。

### 7.5 规则书版本

依据 rbelikov 的逐页对比，[3597269](https://boardgamegeek.com/thread/3597269)（17 赞）。

| 版本 | 位置 | 说明 |
|---|---|---|
| (a) | CGE 官网，[seti-rules-en.pdf](https://filemanager.czechgames.com/storage/files/seti-search-for-extraterrestrial-intelligence/rules/seti-rules-en.pdf) | 最新文字版，但没有 (b) 的图形改动 |
| (b) | BGG [filepage 286198](https://boardgamegeek.com/filepage/286198)，`SETI-rulebook-EN-2024-09-17.pdf`，109 赞 | 有小的图形更新 |
| (c) | BGG 上无图形更新的 web 版 | — |
| (d) | 首印实体书，末页序列号 11733971/NOK240576 | 据推测与 (c) 相同 |

版本 (a) 新增的澄清：
- p.3 部件表加了 ‘Oumuamua 板块；
- p.6 塞牌可选；
- p.12 用图定义“地球所在扇区”，并加了“随后补卡列”一句；
- p.13 标信号是强制的；
- p.14 卡牌只算你自己的东西；
- p.16 圆盘一律逆时针转一个扇区；
- p.19 轮中没有手牌上限；
- p.21 只计你自己的套数；
- p.22 单人开局顺序调整；
- p.26 Rival pass 时洗牌。

---

## 8. 外星种族

### 8.1 基础版

- 共 **5 个种族**：**Mascamites、Exertians、Centaurians、Anomalies、'Oumuamua**。
- **每局随机抽 2 个**，背面朝上放，其余 3 个不看直接放回盒子（rulespal 转录的规则书）。
- **发现方式**
  - 种族板下方有 3 个“发现格”，全部被占满时，该种族被发现。2–3 人局里中立标记也能占格。
  - 在回合结束、里程碑结算之后翻面，读该种族的规则页，执行该种族的开局摆放。
  - 占了发现格的玩家拿奖励：每格 5 分 + 1 宣传；通常还按自己占的格数拿该种族的卡。
- **痕迹**
  - 三色：粉 / 红来自扫描赢扇区，黄来自登陆，蓝来自分析数据（颜色叫法来自论坛和 FAQ）。
  - 痕迹可以标在任一种族板上任意空的同色格，**不必自下而上**。
  - 发现格和溢出格都算该种族的痕迹（官方 FAQ）。
  - 只有占发现格的玩家拿奖励，溢出格不拿（官方 FAQ）。
- **种族自身的问题**：一个种族就占 Rules 区 12–23 个主题。另有“种族规则页下载”需求（[3419516](https://boardgamegeek.com/thread/3419516)），以及“教学时要不要把 5 个种族都学一遍”的讨论（[3646755](https://boardgamegeek.com/thread/3646755)，27 帖）。

### 8.2 各种族最常被问的问题

**Exertians**（约 23 个主题，最多；Strategy 区还有 108 帖的 [Are the Exertians a flawed design?](https://boardgamegeek.com/thread/3431080)）
- 全员危险值为 0 时谁扣分 → CGE：0 危险者不扣分（[3441681](https://boardgamegeek.com/thread/3441681)）。
- 终局计分越过里程碑还能打卡吗 → 不能（[3494193](https://boardgamegeek.com/thread/3494193)）。
- 再次越过同一个里程碑能否再打 → 每个里程碑只能用一次；里程碑对应的是固定分值，不是轨道位置（[3620577](https://boardgamegeek.com/thread/3620577)）。
- 打出的卡没达成条件，危险值照样计入（[3466210](https://boardgamegeek.com/thread/3466210)）。
- 发现后各人出牌顺序 → **无官方答复**，社区有同时出牌和按顺序出牌两种做法（[3447520](https://boardgamegeek.com/thread/3447520)，7 赞）。
- 越过里程碑时没钱支付就打不了，不能事后补付（[3542718](https://boardgamegeek.com/thread/3542718)）。
- Exertian 卡不算任务，也不算终局卡；不能被弃掉；不计入手牌上限。

**Centaurians**（约 16 个主题）
- 打出信息卡后在分数轨前方 15 分处放标记，到达时结算卡的绿色部分。多个标记按打出的先后顺序结算（[3478445](https://boardgamegeek.com/thread/3478445)，[3427822](https://boardgamegeek.com/thread/3427822) 解释了 “+15”）。
- 到达标记是立即结算还是回合结束结算 → 无官方答复，社区多为立即（[3666658](https://boardgamegeek.com/thread/3666658)）。
- 终局计分时越过不触发（CGE；[3439450](https://boardgamegeek.com/thread/3439450)）。
- Centaurians 卡不算任务（官方 FAQ）。

**'Oumuamua**（约 19 个主题）
- 板块位置：木星顺时针方向第二格，有对应的拼图边（[3464568](https://boardgamegeek.com/thread/3464568)）。
- 外化石（exofossil）不能兑换资源，终局也不计分（官方 FAQ）。
- 在 ‘Oumuamua 板块上标信号，算不算“该扇区的信号”（如与 #120 Lagrange 的配合）→ 有争议，无官方答复（[3538344](https://boardgamegeek.com/thread/3538344)）。
- 单人 Rival 怎样扫 ‘Oumuamua（官方 FAQ）。

**Mascamites**（约 13–18 个主题）
- 登陆木星或土星的**卫星**能否取样本 → 能，CGE 也确认卡牌可以用来登陆任何行星，但只有木星、土星（及其卫星）才有样本（[3466813](https://boardgamegeek.com/thread/3466813)、[3383049](https://boardgamegeek.com/thread/3383049)）。
- 样本胶囊要送到地球，部分卡是送到火星；送达后可以晚些再完成任务（官方 FAQ）。
- 胶囊刚出现在宣传图标格上不给宣传（[3555595](https://boardgamegeek.com/thread/3555595)）。
- 两个胶囊任务只送达一个胶囊时，只能完成其中一个（[3439977](https://boardgamegeek.com/thread/3439977)）。
- 有主题直接叫 “Mascamites are too complicated for me”（[3458463](https://boardgamegeek.com/thread/3458463)）。

**Anomalies**（约 12 个主题）
- 异常标记不能盖住天王星、海王星、彗星（[3496498](https://boardgamegeek.com/thread/3496498)、[3380819](https://boardgamegeek.com/thread/3380819)）。
- “下一个触发的异常”指从地球沿逆时针方向最近的那个；触发时比较谁在该颜色上的痕迹最高（官方 FAQ 单人 S.16）。
- ET.20 计分与扇区完成的先后：先得分，再结算扇区（官方 FAQ）。
- 达到手牌上限时还能否拿 Anomalies 卡（[3744503](https://boardgamegeek.com/thread/3744503)）。

**跨种族通用问题**
- “抽一张外星卡”图标只指本种族（[3418340](https://boardgamegeek.com/thread/3418340)，32 帖，规则页没写明）。
- 分数轨上的外星人头像只是中立里程碑标记，不给外星卡（[3466390](https://boardgamegeek.com/thread/3466390)）。
- 多个种族的里程碑同时触发时谁先结算（[3542718](https://boardgamegeek.com/thread/3542718)）。

---

## 9. 开局摆放易错点

1. **太阳系圆盘**：扇区线必须对齐；要么用官方随机网页，要么自己随机（[3621364](https://boardgamegeek.com/thread/3621364)）。
2. **科技板块**：不论人数，每种 4 块洗混，最上面放 2 分标记。不要按人数减少（[3605217](https://boardgamegeek.com/thread/3605217)；2 人局摆错导致的误会见 [3634135](https://boardgamegeek.com/thread/3634135)）。
3. **科技板块朝向**：奖励面朝上，不要照着印错的缺角方向放（[3392400](https://boardgamegeek.com/thread/3392400)）。
4. **中立里程碑**

   | 人数 | 20 分格上方 | 30 分格上方 |
   |---|---|---|
   | 1–2 人 | 2 个 | 2 个 |
   | 3 人 | 1 个 | 1 个 |
   | 4 人 | 不放 | 不放 |

   单人模式按 2 人局设置。有人以为 2 人局“没有特殊规则”（[3487882](https://boardgamegeek.com/thread/3487882)），漏了这一条。
5. **轮末牌**：4 叠，每叠张数 = 人数 + 1。
6. **外星种族**：随机抽 2 个，背面朝上，不要偷看剩下 3 个。
7. **金色计分板块**：4 块都放，随机朝向（[3507914](https://boardgamegeek.com/thread/3507914)）。
8. **‘Oumuamua 板块**：开局放进版图上对应的拼图位置（[3464568](https://boardgamegeek.com/thread/3464568)）。
9. **起始资源**：4 宣传、4 信用、3 能量、5 张手牌，然后**塞 1 张牌到收入并立刻拿该资源**（[3449998](https://boardgamegeek.com/thread/3449998)）。后手玩家起始分略高，作为先后手补偿。
10. **起始收入**：按惯例同时选。
11. **用扩展机构时**：机构取代起始收入卡，只玩 4 轮，Quick Start 卡的处理见扩展 FAQ。
12. **单人模式**：按 2 人局设置；Rival 不用收入卡；先选难度，再放进度标记（2025 版规则书 p.22 调整过顺序）。

---

## 10. 对“线下助手”站的启示（供做 / 不做清单参考，非结论）

**社区痛点强、适合线上化**
- 太阳系旋转提示：下一次转第几层，本轮第一个 pass 的人转了没有，研究科技先转。
- 每轮流程清单：pass 的 3 步、两轮之间的 3 步、第 5 轮不拿收入。
- 金色里程碑和金色板块提示：标记不得分。
- 终局计分器：只有 1 份计分表（17 赞），官方没有计分 App，是空白。
- 种族揭示后的规则提示：种族是第二大提问类别，规则页分散。
- 开局清单：中立里程碑和轮末牌数按人数变化，科技不按人数减。
- 规则 FAQ：官方 FAQ 很长，社区自制的“4 页精简 FAQ”“教学讲稿”都有人要。

**已有成熟工具，不必重复**
- 太阳系随机摆放：官方网页。
- 单人 Rival：brdgm.me，开源 PWA，95 赞。
- 卡牌查询：seti.ender-wiggin.com。

**没有官方答复、要标明“无定论”的**
- Exertians 发现后出牌顺序。
- Centaurians 标记是立即结算还是回合结束结算。
- ‘Oumuamua 上的信号算不算扇区内信号。

**正在变化的**：移动点不能存是 2025-12 才裁定的，旧教学视频和攻略多是错的。
