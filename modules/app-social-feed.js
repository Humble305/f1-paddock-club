// 围场动态、媒体、积分与排名视图

const FEED_SCENE_POOLS = {
    routine: ['晨跑完回到围场，耳边还在回放工程师刚才那段无线电。', '今天的节奏很满，训练、会议、进模拟器，一个都没少。', '刚结束体能训练，腿有点发酸，但脑子反而更清醒了。'],
    paddock: ['围场里今天风有点大，走到车房门口时差点把手里的笔记吹跑。', '刚从车房出来，大家都在忙，我反而更喜欢这种有点乱但很专注的感觉。', '今天在围场里来回跑了很多趟，最后还是会不自觉站回赛车旁边。'],
    food: ['午饭比想象中简单，最后还是多拿了一份水果，不然下午撑不住。', '刚喝到今天第一口像样的咖啡，感觉整个人终于上线了。', '围场餐食偶尔会有惊喜，今天那份热食算是让我心情加了点分。'],
    setup: ['今天和工程师把几个细节重新顺了一遍，车的反馈开始更像我想要的样子。', '有些设定看起来只是小修小改，真正坐进车里差别会很明显。', '今天最满意的不是单圈，而是终于把那点别扭的感觉调顺了。'],
    mood: ['最近状态不算吵闹，就是很专注，知道自己下一步该做什么。', '有些日子不需要太多形容，只要按自己的节奏往前推就够了。', '今天不是那种热血上头的好，而是一种很稳的好。'],
    offtrack: ['离开车房以后终于安静了一会儿，发现自己最想念的还是普通一点的生活感。', '晚上想早点休息，但大概率还是会再回看一遍今天的数据。', '收工以后最舒服的时刻，往往就是把手机放下的前一分钟。'],
    banter: ['队友刚才看了我一眼，那个表情已经说明他也觉得今天挺漫长。', '工程师说得很克制，但我听得出来他对今天这个进展挺满意。', '今天车房里有人一直在哼歌，害我后来满脑子都是那段旋律。']
};

const FEED_PERSONA_HINTS = {
    nor: '语气轻松、嘴硬带一点俏皮，像把围场日常随手发出来。',
    pia: '冷静、简短、干净，偶尔带一点很淡的幽默。',
    lec: '细腻、克制、讲究氛围感，像随手记录一天里的小片刻。',
    ham: '成熟、温柔、有自我要求，但不要写成口号。',
    rus: '理性、认真、有条理，带一点职业车手的自律感。',
    ant: '年轻、兴奋但不吵，像在快速适应顶级赛事生活。',
    ver: '直接、锋利、嫌废话多，但不是冷漠。',
    hadjar: '年轻、带点不服输，偶尔有一点轻微的张扬。',
    alo: '老练、淡定，像什么都见过，所以更知道什么值得说。',
    str: '低调、平稳，不要写得太外放。',
    alb: '友好、轻松、带一点会逗人的温度。',
    sai: '讲究节奏和生活质感，像在认真过一天。',
    gas: '随性、利落、带一点法式松弛感，但仍然专注。',
    col: '年轻、真诚、带点新鲜感。',
    oco: '克制、直给、工作状态很强。',
    bea: '年轻、礼貌、带点还在上升期的兴奋。',
    hul: '成熟、干脆、略带老将式幽默。',
    bor: '真诚、轻快、有一点新人视角。',
    law: '稳、利落、不拖泥带水。',
    lin: '新秀感、冲劲足，但要显得真实。',
    per: '圆融、亲和、会把复杂一天说得轻一点。',
    bot: '松弛、平静，带一点北欧式干净幽默。'
};

function pickFeedSeeds() {
    const poolKeys = Object.keys(FEED_SCENE_POOLS).sort(() => Math.random() - 0.5).slice(0, 3);
    return poolKeys.map(key => FEED_SCENE_POOLS[key][Math.floor(Math.random() * FEED_SCENE_POOLS[key].length)]);
}

function buildFeedPrompt(driver) {
    const currentRace = window.f1RaceDatabase?.currentRaceName || '当前分站周';
    const currentRound = window.raceSessionData?.currentRound || window.f1RaceDatabase?.currentRound || '';
    const personalityHint = FEED_PERSONA_HINTS[driver.id] || '语气自然、克制、像真实车手日常发动态。';
    const seeds = pickFeedSeeds();
    return `今天是${getCurrentDateInfo()}。你是 F1 车手 ${driver.name}（${driver.team}）。
请写一条适合围场动态流发布的近况，长度控制在 45 到 90 字。
【场景参考】${currentRound ? `第 ${currentRound} 站` : ''}${currentRace}
【人设要求】${personalityHint}
【内容方向】
- 更像真实生活里的随手动态，不要写成采访回答、媒体通稿或总结发言。
- 可以写训练、车房、工程会议、饮食、恢复、天气、队友互动、行程节奏、围场小观察，但必须贴近现实，不要夸张失真。
- 允许一点幽默、调侃、疲惫感或松弛感，但不要违背角色人设。
- 可以带 1 到 2 个自然的 emoji 点缀气氛，但不要堆砌，也不要每条都像营业文案。
- 只写一条正文，不要分段，不要标题，不要括号动作。
- 除角色固定口癖外，只能使用中文和中文标点，不要出现任何外语单词、缩写、账号名、标签或网址。
【灵感种子】${seeds.join(' / ')}
${getRoleOutputSafetyPrompt('feed')}`;
}

function generateLocalFeedPost(driver) {
    const personaLead = {
        nor: ['今天的节奏有点满，但还挺好玩。', '刚忙完一轮，脑子还在转。'],
        pia: ['今天整体还算顺。', '事情很多，但节奏还在掌控里。'],
        lec: ['今天有几个安静的小瞬间让我印象很深。', '忙了一整天，反而是在车房外那几分钟最放松。'],
        ham: ['今天更多是在和自己较劲。', '有些进步不需要说得太大声。'],
        ver: ['今天没什么花哨的，就是把该做的事做完。', '状态还行，剩下的继续往下推。']
    };
    const leads = personaLead[driver.id] || ['今天在围场里待了很久。', '这一天下来，脑子里还是赛车的声音。'];
    const details = pickFeedSeeds();
    const tail = ['现在只想安静一会儿，明天继续。', '这种普通但扎实的一天，其实也不错。', '先收工，剩下的留给明天。'];
    return sanitizeRoleOutput(`${leads[Math.floor(Math.random() * leads.length)]}${details[0]}${tail[Math.floor(Math.random() * tail.length)]}`, 'feed');
}

async function generateAIPost() {
    const driver = window.DRIVERS[Math.floor(Math.random() * window.DRIVERS.length)];
    if (!useAI || !apiConfig.key || !apiConfig.url || !apiConfig.model) {
        return { id: Date.now(), name: driver.name, handle: driver.handle, avatar: driver.avatarLetter, content: generateLocalFeedPost(driver), likes: Math.floor(Math.random() * 800) + 100, comments: [], timeAgo: '刚刚' };
    }
    const systemPrompt = buildFeedPrompt(driver);
    try {
        const response = await fetch(`${apiConfig.url.replace(/\/$/, '')}/chat/completions`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiConfig.key}` },
            body: JSON.stringify({ model: apiConfig.model, messages: [{ role: 'system', content: systemPrompt }], temperature: 1.0, max_tokens: 140 })
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const payload = await response.json();
        const content = sanitizeRoleOutput(payload?.choices?.[0]?.message?.content?.trim(), 'feed');
        if (!content) throw new Error('API 返回空内容');
        return { id: Date.now(), name: driver.name, handle: driver.handle, avatar: driver.avatarLetter, content, likes: Math.floor(Math.random() * 800) + 100, comments: [], timeAgo: '刚刚' };
    } catch (error) {
        handleApiError(error, '围场动态生成');
        return { id: Date.now(), name: driver.name, handle: driver.handle, avatar: driver.avatarLetter, content: generateLocalFeedPost(driver), likes: Math.floor(Math.random() * 800) + 100, comments: [], timeAgo: '刚刚' };
    }
}

async function userPost() {
    const content = prompt('想发一条什么动态？');
    if (!content) return;
    feedPosts.unshift({ id: Date.now(), name: userProfile.name, handle: 'you', avatar: '我', content, likes: 0, comments: [], timeAgo: '刚刚' });
    renderFeed();
    showToast('动态已发布', false);
}

async function commentOnPost(post, commentText) {
    if (!post.comments) post.comments = [];
    post.comments.push({ user: userProfile.name, text: commentText, isDriverReply: false });
    const driver = window.DRIVERS.find(item => item.name === post.name);
    if (driver) {
        const reply = await getDriverReplyWithFavor(driver, commentText);
        post.comments.push({ user: driver.name, text: reply.reply, isDriverReply: true });
    }
    renderFeed();
}

function renderFeed() {
    const container = document.getElementById('feedContainer');
    if (!container) return;
    container.innerHTML = '';
    feedPosts.forEach((post, index) => {
        const driver = window.DRIVERS.find(item => item.name === post.name);
        const avatarBg = driver ? getDriverAvatarStyle(driver.id) : null;
        const card = document.createElement('div');
        card.className = 'post-card';
        card.innerHTML = `<div class="post-header"><div class="post-avatar" style="${avatarBg ? `background-image:${avatarBg};background-size:cover;` : ''}">${avatarBg ? '' : (post.avatar || '我')}</div><div><div class="post-user">${escapeHtml(post.name)}</div><div class="post-handle">@${escapeHtml(post.handle)}</div></div><div class="post-time">${escapeHtml(post.timeAgo || '刚刚')}</div></div><div class="post-content">${escapeHtml(post.content)}</div><div class="post-stats"><button class="like-btn" data-idx="${index}">❤ ${post.likes || 0}</button><button class="comment-btn" data-idx="${index}">💬 ${(post.comments || []).length}</button></div><div class="comment-section" id="commentSection_${index}"></div>`;
        container.appendChild(card);
        const commentSection = document.getElementById(`commentSection_${index}`);
        (post.comments || []).slice().reverse().forEach(comment => {
            const line = document.createElement('div');
            line.className = 'comment-item';
            line.innerHTML = `<span class="comment-driver">${escapeHtml(comment.user)}</span><span class="comment-text">：${escapeHtml(comment.text)}</span>${comment.isDriverReply ? '<span class="reply-badge"> 车手回复</span>' : ''}`;
            commentSection.appendChild(line);
        });
        const inputWrap = document.createElement('div');
        inputWrap.style.marginTop = '8px';
        inputWrap.style.display = 'flex';
        inputWrap.style.gap = '8px';
        inputWrap.innerHTML = `<input type="text" id="commentInput_${index}" class="chat-input" style="flex:1; padding:6px 12px;" placeholder="写评论..."><button id="submitComment_${index}" class="send-msg-btn" style="padding:6px 12px;">回复</button>`;
        commentSection.appendChild(inputWrap);
    });

    document.querySelectorAll('.like-btn').forEach(button => button.addEventListener('click', () => {
        const index = Number(button.dataset.idx);
        if (feedPosts[index]) feedPosts[index].likes = (feedPosts[index].likes || 0) + 1;
        renderFeed();
    }));

    document.querySelectorAll('[id^="submitComment_"]').forEach(button => button.addEventListener('click', async () => {
        const index = Number(button.id.split('_')[1]);
        const input = document.getElementById(`commentInput_${index}`);
        const text = input.value.trim();
        if (!text) return;
        input.value = '';
        await commentOnPost(feedPosts[index], text);
    }));
}

async function refreshFeedWithAI() {
    showLoading(true);
    const generated = await generateAIPost();
    if (generated) feedPosts.unshift(generated);
    renderFeed();
    showLoading(false);
}

const FEED_POST_MAX_LENGTH = 140;

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
    const isTooLong = length > FEED_POST_MAX_LENGTH;
    count.innerText = `${length}/${FEED_POST_MAX_LENGTH}`;
    count.classList.toggle('is-over', isTooLong);
    submitBtn.disabled = !trimmedValue || isTooLong;
}

function closePostComposerModal() {
    const { modal, input, count, submitBtn } = getPostComposerElements();
    if (modal) modal.style.display = 'none';
    if (input) input.value = '';
    if (count) {
        count.innerText = `0/${FEED_POST_MAX_LENGTH}`;
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
    if (content.length > FEED_POST_MAX_LENGTH) {
        showToast(`动态最多 ${FEED_POST_MAX_LENGTH} 字`, true);
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
    const seasonDrivers = window.raceSessionData?.seasonStandings?.drivers || [];
    const currentRound = window.raceSessionData?.currentRound || window.f1RaceDatabase?.currentRound || '-';
    const currentRaceName = window.f1RaceDatabase?.currentRaceName || '当前分站';
    const qualifyingTop3 = window.raceSessionData?.qualifying?.top10?.slice(0, 3) || [];
    const raceTop3 = (window.raceSessionData?.race?.top10 || window.raceSessionData?.race?.raceResult || []).slice(0, 3);
    const topDriver = seasonDrivers[0];

    container.innerHTML = `
        <div class="standings-section">
            <div class="section-title">赛季概览</div>
            <div class="profile-card-info-row"><span>当前轮次</span><span>第 ${currentRound} 站</span></div>
            <div class="profile-card-info-row"><span>当前分站</span><span>${escapeHtml(currentRaceName)}</span></div>
            <div class="profile-card-info-row"><span>车手领跑者</span><span>${topDriver ? `${escapeHtml(topDriver.name)} · ${topDriver.points} 分` : '暂无'}</span></div>
        </div>
        <div class="standings-section">
            <div class="section-title">当前站排位 Top 3</div>
            <table class="standings-table">
                <thead><tr><th>Pos</th><th>车手</th><th>车队</th><th>成绩</th></tr></thead>
                <tbody>${qualifyingTop3.length ? qualifyingTop3.map(item => `<tr><td class="pos">${item.pos}</td><td>${escapeHtml(item.driver)}</td><td>${escapeHtml(item.team)}</td><td class="points">${escapeHtml(item.time)}</td></tr>`).join('') : '<tr><td colspan="4">暂无排位数据</td></tr>'}</tbody>
            </table>
        </div>
        <div class="standings-section">
            <div class="section-title">当前站正赛 Top 3</div>
            <table class="standings-table">
                <thead><tr><th>Pos</th><th>车手</th><th>车队</th><th>积分</th></tr></thead>
                <tbody>${raceTop3.length ? raceTop3.map(item => `<tr><td class="pos">${item.pos}</td><td>${escapeHtml(item.driver)}</td><td>${escapeHtml(item.team)}</td><td class="points">${item.points}</td></tr>`).join('') : '<tr><td colspan="4">暂无正赛数据</td></tr>'}</tbody>
            </table>
        </div>
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
        <div class="standings-section">
            <div class="section-title">赛季排名详情</div>
            <table class="standings-table">
                <thead><tr><th>Pos</th><th>车手</th><th>车队</th><th>积分</th><th>胜场</th></tr></thead>
                <tbody>${seasonDrivers.length ? seasonDrivers.map(item => `<tr><td class="pos">${item.pos}</td><td>${escapeHtml(item.name)}</td><td>${escapeHtml(item.team)}</td><td class="points">${item.points}</td><td>${item.wins ?? 0}</td></tr>`).join('') : '<tr><td colspan="5">暂无赛季排名数据</td></tr>'}</tbody>
            </table>
        </div>
    `;
}

function renderMediaPage() {
    const container = document.getElementById('mediaContainer');
    if (!container) return;
    const sorted = sortMediaNewsByTime(window.mediaNewsItems || []);
    const cards = sorted.map(news => `<div class="media-news-card"><div class="media-news-header"><div class="media-source-icon">${news.sourceIcon}</div><div class="media-source-name">${escapeHtml(news.source)}</div><div class="media-news-time">${formatMediaTime(news.timestamp)}</div></div><div class="media-news-title">${escapeHtml(news.title)}</div><div class="media-news-summary">${escapeHtml(news.summary)}</div><a href="${news.url}" target="_blank" class="media-read-more">阅读全文 →</a></div>`).join('');
    container.innerHTML = `<button id="refreshMediaBtn" class="refresh-media">刷新资讯</button>${cards}`;
    document.getElementById('refreshMediaBtn')?.addEventListener('click', () => {
        renderMediaPage();
        showToast('资讯已刷新', false);
    });
}

function renderRaceRankings() {
    renderStandings();
}
