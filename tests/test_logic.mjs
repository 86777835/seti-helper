// Unit tests for public/logic.js and public/steps.js (no server needed). Usage: node tests/test_logic.mjs
import { initialState, reduce, results, parts, allParts, turnOrder, passers, goldAllowed, gameRecord, firstRound, RIVAL } from '../public/logic.js';
import { setupList, passSteps, betweenRounds, dontForget, SPECIES_INFO, speciesOrder } from '../public/steps.js';

let fails = 0;
const eq = (name, got, want) => { const ok = JSON.stringify(got) === JSON.stringify(want); if (!ok) fails++; console.log(ok ? 'PASS' : 'FAIL', name, ok ? '' : `got ${JSON.stringify(got)} want ${JSON.stringify(want)}`); };
const run = (s, ...acts) => acts.reduce((x, a) => { const y = reduce(x, a); if (!y) throw new Error('rejected ' + JSON.stringify(a)); return y; }, s);
const text = items => items.map(i => i.t).join(' ');

// setup
let S = initialState();
S = run(S, { t: 'setN', n: 3 }, { t: 'first', id: 'purple' });
eq('turn order from start player', turnOrder(S), ['purple', 'orange', 'green']);
eq('order rotates each round', turnOrder(S, 2), ['orange', 'green', 'purple']);
eq('org needs the expansion', reduce(S, { t: 'opt', key: 'org', on: true }), null);
S = run(S, { t: 'opt', key: 'sa', on: true }, { t: 'opt', key: 'org', on: true });
eq('org: first round is 2', firstRound(S), 2);
const sl = setupList(S, id => id);
eq('3p neutral milestones: 1 each', text(sl[0].items).includes('各放 <b>1 个</b>'), true);
eq('org: 3 stacks of end-of-round cards', text(sl[0].items).includes('<b>3 叠</b>，每叠 <b>4 张</b>'), true);
eq('org: publicity starts at 0', text(sl[1].items).includes('从 <b>0</b> 开始'), true);
S = run(S, { t: 'opt', key: 'sa', on: false });
eq('dropping the expansion drops org', S.org, false);
eq('base: 4 stacks', text(setupList(S)[0].items).includes('<b>4 叠</b>'), true);
eq('4p: no neutral milestones', text(setupList(run(S, { t: 'setN', n: 4 }))[0].items).includes('<b>不用</b>中立里程碑'), true);
eq('species list without expansion', speciesOrder(S).length, 5);
eq('color swap keeps start', run(S, { t: 'player', i: 0, color: 'white' }).start, 'purple');
S = run(S, { t: 'gold', tile: 'tech', face: 'a' }, { t: 'gold', tile: 'mission', face: 'b' }, { t: 'gold', tile: 'income', face: 'a' }, { t: 'gold', tile: 'other', face: 'b' });

// play: pass order, first pass, between rounds
S = run(S, { t: 'begin' });
eq('round 1', S.round, 1);
eq('cannot pass for another round', reduce(S, { t: 'pass', round: 2, id: 'green' }), null);
eq('first pass rotates', text(passSteps(S, true)).includes('转太阳系'), true);
eq('later passes do not', text(passSteps(S, false)).includes('转太阳系'), false);
S = run(S, { t: 'pass', round: 1, id: 'orange' }, { t: 'pass', round: 1, id: 'green' });
eq('cannot move on before all passed', reduce(S, { t: 'next', round: 1 }), null);
S = run(S, { t: 'pass', round: 1, id: 'purple' }, { t: 'next', round: 1 });
eq('round 2', S.round, 2);
eq('pass log', S.passLog, [['orange', 'green', 'purple']]);
S = run(S, { t: 'undo' });
eq('undo goes back to round 1, all passed', [S.round, S.passed.length], [1, 3]);
S = run(S, { t: 'next', round: 1 });
for (let r = 2; r <= 5; r++) S = run(S, ...['green', 'orange', 'purple'].map(id => ({ t: 'pass', round: r, id })), ...(r === 5 ? [] : [{ t: 'next', round: r }]));
eq('round 5 first pass still rotates and has no card', [text(passSteps(S, true)).includes('第 5 轮也要转'), text(passSteps(S, true)).includes('一轮结束牌里选')], [true, false]);
eq('no income after round 5', text(betweenRounds(S)).includes('不再拿收入'), true);
S = run(S, { t: 'next', round: 5 });
eq('game over', S.stage, 'over');

// species
S = run(S, { t: 'found', k: 'exertians' }, { t: 'found', k: 'anomalies' });
eq('only two species', reduce(S, { t: 'found', k: 'mascamites' }), null);
eq('expansion species need the expansion', reduce(run(S, { t: 'found', k: 'anomalies' }), { t: 'found', k: 'glyphids' }), null);
eq('anomalies add a rotation check', text(passSteps(S, true)).includes('异常点'), true);
eq('exertians in dont-forget', text(dontForget(S)).includes('钻探者'), true);
eq('every species has notes', Object.values(SPECIES_INFO).every(i => i.setup.length && i.rules.length), true);

// scoring: gold tiles, exertians danger
const sc = (id, key, value) => ({ t: 'score', id, key, value });
S = run(S,
  sc('green', 'track', '80'), sc('green', 'cards', [4, 6]), sc('green', 'techP', 1), sc('green', 'techN', '2'), sc('green', 'otherP', 2), sc('green', 'otherN', '3'), sc('green', 'danger', '9'), sc('green', 'ex', [5]),
  sc('orange', 'track', '90'), sc('orange', 'missionP', 1), sc('orange', 'missionN', '3'), sc('orange', 'danger', '9'),
  sc('purple', 'track', '60'), sc('purple', 'danger', '2'));
const P = allParts(S);
eq('green: 80 + 10 cards + tech 11×2 + other 6×3 + 5 exertian = 135, minus 13', [P.green.sub, P.green.minus, P.green.total], [135, 13, 122]);
eq('orange: 90 + mission 8×3 = 114, tied danger also loses 11', [P.orange.sub, P.orange.minus, P.orange.total], [114, 11, 103]);
eq('purple keeps all', [P.purple.minus, P.purple.total], [0, 60]);
const R = results(S);
eq('ranking', R.rows.map(r => [r.id, r.place]), [['green', 1], ['orange', 2], ['purple', 3]]);
S = run(S, sc('green', 'danger', '0'), sc('orange', 'danger', '0'), sc('purple', 'danger', '0'));
eq('nobody loses when the most danger is 0', Object.values(allParts(S)).map(p => p.minus), [0, 0, 0]);
eq('gold allowed by score', [goldAllowed(24), goldAllowed(25), goldAllowed(69), goldAllowed(140)], [0, 1, 2, 3]);
eq('invalid gold slot rejected', reduce(S, sc('green', 'techP', 4)), null);
eq('bad number makes parts null', parts(run(S, sc('green', 'track', 'x')), 'green'), null);
const T = run(S, sc('green', 'track', '100'), sc('orange', 'track', '76'), sc('green', 'cards', []), sc('green', 'ex', []), sc('green', 'techN', '0'), sc('green', 'otherN', '0'));
eq('tie at the top shares first place', results(T).rows.filter(r => r.place === 1).length, 2);
eq('archive record', Object.keys(gameRecord(S)).sort(), ['exp', 'found', 'gid', 'gold', 'n', 'players', 'rival'].sort());

// solo: rival passes too, alternates start, scores objectives; glyphids
let O = run(initialState(), { t: 'setN', n: 1 }, { t: 'opt', key: 'sa', on: true }, { t: 'solo', first: 'rival', diff: 3 });
eq('solo setup mentions an advanced action card at 3 stars', text(setupList(O)[1].items).includes('高级行动牌'), true);
O = run(O, { t: 'begin' });
eq('solo passers', passers(O), ['green', RIVAL]);
eq('solo order alternates', [turnOrder(O, 1), turnOrder(O, 2)], [[RIVAL, 'green'], ['green', RIVAL]]);
eq('solo objectives between rounds', text(betweenRounds(O)).includes('消耗 1 个已完成的目标'), true);
O = run(O, { t: 'found', k: 'glyphids' }, { t: 'gold', tile: 'tech', face: 'b' },
  sc('green', 'track', '70'), sc('green', 'glyph', [5, 3, 1]), sc('green', 'techP', 2), sc('green', 'techN', '3'),
  sc(RIVAL, 'track', '75'), sc(RIVAL, 'obj', '2'), sc(RIVAL, 'glyphN', '4'));
const OP = allParts(O);
eq('solo player: 70 + glyphs 11+5+1 + tech 5×3 = 102', OP.green.total, 102);
eq('solo rival: 75 + 2×5 + 4×3 = 97', OP[RIVAL].total, 97);
eq('glyph set of 8 kinds is flagged as 0', allParts(run(O, sc('green', 'glyph', [8]))).green.glyph, 0);

console.log(fails ? `\n${fails} FAILED` : '\nALL PASS');
process.exit(fails ? 1 : 0);
