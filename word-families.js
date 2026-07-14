// ============================================================
// 词根家族图谱 — 基于词根词缀的关联词网络
// 收录 30+ 核心词根，覆盖 500 词库中的关联词
// ============================================================

const ROOT_FAMILIES = {
  // ── spect/spic (看) ──
  'spect-看': {
    root: 'spect / spic = 看',
    words: {
      expect:   { prefix:'ex- = 出',   hint:'看出来 → 预期' },
      suspect:  { prefix:'sus- = 下',  hint:'往下看(不信任) → 怀疑' },
    },
  },
  // ── duct/duc (引导) ──
  'duct-引导': {
    root: 'duct / duc = 引导',
    words: {
      reduce:   { prefix:'re- = 回',   hint:'往回引导 → 减少' },
      introduce:{ prefix:'intro- = 入',hint:'引入 → 介绍' },
      conduct:  { prefix:'con- = 一起',hint:'引导大家一起 → 实施/行为' },
      produce:  { prefix:'pro- = 前',  hint:'向前引出 → 生产' },
    },
  },
  // ── pos/pon (放) ──
  'pos-放': {
    root: 'pos / pon = 放',
    words: {
      suppose:  { prefix:'sup- = 下',  hint:'放在下面(作假设) → 假设' },
      purpose:  { prefix:'pur- = 前',  hint:'放在前面的 → 目的' },
      oppose:   { prefix:'op- = 对面', hint:'放在对面 → 反对' },
      impose:   { prefix:'im- = 上',   hint:'放在上面 → 强加' },
      expose:   { prefix:'ex- = 出',   hint:'放出来 → 暴露' },
    },
  },
  // ── mit/miss (送) ──
  'mit-送': {
    root: 'mit / miss = 送',
    words: {
      admit:    { prefix:'ad- = 到',   hint:'送到 → 承认/准入' },
      mission:  { prefix:'miss = 送',  hint:'被送出去的任务 → 使命' },
      promise:  { prefix:'pro- = 前',  hint:'提前送出 → 承诺' },
      dismiss:  { prefix:'dis- = 离开',hint:'送走 → 解雇/不予考虑' },
    },
  },
  // ── tain/ten (拿/持) ──
  'tain-持': {
    root: 'tain / ten = 拿住、保持',
    words: {
      maintain: { prefix:'main = 手',  hint:'用手拿住 → 维持' },
      obtain:   { prefix:'ob- = 靠近', hint:'靠近拿到 → 获得' },
      contain:  { prefix:'con- = 一起',hint:'拿在一起 → 包含' },
      sustain:  { prefix:'sus- = 下',  hint:'从下面拿住 → 支撑' },
    },
  },
  // ── tend/tens (伸展) ──
  'tend-伸展': {
    root: 'tend / tens = 伸展',
    words: {
      extend:   { prefix:'ex- = 出',   hint:'伸出去 → 延伸' },
      intend:   { prefix:'in- = 向',   hint:'把注意力伸向 → 打算' },
      pretend:  { prefix:'pre- = 前',  hint:'在面前展开假象 → 假装' },
      tend:     { prefix:'-',          hint:'朝着某个方向伸展 → 倾向于' },
      intense:  { prefix:'in- = 进入', hint:'伸入很深的 → 强烈的' },
      attend:   { prefix:'at- = 到',   hint:'伸展过去 → 参加/注意' },
    },
  },
  // ── sist/stat/st (站) ──
  'sist-站': {
    root: 'sist / stat / st = 站立',
    words: {
      insist:   { prefix:'in- = 上',   hint:'站在上面不动 → 坚持' },
      consist:  { prefix:'con- = 一起',hint:'站在一起 → 由…组成' },
      exist:    { prefix:'ex- = 出',   hint:'站出来 → 存在' },
      establish:{ prefix:'e- = 使',    hint:'使站立起来 → 建立' },
      constant: { prefix:'con- = 一起',hint:'一直站着的 → 不变的' },
      resist:   { prefix:'re- = 回',   hint:'往回站 → 抵抗' },
      assist:   { prefix:'as- = 到',   hint:'站到旁边 → 帮助' },
    },
  },
  // ── ced/ceed/cess (走) ──
  'cess-走': {
    root: 'ced / ceed / cess = 走',
    words: {
      access:   { prefix:'ac- = 到',   hint:'走到 → 进入/访问' },
      succeed:  { prefix:'suc- = 下',  hint:'走下去 → 成功/继承' },
      process:  { prefix:'pro- = 前',  hint:'往前走 → 过程/处理' },
      exceed:   { prefix:'ex- = 超出', hint:'走出去 → 超过' },
      proceed:  { prefix:'pro- = 前',  hint:'往前走 → 继续进行' },
    },
  },
  // ── vert/vers (转) ──
  'vers-转': {
    root: 'vert / vers = 转',
    words: {
      conversation:{prefix:'con- = 一起',hint:'一起转过来 → 对话'},
      reverse:  { prefix:'re- = 回',   hint:'转回去 → 反转' },
      diverse:  { prefix:'di- = 分开', hint:'分开转 → 多样的' },
      version:  { prefix:'vers = 转',  hint:'转换出来的 → 版本' },
    },
  },
  // ── pend/pens (悬挂/称重) ──
  'pend-悬挂': {
    root: 'pend / pens = 悬挂、称重',
    words: {
      depend:   { prefix:'de- = 下',   hint:'挂在下面 → 依赖' },
      suspend:  { prefix:'sus- = 下',  hint:'挂在下面 → 暂停' },
      expense:  { prefix:'ex- = 出',   hint:'称出去的 → 花费' },
    },
  },
  // ── form (形状) ──
  'form-形状': {
    root: 'form = 形状',
    words: {
      perform:  { prefix:'per- = 完全',hint:'完全成形 → 执行/表演' },
      reform:   { prefix:'re- = 再',   hint:'重新塑形 → 改革' },
      transform:{ prefix:'trans- = 穿越',hint:'改变形状 → 转变' },
      inform:   { prefix:'in- = 进入', hint:'给信息赋予形状 → 告知' },
      formal:   { prefix:'form = 形状',hint:'有形状的 → 正式的' },
      former:   { prefix:'form = 形状',hint:'之前成形的 → 以前的' },
    },
  },
  // ── press (压) ──
  'press-压': {
    root: 'press = 压',
    words: {
      impress:  { prefix:'im- = 进',   hint:'压进心里 → 留下印象' },
      express:  { prefix:'ex- = 出',   hint:'压出来 → 表达' },
      pressure: { prefix:'press = 压', hint:'压在上面的 → 压力' },
    },
  },
  // ── vid/vis (看) ──
  'vid-看': {
    root: 'vid / vis = 看',
    words: {
      provide:  { prefix:'pro- = 前',  hint:'提前看到并准备 → 提供' },
      evidence: { prefix:'e- = 出',    hint:'能看出来 → 证据' },
      advise:   { prefix:'ad- = 向',   hint:'向…看 → 建议' },
      revise:   { prefix:'re- = 再',   hint:'再看一遍 → 修改' },
    },
  },
  // ── struct (建造) ──
  'struct-建造': {
    root: 'struct = 建造',
    words: {
      construct:   { prefix:'con- = 一起',hint:'建到一起 → 建造' },
      destroy:     { prefix:'de- = 相反', hint:'和建造相反 → 破坏' },
      instruct:    { prefix:'in- = 进入', hint:'把知识建进去 → 教导' },
      construction:{ prefix:'con- = 一起',hint:'建造 → 建筑' },
    },
  },
  // ── tract (拉) ──
  'tract-拉': {
    root: 'tract = 拉',
    words: {
      attract:  { prefix:'at- = 到',   hint:'拉到 → 吸引' },
      contract: { prefix:'con- = 一起',hint:'拉到一起 → 合同/收缩' },
      distract: { prefix:'dis- = 分开',hint:'把注意力拉开 → 分心' },
    },
  },
  // ── scrib/script (写) ──
  'scribe-写': {
    root: 'scrib / script = 写',
    words: {
      describe:    { prefix:'de- = 下',   hint:'写下来 → 描述' },
      description: { prefix:'de- = 下',   hint:'写下来的东西 → 描述(n.)' },
      prescribe:   { prefix:'pre- = 前',  hint:'提前写好 → 开药方/规定' },
    },
  },
  // ── ven/vent (来) ──
  'ven-来': {
    root: 'ven / vent = 来',
    words: {
      convenient: { prefix:'con- = 一起',hint:'一起来的(顺手) → 方便的' },
      prevent:    { prefix:'pre- = 前',   hint:'提前来阻挡 → 阻止' },
      event:      { prefix:'e- = 出',     hint:'出来的事 → 事件' },
      invent:     { prefix:'in- = 进入',  hint:'走进来 → 发明' },
      adventure:  { prefix:'ad- = 到',    hint:'来到冒险 → 冒险' },
    },
  },
  // ── volv/volut (卷/转) ──
  'volve-卷': {
    root: 'volv / volut = 卷、转',
    words: {
      involve: { prefix:'in- = 进入',hint:'卷入 → 涉及/包含' },
      evolve:  { prefix:'e- = 出',   hint:'卷出来 → 进化/发展' },
    },
  },
  // ── serv (服务/保持) ──
  'serve-服务': {
    root: 'serv = 服务、保持',
    words: {
      observe: { prefix:'ob- = 向',   hint:'看向 → 观察' },
      deserve: { prefix:'de- = 完全', hint:'完全服务 → 值得' },
      reserve: { prefix:'re- = 回',   hint:'保留回去 → 预订' },
      preserve:{ prefix:'pre- = 前',  hint:'提前保存 → 保护' },
    },
  },
  // ── fer (携带) ──
  'fer-携带': {
    root: 'fer = 携带、承载',
    words: {
      prefer:  { prefix:'pre- = 前',  hint:'带到前面 → 更喜欢' },
      suffer:  { prefix:'suf- = 下',  hint:'被迫携带重物 → 受苦' },
      refer:   { prefix:'re- = 回',   hint:'带回去 → 参考/提及' },
      transfer:{ prefix:'trans- = 穿越',hint:'从一处带到另一处 → 转移' },
      offer:   { prefix:'of- = 向',   hint:'带向 → 提供' },
      differ:  { prefix:'dif- = 分开',hint:'分开带 → 不同' },
    },
  },
  // ── cap/cept/ceive (拿) ──
  'cap-拿': {
    root: 'cap / cept / ceive = 拿、抓住',
    words: {
      capable: { prefix:'cap = 拿',   hint:'能拿住的 → 有能力的' },
      capture: { prefix:'capt = 拿',  hint:'拿住 → 捕获' },
      accept:  { prefix:'ac- = 到',   hint:'拿到 → 接受' },
      receive: { prefix:'re- = 回',   hint:'拿回来 → 收到' },
      concept: { prefix:'con- = 一起',hint:'一起拿住的 → 概念' },
    },
  },
  // ── val/vail (价值/强) ──
  'val-价值': {
    root: 'val / vail = 价值、力量',
    words: {
      value:      { prefix:'val = 价值',hint:'价值 → 重视/价值' },
      valid:      { prefix:'val = 强',  hint:'强有效的 → 有效的' },
      available:  { prefix:'a- = 到',   hint:'有价值的可用的 → 可用的' },
      evaluate:   { prefix:'e- = 出',   hint:'把价值算出来 → 评估' },
    },
  },
  // ── rupt (打破) ──
  'rupt-打破': {
    root: 'rupt = 打破、断裂',
    words: {
      interrupt:{ prefix:'inter- = 之间',hint:'在中间打断 → 打断' },
      disrupt:  { prefix:'dis- = 分开',  hint:'分开打破 → 扰乱' },
      bankrupt: { prefix:'bank = 银行',  hint:'银行破裂 → 破产' },
    },
  },
  // ── grad/gress (步/走) ──
  'grad-步': {
    root: 'grad / gress = 步、走',
    words: {
      gradually: { prefix:'grad = 步', hint:'一步步 → 逐渐' },
      progress:  { prefix:'pro- = 前',hint:'向前走 → 进展' },
    },
  },
  // ── cre/creas (增长) ──
  'cre-增长': {
    root: 'cre / creas = 增长、产生',
    words: {
      increase: { prefix:'in- = 进',   hint:'增长 → 增加' },
      decrease: { prefix:'de- = 下',   hint:'降下来 → 减少' },
      create:   { prefix:'cre = 产生', hint:'产生 → 创造' },
      concrete: { prefix:'con- = 一起',hint:'长到一起 → 具体的' },
    },
  },
  // ── fin (界限) ──
  'fin-界限': {
    root: 'fin = 界限、结束',
    words: {
      define:     { prefix:'de- = 完全',hint:'完全划界限 → 定义' },
      definition: { prefix:'de- = 完全',hint:'界限 → 定义(n.)' },
      definite:   { prefix:'de- = 完全',hint:'有界限的 → 明确的' },
      final:      { prefix:'fin = 结束',hint:'结束 → 最终的' },
      finish:     { prefix:'fin = 结束',hint:'结束 → 完成' },
    },
  },
  // ── gen/gener (产生/出生) ──
  'gen-产生': {
    root: 'gen / gener = 产生、出生、种类',
    words: {
      generate:  { prefix:'gener = 产生',hint:'产生 → 生成' },
      general:   { prefix:'gener = 种类',hint:'关于种类的 → 一般的' },
      generous:  { prefix:'gener = 出生',hint:'出身高贵 → 慷慨的' },
      genuine:   { prefix:'gen = 出生',   hint:'天生的 → 真正的' },
    },
  },
  // ── mov/mot (动) ──
  'mot-动': {
    root: 'mov / mot = 动',
    words: {
      promote: { prefix:'pro- = 前',  hint:'向前推动 → 促进/晋升' },
      remove:  { prefix:'re- = 回',   hint:'移回去 → 移除' },
      motion:  { prefix:'mot = 动',   hint:'动 → 运动/动议' },
      emotion: { prefix:'e- = 出',    hint:'动出来的 → 情感' },
    },
  },
  // ── not (知道) ──
  'not-知道': {
    root: 'not = 知道、标记',
    words: {
      notice: { prefix:'not = 知道',hint:'知道 → 注意到' },
      notion: { prefix:'not = 知道',hint:'知道的东西 → 概念/想法' },
    },
  },
  // ── part/port (部分/携带) ──
  'port-携带': {
    root: 'port = 携带、运送',
    words: {
      support:   { prefix:'sup- = 下',  hint:'从下面扛着 → 支持' },
      transport: { prefix:'trans- = 穿越',hint:'从一处运到另一处 → 运输' },
      import:    { prefix:'im- = 进',   hint:'带进来 → 进口' },
      export:    { prefix:'ex- = 出',   hint:'带出去 → 出口' },
      report:    { prefix:'re- = 回',   hint:'带回去 → 报告' },
    },
  },
  // ── sens/sent (感觉) ──
  'sens-感觉': {
    root: 'sens / sent = 感觉',
    words: {
      sensitive:{ prefix:'sens = 感觉',hint:'能感觉的 → 敏感的' },
      sense:    { prefix:'sens = 感觉',hint:'感觉 → 感觉/意义' },
      consent:  { prefix:'con- = 共同',hint:'共同感觉 → 同意' },
    },
  },
};

// ── 查找某词所属的词族 ──
function findRootFamily(word) {
  for (const [familyName, family] of Object.entries(ROOT_FAMILIES)) {
    if (word in family.words) return { name: familyName, ...family };
  }
  return null;
}

// ── 查找某词的所有关联词 ──
function getRelatedWords(word) {
  const family = findRootFamily(word);
  if (!family) return [];
  return Object.entries(family.words)
    .filter(([w]) => w !== word)
    .map(([w, info]) => ({ word: w, ...info }));
}

// ── 渲染词族图谱 HTML ──
function renderWordFamilyHTML(word) {
  const family = findRootFamily(word);
  if (!family) return '';

  const entries = Object.entries(family.words);
  const others = entries.filter(([w]) => w !== word);

  if (others.length === 0) return '';

  let html = '<div class="word-family"><div class="wf-title">🧬 ' + family.root + '</div><div class="wf-tree">';

  // Current word (highlighted)
  const curInfo = family.words[word];
  html += '<div class="wf-node current"><span class="wf-word">' + word + '</span><span class="wf-prefix">' + (curInfo ? curInfo.prefix : '') + '</span><span class="wf-hint">' + (curInfo ? curInfo.hint : '') + ' ← 当前词</span></div>';

  // Related words
  for (const [w, info] of others) {
    html += '<div class="wf-node"><span class="wf-word">' + w + '</span><span class="wf-prefix">' + info.prefix + '</span><span class="wf-hint">' + info.hint + '</span></div>';
  }

  html += '</div></div>';
  return html;
}
