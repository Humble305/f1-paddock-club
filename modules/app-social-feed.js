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
        prompt: '句子偏短，像随手发出来的，带一点轻松和自嘲感；偶尔可以有极短英文碎词，但不要每条都来。',
        tails: {
            post: ['not bad。', '差不多就这样。'],
            reply: ['fair enough。', '我会看到这种。'],
            comment: ['很你。', '这句挺本人。']
        }
    },
    pia: {
        prompt: '句子更短，判断先行，情绪收着；干净、冷静、带一点很淡的冷幽默，不要拖沓。',
        tails: {
            post: ['还行。', '差不多。'],
            reply: ['我记下了。', '这句可以。'],
            comment: ['挺准。', '这条可以。']
        }
    },
    lec: {
        prompt: '句子更流动、更细腻一点，情绪真但克制；可以有一点温柔的停顿感和优雅感，不要写成抒情散文。',
        tails: {
            post: ['这种时刻我会记一下。', '感觉挺好。'],
            reply: ['我知道你在说什么。', '我收到了。'],
            comment: ['这条发得很好。', '这种内容很你。']
        }
    },
    ham: {
        prompt: '句子更完整，更温暖，会自然照顾读者感受；偶尔有一点鼓励和使命感，但绝不要写成演讲稿。',
        tails: {
            post: ['这种感觉我会记住。', '继续工作。'],
            reply: ['谢谢你留这句。', '这种支持我会记得。'],
            comment: ['这条很真。', '这个状态很好。']
        }
    },
    ver: {
        prompt: '更直接，更短，更少修饰；判断很快，不会铺垫太多，重点落在真实感受和赛车本身。',
        tails: {
            post: ['就这样。', '够了，继续。'],
            reply: ['我看到了。', '差不多就是这样。'],
            comment: ['这句对。', '懂。']
        }
    },
    alo: {
        prompt: '老练、干脆、略带一点很轻的老将幽默；不是阴阳怪气，而是那种懂围场的人才会有的松弛感。',
        tails: {
            post: ['有意思。', '慢慢来。'],
            reply: ['这条我认。', '这句不错。'],
            comment: ['挺像你。', '我懂这条。']
        }
    },
    alb: {
        prompt: '更友好、更口语，像会把气氛接住的人；自然、顺、带一点轻松感。',
        tails: {
            post: [' honestly，还不错。', '差不多是这样。'],
            reply: ['我先回你一下。', '这种留言挺好。'],
            comment: ['这条挺好。', '会让人看完笑一下。']
        }
    },
    sai: {
        prompt: '表达更完整、更稳，条理清楚但不官腔；看起来像很会发社媒的人，但不会刻意营业。',
        tails: {
            post: ['一步一步来。', '就先这样。'],
            reply: ['我收到了。', '谢谢你这句。'],
            comment: ['发得不错。', '这种内容挺好。']
        }
    },
    gas: {
        prompt: '情绪更明显一点，更有人味，句子会更流动；真诚但不要过度煽情。',
        tails: {
            post: ['这种感觉挺真实。', '我会记得这一刻。'],
            reply: ['这种话会让人停一下。', '谢谢你认真留这句。'],
            comment: ['这条挺真。', '看完会停一下。']
        }
    },
    bot: {
        prompt: '更松弛，句子短，带一点不费力的冷幽默；生活感强，不会装深沉。',
        tails: {
            post: ['fair enough。', '差不多够了。'],
            reply: ['我看到了。', '这句还行。'],
            comment: ['不错。', '会发。']
        }
    }
};

function getFeedStyleProfile(driverId) {
    return FEED_STYLE_PROFILES[driverId] || {
        prompt: '保持这个车手本人的社媒感，在句长、停顿、玩笑频率上自然区分，不要写成统一模板。',
        tails: {
            post: ['就先这样。'],
            reply: ['我看到了。'],
            comment: ['这条不错。']
        }
    };
}

function stylizeFeedText(driver, text, mode = 'post', slotIndex = 0) {
    const profile = getFeedStyleProfile(driver?.id);
    let result = sanitizeFeedPost(text);
    if (!result) return result;
    const tailPool = profile?.tails?.[mode] || [];
    const tail = tailPool[slotIndex % tailPool.length];
    if (tail && !result.includes(tail.replace(/[。]/g, '').trim())) {
        if (result.length <= 84 && mode === 'post') {
            result = `${result}${/[。！？.!?]$/.test(result) ? '' : '。'}${tail}`;
        } else if (mode !== 'post' && result.length <= 32) {
            result = `${result}${/[。！？.!?]$/.test(result) ? '' : '。'}${tail}`;
        }
    }
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

function buildLocalDriverCircleComment(commentDriver, postDriver, post, slotIndex = 0) {
    const tone = pickFeedCommentTone(commentDriver.id);
    const scene = detectFeedPostScene(post);
    const openers = {
        playful: ['这条很像你会发的。', '看到这句基本能猜到是你。', '这条语气很本人。'],
        warm: ['这条挺真诚的。', '看得出来你这会儿状态不错。', '这句发得挺好。'],
        respect: ['这条说得挺准。', '这句有内容。', '这一条我认。'],
        hype: ['可以，继续。', '这条状态对了。', '这一句有点东西。']
    };
    const sameTeamTail = [
        '我们这边最近也在抠这些细节。',
        '同队的人看这种内容 usually 最有感。',
        '车库里的人大概都会懂你这句。'
    ];
    const tailMap = {
        training: [
            '恢复和准备这种事，只有自己最清楚有多磨人。',
            '这种日子看起来安静，其实最考验人。',
            '训练内容发出来，反而更像真实周内状态。'
        ],
        travel: [
            '围场生活有一半时间确实都在路上。',
            '时差和落地状态，谁碰谁知道。',
            '这种旅途碎片 usually 比成绩单更像真实日常。'
        ],
        sim: [
            '有些感觉确实先在模拟器里找到。',
            '这类内容我们都很熟。',
            '屏幕前待久了，脑子真的会先活在数据里。'
        ],
        fans: [
            '他们看到这条应该会很开心。',
            '这种时候回一下车迷 usually 是对的。',
            '这种内容发出来，下面大概会很热闹。'
        ],
        weekend: [
            '剩下的就看周末怎么把它兑现出来了。',
            '比赛周里，这种心态挺重要。',
            '讲得对，后面还是得靠赛道回答。'
        ],
        friends: [
            '车队气氛顺的时候，人也会轻松很多。',
            '这种日常才最像围场里面真实会发生的东西。',
            '有时候就是这些小瞬间最能提气。'
        ],
        life: [
            '偶尔发这种内容也挺好。',
            '这种节奏看着就很舒服。',
            '不是每条都聊比赛，其实更像本人。'
        ],
        general: [
            '这条发得很自然。',
            '看完会让人停一下的那种。',
            '这种状态继续保持就很好。'
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
    const tail = content ? `你这句发得挺完整。` : '我先在这条下面打个卡。';
    const openerPool = openers[tone] || openers.hype;
    return stylizeFeedText(driver, `${openerPool[slotIndex % openerPool.length]} ${tail}`, 'comment', slotIndex);
}

function buildLocalDriverCommentOnUserPost(driver, post, slotIndex = 0) {
    const tone = pickFeedCommentTone(driver.id);
    const favor = favorability?.[driver.id] || 0;
    const scene = detectFeedPostScene(post);
    const warmOpeners = ['这条我看到了。', '你这条发得不错。', '我看到这句的时候停了一下。'];
    const teaseOpeners = ['你这条挑的时机还挺准。', '这条我当然会看到。', '好，这句我记下了。'];
    const coolOpeners = ['这条挺直接。', '你这句还挺准。', '我懂你在说什么。'];
    const openerPool = tone === 'playful' ? teaseOpeners : (tone === 'respect' ? coolOpeners : warmOpeners);
    const raceTail = favor >= 65
        ? ['我会记着这条，周末尽量给你点能回头看的东西。', '这种时候被你看到，感觉还不错。', '等比赛跑完，再回来看看这条。']
        : ['先把这周末跑完再说。', '现在先把该做的部分做好。', '这种话比赛周会更容易记住。'];
    const lifeTail = favor >= 65
        ? ['你这一句，确实会让人心情好一点。', '这条我就先收下了。', '这种内容我会记一会儿。']
        : ['这条内容挺有你的感觉。', '这句发得挺自然。', '我看到这条了。'];
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
- 轻松不等于阴阳怪气；除非原帖本身就是非常明显的熟人玩笑，否则不要写讽刺、挖苦、别扭的反话。
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
        const response = await fetch(`${apiConfig.url.replace(/\/$/, '')}/chat/completions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${apiConfig.key}`
            },
            body: JSON.stringify({
                model: apiConfig.model,
                messages: [{ role: 'system', content: buildDriverCommentOnUserPostPrompt(driver, post) }],
                temperature: 0.92,
                max_tokens: 90
            })
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const payload = await response.json();
        const content = sanitizeFeedPost(payload?.choices?.[0]?.message?.content?.trim());
        if (!content) throw new Error('API 返回空内容');
        return content;
    } catch (error) {
        console.warn('用户动态互动评论生成失败，回退本地模板。', error);
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
        const response = await fetch(`${apiConfig.url.replace(/\/$/, '')}/chat/completions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${apiConfig.key}`
            },
            body: JSON.stringify({
                model: apiConfig.model,
                messages: [{ role: 'system', content: buildDriverCircleCommentPrompt(commentDriver, postDriver, post) }],
                temperature: 0.9,
                max_tokens: 90
            })
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const payload = await response.json();
        const content = sanitizeFeedPost(payload?.choices?.[0]?.message?.content?.trim());
        if (!content) throw new Error('API 返回空内容');
        return content;
    } catch (error) {
        console.warn('围场车手互动评论生成失败，回退本地模板。', error);
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
    const signatures = getFeedDriverPersonality(driver.id)?.signatures || [];
    const signOff = signatures[0] ? ` ${signatures[0]}。` : '';
    if (/好帅|帅|爱你|喜欢你|想你/.test(lower)) {
        return stylizeFeedText(driver, `看到这种话还是会笑一下。你这条我收到了。${signOff}`, 'reply');
    }
    if (/加油|冲|支持|挺你/.test(lower)) {
        return stylizeFeedText(driver, `收到。你们在下面这么喊，确实会让人更想把这周末跑漂亮一点。${signOff}`, 'reply');
    }
    if (/比赛|排位|正赛|成绩|积分/.test(lower)) {
        return stylizeFeedText(driver, `先把该做的部分做好，后面的结果自然会跟上。现在还没到可以下结论的时候。${signOff}`, 'reply');
    }
    if (/训练|恢复|准备|状态/.test(lower)) {
        return stylizeFeedText(driver, `这种内容我会看到的。最近确实都在做这些。${signOff}`, 'reply');
    }
    return stylizeFeedText(driver, `看到了。谢谢你认真留这句，我先在这里回你一下。${signOff}`, 'reply');
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
        const response = await fetch(`${apiConfig.url.replace(/\/$/, '')}/chat/completions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${apiConfig.key}`
            },
            body: JSON.stringify({
                model: apiConfig.model,
                messages: [{ role: 'system', content: buildFeedReplyPrompt(driver, post, userComment) }],
                temperature: 0.95,
                max_tokens: 120
            })
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const payload = await response.json();
        const content = sanitizeFeedPost(payload?.choices?.[0]?.message?.content?.trim());
        if (!content) throw new Error('API 返回空内容');
        return content;
    } catch (error) {
        handleApiError(error, '围场动态评论回复');
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
            `我都记得。`,
            `会努力给你们一些值得等的内容。`
        ],
        life: [
            `偶尔离赛道远一点，脑子反而更清楚。`,
            `差不多就这样，挺好。`
        ],
        sim: [
            `先在模拟器里把方向找对也不错。`,
            `至少今天感觉是对的。`
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
        const response = await fetch(`${apiConfig.url.replace(/\/$/, '')}/chat/completions`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiConfig.key}` },
            body: JSON.stringify({ model: apiConfig.model, messages: [{ role: 'system', content: systemPrompt }], temperature: 0.92, max_tokens: 150 })
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const payload = await response.json();
        const content = sanitizeFeedPost(payload?.choices?.[0]?.message?.content?.trim());
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
        handleApiError(error, '围场动态生成');
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

function renderStandings() {
    const container = document.getElementById('standingsContainer');
    if (!container) return;
    container.innerHTML = `
        <div class="standings-section">
            <div class="section-title">车队积分榜</div>
            <table class="standings-table">
                <thead><tr><th>Pos</th><th>车队</th><th>积分</th></tr></thead>
                <tbody>${window.teamStandings.map((team, index) => `<tr><td class="pos">${index + 1}</td><td style="color:${team.color}">${team.name}</td><td class="points">${team.points}</td></tr>`).join('')}</tbody>
            </table>
        </div>
        <div class="standings-section">
            <div class="section-title">车手积分榜</div>
            <table class="standings-table">
                <thead><tr><th>Pos</th><th>车手</th><th>车队</th><th>积分</th></tr></thead>
                <tbody>${window.driverStandings.map((driver, index) => `<tr><td class="pos">${index + 1}</td><td>${driver.name}</td><td style="font-size:0.7rem">${driver.team}</td><td class="points">${driver.points}</td></tr>`).join('')}</tbody>
            </table>
        </div>
    `;
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

