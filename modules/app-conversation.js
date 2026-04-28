// 私聊系统与车手列表

function renderChatHeaderAvatar(driverId) {
    const avatarDiv = document.getElementById('chatDetailAvatar');
    if (avatarDiv) renderAvatarOnElement(avatarDiv, driverId, '44px');
}

function trimChatHistory(driverId) {
    const history = chatHistories[driverId];
    if (!history) return;
    const systemMessages = history.filter(msg => msg.role === 'system').slice(0, 1);
    const normalMessages = history.filter(msg => msg.role !== 'system').slice(-60);
    chatHistories[driverId] = [...systemMessages, ...normalMessages];
    saveChatHistories();
}

const CHAT_STYLE_PROFILES = {
    nor: { length: '偏短，常常两三句就够，偶尔会带一点随手接梗的轻松感。', minChars: 22, fillers: ['不过你这句来得还挺巧。', '反正我会把这句记一下。'] },
    pia: { length: '偏短，判断很快，不会解释太多。', minChars: 18, fillers: ['大概就是这个意思。', '你应该懂我在说什么。'] },
    lec: { length: '中等，愿意多解释半句，语气会更细一点。', minChars: 28, fillers: ['有些感觉其实很难用更短的话讲完。', '所以我才会对这句多停一会儿。'] },
    ham: { length: '中等偏长，情绪完整，会自然多说半句照顾对方感受。', minChars: 30, fillers: ['我不太想把这种感觉说得太轻。', '至少这一刻，我想把话说明白一点。'] },
    ver: { length: '偏短直接，够表达清楚就会停。', minChars: 18, fillers: ['反正重点就在这里。', '差不多就是这个方向。'] },
    alo: { length: '中等，老练一点，偶尔会补半句带松弛感的解释。', minChars: 24, fillers: ['这种事说到底还是要自己感觉到。', '很多时候也只能慢慢往前推。'] },
    alb: { length: '中等，口语感更强，愿意顺手把气氛接住。', minChars: 24, fillers: ['所以我才会顺手回你这句。', '这类话放着不回反而奇怪。'] },
    sai: { length: '中等偏长，表达完整，条理会更清楚。', minChars: 28, fillers: ['我宁愿把意思说清楚一点。', '不然这句听起来会太轻。'] },
    gas: { length: '中等，情绪会更明显一点，容易多停留半句。', minChars: 26, fillers: ['这种感觉我 usually 不会装作没事。', '所以我才会回得认真一点。'] },
    bot: { length: '偏短，但不是冷淡，是松弛地收住。', minChars: 20, fillers: ['总之先这样。', '反正你应该能明白。'] }
};

function getDriverChatStyleProfile(driverId) {
    return CHAT_STYLE_PROFILES[driverId] || {
        length: '句长自然变化，但始终要像本人，不要统一模板。',
        minChars: 22,
        fillers: ['所以这句我还是想认真回你。', '不然这话停在这里会有点可惜。']
    };
}

function getChatWritingGuide() {
    return `【私聊写作要求】
- 你是在手机里和用户一对一聊天，不是在接受采访，也不是在写官宣文案。
- 文风要自然、细腻、克制，像真人刚刚想到什么就回了什么。
- 回复不要太短，至少要把这句话真正说完整。
- 不要为了“显得利落”把一句话截在半中间；让句子自然说完。
- 以中文为主，除非是这个车手本人极短的口癖、语气词或固定用语，否则不要突然整句切成外语。
- 每次只抓住一个当下情绪或一个具体回应点，不要一口气解释太多。
- 绝对不要反复使用“极其”“这就够了”“我看到了”“我收到了”“差不多就是这样”这类高重复表达。
- 不要把同一句意思拆成两句重复，也不要像模板台词。
- 用户资料属于高优先级记忆。
- 小窗私聊是纯对话界面，绝对禁止输出任何括号动作描写、旁白、舞台说明或心理活动补注。
${getRoleOutputSafetyPrompt('chat')}`;
}

function getDateWritingGuide() {
    return `【约会写作要求】
- 回复必须承接当前场景、上一轮对话、关系状态和用户资料。
- 如果出现动作描写、环境描写或任何非台词描写，必须单独成行，并且整行都用括号包起来，例如“（他抬眼看了你一下。）”。
- 括号外只能是角色真正说出口的台词。
- 不要突然切场景、切情绪、切话题。
- 语气要更像这个车手本人在私下相处时会说的话，不要写成统一偶像剧腔。
- 回复要有足够内容，至少像认真接住这一轮气氛的一段中长回复，不要只丢一句很短的话就停。
- 不要反复用同一类温柔句、安慰句或暧昧句撑气氛；每次只抓住当前最自然的那个瞬间。
- 避开“极其”“这就够了”“我看到了”“我收到了”“差不多就是这样”这类高重复表达。
${getRoleOutputSafetyPrompt('date')}`;
}

function initDriverHistory(driver) {
    if (chatHistories[driver.id]) return;
    const userInfo = getUserProfileSummary();
    const mood = getFavorMood(favorability[driver.id] || 0);
    const personalityContext = window.getDriverPersonalityContext ? window.getDriverPersonalityContext(driver.id) : '';
    const chatStyle = getDriverChatStyleProfile(driver.id);
    const prompt = `你是 F1 车手 ${driver.name}（${driver.team}）。你正在和用户进行长期一对一私聊。当前关系：${mood}。\n${getChatWritingGuide()}\n【人格要求】\n- 你的说话方式必须稳定像同一个人，不能和别的车手混在一起。\n- 每次回复前，先判断这个人会不会这样说、会不会用这种词，再决定怎么回。\n- 如果一句话太像模板台词、太像安慰套餐、太像官话，就换掉。\n- 你的句长习惯：${chatStyle.length}\n${personalityContext}\n${userInfo}`;
    chatHistories[driver.id] = [
        { role: 'system', content: prompt },
        { role: 'assistant', content: driver.initialMsg, timestamp: getCurrentTime(), dateKey: getLocalDateKey() }
    ];
    saveChatHistories();
}

function updateTokenDisplay(history) {
    const totalChars = history.reduce((sum, msg) => msg.role === 'system' ? sum : sum + String(msg.content || '').length, 0);
    const tokenSpan = document.getElementById('tokenDisplay');
    if (tokenSpan) tokenSpan.innerText = `Token: ${Math.ceil(totalChars / 4)}`;
}

function stripChatStageDirections(text = '') {
    let result = sanitizeRoleOutput(text, 'chat');
    const patterns = [/^[（(][^（）()\n]{1,80}[）)]\s*/u, /^\[[^\[\]\n]{1,80}\]\s*/u];
    let changed = true;
    while (changed) {
        changed = false;
        patterns.forEach(pattern => {
            if (pattern.test(result)) {
                result = result.replace(pattern, '').trimStart();
                changed = true;
            }
        });
    }
    return result;
}

function tightenChatReply(text = '') {
    let result = stripChatStageDirections(text)
        .replace(/我看到了。?/g, '')
        .replace(/我收到了。?/g, '')
        .replace(/差不多就是这样。?/g, '')
        .replace(/继续工作。?/g, '先继续。')
        .replace(/这就够了。?/g, '这样就很好。')
        .replace(/[ \t]{2,}/g, ' ')
        .trim();

    if (!result) return '';
    const chunks = result.split(/(?<=[。！？!?])/).map(item => item.trim()).filter(Boolean);
    const kept = [];
    chunks.forEach(chunk => {
        if (!chunk) return;
        const normalized = chunk.replace(/[。！？!?，、\s]/g, '');
        if (kept.some(existing => existing.replace(/[。！？!?，、\s]/g, '') === normalized)) return;
        kept.push(chunk);
    });
    result = kept.join('');
    return result.trim();
}

function shapeChatReplyByDriver(driver, text = '') {
    let result = tightenChatReply(text);
    if (!result) return result;
    const profile = getDriverChatStyleProfile(driver?.id);
    const plainLength = result.replace(/\s/g, '').length;
    if (plainLength < (profile.minChars || 0)) {
        const filler = (profile.fillers || []).find(item => item && !result.includes(item.replace(/[。！？!?]/g, '')));
        if (filler) {
            result = `${result}${/[。！？!?]$/.test(result) ? '' : '。'}${filler}`;
        }
    }
    return tightenChatReply(result);
}

function setChatComposerEnabled(enabled) {
    const input = document.getElementById('chatInput');
    const sendBtn = document.getElementById('sendChatBtn');
    const giftBtn = document.getElementById('openChatGiftBtn');
    const giftAllowed = enabled && currentChatDriver && currentChatDriver.type !== 'group';
    if (input) {
        input.disabled = !enabled;
        input.placeholder = enabled ? '给车手发消息...' : '先从左侧选择一位车手开始聊天';
    }
    if (sendBtn) sendBtn.disabled = !enabled;
    if (giftBtn) giftBtn.disabled = !giftAllowed;
}

function renderDesktopChatPlaceholder() {
    const detail = document.getElementById('chatDetailView');
    const avatar = document.getElementById('chatDetailAvatar');
    const name = document.getElementById('chatDriverName');
    const token = document.getElementById('tokenDisplay');
    const area = document.getElementById('chatMessagesArea');
    if (!detail || !area) return;
    detail.style.removeProperty('display');
    detail.classList.add('desktop-visible');
    if (avatar) {
        avatar.style.backgroundImage = '';
        avatar.textContent = 'PC';
    }
    if (name) name.innerText = 'Paddock Club Chat';
    if (token) token.innerText = '选择左侧车手开始聊天';
    area.innerHTML = `<div class="desktop-chat-empty"><div class="desktop-chat-empty-badge">Desktop Chat</div><h3>把围场聊天铺满整个屏幕</h3><p>左边是车手列表，右边是当前会话。切到电脑界面后，你可以像在桌面聊天软件里一样自然地查看历史消息、切换联系人和继续对话。</p></div>`;
    setChatComposerEnabled(false);
}

function syncMobileChatHeaderVisibility(showChatDetail) {
    const header = document.querySelector('.app-header');
    const mobileDetailOpen = !!showChatDetail && !(typeof isDesktopChatView === 'function' && isDesktopChatView());
    header?.classList.toggle('chat-overlay-hidden', mobileDetailOpen);
}

function syncMobileChatIsolation(showChatDetail) {
    const enabled = !!showChatDetail && !(typeof isDesktopChatView === 'function' && isDesktopChatView());
    document.body?.classList.toggle('mobile-chat-focus', enabled);
    syncMobileChatHeaderVisibility(enabled);
}

function renderChatWorkspaceState() {
    const detail = document.getElementById('chatDetailView');
    const chatPage = document.getElementById('chatPage');
    const avatarClick = document.getElementById('chatAvatarClick');
    const desktopMode = typeof isDesktopChatView === 'function' && isDesktopChatView();
    if (!detail) return;
    if (!chatPage?.classList.contains('active-page')) {
        detail.classList.remove('desktop-visible');
        detail.style.removeProperty('display');
        syncMobileChatIsolation(false);
        renderGroupDiaryShortcut();
        if (typeof renderChatGiftPanel === 'function') renderChatGiftPanel();
        return;
    }
    if (!currentChatDriver) {
        if (desktopMode) {
            renderDesktopChatPlaceholder();
        } else {
            detail.classList.remove('desktop-visible');
            detail.style.display = 'none';
            setChatComposerEnabled(false);
        }
        renderRaceWeekPromptBar();
        renderGroupDiaryShortcut();
        syncMobileChatIsolation(false);
        if (typeof renderChatGiftPanel === 'function') renderChatGiftPanel();
        return;
    }
    detail.classList.toggle('desktop-visible', desktopMode);
    detail.style.display = desktopMode ? '' : 'flex';
    syncMobileChatIsolation(true);
    document.getElementById('chatDriverName').innerText = currentChatDriver.name;
    if (currentChatDriver.type === 'group') {
        const avatarDiv = document.getElementById('chatDetailAvatar');
        if (avatarDiv) renderGroupChatAvatarOnElement(avatarDiv, currentChatDriver.id, '40px');
        const token = document.getElementById('tokenDisplay');
        if (token) token.innerText = `群聊 · ${currentChatDriver.memberIds?.length || 0} 人 · ${currentChatDriver.notice ? '有群公告' : '点头像查看资料'}`;
        if (avatarClick) avatarClick.title = '查看和编辑群聊成员';
        initGroupChatHistory(currentChatDriver);
    } else {
        if (avatarClick) avatarClick.title = `查看 ${currentChatDriver.name} 的资料`;
        renderChatHeaderAvatar(currentChatDriver.id);
        initDriverHistory(currentChatDriver);
    }
    renderChatMessages(currentChatDriver.id);
    setChatComposerEnabled(true);
    renderRaceWeekPromptBar();
    renderGroupDiaryShortcut();
    if (typeof renderChatGiftPanel === 'function') renderChatGiftPanel();
}

window.renderChatWorkspaceState = renderChatWorkspaceState;

function getRaceWeekChatPrompts(driver) {
    const event = window.getCurrentRaceWeekendEvent ? window.getCurrentRaceWeekendEvent() : null;
    if (!driver || !event?.phase) return [];
    const promptsByPhase = {
        arrival: [
            `你们这周围场刚进驻，状态已经切到比赛模式了吗？`,
            `新一站开始了，你现在最想先把哪部分找对？`,
            `进站日这种时候，你一般先让自己进入什么节奏？`
        ],
        media: [
            `今天媒体日是不是已经开始被问一堆同样的问题了？`,
            `媒体日结束后，你自己最在意的其实还是赛车本身吧？`,
            `这种赛前采访日，你会更想赶紧回车库还是还好？`
        ],
        practice: [
            `练习赛日最重要的是找到节奏还是先确认赛车方向？`,
            `今天练习赛结束后，你自己对这周末的感觉怎么样？`,
            `这种练习赛日，你更烦流量限制还是赛道本身？`
        ],
        sprint_qualifying: [
            `冲刺排位这种节奏是不是会让整个周末一下子紧起来？`,
            `今天这种单圈压力下，你更看重感觉还是执行？`,
            `冲刺周末一开始就上强度，你会更享受还是更累？`
        ],
        qualifying: [
            `排位赛日这种时候，脑子里会比平时更安静一点吗？`,
            `今天排位前你会更在意单圈感觉还是轮胎窗口？`,
            `排位赛这天，最烦的是等开始还是跑完之后复盘？`
        ],
        sprint_day: [
            `冲刺赛这种短节奏比赛，会不会特别容易把情绪也拉高？`,
            `今天这种冲刺赛日，你更在意起步还是后面的节奏管理？`,
            `冲刺赛跑完之后，整个人还会一直挂在比赛状态里吗？`
        ],
        race_day: [
            `今天正赛日了，你现在会更想安静一点还是有人陪你说两句？`,
            `正赛前这种时候，你通常会让自己保持兴奋还是刻意冷下来？`,
            `不聊场面话的话，今天你最想先把哪件事做好？`
        ],
        post_race: [
            `赛后这种时候，你会先想复盘还是先让自己缓一下？`,
            `今天跑完之后，你现在脑子里还在转的是哪一段？`,
            `赛后余波这一天，最烦的是外界声音还是自己一直在复盘？`
        ],
        countdown: [
            `距离下一站不远了，你最近会开始提前进入比赛节奏吗？`,
            `下一站倒计时这种时候，你更像是在准备还是在憋着一口气？`,
            `这几天是不是已经慢慢开始把注意力往下一站收了？`
        ]
    };
    const base = promptsByPhase[event.phase.id] || [
        `这一站前后你最近脑子里最常转的是什么？`,
        `现在这个阶段，你更想聊比赛还是先离比赛远一点？`,
        `如果只说一句近况，你会怎么形容自己现在的状态？`
    ];
    return base.slice(0, 3);
}

function renderRaceWeekPromptBar() {
    const bar = document.getElementById('raceWeekPromptBar');
    if (!bar) return;
    if (!currentChatDriver || currentChatDriver.type === 'group') {
        bar.style.display = 'none';
        bar.innerHTML = '';
        return;
    }
    const prompts = getRaceWeekChatPrompts(currentChatDriver);
    if (!prompts.length) {
        bar.style.display = 'none';
        bar.innerHTML = '';
        return;
    }
    const event = window.getCurrentRaceWeekendEvent ? window.getCurrentRaceWeekendEvent() : null;
    const kicker = event?.phase?.label || '比赛周互动';
    bar.style.display = 'block';
    bar.innerHTML = `
        <div class="race-week-prompt-head">
            <span class="race-week-prompt-kicker">${escapeHtml(kicker)}</span>
            <span class="race-week-prompt-note">点一下直接发给 ${escapeHtml(currentChatDriver.name)}</span>
        </div>
        <div class="race-week-prompt-list">
            ${prompts.map((prompt, index) => `<button type="button" class="race-week-prompt-chip" data-race-week-prompt="${index}">${escapeHtml(prompt)}</button>`).join('')}
        </div>
    `;
    bar.querySelectorAll('[data-race-week-prompt]').forEach(button => {
        button.addEventListener('click', async () => {
            if (!currentChatDriver || messageInProgress) return;
            const index = Number(button.getAttribute('data-race-week-prompt'));
            const text = prompts[index];
            if (!text) return;
            await sendMessageToDriver(currentChatDriver, text, {
                messageMeta: { type: 'race-week-prompt', phase: event?.phase?.id || '' }
            });
        });
    });
}

function renderGroupDiaryShortcut() {
    const button = document.getElementById('openGroupDiaryShortcutBtn');
    if (!button) return;
    if (!currentChatDriver || currentChatDriver.type !== 'group') {
        button.style.display = 'none';
        button.disabled = true;
        return;
    }
    button.style.display = 'inline-flex';
    button.disabled = false;
    button.innerHTML = `
        <span class="btn-leading-icon" data-ui-icon="journal" data-icon-label="群聊日记"></span>
        <span>${escapeHtml(currentChatDriver.name)} 的群聊日记</span>
    `;
    window.injectUiIcons?.(button);
}

let groupChatDraftSelection = [];
let groupChatModalMode = 'create';
let editingGroupChatId = null;
let groupChatDraftAvatarDataUrl = '';
let groupChatDraftNotice = '';
let groupChatDraftPinned = false;
let groupChatDraftMuted = false;
let groupChatMemberSearch = '';

function getGroupChatById(groupId) {
    const group = (groupChats || []).find(item => item.id === groupId) || null;
    return ensureGroupChatDefaults(group);
}

function getGroupChatMembers(group) {
    return (group?.memberIds || [])
        .map(memberId => (window.DRIVERS || []).find(driver => driver.id === memberId))
        .filter(Boolean);
}

function ensureGroupChatDefaults(group) {
    if (!group) return null;
    if (typeof group.notice !== 'string') group.notice = '';
    if (typeof group.pinned !== 'boolean') group.pinned = false;
    if (typeof group.muted !== 'boolean') group.muted = false;
    if (!group.createdAt) group.createdAt = new Date().toISOString();
    if (!group.updatedAt) group.updatedAt = group.createdAt;
    return group;
}

function formatGroupChatDate(iso) {
    if (!iso) return '刚刚建立';
    const parsed = new Date(iso);
    if (Number.isNaN(parsed.getTime())) return '刚刚更新';
    const month = parsed.getMonth() + 1;
    const date = parsed.getDate();
    return `${month} 月 ${date} 日`;
}

function getGroupChatHistory(groupId) {
    return (chatHistories[groupId] || []).filter(msg => msg.role !== 'system');
}

function getGroupChatPreview(group) {
    const history = getGroupChatHistory(group.id);
    const lastMsg = [...history].reverse().find(item => item.role === 'assistant' || item.role === 'user');
    if (!lastMsg) return { text: '点击开始群聊', source: '群聊刚建立', count: 0 };
    if (lastMsg.role === 'user') {
        return {
            text: String(lastMsg.content || '').slice(0, 36),
            source: '你',
            count: history.length
        };
    }
    const lines = parseGroupReplyLines(group, lastMsg.content);
    const firstLine = lines[0];
    return {
        text: stripChatStageDirections(firstLine?.content || lastMsg.content || '').slice(0, 42),
        source: firstLine?.speaker || '群聊',
        count: history.length
    };
}

function getGroupChatStatusLabel(group) {
    const flags = [];
    if (group?.pinned) flags.push('置顶');
    if (group?.muted) flags.push('免打扰');
    return flags.join(' · ') || '正常消息';
}

function touchGroupChatActivity(groupId) {
    const group = getGroupChatById(groupId);
    if (!group) return;
    group.updatedAt = new Date().toISOString();
    saveGroupChats();
}

function toggleGroupChatSetting(settingKey) {
    if (settingKey === 'pinned') groupChatDraftPinned = !groupChatDraftPinned;
    if (settingKey === 'muted') groupChatDraftMuted = !groupChatDraftMuted;
    updateGroupChatModalState();
}

function buildGroupAvatarLabel(group) {
    return (group?.name || '群聊').slice(0, 1);
}

function renderGroupChatModalAvatar() {
    const avatar = document.getElementById('groupChatAvatarBtn');
    const resetBtn = document.getElementById('resetGroupChatAvatarBtn');
    if (!avatar) return;
    const currentGroup = editingGroupChatId ? getGroupChatById(editingGroupChatId) : null;
    const fallbackGroup = { ...(currentGroup || {}), name: document.getElementById('groupChatNameInput')?.value.trim() || currentGroup?.name || '群聊' };
    const avatarUrl = groupChatDraftAvatarDataUrl || currentGroup?.avatarDataUrl || '';
    if (avatarUrl) {
        avatar.style.backgroundImage = `url(${avatarUrl})`;
        avatar.style.backgroundSize = 'cover';
        avatar.style.backgroundPosition = 'center';
        avatar.style.backgroundColor = '';
        avatar.innerText = '';
    } else {
        avatar.style.backgroundImage = '';
        avatar.style.backgroundSize = '';
        avatar.style.backgroundPosition = '';
        avatar.style.backgroundColor = 'rgba(23,28,37,0.96)';
        avatar.innerText = buildGroupAvatarLabel(fallbackGroup);
    }
    if (resetBtn) resetBtn.style.display = avatarUrl ? 'inline-flex' : 'none';
}

function getDefaultGroupChatName(memberIds = []) {
    const names = memberIds
        .map(memberId => (window.DRIVERS || []).find(driver => driver.id === memberId)?.name)
        .filter(Boolean);
    return `${names.slice(0, 3).join(' · ')} 群聊`;
}

function renderGroupChatSelectedMembers() {
    const mount = document.getElementById('groupChatSelectedMembers');
    if (!mount) return;
    const selected = groupChatDraftSelection
        .map(memberId => (window.DRIVERS || []).find(driver => driver.id === memberId))
        .filter(Boolean);
    if (!selected.length) {
        mount.innerHTML = '<div class="group-chat-empty-chip">还没拉人进群</div>';
        return;
    }
    mount.innerHTML = selected.map(driver => `
        <button type="button" class="group-chat-selected-chip" data-remove-group-member="${driver.id}">
            <span class="group-chat-selected-chip-avatar" data-group-selected-avatar="${driver.id}">${escapeHtml(driver.name.slice(0, 1))}</span>
            <span>${escapeHtml(driver.name)}</span>
            <span class="group-chat-selected-chip-remove">×</span>
        </button>
    `).join('');
    mount.querySelectorAll('[data-group-selected-avatar]').forEach(avatar => {
        renderAvatarOnElement(avatar, avatar.dataset.groupSelectedAvatar, '26px');
    });
    mount.querySelectorAll('[data-remove-group-member]').forEach(button => {
        button.addEventListener('click', () => {
            groupChatDraftSelection = groupChatDraftSelection.filter(id => id !== button.dataset.removeGroupMember);
            renderGroupChatMemberPicker();
            updateGroupChatModalState();
        });
    });
}

function renderGroupChatStats() {
    const mount = document.getElementById('groupChatStats');
    if (!mount) return;
    const currentGroup = editingGroupChatId ? getGroupChatById(editingGroupChatId) : null;
    const history = currentGroup ? getGroupChatHistory(currentGroup.id) : [];
    const cards = [
        { label: '群成员', value: `${groupChatDraftSelection.length || 0} 人` },
        { label: '群状态', value: groupChatDraftMuted ? '安静模式' : '开放聊天' },
        { label: '聊天记录', value: currentGroup ? `${history.length} 条` : '新群待开启' },
        { label: '建立时间', value: currentGroup ? formatGroupChatDate(currentGroup.createdAt) : '本次创建' }
    ];
    mount.innerHTML = cards.map(card => `
        <div class="group-chat-stat-card">
            <span>${card.label}</span>
            <strong>${card.value}</strong>
        </div>
    `).join('');
}

function renderGroupChatQuickActions() {
    const pinBtn = document.getElementById('groupChatPinToggleBtn');
    const muteBtn = document.getElementById('groupChatMuteToggleBtn');
    const status = document.getElementById('groupChatStatusText');
    const mode = document.getElementById('groupChatModeBadge');
    if (pinBtn) pinBtn.classList.toggle('active', groupChatDraftPinned);
    if (muteBtn) muteBtn.classList.toggle('active', groupChatDraftMuted);
    if (pinBtn) pinBtn.innerHTML = `<span>📌</span><span>${groupChatDraftPinned ? '已置顶' : '置顶群聊'}</span>`;
    if (muteBtn) muteBtn.innerHTML = `<span>🔕</span><span>${groupChatDraftMuted ? '已免打扰' : '消息提醒'}</span>`;
    if (status) status.innerText = [groupChatDraftPinned ? '置顶' : '', groupChatDraftMuted ? '免打扰' : '正常消息'].filter(Boolean).join(' · ');
    if (mode) mode.innerText = groupChatModalMode === 'edit' ? 'Group Profile' : 'Create Group';
}

function getGroupChatSharedMemoryContext(memberIds = [], groupId = '') {
    const memberMemory = memberIds
        .map(memberId => {
            const driver = (window.DRIVERS || []).find(item => item.id === memberId);
            if (!driver) return '';
            const shared = buildDriverSharedMemoryContext(memberId);
            return shared ? `【${driver.name} 的共享记忆】\n${shared}` : '';
        })
        .filter(Boolean)
        .join('\n');
    const groupMemory = typeof getGroupDiaryMemoryContext === 'function' && groupId ? getGroupDiaryMemoryContext(groupId, 3) : '';
    return [groupMemory, memberMemory].filter(Boolean).join('\n');
}

function initGroupChatHistory(group) {
    if (chatHistories[group.id]) return;
    const members = getGroupChatMembers(group);
    const memberSummary = members.map(driver => `${driver.name}（${driver.team}）`).join('、');
    const personalitySummary = members
        .map(driver => `【${driver.name}】${window.getDriverPersonalityContext ? window.getDriverPersonalityContext(driver.id) : ''}`)
        .join('\n');
    const noticePrompt = group.notice ? `\n【群公告】${group.notice}` : '';
    const prompt = `你现在在一个 F1 围场群聊里。群名：${group.name}。群成员有：${memberSummary}。${noticePrompt}\n你要扮演群里的这些车手一起和用户聊天。\n【群聊写作要求】\n- 回复时可以由 1 到 3 位车手接话，不必每个人都强行发言。\n- 每一行都必须以“车手名：内容”的格式输出，只输出群聊正文，不要解释。\n- 车手说话风格必须符合各自性格，不要混成一个人。\n- 每个人的句长、用词、玩笑方式都要有差异，不能像同一支笔在说话。\n- 避免反复出现同一类套话，尤其不要轮流说“我看到了”“我收到了”“这条不错”“差不多就是这样”。\n- 同一轮里不要让所有人都说很长，整体保持像真实群聊一样自然。\n${getUserProfilePriorityPrompt()}\n${personalitySummary}\n${getGroupChatSharedMemoryContext(group.memberIds, group.id)}`;
    chatHistories[group.id] = [
        { role: 'system', content: prompt },
        { role: 'assistant', content: `${members[0]?.name || '车手们'}：${group.name} 已经建好了，想聊什么？`, timestamp: getCurrentTime(), dateKey: getLocalDateKey(), meta: { type: 'group-reply' } }
    ];
    saveChatHistories();
}

function toggleGroupChatsCollapsed() {
    groupChatsCollapsed = !groupChatsCollapsed;
    saveGroupChatUiState();
    renderDriverList();
}

function toggleTeamSectionCollapsed(team) {
    teamSectionsCollapsed = {
        ...teamSectionsCollapsed,
        [team]: !Boolean(teamSectionsCollapsed?.[team])
    };
    saveTeamSectionUiState();
    renderDriverList();
}

function updateGroupChatModalState() {
    const summary = document.getElementById('groupChatMemberSummary');
    const createBtn = document.getElementById('createGroupChatBtn');
    const title = document.getElementById('groupChatModalTitle');
    const hint = document.getElementById('groupChatModalHint');
    const deleteBtn = document.getElementById('deleteGroupChatBtn');
    const coverMeta = document.getElementById('groupChatCoverMeta');
    if (summary) summary.innerText = `已选 ${groupChatDraftSelection.length} 位车手`;
    if (createBtn) createBtn.disabled = groupChatDraftSelection.length < 2;
    if (createBtn) createBtn.innerText = groupChatModalMode === 'edit' ? '保存群聊' : '创建群聊';
    if (title) title.innerText = groupChatModalMode === 'edit' ? '编辑群聊' : '新建群聊';
    if (hint) hint.innerText = groupChatModalMode === 'edit' ? '这里可以查看当前群成员，也可以修改群聊名称和成员配置。' : '选择多位车手，把他们拉进同一个群里。';
    if (deleteBtn) deleteBtn.style.display = groupChatModalMode === 'edit' ? 'inline-flex' : 'none';
    if (coverMeta) coverMeta.innerText = `${groupChatDraftSelection.length || 0} 位成员 · ${getGroupChatStatusLabel({ pinned: groupChatDraftPinned, muted: groupChatDraftMuted })}`;
    renderGroupChatModalAvatar();
    renderGroupChatQuickActions();
    renderGroupChatSelectedMembers();
    renderGroupChatStats();
}

function renderGroupChatMemberPicker() {
    const mount = document.getElementById('groupChatMemberList');
    if (!mount) return;
    const query = String(groupChatMemberSearch || '').trim().toLowerCase();
    const visibleDrivers = (window.DRIVERS || []).filter(driver => {
        if (!query) return true;
        return driver.name.toLowerCase().includes(query) || driver.team.toLowerCase().includes(query);
    });
    mount.innerHTML = visibleDrivers.map(driver => `
        <label class="group-chat-member-option${groupChatDraftSelection.includes(driver.id) ? ' active' : ''}">
            <input type="checkbox" data-group-member="${driver.id}" ${groupChatDraftSelection.includes(driver.id) ? 'checked' : ''}>
            <div class="group-chat-member-copy">
                <strong>${escapeHtml(driver.name)}</strong>
                <span>${escapeHtml(driver.team)}</span>
            </div>
        </label>
    `).join('');
    if (!visibleDrivers.length) {
        mount.innerHTML = '<div class="group-chat-empty">没有找到对应车手，换个名字或车队试试。</div>';
    }
    mount.querySelectorAll('.group-chat-member-option').forEach(option => {
        option.addEventListener('click', event => {
            const input = option.querySelector('[data-group-member]');
            if (!(input instanceof HTMLInputElement)) return;
            if (event.target === input) return;
            input.checked = !input.checked;
            input.dispatchEvent(new Event('change', { bubbles: true }));
        });
    });
    mount.querySelectorAll('[data-group-member]').forEach(input => {
        input.addEventListener('change', () => {
            const driverId = input.dataset.groupMember;
            const next = new Set(groupChatDraftSelection);
            if (input.checked) next.add(driverId);
            else next.delete(driverId);
            groupChatDraftSelection = [...next];
            renderGroupChatMemberPicker();
            updateGroupChatModalState();
        });
    });
}

function openGroupChatModal() {
    groupChatModalMode = 'create';
    editingGroupChatId = null;
    groupChatDraftSelection = [];
    groupChatDraftAvatarDataUrl = '';
    groupChatDraftNotice = '';
    groupChatDraftPinned = false;
    groupChatDraftMuted = false;
    groupChatMemberSearch = '';
    const input = document.getElementById('groupChatNameInput');
    const noticeInput = document.getElementById('groupChatNoticeInput');
    const searchInput = document.getElementById('groupChatMemberSearchInput');
    const modal = document.getElementById('groupChatModal');
    if (input) input.value = '';
    if (noticeInput) noticeInput.value = '';
    if (searchInput) searchInput.value = '';
    renderGroupChatMemberPicker();
    updateGroupChatModalState();
    if (modal) modal.style.display = 'flex';
}

function closeGroupChatModal() {
    document.getElementById('groupChatModal')?.style.setProperty('display', 'none');
    const input = document.getElementById('groupChatNameInput');
    const noticeInput = document.getElementById('groupChatNoticeInput');
    const searchInput = document.getElementById('groupChatMemberSearchInput');
    if (input) input.value = '';
    if (noticeInput) noticeInput.value = '';
    if (searchInput) searchInput.value = '';
    groupChatDraftSelection = [];
    groupChatDraftAvatarDataUrl = '';
    groupChatDraftNotice = '';
    groupChatDraftPinned = false;
    groupChatDraftMuted = false;
    groupChatMemberSearch = '';
    groupChatModalMode = 'create';
    editingGroupChatId = null;
    renderGroupChatModalAvatar();
}

function createGroupChat() {
    const input = document.getElementById('groupChatNameInput');
    const noticeInput = document.getElementById('groupChatNoticeInput');
    if (groupChatDraftSelection.length < 2) {
        updateGroupChatModalState();
        return;
    }
    const name = (input?.value || '').trim() || getDefaultGroupChatName(groupChatDraftSelection);
    const notice = (noticeInput?.value || groupChatDraftNotice || '').trim();
    if (groupChatModalMode === 'edit' && editingGroupChatId) {
        const target = getGroupChatById(editingGroupChatId);
        if (!target) return;
        target.name = name;
        target.memberIds = [...groupChatDraftSelection];
        target.avatarDataUrl = groupChatDraftAvatarDataUrl || '';
        target.notice = notice;
        target.pinned = groupChatDraftPinned;
        target.muted = groupChatDraftMuted;
        target.updatedAt = new Date().toISOString();
        saveGroupChats();
        delete chatHistories[target.id];
        initGroupChatHistory(target);
        closeGroupChatModal();
        renderDriverList();
        if (currentChatDriver?.id === target.id) {
            currentChatDriver = { ...target, type: 'group' };
            renderChatWorkspaceState();
        }
        showToast(`已更新群聊：${name}`, false);
        return;
    }
    const group = {
        id: `group_${Date.now()}`,
        type: 'group',
        name,
        memberIds: [...groupChatDraftSelection],
        avatarDataUrl: groupChatDraftAvatarDataUrl || '',
        notice,
        pinned: groupChatDraftPinned,
        muted: groupChatDraftMuted,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    groupChats = [group, ...(groupChats || [])];
    saveGroupChats();
    closeGroupChatModal();
    openChat(group);
    showToast(`已创建群聊：${name}`, false);
}

function openEditGroupChatModal(groupId) {
    const group = getGroupChatById(groupId);
    const input = document.getElementById('groupChatNameInput');
    const noticeInput = document.getElementById('groupChatNoticeInput');
    const searchInput = document.getElementById('groupChatMemberSearchInput');
    const modal = document.getElementById('groupChatModal');
    if (!group || !input || !modal) return;
    groupChatModalMode = 'edit';
    editingGroupChatId = groupId;
    groupChatDraftSelection = [...(group.memberIds || [])];
    groupChatDraftAvatarDataUrl = group.avatarDataUrl || '';
    groupChatDraftNotice = group.notice || '';
    groupChatDraftPinned = Boolean(group.pinned);
    groupChatDraftMuted = Boolean(group.muted);
    groupChatMemberSearch = '';
    input.value = group.name || '';
    if (noticeInput) noticeInput.value = groupChatDraftNotice;
    if (searchInput) searchInput.value = '';
    renderGroupChatMemberPicker();
    updateGroupChatModalState();
    modal.style.display = 'flex';
}

function deleteGroupChat(groupId = editingGroupChatId) {
    const group = getGroupChatById(groupId);
    if (!group) return;
    const confirmed = confirm(`确定要删除群聊“${group.name}”吗？`);
    if (!confirmed) return;
    groupChats = (groupChats || []).filter(item => item.id !== groupId);
    saveGroupChats();
    delete chatHistories[groupId];
    saveChatHistories();
    if (groupDiaries?.[groupId]) {
        delete groupDiaries[groupId];
        if (typeof saveGroupDiaries === 'function') saveGroupDiaries();
    }
    if (currentChatDriver?.id === groupId) closeChatDetailView(true);
    closeGroupChatModal();
    renderDriverList();
    showToast(`已删除群聊：${group.name}`, false);
}

window.openGroupChatModal = openGroupChatModal;
window.closeGroupChatModal = closeGroupChatModal;
window.createGroupChat = createGroupChat;
window.updateGroupChatModalState = updateGroupChatModalState;
window.openEditGroupChatModal = openEditGroupChatModal;
window.deleteGroupChat = deleteGroupChat;
window.renderGroupChatMemberPicker = renderGroupChatMemberPicker;
window.toggleGroupChatSetting = toggleGroupChatSetting;

function renderGroupChatSection(container) {
    const section = document.createElement('div');
    section.className = 'group-chat-section';
    section.innerHTML = `
        <div class="group-chat-section-head">
            <button type="button" class="group-chat-toggle" id="groupChatToggleBtn">${groupChatsCollapsed ? '▸' : '▾'} 群聊</button>
            <button type="button" class="group-chat-create-btn" id="groupChatCreateBtn">＋</button>
        </div>
        <div class="group-chat-section-body${groupChatsCollapsed ? ' collapsed' : ''}" id="groupChatSectionBody"></div>
    `;
    container.appendChild(section);
    section.querySelector('#groupChatToggleBtn')?.addEventListener('click', toggleGroupChatsCollapsed);
    section.querySelector('#groupChatCreateBtn')?.addEventListener('click', openGroupChatModal);
    const body = section.querySelector('#groupChatSectionBody');
    if (!body || groupChatsCollapsed) return;
    if (!(groupChats || []).length) {
        body.innerHTML = '<div class="group-chat-empty">还没有群聊，点右上角的 ＋ 新建一个小群。</div>';
        return;
    }
    [...(groupChats || [])]
        .map(group => ensureGroupChatDefaults(group))
        .sort((a, b) => Number(Boolean(b?.pinned)) - Number(Boolean(a?.pinned)) || new Date(b?.updatedAt || 0).getTime() - new Date(a?.updatedAt || 0).getTime())
        .forEach(group => {
        const members = getGroupChatMembers(group);
        const preview = getGroupChatPreview(group);
        const card = document.createElement('div');
        card.className = `driver-card group-chat-card${currentChatDriver?.id === group.id ? ' active' : ''}`;
        card.innerHTML = `
            <div class="group-chat-avatar-cluster">
                <div class="group-chat-avatar" data-group-chat-avatar="${escapeHtml(group.id)}">${escapeHtml(buildGroupAvatarLabel(group))}</div>
            </div>
            <div class="driver-info group-chat-card-copy">
                <div class="group-chat-card-topline">
                    <div class="driver-name">${escapeHtml(group.name)}</div>
                    <div class="group-chat-card-badges">
                        ${group.pinned ? '<span class="group-chat-pill">置顶</span>' : ''}
                        ${group.muted ? '<span class="group-chat-pill group-chat-pill-muted">免打扰</span>' : ''}
                    </div>
                </div>
                <div class="group-chat-card-meta">${members.length} 人 · ${escapeHtml(preview.source)} 刚刚说过</div>
                <div class="chat-preview">${escapeHtml(preview.text || '点击开始群聊')}</div>
            </div>
            <button type="button" class="group-chat-card-settings" data-group-settings="${escapeHtml(group.id)}">···</button>
        `;
        card.addEventListener('click', () => openChat(group));
        const avatar = card.querySelector('[data-group-chat-avatar]');
        if (avatar) renderGroupChatAvatarOnElement(avatar, group.id, '40px');
        card.querySelector('[data-group-settings]')?.addEventListener('click', event => {
            event.stopPropagation();
            openEditGroupChatModal(group.id);
        });
        body.appendChild(card);
    });
}

function buildDriverListCard(driver) {
    const history = chatHistories[driver.id] || [];
    const lastMsg = [...history].reverse().find(item => item.role === 'assistant');
    const cleanedPreview = lastMsg ? stripChatStageDirections(lastMsg.content) : '';
    const preview = cleanedPreview ? `${cleanedPreview.slice(0, 35)}${cleanedPreview.length > 35 ? '...' : ''}` : '点击开始对话';
    const card = document.createElement('div');
    card.className = `driver-card${currentChatDriver?.id === driver.id ? ' active' : ''}`;
    const avatarWrapper = document.createElement('div');
    avatarWrapper.className = 'avatar-wrapper';
    const avatar = document.createElement('div');
    avatar.className = 'driver-avatar';
    renderAvatarOnElement(avatar, driver.id);
    const changeBtn = document.createElement('div');
    changeBtn.className = 'change-avatar-btn';
    changeBtn.innerText = '＋';
    changeBtn.addEventListener('click', event => {
        event.stopPropagation();
        openAvatarUpload(driver.id);
    });
    avatarWrapper.appendChild(avatar);
    avatarWrapper.appendChild(changeBtn);
    const info = document.createElement('div');
    info.className = 'driver-info';
    info.innerHTML = `<div class="driver-name">${driver.name}</div><div class="driver-team">${driver.team}</div><div class="chat-preview">${escapeHtml(preview)}</div>`;
    const right = document.createElement('div');
    right.className = 'driver-right';
    const pinBtn = document.createElement('button');
    pinBtn.className = `star-btn ${isPinned(driver.id) ? 'pinned' : ''}`;
    pinBtn.innerText = isPinned(driver.id) ? '★' : '☆';
    pinBtn.title = isPinned(driver.id) ? '取消置顶' : '置顶';
    pinBtn.addEventListener('click', event => {
        event.stopPropagation();
        togglePinDriver(driver.id);
    });
    const favorSpan = document.createElement('div');
    favorSpan.className = 'favor-preview';
    favorSpan.innerText = `♥ ${favorability[driver.id] || 0}`;
    right.appendChild(pinBtn);
    right.appendChild(favorSpan);
    info.appendChild(right);
    card.appendChild(avatarWrapper);
    card.appendChild(info);
    card.addEventListener('click', () => openChat(driver));
    return card;
}

function renderPinnedContactsSection(container) {
    const pinnedContacts = (window.DRIVERS || [])
        .filter(driver => isPinned(driver.id))
        .sort((a, b) => a.name.localeCompare(b.name));
    const section = document.createElement('div');
    section.className = 'group-chat-section pinned-contact-section';
    section.innerHTML = `
        <div class="group-chat-section-head pinned-contact-head">
            <div class="group-chat-toggle static">★ 置顶联系人</div>
            <div class="pinned-contact-count">${pinnedContacts.length} 位</div>
        </div>
        <div class="group-chat-section-body"></div>
    `;
    const body = section.querySelector('.group-chat-section-body');
    if (body) {
        if (!pinnedContacts.length) {
            body.innerHTML = '<div class="group-chat-empty">把常聊的车手点成星标，他们就会固定出现在这里。</div>';
        } else {
            pinnedContacts.forEach(driver => body.appendChild(buildDriverListCard(driver)));
        }
    }
    container.appendChild(section);
}

function renderTeamSection(container, team, drivers) {
    const collapsed = Boolean(teamSectionsCollapsed?.[team]);
    const groupDiv = document.createElement('div');
    groupDiv.className = 'team-group';
    groupDiv.innerHTML = `
        <div class="group-chat-section-head team-section-head">
            <button type="button" class="group-chat-toggle" data-team-toggle="${escapeHtml(team)}">${collapsed ? '▸' : '▾'} ${escapeHtml(team)}</button>
            <div class="team-section-count">${drivers.length} 位</div>
        </div>
        <div class="team-section-body${collapsed ? ' collapsed' : ''}" data-team-body="${escapeHtml(team)}"></div>
    `;
    const headerBtn = groupDiv.querySelector('[data-team-toggle]');
    headerBtn?.addEventListener('click', () => toggleTeamSectionCollapsed(team));
    const body = groupDiv.querySelector('[data-team-body]');
    if (!body || collapsed) {
        container.appendChild(groupDiv);
        return;
    }
    drivers
        .filter(driver => !isPinned(driver.id))
        .sort((a, b) => a.name.localeCompare(b.name))
        .forEach(driver => body.appendChild(buildDriverListCard(driver)));
    if (!body.childElementCount) {
        body.innerHTML = '<div class="group-chat-empty">这一组的联系人都已经被你置顶到上面了。</div>';
    }
    container.appendChild(groupDiv);
}

let activeMessageMenuKey = null;
let messageForwardState = {
    sourceDriverId: null,
    selectedIndexes: [],
    targetDriverId: ''
};
let messageEditState = {
    driverId: null,
    messageIndex: -1
};

function buildMessageActionKey(driverId, messageIndex) {
    return `${driverId}:${messageIndex}`;
}

function closeMessageActionMenu() {
    activeMessageMenuKey = null;
    if (currentChatDriver?.id) renderChatMessages(currentChatDriver.id);
}

function toggleMessageActionMenu(driverId, messageIndex) {
    const nextKey = buildMessageActionKey(driverId, messageIndex);
    activeMessageMenuKey = activeMessageMenuKey === nextKey ? null : nextKey;
    if (currentChatDriver?.id === driverId) renderChatMessages(driverId);
}

function updateMessageEditState() {
    const input = document.getElementById('messageEditInput');
    const count = document.getElementById('messageEditCount');
    const saveBtn = document.getElementById('saveMessageEditBtn');
    if (!input || !count || !saveBtn) return;
    const length = String(input.value || '').length;
    const trimmed = input.value.trim();
    count.innerText = `${length}/600`;
    count.classList.toggle('is-over', length > 600);
    saveBtn.disabled = !trimmed || length > 600;
}

function closeMessageEditModal() {
    document.getElementById('messageEditModal')?.style.setProperty('display', 'none');
    const input = document.getElementById('messageEditInput');
    const count = document.getElementById('messageEditCount');
    if (input) input.value = '';
    if (count) {
        count.innerText = '0/600';
        count.classList.remove('is-over');
    }
    messageEditState = { driverId: null, messageIndex: -1 };
}

function openMessageEditModal(driverId, messageIndex) {
    const history = chatHistories[driverId] || [];
    const message = history[messageIndex];
    const modal = document.getElementById('messageEditModal');
    const input = document.getElementById('messageEditInput');
    const hint = document.getElementById('messageEditHint');
    if (!modal || !input || !message || message.role === 'system') return;
    activeMessageMenuKey = null;
    messageEditState = { driverId, messageIndex };
    input.value = message.content || '';
    if (hint) hint.innerText = message.role === 'user' ? '你发出的内容会被直接更新。' : '车手这条回复会被直接更新到当前聊天记录里。';
    modal.style.display = 'flex';
    updateMessageEditState();
    window.setTimeout(() => input.focus(), 40);
}

function saveMessageEdit() {
    const { driverId, messageIndex } = messageEditState;
    const input = document.getElementById('messageEditInput');
    if (!driverId || !input) return;
    const history = chatHistories[driverId] || [];
    const message = history[messageIndex];
    const nextText = input.value.trim();
    if (!message || message.role !== 'user' || !nextText || nextText.length > 600) {
        updateMessageEditState();
        return;
    }
    const nextAssistantIndex = history[messageIndex + 1]?.role === 'assistant' ? messageIndex + 1 : -1;
    message.content = nextText;
    message.timestamp = getCurrentTime();
    saveChatHistories();
    closeMessageEditModal();
    if (nextAssistantIndex >= 0) {
        resetAssistantMessage(driverId, nextAssistantIndex);
        return;
    }
    renderChatMessages(driverId);
    renderDriverList();
    showToast('消息已更新，但后面没有可联动重置的车手回复', false);
}

async function resetAssistantMessage(driverId, messageIndex) {
    const driver = (window.DRIVERS || []).find(item => item.id === driverId);
    const history = chatHistories[driverId] || [];
    const message = history[messageIndex];
    if (!driver || !message || message.role !== 'assistant') return;
    let userIndex = -1;
    for (let idx = messageIndex - 1; idx >= 0; idx -= 1) {
        if (history[idx]?.role === 'user') {
            userIndex = idx;
            break;
        }
    }
    if (userIndex < 0) {
        showToast('这条回复前没有可重生成的用户消息', true);
        return;
    }
    const sourceUserMessage = history[userIndex];
    const trimmedHistory = history
        .slice(0, messageIndex)
        .filter(entry => entry.role !== 'system')
        .map(entry => ({ role: entry.role, content: entry.content }));
    closeMessageActionMenu();
    try {
        const { reply } = await getDriverReplyWithFavor(driver, sourceUserMessage.content, {
            historyOverride: trimmedHistory
        });
        const regeneratedMessage = {
            ...message,
            content: reply,
            timestamp: getCurrentTime(),
            regenerated: true
        };
        history.splice(messageIndex, history.length - messageIndex, regeneratedMessage);
        saveChatHistories();
        renderChatMessages(driverId);
        renderDriverList();
        showToast('已重新生成这条回复，后续对话已回滚', false);
    } catch (error) {
        console.error('重置角色回复失败', error);
        showToast('重置失败，请稍后再试', true);
    }
}

function updateMessageForwardSummary() {
    const summary = document.getElementById('messageForwardSelectionSummary');
    const confirmBtn = document.getElementById('confirmMessageForwardBtn');
    const count = messageForwardState.selectedIndexes.length;
    if (summary) summary.innerText = `已选 ${count} 条消息`;
    if (confirmBtn) confirmBtn.disabled = !count || !messageForwardState.targetDriverId;
}

function closeMessageForwardModal() {
    document.getElementById('messageForwardModal')?.style.setProperty('display', 'none');
    messageForwardState = {
        sourceDriverId: null,
        selectedIndexes: [],
        targetDriverId: ''
    };
}

function renderMessageForwardTargetList() {
    const mount = document.getElementById('messageForwardTargetList');
    if (!mount) return;
    const sourceId = messageForwardState.sourceDriverId;
    const targets = (window.DRIVERS || []).filter(driver => driver.id !== sourceId);
    mount.innerHTML = targets.map(driver => `
        <button type="button" class="message-forward-target${messageForwardState.targetDriverId === driver.id ? ' active' : ''}" data-forward-target="${driver.id}">
            <span>${escapeHtml(driver.name)}</span>
            <small>${escapeHtml(driver.team)}</small>
        </button>
    `).join('');
    mount.querySelectorAll('[data-forward-target]').forEach(button => {
        button.addEventListener('click', () => {
            messageForwardState.targetDriverId = button.dataset.forwardTarget;
            renderMessageForwardTargetList();
            updateMessageForwardSummary();
        });
    });
}

function renderMessageForwardList() {
    const mount = document.getElementById('messageForwardList');
    const hint = document.getElementById('messageForwardHint');
    if (!mount) return;
    const history = chatHistories[messageForwardState.sourceDriverId] || [];
    const items = history
        .map((msg, index) => ({ msg, index }))
        .filter(entry => entry.msg.role !== 'system');
    if (hint && currentChatDriver) {
        hint.innerText = `这些内容会从你和 ${currentChatDriver.name} 的聊天里挑选出来再转发。`;
    }
    mount.innerHTML = items.map(({ msg, index }) => {
        const checked = messageForwardState.selectedIndexes.includes(index);
        const roleLabel = msg.role === 'user' ? '你' : currentChatDriver?.name || '车手';
        const displayText = msg.role === 'assistant' ? stripChatStageDirections(msg.content) : String(msg.content || '');
        return `
            <label class="message-forward-item${checked ? ' active' : ''}">
                <input type="checkbox" data-forward-message="${index}" ${checked ? 'checked' : ''}>
                <div class="message-forward-item-body">
                    <div class="message-forward-item-meta">
                        <span>${escapeHtml(roleLabel)}</span>
                        <small>${escapeHtml(msg.timestamp || '')}</small>
                    </div>
                    <div class="message-forward-item-text">${escapeHtml(displayText)}</div>
                </div>
            </label>
        `;
    }).join('');
    mount.querySelectorAll('[data-forward-message]').forEach(input => {
        input.addEventListener('change', () => {
            const index = Number(input.dataset.forwardMessage);
            const next = new Set(messageForwardState.selectedIndexes);
            if (input.checked) next.add(index);
            else next.delete(index);
            messageForwardState.selectedIndexes = [...next].sort((a, b) => a - b);
            renderMessageForwardList();
            updateMessageForwardSummary();
        });
    });
}

function openMessageForwardModal(driverId, initialMessageIndex = null) {
    const modal = document.getElementById('messageForwardModal');
    if (!modal) return;
    activeMessageMenuKey = null;
    messageForwardState = {
        sourceDriverId: driverId,
        selectedIndexes: initialMessageIndex === null ? [] : [initialMessageIndex],
        targetDriverId: ''
    };
    renderMessageForwardList();
    renderMessageForwardTargetList();
    updateMessageForwardSummary();
    modal.style.display = 'flex';
}

async function confirmMessageForward() {
    const { sourceDriverId, selectedIndexes, targetDriverId } = messageForwardState;
    const targetDriver = (window.DRIVERS || []).find(driver => driver.id === targetDriverId);
    const sourceDriver = (window.DRIVERS || []).find(driver => driver.id === sourceDriverId);
    if (!sourceDriverId || !selectedIndexes.length || !targetDriver) {
        updateMessageForwardSummary();
        return;
    }
    const history = chatHistories[sourceDriverId] || [];
    const lines = selectedIndexes
        .map(index => history[index])
        .filter(msg => msg && msg.role !== 'system')
        .map(msg => {
            const speaker = msg.role === 'user' ? '我' : `${sourceDriver?.name || '对方'}`;
            const content = msg.role === 'assistant' ? stripChatStageDirections(msg.content) : String(msg.content || '');
            return { speaker, content };
        });
    if (!lines.length) return;
    const forwardText = `我想转发几条刚刚的聊天内容给你，来源是我和${sourceDriver?.name || '另一位车手'}的对话：\n${lines.map((line, idx) => `${idx + 1}. ${line.speaker}：${line.content}`).join('\n')}`;
    closeMessageForwardModal();
    closeMessageActionMenu();
    try {
        await sendMessageToDriver(targetDriver, forwardText, {
            messageMeta: {
                type: 'forwarded',
                sourceDriverId,
                sourceDriverName: sourceDriver?.name || '另一位车手',
                sourceDriverTeam: sourceDriver?.team || '',
                lines
            }
        });
        showToast(`已转发给 ${targetDriver.name}`, false);
    } catch (error) {
        console.error('转发消息失败', error);
        showToast('转发失败，请稍后再试', true);
    }
}

function parseGroupReplyLines(group, text) {
    const members = getGroupChatMembers(group);
    return String(text || '')
        .split(/\r?\n/)
        .map(line => line.trim())
        .filter(Boolean)
        .map(line => {
            const parts = line.split('：');
            const speaker = parts.shift() || '车手';
            const content = parts.join('：') || line;
            const driver = members.find(member => member.name === speaker) || (window.DRIVERS || []).find(member => member.name === speaker) || null;
            return { speaker, content, driver };
        });
}

async function getGroupReplyFavorIncs(group, userText, replyText) {
    const lines = parseGroupReplyLines(group, replyText);
    const seen = new Set();
    const results = await Promise.all(lines.map(async line => {
        const driver = line.driver;
        if (!driver || seen.has(driver.id)) return null;
        seen.add(driver.id);
        const inc = await judgeFavorabilityWithAI(driver, userText);
        if (inc <= 0) return null;
        return { driverId: driver.id, inc };
    }));
    return results.filter(Boolean);
}

function renderChatMessages(driverId) {
    const area = document.getElementById('chatMessagesArea');
    if (!area) return;
    const history = chatHistories[driverId] || [];
    area.innerHTML = '';
    history.forEach((msg, idx) => {
        if (msg.role === 'system') return;
        const wrapper = document.createElement('div');
        wrapper.className = `msg ${msg.role === 'user' ? 'user' : 'bot'}`;
        wrapper.dataset.messageIndex = String(idx);
        const header = document.createElement('div');
        header.className = 'msg-header';
        const timeSpan = document.createElement('span');
        timeSpan.innerText = msg.timestamp || '';
        header.appendChild(timeSpan);
        const tools = document.createElement('div');
        tools.className = 'msg-tools';
        const menuKey = buildMessageActionKey(driverId, idx);
        const menuOpen = activeMessageMenuKey === menuKey;
        const isOwnMessage = msg.role === 'user';
        tools.innerHTML = `
            <button type="button" class="msg-tools-trigger${menuOpen ? ' active' : ''}" aria-label="消息操作">⋯</button>
            <div class="msg-tools-menu${menuOpen ? ' open' : ''}">
                <button type="button" class="msg-tools-action" data-msg-action="forward" title="转发">转</button>
                <button type="button" class="msg-tools-action" data-msg-action="${isOwnMessage ? 'edit' : 'reset'}" title="${isOwnMessage ? '编辑' : '重置'}">${isOwnMessage ? '编' : '重'}</button>
                <button type="button" class="msg-tools-action danger" data-msg-action="delete" title="删除">删</button>
            </div>
        `;
        header.appendChild(tools);
        const bubble = document.createElement('div');
        const isForwarded = msg.role === 'user' && msg.meta?.type === 'forwarded';
        const isGroupReply = msg.role === 'assistant' && msg.meta?.type === 'group-reply';
        bubble.className = `${isGroupReply ? 'group-message-stack' : 'msg-bubble'}${isForwarded ? ' msg-bubble-forwarded' : ''}${msg.regenerated ? ' msg-bubble-regenerated' : ''}`;
        if (isForwarded) {
            const lines = Array.isArray(msg.meta?.lines) ? msg.meta.lines : [];
            bubble.innerHTML = `
                <div class="forwarded-card-head">
                    <div class="forwarded-accent"></div>
                    <div class="forwarded-head-copy">
                        <div class="forwarded-badge">转发聊天</div>
                        <div class="forwarded-source">${escapeHtml(msg.meta?.sourceDriverName || '另一位车手')}${msg.meta?.sourceDriverTeam ? ` · ${escapeHtml(msg.meta.sourceDriverTeam)}` : ''}</div>
                    </div>
                </div>
                <div class="forwarded-lines">
                    ${lines.map(line => `
                        <div class="forwarded-line">
                            <span class="forwarded-speaker">${escapeHtml(line.speaker || '')}</span>
                            <span class="forwarded-text">${escapeHtml(line.content || '')}</span>
                        </div>
                    `).join('')}
                </div>
            `;
        } else if (isGroupReply) {
            const group = getGroupChatById(driverId) || currentChatDriver;
            const lines = parseGroupReplyLines(group, msg.content);
            bubble.innerHTML = lines.map(line => `
                <div class="group-message-item">
                    <div class="group-message-avatar" data-group-speaker-id="${escapeHtml(line.driver?.id || '')}">${escapeHtml((line.speaker || '群').slice(0, 1))}</div>
                    <div class="group-message-body">
                        <div class="group-message-meta">
                            <span class="group-message-name">${escapeHtml(line.speaker)}</span>
                            <span class="group-message-id">${escapeHtml(line.driver?.team || '群聊成员')}</span>
                        </div>
                        <div class="group-message-bubble">${escapeHtml(line.content)}</div>
                    </div>
                </div>
            `).join('');
        } else {
            bubble.innerText = msg.role === 'assistant' ? stripChatStageDirections(msg.content) : msg.content;
        }
        wrapper.appendChild(header);
        wrapper.appendChild(bubble);
        tools.querySelector('.msg-tools-trigger')?.addEventListener('click', event => {
            event.stopPropagation();
            toggleMessageActionMenu(driverId, idx);
        });
        tools.querySelectorAll('[data-msg-action]').forEach(button => {
            button.addEventListener('click', event => {
                event.stopPropagation();
                const action = button.dataset.msgAction;
                if (action === 'forward') openMessageForwardModal(driverId, idx);
                if (action === 'edit') openMessageEditModal(driverId, idx);
                if (action === 'reset') resetAssistantMessage(driverId, idx);
                if (action === 'delete') {
                    closeMessageActionMenu();
                    deleteMessage(driverId, idx);
                }
            });
        });
        if (isGroupReply) {
            wrapper.querySelectorAll('[data-group-speaker-id]').forEach(avatar => {
                const speakerId = avatar.dataset.groupSpeakerId;
                if (speakerId) renderAvatarOnElement(avatar, speakerId, '38px');
            });
        }
        area.appendChild(wrapper);
    });
    area.scrollTop = area.scrollHeight;
    updateTokenDisplay(history);
}

const FAVOR_TOPIC_LIBRARY = [
    {
        id: 'technical',
        profileCues: ['模拟器', '数据', '工程', '技术', '驾驶输入', '圈速', '刹车', '抓地', '车感', '轮胎', '策略', '排位', '赛道', '录像', '开发', '可靠性', '分析'],
        keywords: ['技术', '数据', '工程', '调校', '设定', '圈速', '单圈', '刹车', '前轴', '转向', '抓地', '车感', '轮胎', '进站', '策略', '排位', '节奏', '长距离', '下压力', '空力', '模拟器', 'sim', '录像', '防守', '超车', '车尾', '开发', '可靠性', '输入']
    },
    {
        id: 'lifestyle',
        profileCues: ['时尚', '音乐', '钢琴', '生活', '文化', '摄影', '环保', '平权', '慈善', '咖啡', '美食', '旅行', '户外', '冲浪', '露营', '葡萄酒'],
        keywords: ['时尚', '穿搭', 'look', '音乐', '歌单', '钢琴', '艺术', '设计', '环保', '平权', '慈善', '文化', '摄影', '拍照', '咖啡', '美食', '吃的', '旅行', '假期', '冲浪', '露营', '葡萄酒', '红酒']
    },
    {
        id: 'fitness',
        profileCues: ['训练', '身心状态', '压力管理', '心态', '耐力', '抗压', '恢复', '成长', '证明自己', '学习'],
        keywords: ['训练', '健身', '体能', '恢复', '状态', '心态', '专注', '压力', '耐力', '自律', '睡眠', '饮食', '成长', '进步', '学习', '目标', '自信']
    },
    {
        id: 'social',
        profileCues: ['家庭', '家人', '朋友', '团队相处', '团队建设', '车迷互动', '围场人情', '私人空间'],
        keywords: ['家人', '家庭', '朋友', '队友', '团队', '相处', '陪伴', '车迷', '粉丝', '互动', '默契', '氛围']
    },
    {
        id: 'sports',
        profileCues: ['足球', '网球', '冰球', '游戏', '电竞', '骑行', '自行车', '山地', '耐力赛'],
        keywords: ['足球', '网球', '冰球', '游戏', '电竞', '骑行', '自行车', '山地', '耐力赛', '球赛']
    },
    {
        id: 'battle',
        profileCues: ['wheel-to-wheel', '位置战', '临场判断', '比赛阅读', '长线判断', '逆风生存', '比赛控制', '极限', '求生'],
        keywords: ['缠斗', '攻防', '位置战', '防守', '超车', '轮对轮', 'wheel to wheel', 'wheel-to-wheel', '临场', '判断', '求生', '逆风', '比赛阅读', '控制比赛', '极限']
    }
];

const FAVOR_GENERIC_POSITIVES = ['加油', '支持', '棒', '厉害', '相信', '喜欢', '爱', '谢谢', '感谢', '冠军', '胜利', '帅', '牛'];

const DRIVER_FAVOR_TOPIC_WEIGHTS = {
    nor: { favorite: ['technical', 'sports', 'social'], casual: ['battle', 'fitness'], off: ['lifestyle'] },
    pia: { favorite: ['technical', 'fitness'], casual: ['social'], off: ['lifestyle', 'sports'] },
    lec: { favorite: ['lifestyle', 'technical'], casual: ['fitness', 'social'], off: ['sports'] },
    ham: { favorite: ['lifestyle', 'fitness'], casual: ['technical', 'social'], off: ['sports'] },
    rus: { favorite: ['technical', 'fitness'], casual: ['battle', 'lifestyle'], off: ['sports'] },
    ant: { favorite: ['technical', 'fitness'], casual: ['social', 'lifestyle'], off: ['battle'] },
    ver: { favorite: ['technical', 'battle'], casual: ['sports', 'social'], off: ['lifestyle'] },
    hadjar: { favorite: ['battle', 'fitness'], casual: ['technical', 'social'], off: ['lifestyle'] },
    alo: { favorite: ['battle', 'technical'], casual: ['lifestyle', 'fitness'], off: ['sports'] },
    str: { favorite: ['battle', 'technical'], casual: ['sports', 'social'], off: ['lifestyle'] },
    alb: { favorite: ['social', 'lifestyle'], casual: ['technical', 'sports'], off: ['battle'] },
    sai: { favorite: ['technical', 'lifestyle'], casual: ['fitness', 'social'], off: ['battle'] },
    gas: { favorite: ['social', 'fitness'], casual: ['lifestyle', 'battle'], off: ['sports'] },
    col: { favorite: ['social', 'sports'], casual: ['battle', 'fitness'], off: ['lifestyle'] },
    oco: { favorite: ['fitness', 'battle'], casual: ['technical', 'social'], off: ['lifestyle'] },
    bea: { favorite: ['technical', 'fitness'], casual: ['lifestyle', 'social'], off: ['battle'] },
    hul: { favorite: ['technical', 'lifestyle'], casual: ['social', 'fitness'], off: ['battle'] },
    bor: { favorite: ['sports', 'social'], casual: ['fitness', 'technical'], off: ['battle'] },
    law: { favorite: ['battle', 'lifestyle'], casual: ['technical', 'fitness'], off: ['social'] },
    lin: { favorite: ['technical', 'sports'], casual: ['lifestyle', 'fitness'], off: ['social'] },
    per: { favorite: ['social', 'lifestyle'], casual: ['technical', 'battle'], off: ['sports'] },
    bot: { favorite: ['lifestyle', 'technical'], casual: ['fitness', 'social'], off: ['battle'] }
};

function normalizeFavorText(text) {
    return String(text || '').trim().toLowerCase();
}

function countContainedKeywords(text, keywords = []) {
    return keywords.reduce((sum, keyword) => sum + (text.includes(keyword) ? 1 : 0), 0);
}

function getDriverFavorTopics(driver) {
    const explicitWeights = DRIVER_FAVOR_TOPIC_WEIGHTS[driver?.id];
    if (explicitWeights) {
        return FAVOR_TOPIC_LIBRARY
            .map(topic => {
                if (explicitWeights.favorite.includes(topic.id)) return { ...topic, affinity: 3 };
                if (explicitWeights.casual.includes(topic.id)) return { ...topic, affinity: 2 };
                if (explicitWeights.off.includes(topic.id)) return { ...topic, affinity: 0 };
                return null;
            })
            .filter(Boolean)
            .sort((a, b) => b.affinity - a.affinity);
    }
    const personality = window.DRIVER_PERSONALITIES?.[driver?.id];
    const profileText = normalizeFavorText(`${personality?.interests || ''} ${personality?.expertise || ''} ${personality?.ruleView || ''}`);
    const topics = FAVOR_TOPIC_LIBRARY
        .map(topic => {
            const affinity = countContainedKeywords(profileText, topic.profileCues);
            return affinity > 0 ? { ...topic, affinity } : null;
        })
        .filter(Boolean)
        .sort((a, b) => b.affinity - a.affinity);
    return topics.length ? topics : FAVOR_TOPIC_LIBRARY.slice(0, 1).map(topic => ({ ...topic, affinity: 1 }));
}

function getFavorTopicLabel(topic) {
    if (!topic) return '';
    if (topic.affinity >= 3) return `最容易被打动的话题：${topic.profileCues.slice(0, 4).join('、')}`;
    if (topic.affinity >= 2) return `平时也愿意接的话题：${topic.profileCues.slice(0, 4).join('、')}`;
    return `通常不会因为这个话题明显拉近关系：${topic.profileCues.slice(0, 4).join('、')}`;
}

function buildFavorJudgePrompt(driver) {
    const topics = getDriverFavorTopics(driver);
    const favoriteTopics = topics.filter(topic => topic.affinity >= 3).slice(0, 2).map(getFavorTopicLabel);
    const casualTopics = topics.filter(topic => topic.affinity === 2).slice(0, 2).map(getFavorTopicLabel);
    const offTopics = topics.filter(topic => topic.affinity <= 0).slice(0, 2).map(getFavorTopicLabel);
    return [
        `你是一个只负责判断“用户这句话会不会让车手对他更有好感”的分析器。`,
        `判断对象：F1 车手 ${driver?.name || ''}（${driver?.team || ''}）。`,
        `请严格基于车手真实的人设倾向、表达风格、兴趣重点和关系节奏来判断，不要因为礼貌夸奖就轻易给分。`,
        `只有当用户这句话真的聊到了这位车手在意的内容、让他觉得被理解、被认真接住，或者在关系上自然推进时，才加分。`,
        `打分规则：0=基本不会增加好感；1=有一点点触动；2=明显觉得聊对了；3=非常对味，像是说到了他心里。`,
        `如果只是空泛夸奖、机械应援、和他本人无关的泛泛聊天、或者明显命中了他不太在意的话题，优先给 0。`,
        favoriteTopics.length ? `高优先级方向：${favoriteTopics.join('；')}` : '',
        casualTopics.length ? `次一级方向：${casualTopics.join('；')}` : '',
        offTopics.length ? `低优先级方向：${offTopics.join('；')}` : '',
        window.getDriverPersonalityContext ? window.getDriverPersonalityContext(driver.id) : '',
        `只输出一行 JSON，例如 {"score":2}，不要输出解释。`
    ].filter(Boolean).join('\n');
}

function localFavorJudgment(driver, message) {
    const lower = normalizeFavorText(message);
    if (!lower) return 0;

    const preferedTopics = getDriverFavorTopics(driver);
    const isThoughtfulPrompt = ['？', '?', '怎么看', '为什么', '会不会', '你觉得', '想不想', '最喜欢', '更在意'].some(item => lower.includes(item));
    const praiseHits = countContainedKeywords(lower, FAVOR_GENERIC_POSITIVES);
    let bestScore = 0;

    preferedTopics.forEach(topic => {
        if (topic.affinity <= 0) return;
        const topicHits = countContainedKeywords(lower, topic.keywords);
        if (!topicHits) return;

        let score = topic.affinity >= 3 ? 2 : 1;
        if (topicHits >= 2) score += 1;
        if (isThoughtfulPrompt) score += 1;
        if (praiseHits && score < 3) score += 1;
        bestScore = Math.max(bestScore, Math.min(3, score));
    });

    return bestScore;
}

function extractFavorScore(content) {
    const text = String(content || '').trim();
    if (!text) return null;
    try {
        const parsed = JSON.parse(text);
        const score = Number(parsed?.score);
        if (Number.isFinite(score)) return Math.max(0, Math.min(3, Math.round(score)));
    } catch (error) {
        const match = text.match(/[0-3]/);
        if (match) return Number(match[0]);
    }
    return null;
}

async function judgeFavorabilityWithAI(driver, message) {
    const fallback = localFavorJudgment(driver, message);
    const normalized = String(message || '').trim();
    if (!normalized) return fallback;
    if (!useAI || !apiConfig.key || !apiConfig.url || !apiConfig.model) return fallback;
    try {
        const response = await fetch(`${apiConfig.url.replace(/\/$/, '')}/chat/completions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${apiConfig.key}`
            },
            body: JSON.stringify({
                model: apiConfig.model,
                messages: [
                    { role: 'system', content: buildFavorJudgePrompt(driver) },
                    { role: 'user', content: normalized }
                ],
                temperature: 0.1,
                max_tokens: 40
            })
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const payload = await response.json();
        const content = payload?.choices?.[0]?.message?.content?.trim();
        const score = extractFavorScore(content);
        return score === null ? fallback : score;
    } catch (error) {
        console.warn('AI 好感判定失败，已回退到本地规则', error);
        return fallback;
    }
}

function pickGroupReplyMembers(group, userText) {
    const members = getGroupChatMembers(group);
    if (!members.length) return [];
    const text = String(userText || '').trim();
    const lower = normalizeFavorText(text);
    const mentionedMembers = members.filter(member => text.includes(member.name));
    if (mentionedMembers.length) return mentionedMembers.slice(0, 3);

    const ranked = members
        .map(member => {
            let score = localFavorJudgment(member, userText);
            const memberFavor = favorability[member.id] || 0;
            if (memberFavor >= 75) score += 2;
            else if (memberFavor >= 40) score += 1;
            if (lower.includes(member.team.toLowerCase())) score += 1;
            if (['你们', '大家', '群里', '都', '一起'].some(keyword => lower.includes(keyword))) score += 0.5;
            return { member, score };
        })
        .sort((a, b) => b.score - a.score || Math.random() - 0.5);

    const topScore = ranked[0]?.score || 0;
    if (topScore <= 0) return [ranked[0]?.member || members[Math.floor(Math.random() * members.length)]].filter(Boolean);
    const replyCount = ranked[1]?.score >= Math.max(2, topScore - 1) ? 2 : 1;
    return ranked.slice(0, replyCount).map(item => item.member);
}

function generateLocalReply(driver, msg, options = {}) {
    const giftContext = options.giftContext || null;
    const politeName = getGenderPrefix() === '车迷朋友' ? userProfile.name : `${userProfile.name}${getGenderPrefix()}`;
    const raceContext = window.getCurrentRaceContext ? window.getCurrentRaceContext() : '';
    const rankingInfo = window.formatRankingForChat ? window.formatRankingForChat(driver.id) : '';
    const lower = String(msg || '').toLowerCase();

    if (giftContext) {
        if (giftContext.preferenceLevel === 'favorite' || giftContext.matched) {
            return shapeChatReplyByDriver(driver, `这份 ${giftContext.name} 真的很对我胃口。你挑到这里，确实会让我一下子记住。`);
        }
        if (giftContext.preferenceLevel === 'liked' || giftContext.liked) {
            return shapeChatReplyByDriver(driver, `${politeName}，这份 ${giftContext.name} 我挺喜欢。你选东西的时候，明显有认真想过我。`);
        }
        return shapeChatReplyByDriver(driver, `${politeName}，${giftContext.name} 我收下了。不是那种会被我随手放过去的东西。`);
    }

    if (lower.includes('排名') || lower.includes('成绩')) {
        return shapeChatReplyByDriver(driver, `${rankingInfo}。不过现在还早，我更在意后面能不能继续把节奏接住。`);
    }
    if (lower.includes('下一站') || lower.includes('什么时候比赛')) {
        return shapeChatReplyByDriver(driver, `${raceContext}。到时候来看看吧，我也想把那一站跑得更像自己一点。`);
    }
    if (lower.includes('想你') || lower.includes('喜欢你')) {
        return shapeChatReplyByDriver(driver, `这种话我不会装作没听见，${politeName}。你这样说，我确实会有点在意。`);
    }
    if ((favorability[driver.id] || 0) >= 70) return shapeChatReplyByDriver(driver, `你一来找我，我这边会松一点。继续说吧，我现在真的有在听。`);
    if ((favorability[driver.id] || 0) >= 40) return shapeChatReplyByDriver(driver, `你的消息会让我停一下。你接着说，我想先听你这边。`);
    return shapeChatReplyByDriver(driver, `你继续说吧。我先听着，再慢慢回你。`);
}

function generateLocalGroupReply(group, userText) {
    const picked = pickGroupReplyMembers(group, userText);
    const snippets = picked.map(member => `${member.name}：${generateLocalReply(member, userText)}`);
    return snippets.join('\n');
}

async function getGroupReply(group, userText) {
    const members = getGroupChatMembers(group);
    if (!members.length) return { reply: '群里暂时没人接话。', incs: [] };
    if (!useAI || !apiConfig.key || !apiConfig.url || !apiConfig.model) {
        const reply = generateLocalGroupReply(group, userText);
        return { reply, incs: await getGroupReplyFavorIncs(group, userText, reply) };
    }
    showLoading(true);
    try {
        const history = (chatHistories[group.id] || []).filter(msg => msg.role !== 'system').slice(-10);
        const memberSummary = members.map(driver => `${driver.name}（${driver.team}）`).join('、');
        const personalitySummary = members
            .map(driver => `【${driver.name}】${window.getDriverPersonalityContext ? window.getDriverPersonalityContext(driver.id) : ''}`)
            .join('\n');
        const pickedMembers = pickGroupReplyMembers(group, userText);
        const text = String(userText || '').trim();
        const pickedNames = pickedMembers.map(driver => driver.name).join('、');
        const mentionRule = text && pickedMembers.length && pickedMembers.every(driver => text.includes(driver.name))
            ? `用户这次明确提到了：${pickedNames}。这次优先只让这些被点到的车手回复。`
            : `这次最可能接话的车手是：${pickedNames || '群里某位成员'}。优先让 1 到 2 位最合适的人回复，不要强行平均分配。`;
        const noticePrompt = group.notice ? `\n【群公告】${group.notice}` : '';
        const systemMsg = {
            role: 'system',
            content: `今天是${getCurrentDateInfo()}。你正在一个围场群聊里回复用户，群名：${group.name}。群成员：${memberSummary}。${noticePrompt}\n【群聊输出规则】\n- 默认输出 1 到 2 行，只有真的有必要时才到 3 行。\n- 如果用户明确点了名字，就优先让被点到的车手接话。\n- 如果没人被点名，就由最可能对这个话题有兴趣、和用户更熟、或者此刻最自然会插话的人回复。\n- 每一行必须以“车手名：内容”的格式输出。\n- 不要让所有成员强行都说话，也不要输出解释、旁白或括号动作。\n- 群聊记忆和用户全局资料共通，回复时可以参考各成员已有记忆。\n- 不要复用“我看到了”“我收到了”“这条不错”“差不多就是这样”之类的机械套话。\n- 每位车手都必须像自己，不要写成一群人共用同一种语气。\n- ${mentionRule}\n${getUserProfilePriorityPrompt()}\n${personalitySummary}\n${getGroupChatSharedMemoryContext(group.memberIds, group.id)}`
        };
        const response = await fetch(`${apiConfig.url.replace(/\/$/, '')}/chat/completions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${apiConfig.key}`
            },
            body: JSON.stringify({ model: apiConfig.model, messages: [systemMsg, ...history], temperature: 0.9, max_tokens: 260 })
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const payload = await response.json();
        const content = sanitizeRoleOutput(payload?.choices?.[0]?.message?.content?.trim(), 'chat');
        if (!content) throw new Error('API 返回空内容');
        return { reply: content, incs: await getGroupReplyFavorIncs(group, userText, content) };
    } catch (error) {
        handleApiError(error, '群聊回复');
        const reply = generateLocalGroupReply(group, userText);
        return { reply, incs: await getGroupReplyFavorIncs(group, userText, reply) };
    } finally {
        showLoading(false);
    }
}

async function getDriverReplyWithFavor(driver, userMessage, options = {}) {
    const giftContext = options.giftContext || null;
    const historyOverride = Array.isArray(options.historyOverride) ? options.historyOverride : null;
    const baseInc = giftContext ? 0 : await judgeFavorabilityWithAI(driver, userMessage);
    if (!useAI || !apiConfig.key || !apiConfig.url || !apiConfig.model) {
        return { reply: generateLocalReply(driver, userMessage, options), inc: baseInc };
    }
    showLoading(true);
    try {
        const history = (historyOverride || (chatHistories[driver.id] || []).filter(msg => msg.role !== 'system')).slice(-8);
        const rankingInfo = window.formatRankingForChat ? window.formatRankingForChat(driver.id) : '';
        const raceContext = window.getCurrentRaceContext ? window.getCurrentRaceContext() : '';
        const chatStyle = getDriverChatStyleProfile(driver.id);
        const giftPrompt = giftContext ? `\n【礼物事件】\n- 用户刚刚送来的礼物：${giftContext.name}\n- 礼物描述：${giftContext.description}\n- 这份礼物和你偏好的匹配程度：${giftContext.preferenceLevel === 'favorite' || giftContext.matched ? '最爱级别' : (giftContext.preferenceLevel === 'liked' || giftContext.liked ? '普通喜欢' : '普通收下')}\n- 如果是最爱级别，请明显更开心、更主动、更有被懂到的感觉，但不要直接说“这就是我最爱的礼物”。\n- 如果只是普通喜欢，请自然表现出“这份礼物挺对胃口”的感觉，开心但不要夸张。\n- 如果只是普通收下，请礼貌收下、语气自然，不要表现得扫兴，也不要直接说送错了。\n- 这是聊天小窗回复，只输出你对用户说的话。` : '';
        const systemMsg = {
            role: 'system',
            content: `今天是${getCurrentDateInfo()}。${raceContext}\n你是 F1 车手 ${driver.name}（${driver.team}）。\n${getChatWritingGuide()}\n${getUserProfilePriorityPrompt()}\n【当前关系】${getFavorMood(favorability[driver.id] || 0)}\n【赛况参考】${rankingInfo}\n【额外语气要求】\n- 回复要像你本人，不要像通用恋爱模板。\n- 只回应当下最自然的一个点，不要把安慰、解释、表态一次性全塞进去。\n- 如果一句话听起来像任何车手都能说，就重写得更像你自己。\n- 你的句长习惯：${chatStyle.length}\n- 有些车手会更短促，有些会自然多解释半句；你必须保持自己的节奏。\n${buildDriverSharedMemoryContext(driver.id)}\n${window.getDriverPersonalityContext ? window.getDriverPersonalityContext(driver.id) : ''}${giftPrompt}`
        };
        const response = await fetch(`${apiConfig.url.replace(/\/$/, '')}/chat/completions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${apiConfig.key}`
            },
            body: JSON.stringify({ model: apiConfig.model, messages: [systemMsg, ...history], temperature: giftContext ? 0.9 : 0.82, max_tokens: 360 })
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const payload = await response.json();
        const content = sanitizeRoleOutput(payload?.choices?.[0]?.message?.content?.trim(), 'chat');
        if (!content) throw new Error('API 返回空内容');
        return { reply: shapeChatReplyByDriver(driver, content), inc: baseInc };
    } catch (error) {
        handleApiError(error, '消息回复');
        return { reply: generateLocalReply(driver, userMessage, options), inc: baseInc };
    } finally {
        showLoading(false);
    }
}

let messageInProgress = false;

async function sendMessageToDriver(driver, userText, options = {}) {
    if (driver?.type === 'group') {
        return sendMessageToGroup(driver, userText, options);
    }
    if (!userText.trim() || messageInProgress) return;
    messageInProgress = true;
    try {
        initDriverHistory(driver);
        chatHistories[driver.id].push({
            role: 'user',
            content: userText,
            timestamp: getCurrentTime(),
            dateKey: getLocalDateKey(),
            meta: options.messageMeta || null
        });
        saveChatHistories();
        renderChatMessages(driver.id);
        const { reply, inc } = await getDriverReplyWithFavor(driver, userText);
        if (inc > 0) addFavorability(driver.id, inc);
        chatHistories[driver.id].push({ role: 'assistant', content: reply, timestamp: getCurrentTime(), dateKey: getLocalDateKey() });
        trimChatHistory(driver.id);
        saveChatHistories();
        renderChatMessages(driver.id);
        renderDriverList();
    } finally {
        messageInProgress = false;
    }
}

async function sendMessageToGroup(group, userText, options = {}) {
    if (!userText.trim() || messageInProgress) return;
    messageInProgress = true;
    try {
        initGroupChatHistory(group);
        chatHistories[group.id].push({
            role: 'user',
            content: userText,
            timestamp: getCurrentTime(),
            dateKey: getLocalDateKey(),
            meta: options.messageMeta || null
        });
        touchGroupChatActivity(group.id);
        saveChatHistories();
        renderChatMessages(group.id);
        const { reply, incs } = await getGroupReply(group, userText);
        incs.forEach(entry => {
            if (entry?.driverId && entry.inc > 0) addFavorability(entry.driverId, entry.inc);
        });
        chatHistories[group.id].push({
            role: 'assistant',
            content: reply,
            timestamp: getCurrentTime(),
            dateKey: getLocalDateKey(),
            meta: { type: 'group-reply', memberIds: group.memberIds || [] }
        });
        trimChatHistory(group.id);
        touchGroupChatActivity(group.id);
        saveChatHistories();
        renderChatMessages(group.id);
        renderDriverList();
    } finally {
        messageInProgress = false;
    }
}

async function sendGiftToDriver(driver, giftItem, preferenceLevel = 'neutral') {
    if (!driver || !giftItem || messageInProgress) return false;
    if (preferenceLevel === true) preferenceLevel = 'favorite';
    if (preferenceLevel === false) preferenceLevel = 'neutral';
    const userText = `我送给你一份礼物：${giftItem.name}`;
    messageInProgress = true;
    try {
        initDriverHistory(driver);
        chatHistories[driver.id].push({ role: 'user', content: userText, timestamp: getCurrentTime(), dateKey: getLocalDateKey() });
        saveChatHistories();
        renderChatMessages(driver.id);
        const { reply } = await getDriverReplyWithFavor(driver, userText, {
            giftContext: {
                name: giftItem.name,
                description: giftItem.description,
                matched: preferenceLevel === 'favorite',
                liked: preferenceLevel === 'liked',
                preferenceLevel
            }
        });
        if (preferenceLevel === 'favorite') addFavorability(driver.id, 5);
        else if (preferenceLevel === 'liked') addFavorability(driver.id, 3);
        chatHistories[driver.id].push({ role: 'assistant', content: reply, timestamp: getCurrentTime(), dateKey: getLocalDateKey() });
        trimChatHistory(driver.id);
        saveChatHistories();
        renderChatMessages(driver.id);
        renderDriverList();
        if (typeof renderChatGiftPanel === 'function') renderChatGiftPanel();
        return true;
    } finally {
        messageInProgress = false;
    }
}

window.sendGiftToDriver = sendGiftToDriver;

let hiddenByMobileChatModalEntries = [];
let isMobileChatIsolating = false;

function shouldUseMobileChatIsolation() {
    return !(typeof isDesktopChatView === 'function' && isDesktopChatView());
}

function hideVisibleOverlaysForMobileChat() {
    if (!shouldUseMobileChatIsolation()) return;
    const selector = '.modal, .profile-card-modal';
    const overlays = [...document.querySelectorAll(selector)].filter(element => {
        if (!(element instanceof HTMLElement)) return false;
        if (element.id === 'chatDetailView') return false;
        const computed = window.getComputedStyle(element);
        return computed.display !== 'none';
    });
    hiddenByMobileChatModalEntries = overlays.map(element => ({
        id: element.id,
        display: element.style.display || 'flex'
    }));
    overlays.forEach(element => {
        element.dataset.hiddenByMobileChat = 'true';
        element.style.display = 'none';
    });
    isMobileChatIsolating = hiddenByMobileChatModalEntries.length > 0;
}

function restoreHiddenOverlaysFromMobileChat() {
    if (!isMobileChatIsolating || !hiddenByMobileChatModalEntries.length) return;
    hiddenByMobileChatModalEntries.forEach(entry => {
        const element = document.getElementById(entry.id);
        if (!(element instanceof HTMLElement)) return;
        if (element.dataset.hiddenByMobileChat !== 'true') return;
        delete element.dataset.hiddenByMobileChat;
        if (window.getComputedStyle(element).display === 'none') {
            element.style.display = entry.display || 'flex';
        }
    });
    hiddenByMobileChatModalEntries = [];
    isMobileChatIsolating = false;
}

window.restoreHiddenOverlaysFromMobileChat = restoreHiddenOverlaysFromMobileChat;
window.isMobileChatIsolating = () => isMobileChatIsolating;

function openChat(driver) {
    hideVisibleOverlaysForMobileChat();
    currentChatDriver = driver.type === 'group' ? { ...driver, type: 'group' } : driver;
    renderChatWorkspaceState();
    renderDriverList();
    if (typeof renderChatGiftPanel === 'function') renderChatGiftPanel();
    const input = document.getElementById('chatInput');
    if (input) {
        input.value = '';
        input.focus();
    }
}

function renderDriverList() {
    const container = document.getElementById('driverList');
    if (!container) return;
    const groups = {};
    window.DRIVERS.forEach(driver => {
        if (!groups[driver.team]) groups[driver.team] = [];
        groups[driver.team].push(driver);
    });
    const teamOrder = ['法拉利', '梅赛德斯', '迈凯伦', '红牛', '阿斯顿马丁', '威廉姆斯', 'Alpine', '哈斯', '奥迪', 'Racing Bulls', '凯迪拉克'];
    container.innerHTML = '';
    renderGroupChatSection(container);
    renderPinnedContactsSection(container);
    teamOrder.forEach(team => {
        if (!groups[team]?.length) return;
        renderTeamSection(container, team, groups[team]);
    });
}

function deleteMessage(driverId, msgIndex) {
    const history = chatHistories[driverId];
    if (!history || msgIndex < 0 || msgIndex >= history.length) return;
    if (history[msgIndex].role === 'system') return;
    history.splice(msgIndex, 1);
    const nonSystem = history.filter(msg => msg.role !== 'system');
    if (!nonSystem.length) {
        const driver = window.DRIVERS.find(item => item.id === driverId);
        const group = getGroupChatById(driverId);
        if (driver) history.push({ role: 'assistant', content: driver.initialMsg, timestamp: getCurrentTime(), dateKey: getLocalDateKey() });
        if (group) {
            const fallbackMember = pickGroupReplyMembers(group, '')[0] || getGroupChatMembers(group)[0];
            history.push({ role: 'assistant', content: `${fallbackMember?.name || '车手'}：群里暂时安静了一下。`, timestamp: getCurrentTime(), dateKey: getLocalDateKey(), meta: { type: 'group-reply' } });
        }
    }
    saveChatHistories();
    if (currentChatDriver?.id === driverId) renderChatMessages(driverId);
    renderDriverList();
    showToast('消息已删除', false);
}
