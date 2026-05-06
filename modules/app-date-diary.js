// 绾︿細绯荤粺涓庡叧绯绘棩璁?

const DATE_FAVOR_THRESHOLD = 50;
const DATE_EVENT_LIBRARY = {
    shared: [
        {
            id: 'recognized',
            title: '差点被认出来',
            desc: '附近有人多看了你们几眼，气氛忽然变得有点微妙。',
            tag: 'Unexpected',
            choices: [
                { id: 'play-cool', label: '装作没事继续聊', actionText: '我压低声音，像什么都没发生一样继续和你往下聊。' },
                { id: 'lean-in', label: '靠近一点挡一下', actionText: '我下意识朝你那边靠近了一点，替你挡住了外面的视线。' },
                { id: 'tease', label: '借机逗他一句', actionText: '我看着你笑了一下，说我们现在这样是不是更像在偷偷约会了。' }
            ]
        },
        {
            id: 'rain',
            title: '天气突然变了',
            desc: '风向一转，空气里开始带上很淡的湿意，像是随时会落雨。',
            tag: 'Weather Shift',
            choices: [
                { id: 'stay', label: '说还想再待一会', actionText: '我说没关系，我还想和你在这里再待一会。' },
                { id: 'shelter', label: '提议换到避风处', actionText: '我轻声提议，不如我们找个更安静也能避风的地方继续。' },
                { id: 'joke', label: '拿这事开个玩笑', actionText: '我笑着说，今晚连天气都像在给我们加一点戏。' }
            ]
        }
    ],
    beach: [
        {
            id: 'shore-photo',
            title: '海边的顺手一拍',
            desc: '浪声正好，光线也正好，像很适合留下今晚的一点痕迹。',
            tag: 'Beach Moment',
            choices: [
                { id: 'take-photo', label: '提议给他拍一张', actionText: '我举起手机，问你要不要让我给你拍一张。' },
                { id: 'joint-photo', label: '提议一起拍', actionText: '我看着你，说不如我们一起留一张今晚的照片。' },
                { id: 'skip-photo', label: '说记在心里就好', actionText: '我摇了摇头，说今晚这样记在心里其实也很好。' }
            ]
        }
    ],
    restaurant: [
        {
            id: 'dessert',
            title: '最后那道甜点',
            desc: '服务生把最后一道甜点端了上来，刚好停在你们之间。',
            tag: 'Table Talk',
            choices: [
                { id: 'share', label: '说一起分着吃', actionText: '我把甜点往你那边轻轻推了推，说我们一起分掉吧。' },
                { id: 'offer-first', label: '先让他尝第一口', actionText: '我看着你，示意你先尝第一口。' },
                { id: 'tease-dessert', label: '顺手调侃他', actionText: '我忍不住笑着问你，原来你也会对这种甜的东西心软吗。' }
            ]
        }
    ],
    paddock: [
        {
            id: 'garage-call',
            title: '车库那边来消息了',
            desc: '你手机震了一下，像是车库那边临时发来了什么消息。',
            tag: 'Paddock Ping',
            choices: [
                { id: 'understand', label: '表示你先处理也没事', actionText: '我看着你，说没关系，你先看消息，我会等你。' },
                { id: 'stay-close', label: '开玩笑说我跟着你', actionText: '我半开玩笑地说，要不我干脆陪你一起去。' },
                { id: 'steal-moment', label: '说先把这一分钟留给我', actionText: '我轻声拦了你一下，说在你回那边之前，先把这一分钟留给我。' }
            ]
        }
    ]
};

const GROUP_DATE_MAX_PARTICIPANTS = 2;
const DATE_MIN_DIALOGUE_CHARS = 48;
const DATE_MAX_DIALOGUE_CHARS = 150;
const GROUP_DATE_MIN_DIALOGUE_CHARS = 28;
const GROUP_DATE_SCENES = [
    {
        id: 'night-market',
        name: '夜市',
        desc: '人声、灯牌和摊位气味全都挤在一起，很适合几个人边走边停，顺手把今晚聊热。',
        iconKey: 'spark'
    },
    {
        id: 'arcade',
        name: '游戏厅',
        desc: '电子音和按键声不停往耳边涌，输赢和起哄都来得很快，气氛也最容易自己动起来。',
        iconKey: 'chat'
    },
    {
        id: 'bowling',
        name: '保龄球馆',
        desc: '球道回响、分数屏和休息区的停顿会把几个人的节奏慢慢拢到一起，适合边玩边看彼此反应。',
        iconKey: 'heart'
    }
];
const GROUP_DATE_EVENT_LIBRARY = {
    shared: [
        {
            id: 'group-spotted',
            title: '差点被认出来',
            desc: '附近有人多看了你们几眼，原本很松的气氛一下子带了点小心翼翼。',
            tag: 'Unexpected',
            choices: [
                { id: 'laugh-through', label: '笑着继续往下走', actionText: '我看了看你们，说先当什么都没发生，继续往前走吧。' },
                { id: 'close-ranks', label: '让大家靠近一点', actionText: '我下意识朝你们那边靠近了一点，让这一小段路看起来更自然。' },
                { id: 'change-route', label: '提议换个方向', actionText: '我压低声音提议，先换个更安静一点的方向吧。' }
            ]
        },
        {
            id: 'group-detour',
            title: '有人突然起了个新主意',
            desc: '原本的路线聊着聊着被带偏了，气氛反而比刚刚更活一点。',
            tag: 'Detour',
            choices: [
                { id: 'follow-idea', label: '顺着新提议走', actionText: '我看着你们笑了一下，说那就顺着这个想法走吧。' },
                { id: 'tease-someone', label: '顺手逗一句带头的人', actionText: '我笑着点了点那个突然改主意的人，说你果然不会老老实实按原计划来。' },
                { id: 'hold-course', label: '说还是先按原计划来', actionText: '我想了想，还是说先把原本的安排走完，再看要不要临时拐出去。' }
            ]
        }
    ],
    'night-market': [
        {
            id: 'snack-split',
            title: '买什么忽然分成了两派',
            desc: '摊位前的香味已经飘过来了，但你们对先买什么忽然有了完全不同的意见。',
            tag: 'Night Market Split',
            choices: [
                { id: 'pick-favorites', label: '干脆一人挑一样', actionText: '我看着你们笑了一下，说不如一人挑一样，今晚反正就是出来乱吃的。' },
                { id: 'tease-the-leader', label: '先逗那个最坚持的人', actionText: '我偏头看向那个最坚持的人，故意问他是不是今晚打算把整条街都按自己的口味带着走。' },
                { id: 'walk-first', label: '说先再往前逛一段', actionText: '我把你们往前轻轻带了半步，说先别急，再往前看看，说不定后面还有更想吃的。' }
            ]
        }
    ],
    arcade: [
        {
            id: 'game-pick',
            title: '先玩什么忽然谁都不肯让',
            desc: '机器一排排亮着，结果你们在第一项到底玩什么上卡住了，谁都觉得自己的选择更对。',
            tag: 'Arcade Start',
            choices: [
                { id: 'call-the-shot', label: '你来直接拍板', actionText: '我往前走了一步，说别争了，这一轮先听我的，玩完再轮到你们。' },
                { id: 'make-it-a-challenge', label: '把选择变成一场小比赛', actionText: '我笑着说不如这样，谁先赢一局，下一项就听谁的。' },
                { id: 'watch-first', label: '先站旁边看一轮', actionText: '我抬了抬下巴，示意先别急着上手，先站旁边看一轮别人怎么打。' }
            ]
        }
    ],
    bowling: [
        {
            id: 'team-lineup',
            title: '分组这件事忽然认真起来了',
            desc: '分数屏刚亮起来，原本随口说的分组忽然多了点谁也不肯轻易认输的味道。',
            tag: 'Bowling Match',
            choices: [
                { id: 'pair-up-boldly', label: '你先指定搭档', actionText: '我看着你们俩，干脆先把搭档拍了板，说今晚先按这个组合来。' },
                { id: 'keep-it-loose', label: '说别太认真随便打', actionText: '我笑着把气氛往回按了一点，说只是出来玩，别一上来就搞得像真要分高下。' },
                { id: 'raise-the-stakes', label: '顺手给输的人加点小惩罚', actionText: '我眼尾带着笑，说既然都开始认真了，那输的人总得认一点小惩罚。' }
            ]
        }
    ]
};

let currentDateSelectionMode = 'single';

function normalizeDateReplyLayout(text = '') {
    const source = String(text || '')
        .replace(/\r\n?/g, '\n')
        .replace(/[ \t]+\n/g, '\n')
        .replace(/\n{3,}/g, '\n\n')
        .trim();
    if (!source) return [];
    const normalized = source.replace(/\(/g, '（').replace(/\)/g, '）');
    const lines = [];
    normalized.split(/\n+/).forEach(rawLine => {
        const line = rawLine.trim();
        if (!line) return;
        const parts = line.split(/(（[^（）\n]{1,220}）)/u).filter(Boolean);
        if (parts.length === 1) {
            lines.push(parts[0].trim());
            return;
        }
        parts.forEach(part => {
            const safePart = part.trim();
            if (!safePart) return;
            lines.push(safePart);
        });
    });
    return lines;
}

function getDateSceneAction(sceneId = '') {
    const actions = {
        beach: [
            '（他偏过脸看你，海风把额前碎发吹乱一点，脚步也跟着慢下来。）',
            '（他抬手压了下被风吹乱的发梢，视线落回你脸上时，脚步没再往前赶。）'
        ],
        restaurant: [
            '（他把指尖从杯沿上挪开，抬眼看你，桌面的暖光顺着眼尾落下来。）',
            '（他把杯子往旁边轻轻推了一点，靠回椅背时，视线却还停在你身上。）'
        ],
        paddock: [
            '（他侧过身站得离你近一点，耳边的广播声还没散干净，眼神却先落到了你这边。）',
            '（他把通行证随手按回外套上，脚步停住半拍，像是终于腾出空认真听你说话。）'
        ]
    };
    const pool = actions[sceneId] || actions.beach;
    return pool[Math.floor(Math.random() * pool.length)];
}

function extractDateHook(userText = '') {
    const raw = String(userText || '').trim();
    if (!raw) return { isQuestion: false, shortText: '' };
    const first = raw.split(/[。！？!?]/)[0].trim();
    return {
        isQuestion: /[?？]$/.test(raw),
        shortText: first.slice(0, 24)
    };
}

function buildSingleDateTone(driver) {
    const toneMap = {
        ver: { opener: ['你都这么说了，我再装没听见就太假了。', '你这句我听见了，所以我才停一下。'] },
        lec: { opener: ['你既然都开口了，我总得认真回你。', '你这句我听见了，所以我不想拿场面话糊弄。'] },
        nor: { opener: ['行，你都把话递过来了，我总不能装傻。', '你这句一出来，我当然会回。'] },
        pia: { opener: ['你都问到这了，我不回反而奇怪。', '你这句我听见了，所以我才停下来。'] },
        rus: { opener: ['你都把话递过来了，我总不能装没听见。', '你这句我听见了，所以我才认真回。'] },
        ham: { opener: ['你既然这么说了，我当然会认真接。', '你这句我听见了，所以我不想敷衍过去。'] }
    };
    return toneMap[driver?.id] || {
        opener: ['你都这么说了，我总得认真回一句。', '你这句我听见了，所以我才停下来。']
    };
}

function buildDateSceneFollow(sceneId = '', isQuestion = false) {
    const sceneMap = {
        beach: isQuestion
            ? ['你先别急着往前走，这句我先回你。', '风是有点大，不过不耽误我把这句说清楚。']
            : ['风有点大，不过你刚才那句我还是听清了。', '海边说话会慢一点，但不至于让我装没听见。'],
        restaurant: isQuestion
            ? ['你先别急着端杯子，这句我先回完。', '这里够安静，我反而更想把话说直接一点。']
            : ['这里安静，你刚才那句一出来我就听见了。', '坐下来以后，很多话反而更不好装作没事。'],
        paddock: isQuestion
            ? ['先别急着继续往前走，这句我先接一下。', '这边是有点吵，不过不耽误我先回你。']
            : ['这边声音是有点杂，但你刚才那句我还是听见了。', '围场里难得有这种能慢下来聊两句的时候。']
    };
    const pool = sceneMap[sceneId] || sceneMap.beach;
    return pool[Math.floor(Math.random() * pool.length)];
}

function buildDateFavorLine(favor = 0) {
    if (favor >= 75) {
        return [
            '你要是还想往下说，就继续，我会认真听。',
            '你这句我不会拿玩笑带过去。'
        ];
    }
    if (favor >= 45) {
        return [
            '你这句既然递过来了，我就认真回。',
            '你要是还想继续聊，我就在这儿听着。'
        ];
    }
    return [
        '我平时不一定会一下说很多，但这句我还是想接。',
        '我没打算敷衍你，所以才停下来回这句。'
    ];
}

function buildDateUserAvatarMarkup() {
    const avatarBg = getUserAvatarStyle();
    const fallback = escapeHtml(getUserAvatarFallbackText());
    return `<div class="date-message-avatar user"${avatarBg ? ` style="background-image:${avatarBg};background-size:cover;background-position:center;"` : ''}>${avatarBg ? '' : fallback}</div>`;
}

function buildDateDriverAvatarMarkup(driverId) {
    const driver = window.DRIVERS.find(item => item.id === driverId);
    const avatarBg = getDriverAvatarStyle(driverId);
    const fallback = escapeHtml(driver?.avatarLetter || 'DR');
    return `<div class="date-message-avatar bot"${avatarBg ? ` style="background-image:${avatarBg};background-size:cover;background-position:center;"` : ''}>${avatarBg ? '' : fallback}</div>`;
}

function buildGroupDateParticipantAvatarMarkup(driverId) {
    const driver = window.DRIVERS.find(item => item.id === driverId);
    const avatarBg = getDriverAvatarStyle(driverId);
    const fallback = escapeHtml(driver?.avatarLetter || 'DR');
    return `<div class="date-group-avatar"${avatarBg ? ` style="background-image:${avatarBg};background-size:cover;background-position:center;"` : ''} title="${escapeHtml(driver?.name || '')}">${avatarBg ? '' : fallback}</div>`;
}

function openDatePreparingModal({ sceneName = '', driverNames = [], isGroup = false } = {}) {
    const modal = document.getElementById('datePreparingModal');
    if (!modal) return;
    const kicker = document.getElementById('datePreparingKicker');
    const title = document.getElementById('datePreparingTitle');
    const meta = document.getElementById('datePreparingMeta');
    if (kicker) kicker.textContent = isGroup ? 'GROUP DATE PREPARING' : 'DATE PREPARING';
    if (title) title.textContent = isGroup ? '群约会正在准备中' : '约会正在准备中';
    if (meta) {
        const memberText = driverNames.length ? `参与成员：${driverNames.join('、')} · ` : '';
        meta.textContent = `${memberText}${sceneName || '今晚场景'} · 正在接通今晚的气氛`;
    }
    modal.style.display = 'flex';
}

function closeDatePreparingModal() {
    document.getElementById('datePreparingModal')?.style.setProperty('display', 'none');
}

function getDriverSceneAffinity(driver, sceneId) {
    const personality = String(window.DRIVER_PERSONALITIES?.[driver?.id]?.interests || '').toLowerCase();
    if (!driver || !sceneId) return 0;
    if (sceneId === 'paddock' && /technical|data|sim|engineering|cars|garage|setup|driving/.test(personality)) return 2;
    if (sceneId === 'beach' && /travel|music|fashion|photography|art|coffee/.test(personality)) return 2;
    if (sceneId === 'restaurant' && /food|coffee|fashion|music|friends|travel/.test(personality)) return 2;
    if (sceneId === 'night-market' && /food|friends|travel|music|fashion|coffee|social|humor|photography/.test(personality)) return 2;
    if (sceneId === 'arcade' && /games|gaming|sim|friends|humor|driving|competition|technical/.test(personality)) return 2;
    if (sceneId === 'bowling' && /friends|competition|fitness|sports|humor|social|travel/.test(personality)) return 2;
    return 0;
}

function getGroupDateDriverIds() {
    return (currentGroupDateDrivers || []).map(driver => driver?.id).filter(Boolean);
}

function getGroupDateKey(driverIds = []) {
    return [...driverIds].filter(Boolean).sort().join('__');
}

function maybeTriggerGroupDateEvent(drivers, scene) {
    return false;
}

function getGroupDateEventHistoryText() {
    return '无';
}

function getDateEventPool(sceneId) {
    return [...(DATE_EVENT_LIBRARY.shared || []), ...(DATE_EVENT_LIBRARY[sceneId] || [])];
}

function pickDateEvent(sceneId) {
    const used = new Set((dateEventHistory || []).map(item => item.id));
    const pool = getDateEventPool(sceneId);
    const freshPool = pool.filter(item => !used.has(item.id));
    const candidates = freshPool.length ? freshPool : pool;
    if (!candidates.length) return null;
    const picked = candidates[Math.floor(Math.random() * candidates.length)];
    return picked ? JSON.parse(JSON.stringify(picked)) : null;
}

function maybeTriggerDateEvent(driver, scene) {
    if (!driver || !scene || currentDateEvent) return false;
    if (currentRound < 1 || currentRound >= maxRounds - 1) return false;
    if (dateEventCooldown > 0) {
        dateEventCooldown -= 1;
        return false;
    }
    const triggerChance = currentRound <= 2 ? 0.58 : 0.38;
    if (Math.random() > triggerChance) return false;
    const picked = pickDateEvent(scene.id);
    if (!picked) return false;
    currentDateEvent = picked;
    dateEventHistory.push({
        id: picked.id,
        title: picked.title,
        desc: picked.desc,
        tag: picked.tag,
        round: currentRound,
        sceneId: scene.id,
        resolved: false
    });
    return true;
}

function getDateEventHistoryText() {
    const lines = (dateEventHistory || [])
        .slice(-3)
        .map(item => item?.resolved
            ? `${item.title}：用户选择了“${item.choiceLabel || '继续陪着你'}”。`
            : `${item.title}：你们刚刚遇到了这件小事。`);
    return lines.length ? lines.join('\n') : '无';
}

function fallbackDateReply(driver, scene, favor, normalHistory = [], dateHistory = [], options = {}) {
    const action = getDateSceneAction(scene?.id || '');
    const lastUser = [...dateHistory].reverse().find(item => item.role === 'user') || [...normalHistory].reverse().find(item => item.role === 'user');
    const hook = extractDateHook(lastUser?.content || '');
    const tone = buildSingleDateTone(driver);
    const opener = hook.shortText
        ? (hook.isQuestion
            ? '你刚才问的那句，我听见了。真要我现在回，我不会拿场面话糊弄你。'
            : '你刚才那句我听见了，所以我才停了一下。')
        : tone.opener[Math.floor(Math.random() * tone.opener.length)];
    const sceneFollow = buildDateSceneFollow(scene?.id || '', hook.isQuestion);
    const favorPool = buildDateFavorLine(favor);
    const favorLine = favorPool[Math.floor(Math.random() * favorPool.length)];
    const eventLead = options.eventContext ? '刚才那点小插曲过去了，反而更适合把话接下去。' : '';
    return [action, eventLead, opener, sceneFollow, favorLine].filter(Boolean).join('\n');
}

function fallbackGroupDateReply(driver, groupDrivers, scene, favor, groupHistory = [], options = {}) {
    if (window.GroupDateRuntime?.fallbackGroupDateReply) {
        return window.GroupDateRuntime.fallbackGroupDateReply(driver, groupDrivers, scene, favor, groupHistory, options);
    }
    return `（他偏过头看你，像是终于轮到自己把这句接住了。）\n你刚才那句我听见了。真要我现在回，我不会装没听见。`;
}

function fallbackGroupDateReplies(drivers, scene, groupHistory = [], options = {}) {
    if (window.GroupDateRuntime?.fallbackGroupDateReplies) {
        return window.GroupDateRuntime.fallbackGroupDateReplies(drivers, scene, groupHistory, options);
    }
    const selectedDrivers = Array.isArray(drivers) ? drivers.slice(0, 1) : [];
    return selectedDrivers.map(driver => ({
        speakerId: driver.id,
        content: fallbackGroupDateReply(driver, selectedDrivers, scene, favorability[driver.id] || 0, groupHistory, options)
    }));
}

function getDateDialogueOnlyText(text = '') {
    return normalizeDateReplyLayout(text)
        .filter(line => !/^（[^（）\n]{1,220}）$/u.test(line))
        .join('')
        .replace(/\s+/g, ' ')
        .trim();
}

function hasDateActionLine(text = '') {
    return normalizeDateReplyLayout(text).some(line => /^（[^（）\n]{1,220}）$/u.test(line));
}

const DATE_META_LEAK_PATTERN = /(system prompt|chain of thought|内部推理|推理过程|思考过程|<think>|只输出|直接输出|不要解释|不要写标题|我会这样回复|我要先回应|我要把这句接住)/i;
const DATE_WEIRD_PATTERN = /(至少现在这一刻|真正让我停下来|把这段气氛|把这段感觉|具体的存在感|把该说的东西说完整|对得起你刚刚|不是因为场景漂亮就够了|明明只是很普通的一段|轻飘飘的话|这种时候我不会|注意力留在了你和眼前这个场景上|我想把话说明白一点|我不会躲开|我会认真接住你这句|为什么继续说|为什么会开口)/i;

function isUsableDateReply(text = '') {
    const source = String(text || '').trim();
    if (!source) return false;
    if (DATE_META_LEAK_PATTERN.test(source) || DATE_WEIRD_PATTERN.test(source)) return false;
    const normalizedLines = normalizeDateReplyLayout(source);
    if (!normalizedLines.length) return false;
    if (!hasDateActionLine(source)) return false;
    const dialogue = getDateDialogueOnlyText(source);
    if (!dialogue) return false;
    const compactLength = dialogue.replace(/\s/g, '').length;
    if (compactLength < DATE_MIN_DIALOGUE_CHARS) return false;
    if (compactLength > DATE_MAX_DIALOGUE_CHARS) return false;
    return true;
}

function isUsableGroupDateReply(text = '', scene = null) {
    if (window.GroupDateRuntime?.isUsableGroupDateReply) {
        return window.GroupDateRuntime.isUsableGroupDateReply(text, scene);
    }
    const source = String(text || '').trim();
    if (!source) return false;
    if (!hasDateActionLine(source)) return false;
    const dialogue = getDateDialogueOnlyText(source);
    return dialogue.replace(/\s+/g, '').length >= GROUP_DATE_MIN_DIALOGUE_CHARS;
}

function ensureDateReplyText(text, driver, scene, favor, normalHistory = [], dateHistory = [], options = {}) {
    const source = String(text || '').trim();
    if (isUsableDateReply(source)) return source;
    return fallbackDateReply(driver, scene, favor, normalHistory, dateHistory, options);
}

function ensureGroupDateReplyText(text, driver, groupDrivers, scene, groupHistory = [], options = {}) {
    if (window.GroupDateRuntime?.ensureGroupDateReplyText) {
        return window.GroupDateRuntime.ensureGroupDateReplyText(text, driver, groupDrivers, scene, groupHistory, options);
    }
    const source = String(text || '').trim();
    if (isUsableGroupDateReply(source, scene)) return source;
    return fallbackGroupDateReply(driver, groupDrivers, scene, favorability[driver.id] || 0, groupHistory, options);
}

function ensureUsableGroupDateReplies(replies, drivers, scene, groupHistory = [], options = {}) {
    if (window.GroupDateRuntime?.ensureUsableGroupDateReplies) {
        return window.GroupDateRuntime.ensureUsableGroupDateReplies(replies, drivers, scene, groupHistory, options);
    }
    const normalized = Array.isArray(replies)
        ? replies.map(item => {
            const speakerId = item?.speakerId || item?.driverId;
            const driver = drivers.find(entry => entry.id === speakerId);
            if (!driver) return null;
            const content = String(item?.content || '').trim();
            return {
                speakerId: driver.id,
                content: isUsableGroupDateReply(content, scene)
                    ? content
                    : fallbackGroupDateReply(driver, drivers, scene, favorability[driver.id] || 0, groupHistory, options)
            };
        }).filter(Boolean)
        : [];
    return normalized.length ? normalized : fallbackGroupDateReplies(drivers, scene, groupHistory, options);
}

function getDriverNameMentions(name = '') {
    const normalized = String(name || '').trim();
    if (!normalized) return [];
    const parts = normalized.split(/\s+/).filter(Boolean);
    const last = parts[parts.length - 1];
    return [...new Set([normalized, last].filter(Boolean).map(item => item.toLowerCase()))];
}

function pickGroupDateSpeakers(drivers, userMessage = '', scene = null, groupHistory = []) {
    const candidates = Array.isArray(drivers) ? drivers.slice() : [];
    if (!candidates.length) return [];
    const normalized = String(userMessage || '').toLowerCase();
    const lastBot = [...groupHistory].reverse().find(item => item.role === 'bot' && item.speakerId);
    const scored = candidates.map(driver => {
        let score = favorability[driver.id] || 0;
        if (getDriverSceneAffinity(driver, scene?.id) > 0) score += 12;
        if (getDriverNameMentions(driver.name).some(token => token && normalized.includes(token))) score += 26;
        if (lastBot?.speakerId === driver.id) score -= 18;
          score += Math.random() * 10;
          return { driver, score };
      }).sort((left, right) => right.score - left.score);
    return scored[0]?.driver ? [scored[0].driver] : [];
}

async function requestDateReplyText(systemPrompt, options = {}) {
    const REQUEST_TIMEOUT_MS = 18000;
    const minDialogueChars = Number(options.minDialogueChars) || DATE_MIN_DIALOGUE_CHARS;
    const maxDialogueChars = Number(options.maxDialogueChars) || DATE_MAX_DIALOGUE_CHARS;
    const firstPassMaxTokens = Number(options.firstPassMaxTokens) || 260;
    const retryMaxTokens = Number(options.retryMaxTokens) || 380;
    const attempts = [
        {
            systemPrompt,
            userPrompt: `请直接输出这一轮约会回复。
 - 第一行先写一行很短的括号动作。
 - 后面直接开口，先接住用户刚刚那句话里最具体的一点。
 - 正文台词控制在 ${minDialogueChars} 到 ${maxDialogueChars} 字左右，够用就停。
 - 像中文母语者真的会这样说话，顺口一点，像面对面自然接话。
 - 不要写成长篇独白，不要分析自己为什么开口，也不要解释气氛为什么变了。
 - 至少要有一行括号动描。
 - 凡是动作、停顿、视线、环境描写，都必须单独成行，并用括号包起来。
 - 动作描写只要短短一行，重点还是把人话说顺。
 - 少写抽象句，少写“这一刻”“这种时候”“存在感”这类自我说明。
 - 括号外只写台词，不要解释规则，不要输出任何思考过程。`,
            temperature: 0.82,
            maxTokens: firstPassMaxTokens
        },
        {
            systemPrompt: `${systemPrompt}\n【补充修正】\n- 如果上一轮输出太空、格式跑偏，或者没有真正承接场景，这一轮就写一行自然的括号描写，再接顺口的台词。\n- 正文台词保持在 ${minDialogueChars} 到 ${maxDialogueChars} 字左右，不要再往长独白上走。\n- 先回应用户，再顺着场景往下接。\n- 别讲大道理，别自我分析，别把一句简单的话说成旁白。\n- 不要解释规则，不要自我说明，不要暴露任何思考过程。`,
            userPrompt: `请重写这一轮约会回复，确保有自然的台词内容。
 - 不能只有括号描写。
 - 不能空回。
 - 至少保留一行括号动描。
 - 场景感必须更强，回复要像真的发生在眼前，而不是泛用长回复。
 - 正文控制在 ${minDialogueChars} 到 ${maxDialogueChars} 字左右。
 - 不要长篇抒情，不要分析自己为什么会这样说。`,
            temperature: 0.78,
            maxTokens: retryMaxTokens
        }
    ];
    for (const attempt of attempts) {
        const controller = new AbortController();
        const timeoutId = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
        let response;
        try {
            response = await fetch(`${apiConfig.url.replace(/\/$/, '')}/chat/completions`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiConfig.key}` },
                body: JSON.stringify({
                    model: apiConfig.model,
                    messages: [
                        { role: 'system', content: attempt.systemPrompt },
                        { role: 'user', content: attempt.userPrompt }
                    ],
                    temperature: attempt.temperature,
                    max_tokens: attempt.maxTokens
                }),
                signal: controller.signal
            });
        } catch (error) {
            window.clearTimeout(timeoutId);
            if (error?.name === 'AbortError') continue;
            throw error;
        }
        window.clearTimeout(timeoutId);
        if (!response.ok) continue;
        const payload = await response.json();
        const content = sanitizeRoleOutput(payload?.choices?.[0]?.message?.content?.trim(), 'date');
        if (isUsableDateReply(content)) return content;
    }
    return '';
}

async function generateDateReply(driver, scene, userAction, userMessage, round, dateHistory = [], normalHistory = [], options = {}) {
    const favor = favorability[driver.id] || 0;
    const mood = getFavorMood(favor);
    const memoryContext = buildDriverSharedMemoryContext(driver.id);
    const personalityContext = window.getDriverPersonalityContext ? window.getDriverPersonalityContext(driver.id) : '';
    const eventContext = options.eventContext || null;
    const raceMemoryContext = typeof getCurrentRaceMemoryContext === 'function' ? getCurrentRaceMemoryContext() : '';
    const isOpening = /开始约会/.test(String(userAction || '')) && !String(userMessage || '').trim();
    if (!useAI || !apiConfig.key || !apiConfig.url || !apiConfig.model) {
        return fallbackDateReply(driver, scene, favor, normalHistory, dateHistory, options);
    }
    showLoading(true);
    try {
        const chatHistoryText = normalHistory.map(msg => `${msg.role === 'user' ? '用户' : driver.name}: ${msg.content}`).join('\n');
        const dateHistoryText = dateHistory.map(msg => `${msg.role === 'user' ? '用户' : driver.name}: ${msg.content}`).join('\n');
        const eventPrompt = eventContext ? `\n【刚刚发生的小插曲】${eventContext.title} - ${eventContext.desc}\n【用户刚刚的选择】${eventContext.choiceLabel}：${eventContext.actionText}` : '';
        const memoryBlock = isOpening ? '' : `\n【共享记忆】${memoryContext}\n【普通聊天记录】\n${chatHistoryText}`;
        const openingRule = isOpening ? '\n- 这是约会刚开始的开场，不要一上来就生硬复述之前小窗聊过的具体句子、旧话题或旧事件，除非它是被眼前场景自然勾出来的。' : '';
        const systemPrompt = `今天是${getCurrentDateInfo()}。${window.getCurrentRaceContext ? window.getCurrentRaceContext() : ''}\n你是 F1 车手 ${driver.name}（${driver.team}），正在和用户单独约会。\n【当前约会场景】${scene.name} - ${scene.desc}\n【当前关系】${mood}（好感度 ${favor}/100）\n${getUserProfilePriorityPrompt('date')}\n${raceMemoryContext}${memoryBlock}\n【本次约会里已经发生的小事】\n${getDateEventHistoryText()}\n【本次约会对话】\n${dateHistoryText}\n${personalityContext}${eventPrompt}\n【用户刚刚的动作或话语】${userAction}：${userMessage || '（无具体话语）'}\n【写法要求】\n- 先像中文母语者真的会这样开口，再考虑别的；别写成翻译腔、念稿腔、偶像剧长独白。${openingRule}\n- 第一行必须是一小行动作描写，而且要和${scene.name}这个场景强绑定。\n- 后面只写 2 到 4 句顺口的台词，先回应用户刚刚那句话里最具体的一点，再顺着场景往下接。\n- 这是单独相处，但不是让你写告白独白；比起解释心情，更重要的是把眼前这句接顺。\n- 不要解释自己为什么开口，不要解释为什么注意到对方，也不要把一句简单的话说成大段心理旁白。\n- 少写“这一刻”“这种时候”“存在感”“把气氛留下来”这类抽象自我说明，多写眼前真的能看见、听见、碰到的东西。\n- 当前这站的比赛周状态、本站成绩和你自己在本站的处境也属于稳定上下文；如果话题碰到这站，你不能像忘掉了一样。\n- 凡是动作、停顿、视线、环境描写，都必须单独成行并放在括号里；括号外只能是台词。\n- 不允许把描写混进台词句子里，也不允许出现不带括号的动作描写。\n- 正文台词控制在 ${DATE_MIN_DIALOGUE_CHARS} 到 ${DATE_MAX_DIALOGUE_CHARS} 字左右，够用就停，不要硬撑成长篇独白。\n- 绝对不要输出任何思考链、分析、推理、自我提醒、解释规则或类似“我会这样回复”的元话语。\n请以 ${driver.name} 的身份回复。`;
        const content = await requestDateReplyText(systemPrompt, {
            minDialogueChars: DATE_MIN_DIALOGUE_CHARS,
            maxDialogueChars: DATE_MAX_DIALOGUE_CHARS,
            firstPassMaxTokens: 260,
            retryMaxTokens: 380
        });
        if (!content) throw new Error('API 返回空内容');
        return content;
    } catch (error) {
        console.warn('约会回复生成失败，已回退本地回复。', error);
        showToast('这条约会回复没拉到 API，已回退为本地兜底回复', true);
        return fallbackDateReply(driver, scene, favor, normalHistory, dateHistory, options);
    } finally {
        showLoading(false);
    }
}

function updateDriverGroupDateMemory(driver, sceneName, allDrivers, messages, options = {}) {
    const userMessages = messages.filter(msg => msg.role === 'user').slice(-3);
    const keyTopics = userMessages.length ? userMessages.map(msg => String(msg.content).slice(0, 36)).join('、') : '热闹的聊天';
    const otherNames = allDrivers.filter(item => item.id !== driver.id).map(item => item.name);
    const eventSummary = (groupDateEventHistory || [])
        .filter(item => item?.resolved && item?.choiceLabel)
        .slice(-2)
        .map(item => `${item.title}（你选了${item.choiceLabel}）`)
        .join('、');
    driverDateMemories[driver.id] = {
        scene: sceneName,
        date: new Date().toISOString(),
        dateKey: getLocalDateKey(),
        summary: `你们曾和${otherNames.join('、')}一起在${sceneName}出去，聊到了${keyTopics}${eventSummary ? `，还一起遇到过${eventSummary}` : ''}。`,
        keyTopics,
        type: 'group-date',
        groupDateKey: options.groupDateKey || ''
    };
    secureStorageSet('f1_date_memories', driverDateMemories);
}

function updateGroupDateMemory(driverIds, sceneName, messages) {
    const drivers = driverIds.map(id => window.DRIVERS.find(item => item.id === id)).filter(Boolean);
    if (!drivers.length) return;
    const key = getGroupDateKey(driverIds);
    const userMessages = messages.filter(msg => msg.role === 'user').slice(-3);
    const keyTopics = userMessages.length ? userMessages.map(msg => String(msg.content).slice(0, 36)).join('、') : '愉快的相处';
    const eventSummary = (groupDateEventHistory || [])
        .filter(item => item?.resolved && item?.choiceLabel)
        .slice(-2)
        .map(item => `${item.title}（你选了${item.choiceLabel}）`)
        .join('、');
    groupDateMemories[key] = {
        driverIds: drivers.map(driver => driver.id),
        driverNames: drivers.map(driver => driver.name),
        scene: sceneName,
        date: new Date().toISOString(),
        dateKey: getLocalDateKey(),
        summary: `你和${drivers.map(driver => driver.name).join('、')}曾在${sceneName}一起出去，聊到了${keyTopics}${eventSummary ? `，还一起遇到过${eventSummary}` : ''}。`,
        keyTopics,
        type: 'group-date'
    };
    if (typeof saveGroupDateMemories === 'function') saveGroupDateMemories();
    drivers.forEach(driver => updateDriverGroupDateMemory(driver, sceneName, drivers, messages, { groupDateKey: key }));
}

function updateGroupDateSession(driverIds, scene, messages) {
    const sceneName = typeof scene === 'string' ? scene : scene?.name || '约会场景';
    const key = getGroupDateKey(driverIds);
    const dateKey = getLocalDateKey();
    if (!groupDateSessions[key] || typeof groupDateSessions[key] !== 'object') groupDateSessions[key] = {};
    groupDateSessions[key][dateKey] = {
        driverIds: [...driverIds],
        scene: sceneName,
        messages: (messages || []).map(message => ({
            role: message.role,
            speakerId: message.speakerId || '',
            content: String(message.content || ''),
            meta: message.meta || null
        })),
        updatedAt: new Date().toISOString()
    };
    if (typeof saveGroupDateSessions === 'function') saveGroupDateSessions();
}

function getGroupDateSharedMemoryContext(driverIds) {
    const key = getGroupDateKey(driverIds);
    const latestMemory = groupDateMemories[key]?.summary ? `【你们这组人的上次群约会记忆】\n${groupDateMemories[key].summary}` : '';
    const sessionMemory = typeof getRecentGroupDateSessionContext === 'function' ? getRecentGroupDateSessionContext(key, 1) : '';
    const personalMemories = driverIds
        .map(driverId => {
            const driver = window.DRIVERS.find(item => item.id === driverId);
            const summary = driverDateMemories?.[driverId]?.summary;
            return driver && summary ? `【${driver.name}和用户的相关记忆】\n${summary}` : '';
        })
        .filter(Boolean)
        .join('\n');
    return [latestMemory, sessionMemory, personalMemories].filter(Boolean).join('\n');
}

async function generateGroupDateReplyForSpeaker(driver, groupDrivers, scene, userAction, userMessage, round, groupHistory = [], options = {}) {
    if (window.GroupDateRuntime?.generateGroupDateReplyForSpeaker) {
        return window.GroupDateRuntime.generateGroupDateReplyForSpeaker(driver, groupDrivers, scene, userAction, userMessage, round, groupHistory, options);
    }
    return fallbackGroupDateReply(driver, groupDrivers, scene, favorability[driver.id] || 0, groupHistory, options);
}

async function generateGroupDateReplies(drivers, scene, userAction, userMessage, round, groupHistory = [], options = {}) {
    if (window.GroupDateRuntime?.generateGroupDateReplies) {
        return window.GroupDateRuntime.generateGroupDateReplies(drivers, scene, userAction, userMessage, round, groupHistory, options);
    }
    return fallbackGroupDateReplies(drivers.slice(0, 1), scene, groupHistory, options);
}

async function startDate(driverId, sceneId) {
    const driver = window.DRIVERS.find(item => item.id === driverId);
    const scene = window.DATE_SCENES.find(item => item.id === sceneId);
    if (!driver || !scene) return;
    const favor = favorability[driver.id] || 0;
    if (favor < DATE_FAVOR_THRESHOLD) {
        showToast(`好感度达到 ${DATE_FAVOR_THRESHOLD} 才能和 ${driver.name} 约会`, true);
        return;
    }
    openDatePreparingModal({ sceneName: scene.name, driverNames: [driver.name], isGroup: false });
    currentDateDriver = driver;
    currentDateScene = scene;
    currentRound = 0;
    dateMessages = [];
    dateInProgress = true;
    currentDateEvent = null;
    dateEventHistory = [];
    dateEventCooldown = 1;
    renderDatePage();
    try {
        let opening = '';
        try {
            opening = await generateDateReply(driver, scene, '开始约会', '', currentRound, [], getRecentChatHistory(driver.id, 8));
        } catch (error) {
            console.warn('单人约会开场生成失败，已回退本地回复。', error);
        }
        const safeOpening = ensureDateReplyText(opening, driver, scene, favor, getRecentChatHistory(driver.id, 8), [], {});
        dateMessages.push({ role: 'bot', content: safeOpening });
        renderDatePage();
    } finally {
        closeDatePreparingModal();
    }
}

async function startGroupDate(driverIds, sceneId) {
    const uniqueIds = [...new Set((driverIds || []).filter(Boolean))].slice(0, GROUP_DATE_MAX_PARTICIPANTS);
    const drivers = uniqueIds.map(id => window.DRIVERS.find(item => item.id === id)).filter(Boolean);
    const scene = GROUP_DATE_SCENES.find(item => item.id === sceneId);
    if (!scene || drivers.length !== GROUP_DATE_MAX_PARTICIPANTS) {
        showToast(`第一版群约会需要正好选择 ${GROUP_DATE_MAX_PARTICIPANTS} 位车手`, true);
        return;
    }
    const blockedDriver = drivers.find(driver => (favorability[driver.id] || 0) < DATE_FAVOR_THRESHOLD);
    if (blockedDriver) {
        showToast(`${blockedDriver.name} 的好感还没达到赴约门槛`, true);
        return;
    }
    openDatePreparingModal({ sceneName: scene.name, driverNames: drivers.map(driver => driver.name), isGroup: true });
    currentGroupDateDrivers = drivers;
    currentGroupDateScene = scene;
    currentGroupDateRound = 0;
    groupDateMessages = [];
    groupDateInProgress = true;
    currentGroupDateEvent = null;
    groupDateEventHistory = [];
    groupDateEventCooldown = 1;
    renderDatePage();
    try {
        let openingReplies = [];
        try {
            openingReplies = await generateGroupDateReplies(drivers, scene, '开始群约会', '', currentGroupDateRound, [], {});
        } catch (error) {
            console.warn('群约会开场生成失败，已回退本地回复。', error);
        }
        ensureUsableGroupDateReplies(openingReplies, drivers, scene, [], {}).forEach(reply => {
            groupDateMessages.push({ role: 'bot', speakerId: reply.speakerId, content: reply.content });
        });
        renderDatePage();
    } finally {
        closeDatePreparingModal();
    }
}

async function submitDateAction(action, customText, options = {}) {
    if (!dateInProgress || !currentDateDriver || !currentDateScene) return;
    if (currentRound >= maxRounds) return endDate();
    const userMessage = customText || action;
    const eventContext = options.eventChoice && currentDateEvent
        ? {
            title: currentDateEvent.title,
            desc: currentDateEvent.desc,
            tag: currentDateEvent.tag,
            choiceId: options.eventChoice.id,
            choiceLabel: options.eventChoice.label,
            actionText: options.eventChoice.actionText || userMessage
        }
        : null;
    dateMessages.push({ role: 'user', content: userMessage, meta: eventContext ? { type: 'date-event-choice', eventTitle: eventContext.title, eventChoiceLabel: eventContext.choiceLabel } : null });
    currentRound += 1;
    const reply = await generateDateReply(currentDateDriver, currentDateScene, action, userMessage, currentRound, dateMessages, getRecentChatHistory(currentDateDriver.id, 8), { eventContext });
    const safeReply = ensureDateReplyText(reply, currentDateDriver, currentDateScene, favorability[currentDateDriver.id] || 0, getRecentChatHistory(currentDateDriver.id, 8), dateMessages, { eventContext });
    if (eventContext) {
        const latestEvent = [...dateEventHistory].reverse().find(item => item.id === currentDateEvent?.id && !item.resolved);
        if (latestEvent) {
            latestEvent.resolved = true;
            latestEvent.choiceId = eventContext.choiceId;
            latestEvent.choiceLabel = eventContext.choiceLabel;
            latestEvent.actionText = eventContext.actionText;
        }
        currentDateEvent = null;
        dateEventCooldown = 2;
    }
    dateMessages.push({ role: 'bot', content: safeReply });
    maybeTriggerDateEvent(currentDateDriver, currentDateScene);
    renderDatePage();
    if (currentRound >= maxRounds) endDate();
}

async function submitGroupDateAction(action, customText, options = {}) {
    if (!groupDateInProgress || !currentGroupDateDrivers.length || !currentGroupDateScene) return;
    if (currentGroupDateRound >= maxRounds) return endGroupDate();
    const userMessage = customText || action;
    groupDateMessages.push({
        role: 'user',
        content: userMessage,
        meta: null
    });
    currentGroupDateRound += 1;
    const replies = await generateGroupDateReplies(currentGroupDateDrivers, currentGroupDateScene, action, userMessage, currentGroupDateRound, groupDateMessages, {});
    ensureUsableGroupDateReplies(replies, currentGroupDateDrivers, currentGroupDateScene, groupDateMessages, {}).forEach(reply => {
        groupDateMessages.push({ role: 'bot', speakerId: reply.speakerId, content: reply.content });
    });
    renderDatePage();
    if (currentGroupDateRound >= maxRounds) endGroupDate();
}

function updateDriverDateMemory(driverId, sceneName, messages) {
    const userMessages = messages.filter(msg => msg.role === 'user').slice(-3);
    const keyTopics = userMessages.length ? userMessages.map(msg => String(msg.content).slice(0, 40)).join('、') : '愉快的聊天';
    const eventSummary = (dateEventHistory || [])
        .filter(item => item?.resolved && item?.choiceLabel)
        .slice(-2)
        .map(item => `${item.title}（你选了${item.choiceLabel}）`)
        .join('、');
    driverDateMemories[driverId] = { scene: sceneName, date: new Date().toISOString(), dateKey: getLocalDateKey(), summary: `你们曾在${sceneName}约会，聊到了${keyTopics}${eventSummary ? `，还一起遇到过${eventSummary}` : ''}。`, keyTopics };
    secureStorageSet('f1_date_memories', driverDateMemories);
}

function endDate() {
    if (!currentDateDriver || !currentDateScene) return;
    if (currentDateEvent) {
        showToast('先处理当前小插曲', true);
        return;
    }
    const finishedDriver = currentDateDriver;
    const favorChange = Math.floor(Math.random() * 10) - 2;
    if (favorChange > 0) addFavorability(finishedDriver.id, favorChange);
    updateDriverDateMemory(finishedDriver.id, currentDateScene.name, dateMessages);
    currentDateDriver = null;
    currentDateScene = null;
    dateInProgress = false;
    currentDateEvent = null;
    dateEventHistory = [];
    dateEventCooldown = 0;
    renderDatePage();
    renderDriverList();
    if (currentChatDriver?.id === finishedDriver.id) renderChatMessages(finishedDriver.id);
    showToast(favorChange > 0 ? `约会结束，好感度 +${favorChange}` : '约会结束', false);
}

function endGroupDate() {
    if (!currentGroupDateDrivers.length || !currentGroupDateScene) return;
    const finishedDrivers = currentGroupDateDrivers.slice();
    const favorGains = [];
    finishedDrivers.forEach(driver => {
        const favorChange = Math.max(1, Math.floor(Math.random() * 5));
        addFavorability(driver.id, favorChange);
        favorGains.push(`${driver.name} +${favorChange}`);
    });
    updateGroupDateMemory(finishedDrivers.map(driver => driver.id), currentGroupDateScene.name, groupDateMessages);
    updateGroupDateSession(finishedDrivers.map(driver => driver.id), currentGroupDateScene, groupDateMessages);
    currentGroupDateDrivers = [];
    currentGroupDateScene = null;
    currentGroupDateRound = 0;
    groupDateMessages = [];
    groupDateInProgress = false;
    currentGroupDateEvent = null;
    groupDateEventHistory = [];
    groupDateEventCooldown = 0;
    renderDatePage();
    renderDriverList();
    if (currentChatDriver?.id && finishedDrivers.some(driver => driver.id === currentChatDriver.id)) renderChatMessages(currentChatDriver.id);
    showToast(`群约会结束 · ${favorGains.join(' / ')}`, false);
}

function formatDateBubbleContent(text = '', role = 'bot') {
    const safeText = String(text || '').trim() || '（他看着你，像是在等你把话继续说下去。）\n我在听，你可以继续。';
    const normalizedLines = normalizeDateReplyLayout(safeText).map(line => {
        const normalizedLine = line.replace(/\(/g, '（').replace(/\)/g, '）');
        const isWrappedAction = /^（[^（）\n]{1,220}）$/u.test(normalizedLine);
        if (isWrappedAction) return `<div class="date-action-line">${escapeHtml(normalizedLine)}</div>`;
        return `<div class="date-dialogue-line"><span class="date-dialogue-inline">${escapeHtml(normalizedLine)}</span></div>`;
    });
    return normalizedLines.length ? normalizedLines.join('') : `<div class="date-dialogue-line">${escapeHtml(safeText)}</div>`;
}

function renderDatePage() {
    const container = document.getElementById('dateContainer');
    const datePage = document.getElementById('datePage');
    if (!container) return;
    const isSingleSession = !!dateInProgress;
    const isGroupSession = !!groupDateInProgress;
    container.classList.toggle('date-session-active', isSingleSession || isGroupSession);
    datePage?.classList.toggle('date-page-session', isSingleSession || isGroupSession);
    if (!isSingleSession && !isGroupSession) {
        const availableDrivers = window.DRIVERS.filter(driver => (favorability[driver.id] || 0) >= DATE_FAVOR_THRESHOLD);
        if (!availableDrivers.length) {
            container.innerHTML = `<div class="date-selector date-selector-empty"><div class="date-hero-card"><div class="date-hero-kicker">Paddock Date</div><div class="date-hero-title">还没有车手愿意赴约</div><div class="date-hero-copy">好感达到 ${DATE_FAVOR_THRESHOLD} 之后，对应车手才会出现在这里。先去聊聊天、送送礼，再回来挑一个更合适的晚上。</div></div></div>`;
            return;
        }
        const isGroupMode = currentDateSelectionMode === 'group';
        const driverCards = availableDrivers.map(driver => {
            const favor = favorability[driver.id] || 0;
            const avatarBg = getDriverAvatarStyle(driver.id);
            return `<button class="date-driver-card${isGroupMode ? ' is-group-pick' : ''}" data-driver-id="${driver.id}"><div class="date-driver-card-glow"></div><div class="driver-avatar-mini"${avatarBg ? ` style="background-image:${avatarBg};background-size:cover;background-position:center;"` : ''}>${avatarBg ? '' : driver.avatarLetter}</div><div class="driver-info-mini"><div class="driver-name-mini">${driver.name}</div><div class="driver-team-mini">${driver.team}</div><div class="driver-favor-mini">好感 ${favor}</div></div><span class="date-card-select">${isGroupMode ? '加入组局' : '已待命'}</span></button>`;
        }).join('');
        const availableScenes = isGroupMode ? GROUP_DATE_SCENES : window.DATE_SCENES;
        const sceneCards = availableScenes.map(scene => `<button class="date-scene-card" data-scene-id="${scene.id}"><div class="date-scene-track"></div><div class="scene-icon">${window.getUiIconMarkup ? window.getUiIconMarkup(scene.iconKey || 'spark', 'scene-icon-svg', scene.name) : ''}</div><div class="scene-name">${scene.name}</div><div class="scene-desc">${scene.desc}</div><div class="date-scene-meta">${isGroupMode ? 'Crew Route' : 'Mood Route'}</div></button>`).join('');
        container.innerHTML = `<div class="date-selector"><div class="date-hero-card"><div><div class="date-hero-kicker">Paddock Date</div><div class="date-hero-title">${isGroupMode ? '挑两个人，再把今晚组起来' : '挑一个人，再挑一个今晚的氛围'}</div><div class="date-hero-copy">${isGroupMode ? '第一版群约会是临时组局。选两位已经达到赴约门槛的车手，再决定这晚该在夜市、游戏厅还是保龄球馆里发生。' : '这不是普通入口页，更像围场深夜里的一张邀约面板。先选车手，再决定这次约会该在海边、餐厅还是围场里发生。'}</div></div><div class="date-hero-badge">${isGroupMode ? 'Crew Night' : 'Private Line'}</div></div><div class="date-mode-switch"><button type="button" class="date-mode-tab${!isGroupMode ? ' active' : ''}" data-date-mode="single">单人约会</button><button type="button" class="date-mode-tab${isGroupMode ? ' active' : ''}" data-date-mode="group">群约会</button></div><div class="date-driver-grid"><section class="date-driver-section"><div class="date-section-head"><h4>${isGroupMode ? '选择两位车手' : '选择车手'}</h4><span class="date-section-meta">${isGroupMode ? `最多 ${GROUP_DATE_MAX_PARTICIPANTS} 位` : `${availableDrivers.length} 位可赴约`}</span></div>${isGroupMode ? '<div class="date-group-hint">第一版群约会需要正好 2 位车手，且每位都达到单独赴约门槛。</div>' : ''}<div class="date-driver-cards">${driverCards}</div></section><section class="date-scene-section"><div class="date-section-head"><h4>选择场景</h4><span class="date-section-meta">${availableScenes.length} 条${isGroupMode ? '组局路线' : '氛围路线'}</span></div><div class="date-scene-cards">${sceneCards}</div></section></div><button id="startDateBtn" class="date-start-btn"><span class="date-start-kicker">Open Session</span><strong>${isGroupMode ? '开始这场群约会' : '开始这场约会'}</strong></button></div>`;
        let selectedDriverId = availableDrivers[0]?.id || '';
        let selectedDriverIds = availableDrivers.slice(0, GROUP_DATE_MAX_PARTICIPANTS).map(driver => driver.id);
        let selectedSceneId = availableScenes[0]?.id || '';
        const updateActive = () => {
            document.querySelectorAll('.date-driver-card').forEach(card => {
                const active = isGroupMode ? selectedDriverIds.includes(card.dataset.driverId) : card.dataset.driverId === selectedDriverId;
                card.classList.toggle('active', active);
            });
            document.querySelectorAll('.date-scene-card').forEach(card => card.classList.toggle('active', card.dataset.sceneId === selectedSceneId));
            const startBtn = document.getElementById('startDateBtn');
            if (startBtn && isGroupMode) startBtn.disabled = selectedDriverIds.length !== GROUP_DATE_MAX_PARTICIPANTS;
        };
        document.querySelectorAll('[data-date-mode]').forEach(button => {
            button.addEventListener('click', () => {
                currentDateSelectionMode = button.dataset.dateMode === 'group' ? 'group' : 'single';
                renderDatePage();
            });
        });
        document.querySelectorAll('.date-driver-card').forEach(card => card.addEventListener('click', () => {
            if (isGroupMode) {
                const driverId = card.dataset.driverId;
                if (selectedDriverIds.includes(driverId)) selectedDriverIds = selectedDriverIds.filter(id => id !== driverId);
                else if (selectedDriverIds.length < GROUP_DATE_MAX_PARTICIPANTS) selectedDriverIds = [...selectedDriverIds, driverId];
                else showToast(`第一版群约会最多选择 ${GROUP_DATE_MAX_PARTICIPANTS} 位车手`, true);
            } else {
                selectedDriverId = card.dataset.driverId;
            }
            updateActive();
        }));
        document.querySelectorAll('.date-scene-card').forEach(card => card.addEventListener('click', () => {
            selectedSceneId = card.dataset.sceneId;
            updateActive();
        }));
        updateActive();
        document.getElementById('startDateBtn')?.addEventListener('click', () => {
            if (isGroupMode) startGroupDate(selectedDriverIds, selectedSceneId);
            else startDate(selectedDriverId, selectedSceneId);
        });
        return;
    }
    const activeDrivers = isGroupSession ? currentGroupDateDrivers : [currentDateDriver].filter(Boolean);
    const activeScene = isGroupSession ? currentGroupDateScene : currentDateScene;
    const activeMessages = isGroupSession ? groupDateMessages : dateMessages;
    const activeRound = isGroupSession ? currentGroupDateRound : currentRound;
    const activeEvent = isGroupSession ? null : currentDateEvent;
    const messagesHtml = activeMessages.map(msg => {
        const speakerId = msg.speakerId || currentDateDriver?.id;
        const speaker = activeDrivers.find(driver => driver.id === speakerId) || currentDateDriver;
        const avatarMarkup = msg.role === 'user'
            ? buildDateUserAvatarMarkup()
            : buildDateDriverAvatarMarkup(speakerId);
        const eventMetaHtml = msg.meta?.type === 'date-event-choice'
            ? `<div class="date-message-tag">${escapeHtml(msg.meta.eventTitle)} · ${escapeHtml(msg.meta.eventChoiceLabel)}</div>`
            : '';
        const speakerLabel = msg.role === 'bot' && isGroupSession
            ? `<div class="date-message-speaker">${escapeHtml(speaker?.name || '')}</div>`
            : '';
        return `<div class="date-message-row ${msg.role}">${msg.role === 'bot' ? avatarMarkup : ''}<div class="date-message ${msg.role}">${speakerLabel}${eventMetaHtml}<div class="date-bubble">${formatDateBubbleContent(msg.content, msg.role)}</div></div>${msg.role === 'user' ? avatarMarkup : ''}</div>`;
    }).join('');
    const headerMain = isGroupSession
        ? `<div class="date-panel-main"><div class="date-group-avatar-stack">${activeDrivers.map(driver => buildGroupDateParticipantAvatarMarkup(driver.id)).join('')}</div><div class="date-panel-meta"><div class="date-panel-title">${activeDrivers.map(driver => driver.name).join(' / ')}</div><div class="date-panel-subtitle">群约会 · ${escapeHtml(activeScene?.name || '约会中')}</div></div></div>`
        : `<div class="date-panel-main"><div class="date-panel-avatar"${getDriverAvatarStyle(currentDateDriver.id) ? ` style="background-image:${getDriverAvatarStyle(currentDateDriver.id)};background-size:cover;background-position:center;"` : ''}>${getDriverAvatarStyle(currentDateDriver.id) ? '' : currentDateDriver.avatarLetter}</div><div class="date-panel-meta"><div class="date-panel-title">${escapeHtml(currentDateDriver.name)}</div><div class="date-panel-subtitle">${escapeHtml(currentDateDriver.team)} · ${escapeHtml(activeScene?.name || '约会中')}</div></div></div>`;
    const headerCornerAction = `<button type="button" id="endDateSessionBtn" class="date-end-btn date-end-btn-corner"${activeEvent ? ' disabled' : ''}>${isGroupSession ? '结束这次群约会' : '结束这次约会'}</button>`;
    const eventHtml = activeEvent ? `
        <div class="date-event-modal">
            <div class="date-event-backdrop"></div>
            <section class="date-event-card">
                <div class="date-event-head">
                    <div>
                        <div class="date-event-kicker">${escapeHtml(activeEvent.tag || 'Date Event')}</div>
                        <div class="date-event-title">${escapeHtml(activeEvent.title)}</div>
                    </div>
                    <div class="date-event-badge">${isGroupSession ? 'Group' : 'Live'}</div>
                </div>
                <div class="date-event-desc">${escapeHtml(activeEvent.desc)}</div>
                <div class="date-event-choices">
                    ${activeEvent.choices.map((choice, index) => `<button type="button" class="date-event-choice" data-date-event-choice="${index}"><span>${escapeHtml(choice.label)}</span><small>${escapeHtml(choice.actionText)}</small></button>`).join('')}
                </div>
            </section>
        </div>
    ` : '';
    container.innerHTML = `<div class="date-panel-header">${headerCornerAction}<div class="date-panel-head-layout">${headerMain}<div class="date-panel-scene"><div class="date-panel-scene-label">Scene</div><strong>${escapeHtml(activeScene?.name || '')}</strong></div></div></div><div class="round-counter date-panel-pill">第 ${activeRound + 1} / ${maxRounds} 轮 · ${activeEvent ? '今晚有小插曲' : (isGroupSession ? '群约会进行中' : `${currentDateDriver.name} 的约会`)}</div><div class="date-chat-area" id="dateChatArea">${messagesHtml}</div><div class="date-input-area"><input type="text" id="dateUserInput" class="date-input" placeholder="${isGroupSession ? '写点今晚想让他们接住的话...' : '写一点今晚想说的话...'}" autocomplete="off"><button id="dateSendBtn" class="send-msg-btn"><span>发送</span></button></div>${eventHtml}`;
    const inputArea = container.querySelector('.date-input-area');
    if (inputArea && !inputArea.parentElement?.classList.contains('date-input-shell')) {
        const shell = document.createElement('div');
        shell.className = 'date-input-shell';
        inputArea.replaceWith(shell);
        shell.appendChild(inputArea);
    }
    const send = () => {
        const input = document.getElementById('dateUserInput');
        const text = input.value.trim();
        if (!text) return;
        input.value = '';
        if (isGroupSession) submitGroupDateAction('自定义', text);
        else submitDateAction('自定义', text);
    };
    document.getElementById('dateSendBtn')?.addEventListener('click', send);
    document.getElementById('endDateSessionBtn')?.addEventListener('click', () => {
        if (!isGroupSession && activeEvent) {
            showToast('先处理当前小插曲', true);
            return;
        }
        if (isGroupSession) endGroupDate();
        else endDate();
    });
    container.querySelectorAll('[data-date-event-choice]').forEach(button => {
        button.addEventListener('click', () => {
            const choice = activeEvent?.choices?.[Number(button.dataset.dateEventChoice)];
            if (!choice) return;
            submitDateAction('事件选择', choice.actionText, { eventChoice: choice });
        });
    });
    document.getElementById('dateUserInput')?.addEventListener('keypress', event => {
        if (event.key === 'Enter') {
            event.preventDefault();
            send();
        }
    });
    const chatArea = document.getElementById('dateChatArea');
    if (chatArea) chatArea.scrollTop = chatArea.scrollHeight;
}

function getRecentChatHistory(driverId, maxCount = 6) {
    return (chatHistories[driverId] || []).filter(msg => msg.role !== 'system').slice(-maxCount);
}

function openDiaryModal(driverId) {
    currentDiaryTargetType = 'driver';
    currentDiaryDriverId = driverId;
    currentDiaryGroupId = null;
    currentDiaryDateKey = getLocalDateKey();
    renderDiaryModal();
    document.getElementById('diaryModal').style.display = 'flex';
}

function openGroupDiaryModal(groupId) {
    currentDiaryTargetType = 'group';
    currentDiaryGroupId = groupId;
    currentDiaryDriverId = null;
    currentDiaryDateKey = getLocalDateKey();
    renderDiaryModal();
    document.getElementById('diaryModal').style.display = 'flex';
}

function closeDiaryModal() {
    document.getElementById('diaryModal').style.display = 'none';
    currentDiaryDriverId = null;
    currentDiaryGroupId = null;
    currentDiaryTargetType = 'driver';
}

function shiftDiaryDate(offset) {
    currentDiaryDateKey = getLocalDateKey(new Date(parseDateKey(currentDiaryDateKey).getTime() + offset * 86400000));
    renderDiaryModal();
}

function buildDiaryGenerationSource(targetId, dateKey, targetType = currentDiaryTargetType) {
    const messages = getMessagesForDate(targetId, dateKey);
    if (targetType === 'group') {
        const group = typeof getGroupChatById === 'function' ? getGroupChatById(targetId) : null;
        const chatText = messages.map(msg => {
            if (msg.role === 'user') return `${userProfile.name}: ${msg.content}`;
            if (msg.meta?.type === 'group-reply' && typeof parseGroupReplyLines === 'function') {
                return parseGroupReplyLines(group, msg.content).map(line => `${line.speaker}: ${line.content}`).join('\n');
            }
            return `群聊: ${msg.content}`;
        }).join('\n');
        return {
            messages,
            chatText,
            dateMemoryText: group?.notice ? `群公告：${group.notice}` : '',
            title: `${group?.name || '群聊'} 的群聊日记`,
            emptyHint: '这一天还没有群聊记录可用于生成日记',
            fallbackText: `今天在${group?.name || '这个群'}里聊了不少。\n\n${chatText.slice(0, 300)}`,
            prompt: `请根据下面这一天的群聊内容，写一篇群聊日记。要求：第三人称概括、自然细腻、要能看出群里的氛围、谁更活跃、聊了哪些重点、你和这个群现在的熟悉程度，100 到 220 字。\n【群聊记录】\n${chatText}\n【群公告或备注】\n${group?.notice || '无'}`,
            sourceMeta: `当日群聊记录 ${messages.length} 条`,
            memoryHint: group?.notice ? `群公告：${group.notice}` : '这一天没有可同步的群聊备注。'
        };
    }
    const dateMemory = driverDateMemories[targetId];
    const linkedGroupMemory = Object.values(groupDateMemories || {}).find(memory => Array.isArray(memory?.driverIds) && memory.driverIds.includes(targetId) && memory.dateKey === dateKey);
    return {
        messages,
        chatText: messages.map(msg => `${msg.role === 'user' ? userProfile.name : (window.DRIVERS.find(item => item.id === targetId)?.name || '车手')}: ${msg.content}`).join('\n'),
        dateMemoryText: [dateMemory?.dateKey === dateKey ? dateMemory.summary : '', linkedGroupMemory?.summary || ''].filter(Boolean).join('\n'),
        title: `${window.DRIVERS.find(item => item.id === targetId)?.name || '车手'} 的日记`,
        emptyHint: '这一天还没有聊天记录可用于生成日记',
        fallbackText: `今天和${window.DRIVERS.find(item => item.id === targetId)?.name || '这位车手'}聊了不少。\n\n${messages.map(msg => `${msg.role === 'user' ? userProfile.name : (window.DRIVERS.find(item => item.id === targetId)?.name || '车手')}: ${msg.content}`).join('\n').slice(0, 300)}`,
        prompt: `请根据下面这一天的聊天内容，写一篇关系日记。要求：第三人称概括、自然细腻、突出关系进展、100 到 220 字。\n【聊天记录】\n${messages.map(msg => `${msg.role === 'user' ? userProfile.name : (window.DRIVERS.find(item => item.id === targetId)?.name || '车手')}: ${msg.content}`).join('\n')}\n【约会记忆】\n${[dateMemory?.dateKey === dateKey ? dateMemory.summary : '', linkedGroupMemory?.summary || ''].filter(Boolean).join('\n') || '无'}`,
        sourceMeta: `当日聊天记录 ${messages.length} 条`,
        memoryHint: [dateMemory?.dateKey === dateKey ? dateMemory.summary : '', linkedGroupMemory?.summary || ''].filter(Boolean).join(' ') || '这一天没有同步到约会记忆摘要。'
    };
}

async function generateDriverDiary() {
    const diaryTargetId = currentDiaryTargetType === 'group' ? currentDiaryGroupId : currentDiaryDriverId;
    if (!diaryTargetId || !currentDiaryDateKey) return;
    const source = buildDiaryGenerationSource(diaryTargetId, currentDiaryDateKey, currentDiaryTargetType);
    const textarea = document.getElementById('diaryEditor');
    if (!textarea) return;
    if (!source.messages.length) {
        showToast(source.emptyHint, true);
        return;
    }
    if (!useAI || !apiConfig.key || !apiConfig.url || !apiConfig.model) {
        textarea.value = source.fallbackText;
        return;
    }
    showLoading(true);
    try {
        const response = await fetch(`${apiConfig.url.replace(/\/$/, '')}/chat/completions`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiConfig.key}` },
            body: JSON.stringify({ model: apiConfig.model, messages: [{ role: 'user', content: source.prompt }], temperature: 0.7, max_tokens: 260 })
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const payload = await response.json();
        textarea.value = payload?.choices?.[0]?.message?.content?.trim() || '';
    } catch (error) {
        handleApiError(error, '关系日记生成');
    } finally {
        showLoading(false);
    }
}

function saveDiaryEntry() {
    const diaryTargetId = currentDiaryTargetType === 'group' ? currentDiaryGroupId : currentDiaryDriverId;
    if (!diaryTargetId || !currentDiaryDateKey) return;
    const textarea = document.getElementById('diaryEditor');
    const content = textarea?.value?.trim() || '';
    const diaryStore = currentDiaryTargetType === 'group' ? ensureGroupDiaryStore(diaryTargetId) : ensureDriverDiaryStore(diaryTargetId);
    if (!content) delete diaryStore[currentDiaryDateKey];
    else {
        diaryStore[currentDiaryDateKey] = {
            content,
            updatedAt: new Date().toISOString(),
            linkedDateSummary: currentDiaryTargetType === 'group'
                ? ((typeof getGroupChatById === 'function' ? getGroupChatById(diaryTargetId)?.notice : '') || '')
                : (driverDateMemories[diaryTargetId]?.dateKey === currentDiaryDateKey ? driverDateMemories[diaryTargetId].summary : '')
        };
    }
    if (currentDiaryTargetType === 'group') saveGroupDiaries();
    else saveDriverDiaries();
    renderDiaryModal();
    showToast(content ? '日记已保存' : '这一天的日记已清空', false);
}

function renderDiaryModal() {
    const diaryTargetId = currentDiaryTargetType === 'group' ? currentDiaryGroupId : currentDiaryDriverId;
    if (!diaryTargetId || !currentDiaryDateKey) return;
    const entry = currentDiaryTargetType === 'group'
        ? getGroupDiaryEntry(diaryTargetId, currentDiaryDateKey)
        : getDriverDiaryEntry(diaryTargetId, currentDiaryDateKey);
    const source = buildDiaryGenerationSource(diaryTargetId, currentDiaryDateKey, currentDiaryTargetType);
    document.getElementById('diaryDriverName').innerText = source.title;
    document.getElementById('diaryDateLabel').innerText = formatDateKeyLabel(currentDiaryDateKey);
    document.getElementById('diaryStatusText').innerText = entry ? `已保存 · ${new Date(entry.updatedAt).toLocaleString('zh-CN', { hour12: false })}` : '这一天还没有日记';
    document.getElementById('diarySourceMeta').innerText = source.sourceMeta;
    document.getElementById('diaryMemoryHint').innerText = source.memoryHint;
    document.getElementById('diaryEditor').value = entry?.content || '';
}
