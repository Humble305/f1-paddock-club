// app-social-feed.js
// 围场动态、媒体、积分与排名视图

const FEED_TOPIC_POOL = [
    { id: 'weekend', label: '比赛周末感受', needReality: true },
    { id: 'garage', label: '车队工作日常', needReality: true },
    { id: 'training', label: '训练/恢复/准备', needReality: false },
    { id: 'travel', label: '旅途/城市碎片', needReality: false },
    { id: 'friends', label: '队友/围场互动', needReality: false },
    { id: 'fans', label: '对车迷说话', needReality: false },
    { id: 'life', label: '生活兴趣', needReality: false },
    { id: 'sim', label: '模拟器/游戏/技术宅时刻', needReality: false }
];

const DRIVER_SOCIAL_LINKS = {
    nor: ['pia', 'ham'],
    pia: ['nor', 'rus'],
    lec: ['ham', 'ver', 'gas'],
    ham: ['lec', 'nor', 'sai'],
    rus: ['ant', 'pia'],
    ant: ['rus', 'bea'],
    ver: ['lec', 'alo'],
    hadjar: ['ver'],
    alo: ['ver', 'sai', 'hul'],
    str: ['alo'],
    alb: ['sai', 'nor'],
    sai: ['alb', 'alo', 'ham'],
    gas: ['lec', 'col'],
    col: ['gas', 'bor'],
    oco: ['hul'],
    bea: ['ant', 'rus'],
    hul: ['alo', 'oco', 'sai'],
    bor: ['col', 'per'],
    law: ['ver'],
    lin: ['rus', 'ant'],
    per: ['bor'],
    bot: ['hul']
};

function getFeedDriverPersonality(driverId) {
    return window.DRIVER_PERSONALITIES?.[driverId] || null;
}

function getDriverById(driverId) {
    return (window.DRIVERS || []).find(driver => driver.id === driverId) || null;
}

function getDriverByName(name) {
    return (window.DRIVERS || []).find(driver => driver.name === name) || null;
}

function getDriverSocialCircle(driverId) {
    const explicit = DRIVER_SOCIAL_LINKS[driverId] || [];
    const sameTeam = (window.DRIVERS || [])
        .filter(driver => driver.id !== driverId && getDriverById(driverId)?.team === driver.team)
        .map(driver => driver.id);
    return [...new Set([...explicit, ...sameTeam].filter(id => id && id !== driverId))];
}

function getDriverExtendedCircle(driverId) {
    const direct = getDriverSocialCircle(driverId);
    const reverse = Object.entries(DRIVER_SOCIAL_LINKS)
        .filter(([, links]) => Array.isArray(links) && links.includes(driverId))
        .map(([id]) => id);
    const oneHop = direct
        .flatMap(id => DRIVER_SOCIAL_LINKS[id] || [])
        .filter(id => id && id !== driverId);
    return [...new Set([...direct, ...reverse, ...oneHop].filter(id => id && id !== driverId))];
}

function buildPostInteractionMap(authorDriver, index = 0) {
    if (!authorDriver) {
        return getUserPostInteractionMap(index);
    }
    const closeIds = getDriverSocialCircle(authorDriver.id);
    const extendedIds = getDriverExtendedCircle(authorDriver.id).filter(id => !closeIds.includes(id));
    const commentIds = closeIds
        .filter((_, slotIndex) => ((slotIndex + index) % 2 === 0))
        .slice(0, 2);
    const likeIds = [...new Set([
        ...closeIds,
        ...extendedIds.filter((_, slotIndex) => ((slotIndex + index) % 2 === 0)).slice(0, 4)
    ])].slice(0, 6);
    return { commentIds, likeIds };
}

function getUserPostInteractionMap(index = 0) {
    const drivers = (window.DRIVERS || []).slice();
    const highFavorDrivers = drivers
        .filter(driver => (favorability?.[driver.id] || 0) >= 65)
        .sort((left, right) => (favorability?.[right.id] || 0) - (favorability?.[left.id] || 0));
    const remainingDrivers = drivers.filter(driver => !highFavorDrivers.some(item => item.id === driver.id));
    const randomCommentIds = remainingDrivers
        .filter((_, slotIndex) => ((slotIndex + index) % 3 === 0))
        .slice(0, 2)
        .map(driver => driver.id);
    const randomLikeIds = remainingDrivers
        .filter((_, slotIndex) => ((slotIndex + index) % 2 === 0))
        .slice(0, 5)
        .map(driver => driver.id);
    const favoredIds = highFavorDrivers.map(driver => driver.id);
    return {
        commentIds: [...new Set([...favoredIds, ...randomCommentIds])].slice(0, Math.max(2, favoredIds.length + 2)),
        likeIds: [...new Set([...favoredIds, ...randomLikeIds])].slice(0, Math.max(4, favoredIds.length + 5))
    };
}

function pickFeedCommentTone(driverId) {
    const personality = getFeedDriverPersonality(driverId);
    const voice = `${personality?.voice || ''} ${personality?.social || ''}`;
    if (/开玩笑|冷幽默|轻松|会接梗|口语/.test(voice)) return 'playful';
    if (/成熟|温和|照顾人|鼓励/.test(voice)) return 'warm';
    if (/直接|硬|执行|专业|老练/.test(voice)) return 'respect';
    return 'hype';
}

function detectFeedPostScene(post) {
    const lower = String(post?.content || '').trim().toLowerCase();
    if (/训练|恢复|健身|骑行|跑步|gym|recovery/.test(lower)) return 'training';
    if (/路上|落地|时差|机场|飞行|城市|酒店|咖啡/.test(lower)) return 'travel';
    if (/模拟器|屏幕|数据|圈速|游戏|sim/.test(lower)) return 'sim';
    if (/看台|留言|谢谢|车迷|支持|粉丝/.test(lower)) return 'fans';
    if (/周末|比赛|排位|正赛|车库|练习|轮胎|工程师/.test(lower)) return 'weekend';
    if (/朋友|队友|一起|车队气氛/.test(lower)) return 'friends';
    if (/音乐|钢琴|晚餐|吃的|穿搭|时尚|海边/.test(lower)) return 'life';
    return 'general';
}

const FEED_STYLE_PROFILES = {
    nor: {
        prompt: '句子偏短，随手感明显，轻松、爱接梗，偶尔有一点不费力的自嘲；不要写成官方总结。'
    },
    pia: {
        prompt: '句子更短，判断先行，情绪收着；冷静、干净、偶尔一丝很淡的冷幽默，不拖沓。'
    },
    lec: {
        prompt: '句子更流动、更细腻，情绪真但克制；有一点优雅和停顿感，但绝不要写成抒情散文。'
    },
    ham: {
        prompt: '句子更完整、更温暖，会自然照顾读者感受；有一点信念感，但不要写成演讲稿。'
    },
    ver: {
        prompt: '更直接，更短，更少修饰；判断很快，不会铺垫太多，重点落在真实感受和赛车本身。'
    },
    alo: {
        prompt: '老练、干脆、略带一点轻的老将幽默；不是阴阳怪气，而是很懂围场后的松弛感。'
    },
    alb: {
        prompt: '更友好、更口语，像会把气氛接住的人；自然、顺、带一点轻松和机灵感。'
    },
    sai: {
        prompt: '表达更完整、更稳，条理清楚但不官腔；看起来像很会发社媒的人，但不会刻意营业。'
    },
    gas: {
        prompt: '情绪更明显一点，更有人味，句子会更流动；真诚，但不要过度煽情。'
    },
    bot: {
        prompt: '更松弛，句子短，带一点不费力的冷幽默；生活感强，不会装深沉。'
    }
};

function getFeedStyleProfile(driverId) {
    return FEED_STYLE_PROFILES[driverId] || {
        prompt: '保持这个车手本人的社媒感，在句长、停顿、玩笑频率上自然区分，不要写成统一模板。'
    };
}

function stylizeFeedText(driver, text, mode = 'post', slotIndex = 0) {
    const profile = getFeedStyleProfile(driver?.id);
    let result = sanitizeFeedPost(text);
    if (!result) return result;
    result = result
        .replace(/可以，继续。?/g, '')
        .replace(/这条状态对了。?/g, '')
        .replace(/这一句有点东西。?/g, '')
        .replace(/这条很像你会发的。?/g, '')
        .replace(/这条语气很本人。?/g, '')
        .replace(/这一句我会停一下。?/g, '')
        .replace(/这条下面值得留句话。?/g, '')
        .replace(/你这次写得比平时更实一点。?/g, '')
        .replace(/这条放在这里很顺。?/g, '')
        .replace(/看完会让人停一下。?/g, '')
        .replace(/你这句比很多场面话都真。?/g, '');
    if (driver?.id === 'pia') {
        result = result.replace(/其实/g, '').replace(/真的/g, '');
    }
    if (driver?.id === 'lec') {
        result = result.replace('。', '，');
    }
    if (driver?.id === 'ver') {
        result = result.replace(/我觉得|我感觉/g, '');
    }
    return sanitizeFeedPost(result);
}

async function requestFeedText(systemPrompt, { temperature = 0.92, maxTokens = 120 } = {}) {
    if (!useAI || !apiConfig.key || !apiConfig.url || !apiConfig.model) return '';
    const attempts = [
        { temperature, maxTokens, prompt: systemPrompt },
        {
            temperature: Math.max(0.72, temperature - 0.12),
            maxTokens,
            prompt: `${systemPrompt}\n补充要求：如果上一轮你的输出太空、太像模板、或没有真正落到原帖内容上，这次请只抓一个最具体的点，直接给出一句自然的正文。`
        }
    ];
    for (const attempt of attempts) {
        const response = await fetch(`${apiConfig.url.replace(/\/$/, '')}/chat/completions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${apiConfig.key}`
            },
            body: JSON.stringify({
                model: apiConfig.model,
                messages: [{ role: 'system', content: attempt.prompt }],
                temperature: attempt.temperature,
                max_tokens: attempt.maxTokens
            })
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const payload = await response.json();
        const content = sanitizeFeedPost(payload?.choices?.[0]?.message?.content?.trim());
        if (content) return content;
    }
    return '';
}

function extractFeedCommentAnchor(post) {
    const text = String(post?.content || '').trim();
    if (!text) return '这条里有你当下的状态。';
    const parts = text
        .split(/[，。！？!?]/)
        .map(item => item.trim())
        .filter(item => item && item.length >= 3);
    const picked = parts.find(item => item.length <= 16) || parts[0] || text.slice(0, 16);
    return `${picked.slice(0, 18)}${picked.length > 18 ? '…' : ''}`;
}

function buildLocalDriverCircleComment(commentDriver, postDriver, post, slotIndex = 0) {
    const tone = pickFeedCommentTone(commentDriver.id);
    const scene = detectFeedPostScene(post);
    const anchor = extractFeedCommentAnchor(post);
    const openers = {
        playful: [`${anchor} 这句很你。`, `你把 ${anchor} 发出来，我一点不意外。`, `${anchor} 这种内容，也只有你会这样留。`],
        warm: [`${anchor} 这句看着就很真。`, `你把 ${anchor} 写出来，状态已经很明显了。`, `${anchor} 这种话，留出来反而更有分量。`],
        respect: [`${anchor} 这句点得挺准。`, `你把 ${anchor} 放出来，意思已经够清楚了。`, `${anchor} 这一下，我能接上。`],
        hype: [`${anchor} 这句我认。`, `你把 ${anchor} 留在这里，挺对。`, `${anchor} 这种内容，放出来就够了。`]
    };
    const sameTeamTail = [
        '我们这边最近也一直在抠这些感觉。',
        '同队的人看到这种内容 usually 最先懂。',
        '车库里的人基本都会知道你在说哪一块。'
    ];
    const tailMap = {
        training: [
            '这种准备期 usually 只有自己知道有多磨。',
            '训练日越安静，越能看出人有没有撑住。',
            '这种内容发出来，反而比口号更像真状态。'
        ],
        travel: [
            '围场生活里有一半时间，本来就在路上。',
            '时差和落地状态这种事，碰到的人都懂。',
            '这种旅途碎片 usually 比成绩单更像真实日常。'
        ],
        sim: [
            '有些感觉本来就是先在模拟器里冒出来的。',
            '这类东西我们看一眼就知道你在说什么。',
            '屏幕前待久了，脑子会先活在数据里。'
        ],
        fans: [
            '他们看到这条，应该会挺开心。',
            '这种时候回一下看台和留言，通常都值得。',
            '这种内容一发，下面 usually 会很热闹。'
        ],
        weekend: [
            '剩下的就看周末怎么把它跑出来了。',
            '比赛周里，很多东西最后都要落回赛道上。',
            '这类话说完，后面还是得靠赛道回答。'
        ],
        friends: [
            '车队气氛顺的时候，人真的会轻一点。',
            '这种日常，反而最像围场里真实会发生的事。',
            '很多时候就是这些小瞬间最能提气。'
        ],
        life: [
            '偶尔发这种内容，本来就挺好。',
            '这种节奏看着会让人放松一点。',
            '不是每条都聊比赛，反而更像你本人。'
        ],
        general: [
            '这句放出来，比很多场面话都直接。',
            '这种内容留在这里，反而会让人记一下。',
            '你这条至少不像在替谁说标准答案。'
        ]
    };
    let tailPool = tailMap[scene] || tailMap.general;
    if (commentDriver.team === postDriver.team && scene === 'general') tailPool = sameTeamTail;
    const openerPool = openers[tone] || openers.hype;
    const opener = openerPool[slotIndex % openerPool.length];
    const tail = tailPool[(slotIndex + 1) % tailPool.length];
    return stylizeFeedText(commentDriver, `${opener} ${tail}`, 'comment', slotIndex);
}

function buildLocalUserCircleComment(driver, post, slotIndex = 0) {
    const tone = pickFeedCommentTone(driver.id);
    const openers = {
        playful: ['我先来占个位置。', '这条下面我得先出现一下。'],
        warm: ['这条我先记下。', '先在这里留一句。'],
        respect: ['这一条值得看。', '这条内容可以。'],
        hype: ['这条得先顶一下。', '先来这里报个到。']
    };
    const content = String(post?.content || '').trim();
    const tail = content ? `这条下面留一句，刚好。` : '我先在这里露个面。';
    const openerPool = openers[tone] || openers.hype;
    return stylizeFeedText(driver, `${openerPool[slotIndex % openerPool.length]} ${tail}`, 'comment', slotIndex);
}

function buildLocalDriverCommentOnUserPost(driver, post, slotIndex = 0) {
    const tone = pickFeedCommentTone(driver.id);
    const favor = favorability?.[driver.id] || 0;
    const scene = detectFeedPostScene(post);
    const anchor = extractFeedCommentAnchor(post);
    const warmOpeners = [`${anchor} 这句挺自然。`, `你把 ${anchor} 留出来，我多看了一眼。`, `${anchor} 放在今天，刚刚好。`];
    const teaseOpeners = [`你把 ${anchor} 发出来，还挺会挑时机。`, `好，${anchor} 这句我记住了。`, `${anchor} 这种内容，你还挺会卡点。`];
    const coolOpeners = [`${anchor} 这句挺直接。`, `你把 ${anchor} 说出来，已经够清楚了。`, `${anchor} 这一下，我懂你想说什么。`];
    const openerPool = tone === 'playful' ? teaseOpeners : (tone === 'respect' ? coolOpeners : warmOpeners);
    const raceTail = favor >= 65
        ? ['我会记着这条，周末尽量给你点能回头看的东西。', '这种时候被你看到，感觉还不错。', '等比赛跑完，再回来看看这条。']
        : ['先把这周末跑完再说。', '现在先把该做的部分做好。', '这种话比赛周会更容易记住。'];
    const lifeTail = favor >= 65
        ? ['你这一句，确实会让人心情好一点。', '这条我就先收下了。', '这种内容我会记一会儿。']
        : ['这条内容挺有你的感觉。', '这句发得挺自然。', '这种内容留在这里，刚好。'];
    const tailPool = scene === 'weekend' ? raceTail : lifeTail;
    return stylizeFeedText(driver, `${openerPool[slotIndex % openerPool.length]} ${tailPool[(slotIndex + 1) % tailPool.length]}`, 'comment', slotIndex);
}

function buildDriverCommentOnUserPostPrompt(driver, post) {
    const personalityContext = window.getDriverPersonalityContext ? window.getDriverPersonalityContext(driver.id) : '';
    const weekendContext = window.getRaceWeekendPromptContext ? window.getRaceWeekendPromptContext() : '';
    const favor = favorability?.[driver.id] || 0;
    const styleProfile = getFeedStyleProfile(driver.id);
    return `今天是${getCurrentDateInfo()}。
你是 F1 车手 ${driver.name}（${driver.team}），现在要在一位用户发布的围场动态下公开留言。
${getRoleOutputSafetyPrompt('feed')}
${personalityContext}
${weekendContext}
【用户信息】
- 用户名：${userProfile.name}
- 你和用户当前好感度：${favor}/100
【用户动态】
- ${post?.content || '围场近况'}
【留言要求】
- 这是公开评论区留言，不是私聊。
- 你必须先读懂用户发的内容，再决定怎么回，不能空泛敷衍。
- 如果你和用户好感较高，要明显更愿意互动，但仍然保持公开社媒语气，不要写成暧昧私聊。
- 语气要像真实车手会在评论区留的一句：短、自然、有人味，可以带一点熟悉感或玩笑感。
- 以中文为主，除非是极短的口癖或专有名词，否则不要突然整句切成外语。
- 轻松不等于阴阳怪气；除非原帖本身就是非常明显的熟人玩笑，否则不要写讽刺、挖苦、别扭的反话。
- 不要出现“极其”“这就够了”“我看到了”“我收到了”“差不多就是这样”这类模板词。
- 如果帖子提到比赛、围场、成绩、排位或正赛，只能站在当前现实信息内回复，不要编造结果、事故、转会、处罚或伤病。
- 不要加括号动作，不要加引号，不要写解释。
- 长度控制在 10 到 34 个汉字。
【社媒微风格】
- ${styleProfile.prompt}
现在直接输出评论正文。`;
}

async function generateDriverCommentOnUserPost(driver, post, slotIndex = 0) {
    if (!useAI || !apiConfig.key || !apiConfig.url || !apiConfig.model) {
        return buildLocalDriverCommentOnUserPost(driver, post, slotIndex);
    }
    try {
        const content = await requestFeedText(buildDriverCommentOnUserPostPrompt(driver, post), { temperature: 0.92, maxTokens: 90 });
        if (!content) throw new Error('API 返回空内容');
        return content;
    } catch (error) {
        console.warn('用户动态互动评论生成失败，已回退本地回复。', error);
        return buildLocalDriverCommentOnUserPost(driver, post, slotIndex);
    }
}

function buildDriverCircleCommentPrompt(commentDriver, postDriver, post) {
    const personalityContext = window.getDriverPersonalityContext ? window.getDriverPersonalityContext(commentDriver.id) : '';
    const postFacts = summarizeFeedReality(postDriver);
    const weekendContext = window.getRaceWeekendPromptContext ? window.getRaceWeekendPromptContext() : '';
    const styleProfile = getFeedStyleProfile(commentDriver.id);
    return `今天是${getCurrentDateInfo()}。
你是 F1 车手 ${commentDriver.name}（${commentDriver.team}），现在正在另一位车手的公开动态下留言。
${getRoleOutputSafetyPrompt('feed')}
${personalityContext}
${weekendContext}
【发帖车手】
- 车手：${postDriver.name}（${postDriver.team}）
- 你和他的关系：${commentDriver.team === postDriver.team ? '同队，彼此更熟' : '围场熟人，会公开互动'}
【原帖内容】
- ${post?.content || '围场近况'}
【留言要求】
- 你必须先读懂原帖内容，再有针对性地留言，不能像机器人套模板。
- 这是车手对车手的公开评论，不是采访，不是私聊。
- 语气要像真实车手会在 X / IG 评论区顺手留的一句：短、自然、像本人。
- 可以轻松一点、熟人一点，但不要阴阳怪气、不要带刺，也不要为了显得熟而故意怼人。
- 不要出现“极其”“这就够了”“我看到了”“我收到了”“差不多就是这样”这类模板词。
- 以中文为主，除非是极短的口癖、固定碎词或专有名词，否则不要整句写纯外语。
- 如果帖子提到比赛、积分、车队工作或围场情况，必须以当前现实信息为边界，不要编造结果、事故、转会、处罚或伤病。
- 不要复读原帖，不要写空泛鸡汤，不要带括号动作，不要加引号。
- 长度控制在 10 到 32 个汉字，读起来像真实留言。
【社媒微风格】
- ${styleProfile.prompt}
【现实参考】
${postFacts.length ? postFacts.map(item => `- ${item}`).join('\n') : '- 暂无明确赛事新闻可引用，优先承接原帖内容本身。'}
现在直接输出评论正文。`;
}

async function generateDriverCircleComment(commentDriver, postDriver, post, slotIndex = 0) {
    if (!useAI || !apiConfig.key || !apiConfig.url || !apiConfig.model) {
        return buildLocalDriverCircleComment(commentDriver, postDriver, post, slotIndex);
    }
    try {
        const content = await requestFeedText(buildDriverCircleCommentPrompt(commentDriver, postDriver, post), { temperature: 0.9, maxTokens: 90 });
        if (!content) throw new Error('API 返回空内容');
        return content;
    } catch (error) {
        console.warn('围场车手互动评论生成失败，已回退本地回复。', error);
        return buildLocalDriverCircleComment(commentDriver, postDriver, post, slotIndex);
    }
}

async function hydratePostCircleMeta(post, index = 0) {
    if (!post?.circleMeta || post.circleMeta.loading || post.circleMeta.hydrated) return;
    post.circleMeta.loading = true;
    const authorDriver = getDriverByName(post?.name || '');
    const crewDrivers = (post.circleMeta.commentDriverIds || []).map(getDriverById).filter(Boolean);
    try {
        const autoComments = await Promise.all(
            crewDrivers.map(async (driver, slotIndex) => {
                const text = authorDriver
                    ? await generateDriverCircleComment(driver, authorDriver, post, slotIndex + index)
                    : await generateDriverCommentOnUserPost(driver, post, slotIndex + index);
                return {
                    user: driver.name,
                    driverId: driver.id,
                    text,
                    isDriverReply: false,
                    isCircleReply: true
                };
            })
        );
        const favoredCommentCount = authorDriver
            ? 0
            : (post.circleMeta.commentDriverIds || []).filter(driverId => (favorability?.[driverId] || 0) >= 65).length;
        const commentLimit = authorDriver ? 2 : Math.max(2, favoredCommentCount || 0, 3);
        post.circleMeta.autoComments = autoComments.filter(Boolean).slice(0, commentLimit);
        post.circleMeta.hydrated = true;
    } finally {
        post.circleMeta.loading = false;
        renderFeed();
    }
}

function ensurePostCircleMeta(post, index = 0) {
    if (post?.circleMeta) {
        if (!post.circleMeta.hydrated && !post.circleMeta.loading) hydratePostCircleMeta(post, index);
        return post.circleMeta;
    }
    const authorDriver = getDriverByName(post?.name || '');
    const interactionMap = buildPostInteractionMap(authorDriver, index);
    post.circleMeta = {
        commentDriverIds: interactionMap.commentIds,
        likeDriverIds: interactionMap.likeIds,
        autoComments: [],
        hydrated: false,
        loading: false
    };
    hydratePostCircleMeta(post, index);
    return post.circleMeta;
}

function getDriverStandingSnapshot(driver) {
    const driverStanding = (window.driverStandings || []).find(item => item.name === driver.name) || null;
    const teamStanding = (window.teamStandings || []).find(item => String(item.name || '').includes(driver.team)) || null;
    return { driverStanding, teamStanding };
}

function getFeedRelevantNews(driver) {
    const keywords = [driver.name, driver.team, ...(driver.name || '').split(/\s+/)]
        .filter(Boolean)
        .map(text => String(text).toLowerCase());
    const items = (window.mediaNewsItems || []).filter(item => {
        const haystack = `${item.title || ''} ${item.summary || ''} ${item.source || ''}`.toLowerCase();
        return keywords.some(keyword => haystack.includes(keyword));
    });
    return sortMediaNewsByTime(items).slice(0, 2);
}

function summarizeFeedReality(driver) {
    const { driverStanding, teamStanding } = getDriverStandingSnapshot(driver);
    const news = getFeedRelevantNews(driver);
    const facts = [];
    if (driverStanding) facts.push(`${driver.name} 当前车手积分榜第 ${window.driverStandings.indexOf(driverStanding) + 1}，${driverStanding.points} 分`);
    if (teamStanding) facts.push(`${driver.team} 当前车队积分榜第 ${window.teamStandings.indexOf(teamStanding) + 1}，${teamStanding.points} 分`);
    const weekendContext = window.getRaceWeekendPromptContext ? window.getRaceWeekendPromptContext() : '';
    if (weekendContext) facts.push(weekendContext);
    news.forEach(item => facts.push(`近期围场信息：${item.title}`));
    return facts;
}

function pickFeedTopic(driver) {
    const news = getFeedRelevantNews(driver);
    const personality = getFeedDriverPersonality(driver.id);
    const preferred = [];
    if (news.length) preferred.push('weekend', 'garage');
    const interests = String(personality?.interests || '').toLowerCase();
    if (/模拟器|游戏|电竞|编程/.test(interests)) preferred.push('sim');
    if (/训练|骑行|恢复/.test(interests)) preferred.push('training');
    if (/家庭|朋友|车迷/.test(interests)) preferred.push('friends', 'fans');
    if (/音乐|美食|咖啡|宠物|时尚|旅行/.test(interests)) preferred.push('life', 'travel');
    const pool = preferred.length
        ? FEED_TOPIC_POOL.filter(topic => preferred.includes(topic.id)).concat(FEED_TOPIC_POOL)
        : FEED_TOPIC_POOL;
    return pool[Math.floor(Math.random() * pool.length)];
}

function sanitizeFeedPost(text = '') {
    let result = sanitizeRoleOutput(text, 'feed').replace(/\s+/g, ' ').trim();
    result = result.replace(/^["“”'']|["“”'']$/g, '').trim();
    result = result
        .replace(/极其/g, '很')
        .replace(/这就够了/g, '这样就很好')
        .replace(/我看到了。?/g, '')
        .replace(/我收到了。?/g, '')
        .replace(/差不多就是这样。?/g, '大概就是这样。')
        .replace(/继续工作。?/g, '继续做事。')
        .replace(/[ \t]{2,}/g, ' ')
        .trim();
    if (result.length > 140) result = `${result.slice(0, 137).trim()}...`;
    return result;
}

function buildFeedPrompt(driver, topic) {
    const personalityContext = window.getDriverPersonalityContext ? window.getDriverPersonalityContext(driver.id) : '';
    const personality = getFeedDriverPersonality(driver.id);
    const styleProfile = getFeedStyleProfile(driver.id);
    const facts = summarizeFeedReality(driver);
    const weekendContext = window.getRaceWeekendPromptContext ? window.getRaceWeekendPromptContext() : '';
    return `今天是${getCurrentDateInfo()}。
你是 F1 车手 ${driver.name}（${driver.team}），现在要发一条更像 X / 围场社媒风格的短动态。
${getRoleOutputSafetyPrompt('feed')}
${personalityContext}
${weekendContext}
【动态场景】
- 本条主题：${topic?.label || '围场近况'}
- 你在公开社媒上发，不是在接受采访，也不是在私聊用户。
- 语气要像本人平时会发的短 caption：简洁、自然、有人味，可以有一点轻松幽默，但不要硬写段子。
- 比起“发表观点”，更像是在随手记录此刻状态、一个很具体的小瞬间、情绪碎片，或者围场里刚发生的小事。
- 尽量避免空泛鸡汤、官话和模板式积极发言，读起来要像真的有人刚发出去。
- 不要写“极其”“这就够了”“差不多就是这样”“继续工作”“我看到了”“我收到了”这类高重复模板词。
- 同一个意思不要用两句换着说；不要为了像真人而硬塞口头禅。
- 以中文为主，除非是很短的口癖、语气词、固定社媒碎词或专有名词，否则不要整句写成外语。
- 可以聊比赛，也可以聊训练、旅途、恢复、朋友、模拟器、音乐、美食、车队日常、和车迷互动。
- 如果聊比赛或围场新闻，必须以当前现实信息为边界，不要编造冠军、杆位、事故、转会、伤病、处罚或数据。
- 如果当前没有足够现实依据，就写更生活化、更日常的内容，不要强行点评赛事。
- 不要带括号动作，不要写标题，不要加解释。
- 长度控制在 35 到 110 个汉字，读起来像真实车手刚刚发出去的一条动态。
【当前可参考的现实信息】
${facts.length ? facts.map(item => `- ${item}`).join('\n') : '- 暂无明确赛事新闻可引用，优先发生活化内容。'}
【语气补充】
- 这位车手的社媒感：${personality?.social || '自然、克制、像真人短动态'}
- 这位车手的表达禁忌：${personality?.avoid || '不要写得像新闻稿'}
- 社媒微风格：${styleProfile.prompt}
现在直接输出动态正文。`;
}

function buildLocalFeedReply(driver, post, userComment) {
    const lower = String(userComment || '').toLowerCase();
    if (/好帅|帅|爱你|喜欢你|想你/.test(lower)) {
        return stylizeFeedText(driver, `这种话会让我忍不住多看一眼。你这句留得还挺会挑时候。`, 'reply');
    }
    if (/加油|冲|支持|挺你/.test(lower)) {
        return stylizeFeedText(driver, `这类留言我会认真看。有人在后面推着，感觉还是不一样。`, 'reply');
    }
    if (/比赛|排位|正赛|成绩|积分/.test(lower)) {
        return stylizeFeedText(driver, `现在还不想把话说满。等这周真的跑完，再回头看会更准一点。`, 'reply');
    }
    if (/训练|恢复|准备|状态/.test(lower)) {
        return stylizeFeedText(driver, `最近大半时间都在做这些。外面看着安静，其实里面排得很满。`, 'reply');
    }
    return stylizeFeedText(driver, `你这句我留意到了。放在这条下面回你，刚刚好。`, 'reply');
}

function buildFeedReplyPrompt(driver, post, userComment) {
    const personalityContext = window.getDriverPersonalityContext ? window.getDriverPersonalityContext(driver.id) : '';
    const personality = getFeedDriverPersonality(driver.id);
    const styleProfile = getFeedStyleProfile(driver.id);
    const facts = summarizeFeedReality(driver);
    const weekendContext = window.getRaceWeekendPromptContext ? window.getRaceWeekendPromptContext() : '';
    return `今天是${getCurrentDateInfo()}。
你是 F1 车手 ${driver.name}（${driver.team}），现在要在自己刚发的围场动态评论区，公开回复一位用户。
${getRoleOutputSafetyPrompt('feed')}
${personalityContext}
${weekendContext}
【当前动态】
- 你刚发的内容：${post?.content || '围场近况'}
【用户评论】
- 用户名：${userProfile.name}
- 评论内容：${userComment}
【回复要求】
- 这是公开评论区，不是私聊，不要写得像一对一聊天。
- 语气要像真实车手在 X / IG 评论区顺手回一句：自然、短、有人味，可以轻微熟络，但不要冷冰冰，更不要阴阳怪气。
- 必须像本人，会参考这位车手平时的语气和社媒风格。
- 可以承接用户的话，也可以回应自己刚发的那条动态，但不要重复原帖。
- 不要出现“极其”“这就够了”“我看到了”“我收到了”“差不多就是这样”这类模板词。
- 以中文为主，除非是很短的口癖或固定用语，否则不要整句写纯外语。
- 如果提到赛事、成绩、排位、积分或围场情况，必须以当前现实信息为边界，不要编造结果、事故、转会、处罚或伤病。
- 不要写括号动作，不要写旁白，不要加引号，不要解释自己。
- 长度控制在 12 到 45 个汉字，像评论区里真的会出现的一句回复。
【现实参考】
${facts.length ? facts.map(item => `- ${item}`).join('\n') : '- 暂无明确赛事新闻可引用，优先自然回复。'}
【语气补充】
- 这位车手的社媒感：${personality?.social || '自然、克制、像真人短动态'}
- 这位车手的表达禁忌：${personality?.avoid || '不要写得像新闻稿'}
- 社媒微风格：${styleProfile.prompt}
现在直接输出评论回复正文。`;
}

async function generateFeedDriverReply(driver, post, userComment) {
    if (!useAI || !apiConfig.key || !apiConfig.url || !apiConfig.model) {
        return buildLocalFeedReply(driver, post, userComment);
    }
    showLoading(true);
    try {
        const content = await requestFeedText(buildFeedReplyPrompt(driver, post, userComment), { temperature: 0.95, maxTokens: 120 });
        if (!content) throw new Error('API 返回空内容');
        return content;
    } catch (error) {
        console.warn('围场动态评论回复生成失败，已回退本地回复。', error);
        return buildLocalFeedReply(driver, post, userComment);
    } finally {
        showLoading(false);
    }
}

function buildLocalFeedPost(driver, index = 0) {
    const topic = pickFeedTopic(driver);
    const personality = getFeedDriverPersonality(driver.id);
    const { driverStanding, teamStanding } = getDriverStandingSnapshot(driver);
    const news = getFeedRelevantNews(driver);
    const weekendEvent = window.getCurrentRaceWeekendEvent ? window.getCurrentRaceWeekendEvent() : null;
    const openingMap = {
        weekend: [
            weekendEvent?.status === 'live' ? `比赛周开始之后，脑子会自动切到很窄的那条线。` : (driverStanding ? `这一站还是想把该拿到的东西稳稳拿回来。` : `这个周末还有不少空间可以继续往前。`),
            teamStanding ? `${driver.team} 这段时间的工作量很扎实，现在就看怎么把它兑现出来。` : `车库里最近一直在抠那些很细但很重要的东西。`
        ],
        garage: [
            weekendEvent?.status === 'live' ? `今天大半时间都在和工程师对比赛周的细节。` : `今天大半时间都在和工程师把数据又过了一遍。`,
            `很多进步其实都藏在外面完全看不见的那几个小时里。`
        ],
        training: [
            `训练结束之后，最累的 usually 还是脑子。`,
            `恢复日也不算真正轻松，但这种节奏挺熟悉。`
        ],
        travel: [
            `又在路上了，先靠咖啡把人拉回在线。`,
            `时差从来不讲道理，只能自己慢慢找回来。`
        ],
        friends: [
            `今天车队里的气氛不错，这种时候很多事会顺很多。`,
            `围场里总会有人把很长的一天变得没那么长。`
        ],
        fans: [
            `看见看台和留言了，谢谢。`,
            `一直有人在后面推着你往前，这种感觉很难忽视。`
        ],
        life: [
            `有时候一顿像样的饭真的能把一天救回来。`,
            `不聊圈速的时候，脑子反而会转得更顺一点。`
        ],
        sim: [
            `今天不是在车里，就是在模拟器里。`,
            `有些感觉先在屏幕里找到，接下来再把它带去赛道上。`
        ]
    };
    const closerMap = {
        weekend: [
            news[0] ? `先把当下处理好，通常比说大话有用。` : `一步一步来，通常比喊口号靠谱。`,
            personality?.signatures?.[0] ? `${personality.signatures[0]}，继续往前。` : `继续往前。`
        ],
        garage: [
            `这些东西现在看不见，周末大概会慢慢给答案。`,
            `很多时候就是细节决定最后差在哪里。`
        ],
        training: [
            `状态不是喊出来的，还是得一点点做。`,
            `明天大概会感谢今天没有偷懒。`
        ],
        travel: [
            `先把自己调到在线模式。`,
            `落地之后再看看这周会长成什么样。`
        ],
        friends: [
            `这种感觉其实挺重要。`,
            `团队顺的时候，人也会更敢往前推。`
        ],
        fans: [
            `有人一直在场边，很多时候比数据更让人记得住。`,
            `有些支持不会很吵，但真的会留在心里。`
        ],
        life: [
            `偶尔离赛道远一点，脑子反而更清楚。`,
            `有些安静的时刻，本身就已经很好。`
        ],
        sim: [
            `先在模拟器里把方向找对，也算往前。`,
            `今天至少把感觉慢慢找回来了。`
        ]
    };
    const openings = openingMap[topic.id] || openingMap.life;
    const closers = closerMap[topic.id] || closerMap.life;
    const first = openings[index % openings.length];
    const second = closers[(index + 1) % closers.length];
    const text = stylizeFeedText(driver, `${first}${second}`, 'post', index);
    return text || stripChatStageDirections(driver.initialMsg);
}

function estimatePostLikes(driver, index = 0) {
    const base = 90 + index * 23;
    const standing = (window.driverStandings || []).findIndex(item => item.name === driver.name);
    const standingBonus = standing >= 0 ? Math.max(0, 180 - standing * 12) : 0;
    return base + standingBonus;
}

async function generateAIPost() {
    const driver = window.DRIVERS[Math.floor(Math.random() * window.DRIVERS.length)];
    const topic = pickFeedTopic(driver);
    if (!useAI || !apiConfig.key || !apiConfig.url || !apiConfig.model) {
        return {
            id: Date.now(),
            name: driver.name,
            handle: driver.handle,
            avatar: driver.avatarLetter,
            content: buildLocalFeedPost(driver),
            likes: estimatePostLikes(driver),
            comments: [],
            timeAgo: '刚刚'
        };
    }
    const systemPrompt = buildFeedPrompt(driver, topic);
    try {
        const content = await requestFeedText(systemPrompt, { temperature: 0.92, maxTokens: 150 });
        if (!content) throw new Error('API 返回空内容');
        return {
            id: Date.now(),
            name: driver.name,
            handle: driver.handle,
            avatar: driver.avatarLetter,
            content,
            likes: estimatePostLikes(driver),
            comments: [],
            timeAgo: '刚刚'
        };
    } catch (error) {
        console.warn('围场动态生成失败，已回退本地动态。', error);
        return {
            id: Date.now(),
            name: driver.name,
            handle: driver.handle,
            avatar: driver.avatarLetter,
            content: buildLocalFeedPost(driver),
            likes: estimatePostLikes(driver),
            comments: [],
            timeAgo: '刚刚'
        };
    }
}

async function commentOnPost(post, commentText) {
    if (!post.comments) post.comments = [];
    post.comments.push({ user: userProfile.name, text: commentText, isDriverReply: false });
    const driver = window.DRIVERS.find(item => item.name === post.name);
    if (driver) {
        const replyText = await generateFeedDriverReply(driver, post, commentText);
        post.comments.push({ user: driver.name, text: replyText, replyTo: userProfile.name, isDriverReply: true });
    }
    renderFeed();
}

function renderFeed() {
    const container = document.getElementById('feedContainer');
    if (!container) return;
    container.innerHTML = '';
    feedPosts.forEach((post, index) => {
        const circleMeta = ensurePostCircleMeta(post, index);
        const driver = window.DRIVERS.find(item => item.name === post.name);
        const avatarBg = driver ? getDriverAvatarStyle(driver.id) : null;
        const visibleComments = [...(circleMeta?.autoComments || []), ...(post.comments || [])];
        const likeDrivers = (circleMeta?.likeDriverIds || []).map(getDriverById).filter(Boolean);
        const likeCount = Math.max(post.likes || 0, likeDrivers.length + (post.likedByUser ? 1 : 0));
        const card = document.createElement('div');
        card.className = 'post-card';
        card.innerHTML = `
            <div class="post-header">
                <div class="post-avatar" style="${avatarBg ? `background-image:${avatarBg};background-size:cover;` : ''}">${avatarBg ? '' : (post.avatar || '我')}</div>
                <div>
                    <div class="post-user">${escapeHtml(post.name)}</div>
                    <div class="post-handle">@${escapeHtml(post.handle)}</div>
                </div>
                <div class="post-time">${escapeHtml(post.timeAgo || '刚刚')}</div>
            </div>
            <div class="post-content">${escapeHtml(post.content)}</div>
            ${(likeDrivers.length || post.likedByUser) ? `<div class="post-likes-row"><div class="post-likes-avatars">${likeDrivers.slice(0, 5).map(likeDriver => `<span class="post-like-avatar" data-feed-like-avatar="${likeDriver.id}">${escapeHtml(likeDriver.avatarLetter || likeDriver.name.slice(0, 1))}</span>`).join('')}${post.likedByUser ? '<span class="post-like-avatar post-like-avatar-user">你</span>' : ''}</div><div class="post-likes-copy">赞过：${escapeHtml(likeDrivers.slice(0, 4).map(item => item.name).join('、'))}${likeDrivers.length > 4 ? ' 等人' : ''}${post.likedByUser ? `${likeDrivers.length ? '、' : ''}你` : ''}</div></div>` : ''}
            <div class="post-stats">
                <button class="like-btn${post.likedByUser ? ' is-active' : ''}" data-idx="${index}">♥ ${likeCount}</button>
                <button class="comment-btn" data-idx="${index}">评论 ${visibleComments.length}</button>
            </div>
            <div class="comment-section" id="commentSection_${index}"></div>
        `;
        container.appendChild(card);
        const commentSection = document.getElementById(`commentSection_${index}`);
        visibleComments.slice().reverse().forEach(comment => {
            const line = document.createElement('div');
            const replyPrefix = comment.replyTo ? `：回复 ${escapeHtml(comment.replyTo)}：` : '：';
            line.className = 'comment-item';
            line.innerHTML = `<span class="comment-driver">${escapeHtml(comment.user)}</span><span class="comment-text">${replyPrefix}${escapeHtml(comment.text)}</span>`;
            commentSection.appendChild(line);
        });
        const inputWrap = document.createElement('div');
        inputWrap.style.marginTop = '8px';
        inputWrap.style.display = 'flex';
        inputWrap.style.gap = '8px';
        inputWrap.innerHTML = `<input type="text" id="commentInput_${index}" class="chat-input" style="flex:1; padding:6px 12px;" placeholder="写评论..."><button id="submitComment_${index}" class="send-msg-btn" style="padding:6px 12px;">回复</button>`;
        commentSection.appendChild(inputWrap);
    });
    document.querySelectorAll('[data-feed-like-avatar]').forEach(node => {
        const element = node;
        const driverId = element.getAttribute('data-feed-like-avatar');
        if (driverId) renderAvatarOnElement(element, driverId, '28px');
    });
    document.querySelectorAll('.like-btn').forEach(button => {
        button.addEventListener('click', () => {
            const index = Number(button.dataset.idx);
            if (feedPosts[index]) {
                const post = feedPosts[index];
                post.likedByUser = !post.likedByUser;
                if (typeof post.likes !== 'number') {
                    post.likes = 0;
                }
                post.likes += post.likedByUser ? 1 : -1;
                if (post.likes < 0) post.likes = 0;
            }
            renderFeed();
        });
    });
    document.querySelectorAll('[id^="submitComment_"]').forEach(button => {
        button.addEventListener('click', async () => {
            const index = Number(button.id.split('_')[1]);
            const input = document.getElementById(`commentInput_${index}`);
            const text = input.value.trim();
            if (!text) return;
            input.value = '';
            await commentOnPost(feedPosts[index], text);
        });
    });
}

async function refreshFeedWithAI() {
    showLoading(true);
    const generated = await generateAIPost();
    if (generated) feedPosts.unshift(generated);
    renderFeed();
    showLoading(false);
}

function getPostComposerElements() {
    return {
        modal: document.getElementById('postComposerModal'),
        input: document.getElementById('postComposerInput'),
        count: document.getElementById('postComposerCount'),
        submitBtn: document.getElementById('submitPostComposerBtn')
    };
}

function updatePostComposerState() {
    const { input, count, submitBtn } = getPostComposerElements();
    if (!input || !count || !submitBtn) return;
    const rawValue = input.value || '';
    const trimmedValue = rawValue.trim();
    const length = rawValue.length;
    const isTooLong = length > 140;
    count.innerText = `${length}/140`;
    count.classList.toggle('is-over', isTooLong);
    submitBtn.disabled = !trimmedValue || isTooLong;
}

function closePostComposerModal() {
    const { modal, input, count, submitBtn } = getPostComposerElements();
    if (modal) modal.style.display = 'none';
    if (input) input.value = '';
    if (count) {
        count.innerText = '0/140';
        count.classList.remove('is-over');
    }
    if (submitBtn) submitBtn.disabled = true;
}

function openPostComposerModal() {
    const { modal, input } = getPostComposerElements();
    if (!modal || !input) return;
    modal.style.display = 'flex';
    updatePostComposerState();
    window.setTimeout(() => input.focus(), 40);
}

function submitPostComposer() {
    const { input } = getPostComposerElements();
    if (!input) return;
    const content = input.value.trim();
    if (!content) {
        updatePostComposerState();
        return;
    }
    if (content.length > 140) {
        showToast('动态最多 140 字', true);
        updatePostComposerState();
        return;
    }
    feedPosts.unshift({
        id: Date.now(),
        name: userProfile.name,
        handle: 'you',
        avatar: '我',
        content,
        likes: 0,
        comments: [],
        timeAgo: '刚刚'
    });
    closePostComposerModal();
    renderFeed();
    showToast('动态已发布', false);
}

function userPost() {
    openPostComposerModal();
}

window.openPostComposerModal = openPostComposerModal;
window.closePostComposerModal = closePostComposerModal;
window.submitPostComposer = submitPostComposer;
window.updatePostComposerState = updatePostComposerState;

const TEAM_PROFILE_DETAILS = {
    mercedes: {
        label: 'Mercedes-AMG',
        founded: '1954 首秀 / 2010 厂队回归',
        base: '布拉克利 / 布里克斯沃斯',
        legacy: '银箭系谱',
        signature: '工程精度、长线开发、节奏控制',
        hero: '从经典银箭到混动时代统治，速度和秩序感一直是这支车队最鲜明的标签。',
        note: '擅长把比赛拉回自己的节奏，风格冷静、干净、压迫感强。'
    },
    ferrari: {
        label: 'Scuderia Ferrari',
        founded: '1950 全勤至今',
        base: '马拉内罗',
        legacy: '跃马传统',
        signature: '激情、压力、历史重量',
        hero: 'F1 历史里最具象征性的名字之一，围场里几乎每一次红色出场都自带主角光环。',
        note: '这支车队的速度感从来不只来自赛车，也来自它本身背着的传奇。'
    },
    mclaren: {
        label: 'McLaren',
        founded: '1966',
        base: '沃金',
        legacy: '橙色传承',
        signature: '空气效率、轻快节奏、年轻锋芒',
        hero: '从塞纳时代到新世代橙军，McLaren 总带着一种又锐又轻的上升气流。',
        note: '视觉上最有冲刺感的一支车队之一，节奏利落，气质很像高速扫弯。'
    },
    red_bull: {
        label: 'Oracle Red Bull Racing',
        founded: '2005',
        base: '米尔顿凯恩斯',
        legacy: '能量派',
        signature: '高下压力、侵略性、强攻窗口',
        hero: '它更像一支永远在寻找极限边界的队伍，动作直接，风格从不保守。',
        note: '每次状态起来，都会有很强的追击感和压迫感。'
    },
    williams: {
        label: 'Williams Racing',
        founded: '1977',
        base: '格罗夫',
        legacy: '英伦底蕴',
        signature: '传统、韧性、直线气质',
        hero: '老牌车队的轮廓感很重，哪怕经历起伏，身上还是有那种不肯退场的硬气。',
        note: '更像一支把风洞、机械和历史都写进骨架里的队伍。'
    },
    aston_martin: {
        label: 'Aston Martin Aramco',
        founded: '2021 以 Aston Martin 名义回归',
        base: '银石',
        legacy: '英伦绿',
        signature: '奢雅外观、雄心扩张、设施升级',
        hero: '这支队伍的存在感很依赖氛围和野心，看起来总像在打造一个更庞大的长期工程。',
        note: '它的速度感不是最锋利的那种，更像低沉、厚重、带仪式感的推进。'
    },
    alpine: {
        label: 'Alpine',
        founded: '2021 以 Alpine 名义参赛',
        base: '恩斯通',
        legacy: '法式厂队线',
        signature: '轻盈、技术味、阶段性爆发',
        hero: '蓝色外壳下是很典型的欧洲厂队工程感，安静时收着，跑起来会突然很锐。',
        note: '它的魅力常常出现在细节点火的瞬间。'
    },
    haas: {
        label: 'MoneyGram Haas F1 Team',
        founded: '2016',
        base: '卡纳波利斯 / 班伯里',
        legacy: '美式独立队',
        signature: '直接、务实、抓机会',
        hero: '更像围场里的硬派生存者，不铺张，靠效率和判断把分数咬下来。',
        note: '一旦周末走势对味，这种队伍会非常有“黑马冲线”的快感。'
    },
    racing_bulls: {
        label: 'Racing Bulls',
        founded: '2006 起步的法恩扎支线',
        base: '法恩扎',
        legacy: '青年梯队',
        signature: '培养、试炼、轻量节奏',
        hero: '这支车队的味道很特别，像围场里专门为新锐车手准备的高速成长赛道。',
        note: '它不是最厚重的名字，但往往有最灵活、最轻快的转向感。'
    },
    audi: {
        label: 'Audi F1 Team',
        founded: '2026 新时代加入',
        base: '欣维尔',
        legacy: '德系新章',
        signature: '品牌入局、体系重构、长期项目',
        hero: '它代表的是一个全新周期的开端，整个项目本身就带着很强的未来感和秩序感。',
        note: '现阶段更像正在建立速度语言的新工厂，气氛偏冷、偏精密。'
    },
    cadillac: {
        label: 'Cadillac Formula 1 Team',
        founded: '2026 新军',
        base: '美国项目中枢',
        legacy: '新势力入场',
        signature: '美式体量、品牌声势、从零搭建',
        hero: 'Cadillac 的魅力在于它像一台刚推上发车区的新机器，厚重、陌生、却很有存在感。',
        note: '它的故事感更多来自“正在建立”，而不是已经完成。'
    }
};

let activeStandingsTeamKey = 'mercedes';
let activeStandingsDriverId = 'ant';

const DRIVER_TEAM_KEY_BY_ID = {
    nor: 'mclaren',
    pia: 'mclaren',
    lec: 'ferrari',
    ham: 'ferrari',
    rus: 'mercedes',
    ant: 'mercedes',
    ver: 'red_bull',
    hadjar: 'red_bull',
    alo: 'aston_martin',
    str: 'aston_martin',
    alb: 'williams',
    sai: 'williams',
    gas: 'alpine',
    col: 'alpine',
    oco: 'haas',
    bea: 'haas',
    hul: 'audi',
    bor: 'audi',
    law: 'racing_bulls',
    lin: 'racing_bulls',
    per: 'cadillac',
    bot: 'cadillac'
};

function normalizeStandingsTeamKey(teamName = '') {
    const text = String(teamName || '').toLowerCase();
    if (text.includes('mercedes')) return 'mercedes';
    if (text.includes('ferrari')) return 'ferrari';
    if (text.includes('mclaren')) return 'mclaren';
    if (text.includes('red bull')) return 'red_bull';
    if (text.includes('williams')) return 'williams';
    if (text.includes('aston martin')) return 'aston_martin';
    if (text.includes('alpine')) return 'alpine';
    if (text.includes('haas')) return 'haas';
    if (text.includes('racing bulls')) return 'racing_bulls';
    if (text.includes('audi')) return 'audi';
    if (text.includes('cadillac')) return 'cadillac';
    return text.replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '') || 'team';
}

function getStandingsTeamDisplayName(teamName = '') {
    const match = String(teamName || '').match(/\(([^)]+)\)/);
    return match?.[1] || String(teamName || '').trim();
}

function getReadableStandingsAccent(color = '#9aa5b5') {
    const hex = String(color || '').replace('#', '');
    if (hex.length !== 6) return color;
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
    if (luminance < 0.24) {
        return '#d7dfed';
    }
    return color;
}

function resolveDriverTeamKey(driverId = '', teamName = '') {
    return DRIVER_TEAM_KEY_BY_ID[driverId] || normalizeStandingsTeamKey(teamName);
}

function getStandingsTeamDrivers(teamKey) {
    return (window.DRIVERS || [])
        .filter(driver => resolveDriverTeamKey(driver.id, driver.team) === teamKey)
        .map(driver => driver.name);
}

function buildStandingsTeamProfile(team, index) {
    const teamKey = normalizeStandingsTeamKey(team?.name);
    const details = TEAM_PROFILE_DETAILS[teamKey] || {
        label: getStandingsTeamDisplayName(team?.name),
        founded: '围场资料更新中',
        base: 'Paddock Network',
        legacy: '当前档案',
        signature: '速度、节奏、开发',
        hero: '这支车队正在用自己的方式往积分榜上推进，资料面板会继续补充更完整的历史线索。',
        note: '当前可先从积分、颜色和车手阵容里读它的比赛气质。'
    };
    const drivers = getStandingsTeamDrivers(teamKey);
    return {
        key: teamKey,
        color: team?.color || '#9aa5b5',
        rank: index + 1,
        points: Number(team?.points || 0),
        displayName: getStandingsTeamDisplayName(team?.name),
        fullName: getStandingsTeamDisplayName(team?.name) || details.label,
        details,
        drivers
    };
}

function buildDriverLegacyStatus(profile) {
    if (!profile) return '围场资料同步中';
    const championships = Array.isArray(profile.championships) ? profile.championships.length : 0;
    const wins = Number(profile.totalWins || 0);
    const debutText = String(profile.f1Debut || '');
    if (championships >= 4) return '王者序列';
    if (championships >= 1) return '世界冠军';
    if (wins >= 10) return '前列常客';
    if (wins >= 1) return '分站冠军';
    if (debutText.includes('2026')) return '2026 新秀';
    if (debutText.includes('2025')) return '二年级窗口';
    return '围场主力';
}

function buildDriverLegacyHero(driver, profile, standing, rank) {
    const championships = Array.isArray(profile?.championships) ? profile.championships.length : 0;
    const wins = Number(profile?.totalWins || 0);
    const debutText = String(profile?.f1Debut || '');
    if (championships >= 1) {
        return `${driver.name} 现在以 ${standing.points} 分站在 2026 车手积分榜第 ${rank}，履历上已经背着 ${championships} 个世界冠军头衔，是这张榜单里最有历史重量的那批名字之一。`;
    }
    if (wins >= 5) {
        return `${driver.name} 目前以 ${standing.points} 分排在第 ${rank}，他的生涯已经不只是在围场里站稳，而是有了足够多能够定义个人速度语言的胜利节点。`;
    }
    if (wins >= 1) {
        return `${driver.name} 现在以 ${standing.points} 分位列第 ${rank}，已经完成过分站夺冠这道门槛，眼下更像是在把零散的高光慢慢压成更稳定的前排节奏。`;
    }
    if (debutText.includes('2026')) {
        return `${driver.name} 作为 2026 赛季的新秀，目前已经拿到 ${standing.points} 分、排在第 ${rank}，这更像是他的第一份围场成绩单，信息量比数字本身还要大。`;
    }
    return `${driver.name} 目前以 ${standing.points} 分排在第 ${rank}，这份档案更像是在记录他如何把经验、速度和位置一点点推到更前面。`;
}

function buildDriverLegacyNote(driver, profile) {
    const championships = Array.isArray(profile?.championships) ? profile.championships.length : 0;
    const wins = Number(profile?.totalWins || 0);
    if (championships >= 1) return '他的比赛气质更像高压下的稳定输出，真正的威胁往往来自那种不需要夸张动作的掌控力。';
    if (wins >= 10) return '这种级别的车手通常不靠单次爆闪立住，而是靠很长时间里的速度密度。';
    if (wins >= 1) return '已经赢过的人，围场看他的方式会完全不同，很多时候差的是把势头继续延长。';
    return '现阶段更像是在把周末完整度一点点拼出来，资料卡里最值得看的就是他正在形成的比赛轮廓。';
}

function getDriverCareerHighlight(profile) {
    if (Array.isArray(profile?.championships) && profile.championships.length) {
        const latest = profile.championships[profile.championships.length - 1];
        return `${latest.year} · ${latest.desc || '世界冠军'}`;
    }
    if (Array.isArray(profile?.wins) && profile.wins.length) {
        const firstWin = profile.wins[0];
        return `${firstWin.year} · ${firstWin.desc || firstWin.race || '分站冠军'}`;
    }
    return profile?.f1Debut || '生涯资料同步中';
}

function buildStandingsDriverProfile(standing, index) {
    const driver = (window.DRIVERS || []).find(item => item.name === standing?.name) || null;
    const profile = driver ? window.DRIVER_PROFILES?.[driver.id] : null;
    const teamKey = resolveDriverTeamKey(driver?.id, standing?.team || driver?.team || '');
    const teamProfile = TEAM_PROFILE_DETAILS[teamKey] || null;
    return {
        id: driver?.id || `driver-${index}`,
        rank: index + 1,
        points: Number(standing?.points || 0),
        name: standing?.name || driver?.name || 'Driver',
        teamDisplay: teamProfile?.label || getStandingsTeamDisplayName(standing?.team || driver?.team || ''),
        accent: teamProfile?.color || null,
        teamColor: teamProfile ? (window.teamStandings || []).find(item => normalizeStandingsTeamKey(item.name) === teamKey)?.color || '#9aa5b5' : '#9aa5b5',
        profile,
        driver,
        status: buildDriverLegacyStatus(profile),
        hero: buildDriverLegacyHero(driver || { name: standing?.name || '这位车手' }, profile, standing, index + 1),
        note: buildDriverLegacyNote(driver || { name: standing?.name || '这位车手' }, profile),
        highlight: getDriverCareerHighlight(profile)
    };
}

function renderStandingsTeamPanel(profile) {
    const safe = value => escapeHtml(String(value ?? ''));
    return `
        <div class="team-legacy-panel" style="--team-accent:${safe(profile.color)};">
            <div class="team-legacy-speedline" aria-hidden="true"></div>
            <div class="team-legacy-top">
                <div>
                    <div class="team-legacy-kicker">TEAM DOSSIER</div>
                    <div class="team-legacy-name">${safe(profile.displayName)}</div>
                    <div class="team-legacy-subtitle">${safe(profile.details.label)}</div>
                </div>
                <div class="team-legacy-rankbox">
                    <span class="team-legacy-rank-label">P${profile.rank}</span>
                    <span class="team-legacy-points">${profile.points} pts</span>
                </div>
            </div>
            <div class="team-legacy-tags">
                <span class="team-legacy-tag">${safe(profile.details.founded)}</span>
                <span class="team-legacy-tag">${safe(profile.details.base)}</span>
                <span class="team-legacy-tag team-legacy-tag-accent">${safe(profile.details.legacy)}</span>
            </div>
            <div class="team-legacy-copy">${safe(profile.details.hero)}</div>
            <div class="team-legacy-grid">
                <article class="team-legacy-card">
                    <div class="team-legacy-card-label">速度语言</div>
                    <div class="team-legacy-card-value">${safe(profile.details.signature)}</div>
                </article>
                <article class="team-legacy-card">
                    <div class="team-legacy-card-label">当前双车阵容</div>
                    <div class="team-legacy-card-value">${profile.drivers.length ? profile.drivers.map(name => safe(name)).join(' / ') : '资料同步中'}</div>
                </article>
            </div>
            <div class="team-legacy-note">${safe(profile.details.note)}</div>
        </div>
    `;
}

function renderStandingsDriverPanel(profile) {
    const safe = value => escapeHtml(String(value ?? ''));
    const championships = Array.isArray(profile.profile?.championships) ? profile.profile.championships.length : 0;
    const wins = Number(profile.profile?.totalWins || 0);
    const poles = Number(profile.profile?.totalPoles || 0);
    const podiums = Number(profile.profile?.totalPodiums || 0);
    const age = profile.profile?.age ? `${profile.profile.age} 岁` : '围场资料同步中';
    const debut = profile.profile?.f1Debut || '生涯起点同步中';
    return `
        <div class="driver-legacy-panel" style="--driver-accent:${safe(profile.teamColor)};">
            <div class="driver-legacy-rail" aria-hidden="true"></div>
            <div class="driver-legacy-top">
                <div>
                    <div class="driver-legacy-kicker">DRIVER DOSSIER</div>
                    <div class="driver-legacy-name">${safe(profile.name)}</div>
                    <div class="driver-legacy-subtitle">${safe(profile.teamDisplay)} · ${safe(profile.status)}</div>
                </div>
                <div class="driver-legacy-rankbox">
                    <span class="driver-legacy-rank-label">P${profile.rank}</span>
                    <span class="driver-legacy-points">${profile.points} pts</span>
                </div>
            </div>
            <div class="driver-legacy-tags">
                <span class="driver-legacy-tag">${safe(age)}</span>
                <span class="driver-legacy-tag">${safe(debut)}</span>
                <span class="driver-legacy-tag driver-legacy-tag-accent">${safe(profile.highlight)}</span>
            </div>
            <div class="driver-legacy-copy">${safe(profile.hero)}</div>
            <div class="driver-legacy-grid">
                <article class="driver-legacy-card">
                    <div class="driver-legacy-card-label">生涯数据</div>
                    <div class="driver-legacy-card-value">${championships} 冠 · ${wins} 胜 · ${poles} 杆位 · ${podiums} 次领奖台</div>
                </article>
                <article class="driver-legacy-card">
                    <div class="driver-legacy-card-label">2026 当前定位</div>
                    <div class="driver-legacy-card-value">积分榜第 ${profile.rank}，目前拿到 ${profile.points} 分，效力于 ${safe(profile.teamDisplay)}</div>
                </article>
            </div>
            <div class="driver-legacy-note">${safe(profile.note)}</div>
        </div>
    `;
}

function renderStandings() {
    const container = document.getElementById('standingsContainer');
    if (!container) return;
    const teamProfiles = (window.teamStandings || []).map((team, index) => buildStandingsTeamProfile(team, index));
    if (!teamProfiles.length) {
        container.innerHTML = '';
        return;
    }
    if (!teamProfiles.some(profile => profile.key === activeStandingsTeamKey)) {
        activeStandingsTeamKey = teamProfiles[0].key;
    }
    const activeProfile = teamProfiles.find(profile => profile.key === activeStandingsTeamKey) || teamProfiles[0];
    const driverProfiles = (window.driverStandings || []).map((driverStanding, index) => buildStandingsDriverProfile(driverStanding, index));
    if (!driverProfiles.some(profile => profile.id === activeStandingsDriverId)) {
        activeStandingsDriverId = driverProfiles[0]?.id || '';
    }
    const activeDriverProfile = driverProfiles.find(profile => profile.id === activeStandingsDriverId) || driverProfiles[0];
    container.innerHTML = `
        <div class="standings-section">
            <div class="section-title">车队积分榜</div>
            <div class="standings-team-shell">
                <div class="standings-team-table-wrap">
                    <table class="standings-table standings-team-table">
                        <thead><tr><th>Pos</th><th>车队</th><th>积分</th></tr></thead>
                        <tbody>${teamProfiles.map(profile => `
                            <tr class="team-standing-row${profile.key === activeProfile.key ? ' is-active' : ''}" data-team-key="${profile.key}" tabindex="0" style="--team-accent:${profile.color};">
                                <td class="pos">${profile.rank}</td>
                                <td>
                                    <div class="team-standing-namewrap">
                                        <span class="team-standing-glowline" aria-hidden="true"></span>
                                        <span class="team-standing-name" style="color:${getReadableStandingsAccent(profile.color)}">${escapeHtml(profile.displayName)}</span>
                                        <span class="team-standing-hint">Hover / Tap</span>
                                    </div>
                                </td>
                                <td class="points">${profile.points}</td>
                            </tr>
                        `).join('')}</tbody>
                    </table>
                </div>
                <div class="standings-team-panel-wrap" id="standingsTeamPanelWrap">
                    ${renderStandingsTeamPanel(activeProfile)}
                </div>
            </div>
        </div>
        <div class="standings-section">
            <div class="section-title">车手积分榜</div>
            <div class="standings-driver-shell">
                <div class="standings-driver-table-wrap">
                    <table class="standings-table standings-driver-table">
                        <thead><tr><th>Pos</th><th>车手</th><th>车队</th><th>积分</th></tr></thead>
                        <tbody>${driverProfiles.map(profile => `
                            <tr class="driver-standing-row${profile.id === activeDriverProfile.id ? ' is-active' : ''}" data-driver-id="${profile.id}" tabindex="0" style="--driver-accent:${profile.teamColor};">
                                <td class="pos">${profile.rank}</td>
                                <td>
                                    <div class="driver-standing-namewrap">
                                        <span class="driver-standing-trace" aria-hidden="true"></span>
                                        <span class="driver-standing-name">${escapeHtml(profile.name)}</span>
                                    </div>
                                </td>
                                <td class="driver-standing-team">${escapeHtml(profile.teamDisplay)}</td>
                                <td class="points">${profile.points}</td>
                            </tr>
                        `).join('')}</tbody>
                    </table>
                </div>
                <div class="standings-driver-panel-wrap" id="standingsDriverPanelWrap">
                    ${renderStandingsDriverPanel(activeDriverProfile)}
                </div>
            </div>
        </div>
    `;
    const panelWrap = document.getElementById('standingsTeamPanelWrap');
    const driverPanelWrap = document.getElementById('standingsDriverPanelWrap');
    const activateTeamProfile = teamKey => {
        const nextProfile = teamProfiles.find(profile => profile.key === teamKey);
        if (!nextProfile || !panelWrap) return;
        activeStandingsTeamKey = teamKey;
        container.querySelectorAll('.team-standing-row').forEach(row => {
            row.classList.toggle('is-active', row.dataset.teamKey === teamKey);
        });
        panelWrap.classList.remove('is-visible');
        requestAnimationFrame(() => {
            panelWrap.innerHTML = renderStandingsTeamPanel(nextProfile);
            panelWrap.classList.add('is-visible');
        });
    };
    container.querySelectorAll('.team-standing-row').forEach(row => {
        const teamKey = row.dataset.teamKey || '';
        row.addEventListener('mouseenter', () => {
            if (window.matchMedia?.('(hover: hover)').matches) activateTeamProfile(teamKey);
        });
        row.addEventListener('focus', () => activateTeamProfile(teamKey));
        row.addEventListener('click', () => activateTeamProfile(teamKey));
    });
    const activateDriverProfile = driverId => {
        const nextProfile = driverProfiles.find(profile => profile.id === driverId);
        if (!nextProfile || !driverPanelWrap) return;
        activeStandingsDriverId = driverId;
        container.querySelectorAll('.driver-standing-row').forEach(row => {
            row.classList.toggle('is-active', row.dataset.driverId === driverId);
        });
        driverPanelWrap.classList.remove('is-visible');
        requestAnimationFrame(() => {
            driverPanelWrap.innerHTML = renderStandingsDriverPanel(nextProfile);
            driverPanelWrap.classList.add('is-visible');
        });
    };
    container.querySelectorAll('.driver-standing-row').forEach(row => {
        const driverId = row.dataset.driverId || '';
        row.addEventListener('mouseenter', () => {
            if (window.matchMedia?.('(hover: hover)').matches) activateDriverProfile(driverId);
        });
        row.addEventListener('focus', () => activateDriverProfile(driverId));
        row.addEventListener('click', () => activateDriverProfile(driverId));
    });
    requestAnimationFrame(() => {
        panelWrap?.classList.add('is-visible');
        driverPanelWrap?.classList.add('is-visible');
    });
}

const MEDIA_NEWS_FEEDS = [
    { source: 'Crash.net', sourceIcon: 'CR', feedUrl: 'https://www.crash.net/rss/f1', kind: 'rss' },
    { source: 'Motorsport.com', sourceIcon: 'MS', feedUrl: 'https://www.motorsport.com/rss/f1/news/', kind: 'rss' },
    { source: '每日赛车', sourceIcon: '赛', feedUrl: 'https://news.google.com/rss/search?q=F1+(site:romielf.com)&hl=zh-CN&gl=CN&ceid=CN:zh-Hans', kind: 'rss' },
    { source: '腾讯体育 F1', sourceIcon: '腾', feedUrl: 'https://news.google.com/rss/search?q=F1+(site:sports.qq.com+OR+site:new.qq.com)&hl=zh-CN&gl=CN&ceid=CN:zh-Hans', kind: 'rss' },
    { source: 'Google News F1', sourceIcon: 'GN', feedUrl: 'https://news.google.com/rss/search?q=Formula+1+OR+F1&hl=en-US&gl=US&ceid=US:en', kind: 'rss' },
    { source: 'Google News 中文F1', sourceIcon: '中', feedUrl: 'https://news.google.com/rss/search?q=F1+%E8%B5%9B%E8%BD%A6+OR+F1+%E5%A4%A7%E5%A5%96%E8%B5%9B&hl=zh-CN&gl=CN&ceid=CN:zh-Hans', kind: 'rss' },
    { source: 'Google News 国内报道', sourceIcon: 'CN', feedUrl: 'https://news.google.com/rss/search?q=F1+(site:thepaper.cn+OR+site:xinhuanet.com+OR+site:sina.com.cn+OR+site:163.com+OR+site:people.com.cn)&hl=zh-CN&gl=CN&ceid=CN:zh-Hans', kind: 'rss' }
];

const MEDIA_NEWS_CACHE_KEY = 'f1_media_news_cache';
const MEDIA_NEWS_CACHE_TIME_KEY = 'f1_media_news_cache_time';
const MEDIA_NEWS_STATUS_KEY = 'f1_media_news_status';
const MEDIA_NEWS_FILTER_KEY = 'f1_media_news_filter';
const MEDIA_NEWS_CACHE_TTL = 30 * 60 * 1000;

let mediaNewsRefreshPromise = null;
let hasAttemptedInitialMediaRefresh = false;
let mediaNewsStatus = {
    mode: 'fallback',
    label: '静态资讯',
    detail: '当前显示内置资讯',
    updatedAt: null,
    sourceCount: 0
};
let mediaNewsFilter = { region: 'all', keyword: 'all' };

function decodeHtmlEntities(text = '') {
    const parser = new DOMParser();
    return parser.parseFromString(String(text), 'text/html').documentElement.textContent || '';
}

function stripHtmlTags(text = '') {
    return String(text)
        .replace(/<script[\s\S]*?<\/script>/gi, ' ')
        .replace(/<style[\s\S]*?<\/style>/gi, ' ')
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}

function normalizeMediaText(text = '') {
    return decodeHtmlEntities(stripHtmlTags(text))
        .replace(/\u00a0/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}

function getMediaKeywordOptions() {
    const base = [
        { id: 'all', label: '全部关键词', patterns: [] },
        { id: 'ferrari', label: '法拉利', patterns: ['ferrari', '法拉利', 'leclerc', 'hamilton', 'charles', 'lewis'] },
        { id: 'verstappen', label: '维斯塔潘', patterns: ['verstappen', 'max', '维斯塔潘'] },
        { id: 'hamilton', label: '汉密尔顿', patterns: ['hamilton', 'lewis', '汉密尔顿'] }
    ];
    const dynamic = (window.DRIVERS || []).map(driver => ({
        id: driver.id,
        label: driver.name,
        patterns: [String(driver.name || '').toLowerCase(), String(driver.team || '').toLowerCase(), ...String(driver.name || '').toLowerCase().split(/\s+/)]
    }));
    const seen = new Set();
    return [...base, ...dynamic].filter(option => {
        if (seen.has(option.id)) return false;
        seen.add(option.id);
        return true;
    });
}

function detectMediaRegion(news) {
    const source = String(news?.source || '');
    const url = String(news?.url || '');
    if (/thepaper\.cn|xinhuanet\.com|sina\.com\.cn|163\.com|people\.com\.cn|romielf\.com|sports\.qq\.com|new\.qq\.com/i.test(url)) return 'cn';
    if (/Google News 中文F1|Google News 国内报道|中文|国内|澎湃|新华社|新浪|网易|人民网|每日赛车|腾讯体育/u.test(source)) return 'cn';
    return 'en';
}

function getMediaSourceTone(news) {
    const source = String(news?.source || '');
    if (/google news/i.test(source)) return 'agg';
    return detectMediaRegion(news);
}

function getMediaSourceToneLabel(news) {
    const tone = getMediaSourceTone(news);
    if (tone === 'cn') return '国内';
    if (tone === 'agg') return '聚合';
    return '英文';
}

function getCurrentMediaKeywordOption() {
    return getMediaKeywordOptions().find(option => option.id === mediaNewsFilter.keyword) || getMediaKeywordOptions()[0];
}

function matchesMediaKeyword(news, option) {
    if (!option || option.id === 'all') return true;
    const haystack = `${news.title || ''} ${news.summary || ''} ${news.source || ''}`.toLowerCase();
    return option.patterns.some(pattern => haystack.includes(String(pattern || '').toLowerCase()));
}

function filterMediaItems(items) {
    const keywordOption = getCurrentMediaKeywordOption();
    return items.filter(item => {
        const regionOk = mediaNewsFilter.region === 'all' ? true : detectMediaRegion(item) === mediaNewsFilter.region;
        return regionOk && matchesMediaKeyword(item, keywordOption);
    });
}

function setMediaNewsFilter(nextFilter = {}) {
    mediaNewsFilter = { ...mediaNewsFilter, ...nextFilter };
    try {
        localStorage.setItem(MEDIA_NEWS_FILTER_KEY, JSON.stringify(mediaNewsFilter));
    } catch (error) {
        console.warn('缓存资讯筛选失败', error);
    }
}

function loadMediaNewsFilter() {
    try {
        const raw = localStorage.getItem(MEDIA_NEWS_FILTER_KEY);
        if (!raw) return;
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object') mediaNewsFilter = { ...mediaNewsFilter, ...parsed };
    } catch (error) {
        console.warn('读取资讯筛选失败', error);
    }
}

function getMediaStatusMarkup() {
    const updatedText = mediaNewsStatus.updatedAt ? formatMediaTime(mediaNewsStatus.updatedAt) : '未更新';
    const sourceCount = mediaNewsStatus.sourceCount || 0;
    return `
        <div class="media-news-status" data-media-status-mode="${escapeHtml(mediaNewsStatus.mode || 'fallback')}">
            <div class="media-news-status-main">
                <span class="media-news-status-badge">${escapeHtml(mediaNewsStatus.label || '静态资讯')}</span>
                <span class="media-news-status-text">${escapeHtml(mediaNewsStatus.detail || '')}</span>
            </div>
            <div class="media-news-status-meta">最近更新：${escapeHtml(updatedText)} · 来源数：${sourceCount}</div>
        </div>
    `;
}

function setMediaNewsStatus(nextStatus = {}) {
    mediaNewsStatus = { ...mediaNewsStatus, ...nextStatus };
    try {
        localStorage.setItem(MEDIA_NEWS_STATUS_KEY, JSON.stringify(mediaNewsStatus));
    } catch (error) {
        console.warn('缓存资讯状态失败', error);
    }
}

function loadMediaNewsStatus() {
    try {
        const raw = localStorage.getItem(MEDIA_NEWS_STATUS_KEY);
        if (!raw) return;
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object') mediaNewsStatus = { ...mediaNewsStatus, ...parsed };
    } catch (error) {
        console.warn('读取资讯状态失败', error);
    }
}

function buildMediaSummary(item, fallbackSource) {
    const rawDescription = item.querySelector('description')?.textContent || item.querySelector('content\\:encoded')?.textContent || '';
    const cleaned = normalizeMediaText(rawDescription);
    if (cleaned) return cleaned.slice(0, 140) + (cleaned.length > 140 ? '...' : '');
    return `${fallbackSource} 最新 F1 资讯，点击查看全文。`;
}

function extractMediaSourceMeta(item, fallbackFeed) {
    let sourceName = normalizeMediaText(item.querySelector('source')?.textContent || '') || fallbackFeed.source;
    sourceName = sourceName.replace(/\s*-\s*Google News$/i, '').trim();
    const sourceIcon = sourceName
        .split(/[\s./-]+/)
        .filter(Boolean)
        .slice(0, 2)
        .map(part => part[0]?.toUpperCase() || '')
        .join('')
        .slice(0, 2) || fallbackFeed.sourceIcon;
    return { source: sourceName, sourceIcon };
}

function parseMediaFeedXml(xmlText, fallbackFeed) {
    const xml = new DOMParser().parseFromString(xmlText, 'text/xml');
    if (xml.querySelector('parsererror')) throw new Error(`${fallbackFeed.source} feed parse failed`);
    return Array.from(xml.querySelectorAll('item')).map((item, index) => {
        const title = normalizeMediaText(item.querySelector('title')?.textContent || '');
        const url = normalizeMediaText(item.querySelector('link')?.textContent || '');
        const timestamp = item.querySelector('pubDate')?.textContent || item.querySelector('published')?.textContent || new Date().toISOString();
        const { source, sourceIcon } = extractMediaSourceMeta(item, fallbackFeed);
        return {
            id: `${fallbackFeed.source}-${index}-${url || title}`,
            source,
            sourceIcon,
            title,
            summary: buildMediaSummary(item, source),
            url,
            timestamp
        };
    }).filter(item => item.title && item.url);
}

async function fetchMediaFeed(feed) {
    const proxyUrls = [
        `https://api.allorigins.win/raw?url=${encodeURIComponent(feed.feedUrl)}`,
        `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feed.feedUrl)}`
    ];
    let lastError = null;
    for (const proxyUrl of proxyUrls) {
        try {
            const response = await fetch(proxyUrl, { cache: 'no-store' });
            if (!response.ok) throw new Error(`${feed.source} HTTP ${response.status}`);
            if (proxyUrl.includes('rss2json')) {
                const payload = await response.json();
                if (!Array.isArray(payload?.items)) throw new Error(`${feed.source} JSON feed invalid`);
                return payload.items.map((item, index) => {
                    const rawSummary = normalizeMediaText(item.description || '');
                    return {
                        id: `${feed.source}-${index}-${item.link || item.title}`,
                        source: normalizeMediaText(item.author || feed.source),
                        sourceIcon: feed.sourceIcon,
                        title: normalizeMediaText(item.title || ''),
                        summary: rawSummary.slice(0, 140) + (rawSummary.length > 140 ? '...' : ''),
                        url: normalizeMediaText(item.link || ''),
                        timestamp: item.pubDate || new Date().toISOString()
                    };
                }).filter(item => item.title && item.url);
            }
            const xmlText = await response.text();
            return parseMediaFeedXml(xmlText, feed);
        } catch (error) {
            lastError = error;
        }
    }
    throw lastError || new Error(`${feed.source} feed fetch failed`);
}

function dedupeMediaItems(items) {
    const seen = new Set();
    return items.filter(item => {
        const key = `${item.url}::${item.title}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
    });
}

function cacheMediaNews(items) {
    try {
        localStorage.setItem(MEDIA_NEWS_CACHE_KEY, JSON.stringify(items));
        localStorage.setItem(MEDIA_NEWS_CACHE_TIME_KEY, String(Date.now()));
    } catch (error) {
        console.warn('缓存媒体资讯失败', error);
    }
}

function loadCachedMediaNews() {
    try {
        const raw = localStorage.getItem(MEDIA_NEWS_CACHE_KEY);
        const ts = Number(localStorage.getItem(MEDIA_NEWS_CACHE_TIME_KEY) || 0);
        if (!raw || !ts || Date.now() - ts > MEDIA_NEWS_CACHE_TTL) return null;
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : null;
    } catch (error) {
        console.warn('读取媒体资讯缓存失败', error);
        return null;
    }
}

async function refreshMediaNews(force = false) {
    if (mediaNewsRefreshPromise && !force) return mediaNewsRefreshPromise;
    mediaNewsRefreshPromise = (async () => {
        const cached = !force ? loadCachedMediaNews() : null;
        if (cached?.length) {
            window.mediaNewsItems = cached;
            setMediaNewsStatus({
                mode: 'cache',
                label: '使用缓存',
                detail: '已从本地缓存恢复最近资讯',
                updatedAt: localStorage.getItem(MEDIA_NEWS_CACHE_TIME_KEY) || new Date().toISOString(),
                sourceCount: new Set(cached.map(item => item.source)).size
            });
            return cached;
        }

        const settled = await Promise.allSettled(MEDIA_NEWS_FEEDS.map(fetchMediaFeed));
        const freshItems = dedupeMediaItems(
            settled
                .filter(result => result.status === 'fulfilled')
                .flatMap(result => result.value)
        );
        if (!freshItems.length) throw new Error('没有拉取到最新资讯');

        const latest = sortMediaNewsByTime(freshItems).slice(0, 12);
        window.mediaNewsItems = latest;
        cacheMediaNews(latest);
        setMediaNewsStatus({
            mode: 'live',
            label: '实时拉取',
            detail: '已联网更新最新媒体报道',
            updatedAt: new Date().toISOString(),
            sourceCount: new Set(latest.map(item => item.source)).size
        });
        return latest;
    })();

    try {
        return await mediaNewsRefreshPromise;
    } finally {
        mediaNewsRefreshPromise = null;
    }
}

function getMediaFilterBarMarkup() {
    const regionMarkup = [
        { id: 'all', label: '全部' },
        { id: 'cn', label: '只看国内' },
        { id: 'en', label: '只看英文' }
    ].map(option => `<button type="button" class="media-filter-chip ${mediaNewsFilter.region === option.id ? 'active' : ''}" data-media-region="${option.id}">${escapeHtml(option.label)}</button>`).join('');
    const keywordMarkup = getMediaKeywordOptions().map(option => `<button type="button" class="media-filter-chip media-filter-chip-keyword ${mediaNewsFilter.keyword === option.id ? 'active' : ''}" data-media-keyword="${option.id}">${escapeHtml(option.label)}</button>`).join('');
    return `
        <div class="media-filter-bar">
            <div class="media-filter-row">${regionMarkup}</div>
            <div class="media-filter-row media-filter-row-head"><div class="media-filter-label">车手 / 车队筛选</div></div>
            <div class="media-filter-row media-filter-row-scroll">${keywordMarkup}</div>
        </div>
    `;
}

function renderMediaPage() {
    const container = document.getElementById('mediaContainer');
    if (!container) return;
    const sorted = sortMediaNewsByTime(window.mediaNewsItems || []);
    const filtered = filterMediaItems(sorted);
    const cards = filtered.length ? filtered.map(news => `
        <div class="media-news-card">
            <div class="media-news-header">
                <div class="media-source-icon">${news.sourceIcon}</div>
                <div class="media-source-stack">
                    <div class="media-source-name">${escapeHtml(news.source)}</div>
                    <div class="media-source-tags">
                        <span class="media-source-tag media-source-tag-${getMediaSourceTone(news)}">${escapeHtml(getMediaSourceToneLabel(news))}</span>
                        <span class="media-source-tag media-source-tag-${detectMediaRegion(news)}">${detectMediaRegion(news) === 'cn' ? '中文/国内' : '英文/海外'}</span>
                    </div>
                </div>
                <div class="media-news-time">${formatMediaTime(news.timestamp)}</div>
            </div>
            <div class="media-news-title">${escapeHtml(news.title)}</div>
            <div class="media-news-summary">${escapeHtml(news.summary)}</div>
            <a href="${news.url}" target="_blank" rel="noopener noreferrer" class="media-read-more">阅读全文 →</a>
        </div>
    `).join('') : `<div class="media-news-card"><div class="media-news-title">当前筛选下没有结果</div><div class="media-news-summary">可以切回“全部”，或者换一个车手关键词试试。</div></div>`;
    container.innerHTML = `<button id="refreshMediaBtn" class="refresh-media">刷新资讯</button>${getMediaStatusMarkup()}${getMediaFilterBarMarkup()}${cards}`;
    document.getElementById('refreshMediaBtn')?.addEventListener('click', async event => {
        const button = event.currentTarget;
        if (button instanceof HTMLButtonElement) {
            button.disabled = true;
            button.innerText = '拉取中...';
        }
        showLoading(true);
        try {
            await refreshMediaNews(true);
            renderMediaPage();
            showToast('最新资讯已更新', false);
        } catch (error) {
            setMediaNewsStatus({
                mode: 'fallback',
                label: '回退静态',
                detail: '联网失败，暂时显示缓存或内置资讯',
                updatedAt: mediaNewsStatus.updatedAt || null,
                sourceCount: new Set((window.mediaNewsItems || []).map(item => item.source)).size
            });
            renderMediaPage();
            handleApiError(error, '媒体资讯刷新');
        } finally {
            showLoading(false);
            if (button instanceof HTMLButtonElement) {
                button.disabled = false;
                button.innerText = '刷新资讯';
            }
        }
    });

    if (!hasAttemptedInitialMediaRefresh) {
        hasAttemptedInitialMediaRefresh = true;
        refreshMediaNews(false)
            .then(() => renderMediaPage())
            .catch(error => {
                setMediaNewsStatus({
                    mode: 'fallback',
                    label: '静态兜底',
                    detail: '首次拉取失败，当前显示内置资讯',
                    updatedAt: null,
                    sourceCount: new Set((window.mediaNewsItems || []).map(item => item.source)).size
                });
                console.warn('初始化媒体资讯失败', error);
                renderMediaPage();
            });
    }
    document.querySelectorAll('[data-media-region]').forEach(button => button.addEventListener('click', event => {
        const target = event.currentTarget;
        if (!(target instanceof HTMLButtonElement)) return;
        setMediaNewsFilter({ region: target.dataset.mediaRegion || 'all' });
        renderMediaPage();
    }));
    document.querySelectorAll('[data-media-keyword]').forEach(button => button.addEventListener('click', event => {
        const target = event.currentTarget;
        if (!(target instanceof HTMLButtonElement)) return;
        setMediaNewsFilter({ keyword: target.dataset.mediaKeyword || 'all' });
        renderMediaPage();
    }));
}

function renderRaceRankings() {
    const container = document.getElementById('raceRankingsContainer');
    if (!container) return;
    const standings = window.raceSessionData?.seasonStandings?.drivers || [];
    if (!standings.length) {
        container.innerHTML = '<div class="rankings-section"><div class="section-title">当前暂无排名数据</div></div>';
        return;
    }
    container.innerHTML = `
        <div class="rankings-section">
            <div class="section-title">当前赛季排名</div>
            <table class="rankings-table">
                <thead><tr><th>Pos</th><th>车手</th><th>车队</th><th>积分</th></tr></thead>
                <tbody>${standings.map((item, index) => `<tr><td class="rank">${index + 1}</td><td>${escapeHtml(item.name)}</td><td>${escapeHtml(item.team)}</td><td class="points">${item.points}</td></tr>`).join('')}</tbody>
            </table>
        </div>
    `;
}

