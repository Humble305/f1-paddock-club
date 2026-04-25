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
    const actions = {
        beach: ['（他偏过脸看你，海风把额前的发丝吹得有点乱。）', '（他放慢脚步，和你并肩沿着海边继续往前走。）'],
        restaurant: ['（他把手边的杯子轻轻转了半圈，目光又落回你身上。）', '（他靠在椅背上，语气比刚才更松一点。）'],
        paddock: ['（他侧身示意你跟上，脚步却刻意替你放慢了一点。）', '（他抬手指了指不远处的赛车，眼神里带着一点认真。）']
    };
    const action = (actions[scene.id] || actions.beach)[Math.floor(Math.random() * 2)];
    const lastUser = [...dateHistory].reverse().find(item => item.role === 'user') || [...normalHistory].reverse().find(item => item.role === 'user');
    const moodText = favor >= 70 ? '和你待在一起的时候，我会比平时放松。' : favor >= 40 ? '至少现在这一刻，我挺愿意继续把时间留给你。' : '我在认真听你说。';
    const eventLead = options.eventContext ? `刚才那件“${options.eventContext.title}”，我其实也还在想着。` : '';
    const continuity = lastUser ? `你刚才提到的“${String(lastUser.content).slice(0, 20)}”，我有在想。` : '继续说吧，我在听。';
    return `${action}\n${moodText}${eventLead}${continuity}`;
}

async function generateDateReply(driver, scene, userAction, userMessage, round, dateHistory = [], normalHistory = [], options = {}) {
    const favor = favorability[driver.id] || 0;
    const mood = getFavorMood(favor);
    const memoryContext = buildDriverSharedMemoryContext(driver.id);
    const personalityContext = window.getDriverPersonalityContext ? window.getDriverPersonalityContext(driver.id) : '';
    const eventContext = options.eventContext || null;
    if (!useAI || !apiConfig.key || !apiConfig.url || !apiConfig.model) {
        return fallbackDateReply(driver, scene, favor, normalHistory, dateHistory, options);
    }
    showLoading(true);
    try {
        const chatHistoryText = normalHistory.map(msg => `${msg.role === 'user' ? '用户' : driver.name}: ${msg.content}`).join('\n');
        const dateHistoryText = dateHistory.map(msg => `${msg.role === 'user' ? '用户' : driver.name}: ${msg.content}`).join('\n');
        const eventPrompt = eventContext ? `\n【刚刚发生的小插曲】${eventContext.title} - ${eventContext.desc}\n【用户刚刚的选择】${eventContext.choiceLabel}：${eventContext.actionText}` : '';
        const systemPrompt = `今天是${getCurrentDateInfo()}。${window.getCurrentRaceContext ? window.getCurrentRaceContext() : ''}\n你是 F1 车手 ${driver.name}（${driver.team}），正在和用户进行一场真实、私密、连续的约会。\n【当前约会场景】${scene.name} - ${scene.desc}\n【当前关系】${mood}（好感度 ${favor}/100）\n${getDateWritingGuide()}\n${getUserProfilePriorityPrompt()}\n${getRoleOutputSafetyPrompt('date')}\n【共享记忆】${memoryContext}\n【本次约会里已经发生的小事】\n${getDateEventHistoryText()}\n【普通聊天记录】\n${chatHistoryText}\n【本次约会对话】\n${dateHistoryText}\n${personalityContext}${eventPrompt}\n【用户刚刚的动作或话语】${userAction}：${userMessage || '（无具体话语）'}\n请以 ${driver.name} 的身份回复。回复长度 100 到 220 字，动作描写必须放在开头单独一行，随后换行继续台词。`;
        const response = await fetch(`${apiConfig.url.replace(/\/$/, '')}/chat/completions`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiConfig.key}` },
            body: JSON.stringify({ model: apiConfig.model, messages: [{ role: 'system', content: systemPrompt }], temperature: 0.82, max_tokens: 320 })
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const payload = await response.json();
        const content = sanitizeRoleOutput(payload?.choices?.[0]?.message?.content?.trim(), 'date');
        if (!content) throw new Error('API 返回空内容');
        return content;
    } catch (error) {
        handleApiError(error, '约会回复');
        return fallbackDateReply(driver, scene, favor, normalHistory, dateHistory, options);
    } finally {
        showLoading(false);
    }
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
    currentDateDriver = driver;
    currentDateScene = scene;
    currentRound = 0;
    dateMessages = [];
    dateInProgress = true;
    currentDateEvent = null;
    dateEventHistory = [];
    dateEventCooldown = 1;
    const opening = await generateDateReply(driver, scene, '开始约会', '', currentRound, [], getRecentChatHistory(driver.id, 8));
    dateMessages.push({ role: 'bot', content: opening });
    renderDatePage();
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
    dateMessages.push({ role: 'bot', content: reply });
    maybeTriggerDateEvent(currentDateDriver, currentDateScene);
    renderDatePage();
    if (currentRound >= maxRounds) endDate();
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
    showToast(favorChange > 0 ? `绾︿細缁撴潫锛屽ソ鎰熷害 +${favorChange}` : '绾︿細缁撴潫', false);
}

function formatDateBubbleContent(text = '', role = 'bot') {
    const safeText = String(text || '');
    if (role !== 'bot') return escapeHtml(safeText);
    const actionPattern = /([锛?][^锛堬級()\n]{1,120}[锛?])/gu;
    const blocks = [];
    let lastIndex = 0;
    let match;
    const pushDialogue = value => {
        const cleaned = String(value || '').trim();
        if (cleaned) blocks.push(`<div class="date-dialogue-line">${escapeHtml(cleaned)}</div>`);
    };
    while ((match = actionPattern.exec(safeText)) !== null) {
        pushDialogue(safeText.slice(lastIndex, match.index));
        blocks.push(`<div class="date-action-line">${escapeHtml(match[0])}</div>`);
        lastIndex = match.index + match[0].length;
    }
    pushDialogue(safeText.slice(lastIndex));
    return blocks.length ? blocks.join('') : escapeHtml(safeText);
}

function renderDatePage() {
    const container = document.getElementById('dateContainer');
    const datePage = document.getElementById('datePage');
    if (!container) return;
    container.classList.toggle('date-session-active', !!dateInProgress);
    datePage?.classList.toggle('date-page-session', !!dateInProgress);
    if (!dateInProgress) {
        const availableDrivers = window.DRIVERS.filter(driver => (favorability[driver.id] || 0) >= DATE_FAVOR_THRESHOLD);
        if (!availableDrivers.length) {
            container.innerHTML = `<div class="date-selector date-selector-empty"><div class="date-hero-card"><div class="date-hero-kicker">Paddock Date</div><div class="date-hero-title">还没有车手愿意赴约</div><div class="date-hero-copy">好感达到 ${DATE_FAVOR_THRESHOLD} 之后，对应车手才会出现在这里。先去聊聊天、送送礼，再回来挑一个更合适的晚上。</div></div></div>`;
            return;
        }
        const driverCards = availableDrivers.map(driver => {
            const favor = favorability[driver.id] || 0;
            const avatarBg = getDriverAvatarStyle(driver.id);
            return `<button class="date-driver-card" data-driver-id="${driver.id}"><div class="date-driver-card-glow"></div><div class="driver-avatar-mini"${avatarBg ? ` style="background-image:${avatarBg};background-size:cover;background-position:center;"` : ''}>${avatarBg ? '' : driver.avatarLetter}</div><div class="driver-info-mini"><div class="driver-name-mini">${driver.name}</div><div class="driver-team-mini">${driver.team}</div><div class="driver-favor-mini">好感 ${favor}</div></div><span class="date-card-select">已待命</span></button>`;
        }).join('');
        const sceneCards = window.DATE_SCENES.map(scene => `<button class="date-scene-card" data-scene-id="${scene.id}"><div class="date-scene-track"></div><div class="scene-icon">${window.getUiIconMarkup ? window.getUiIconMarkup(scene.iconKey || 'spark', 'scene-icon-svg', scene.name) : ''}</div><div class="scene-name">${scene.name}</div><div class="scene-desc">${scene.desc}</div><div class="date-scene-meta">Mood Route</div></button>`).join('');
        container.innerHTML = `<div class="date-selector"><div class="date-hero-card"><div><div class="date-hero-kicker">Paddock Date</div><div class="date-hero-title">挑一个人，再挑一个今晚的氛围</div><div class="date-hero-copy">这不是普通入口页，更像围场深夜里的一张邀约面板。先选车手，再决定这次约会该在海边、餐厅还是围场里发生。</div></div><div class="date-hero-badge">Private Line</div></div><div class="date-driver-grid"><section class="date-driver-section"><div class="date-section-head"><h4>选择车手</h4><span class="date-section-meta">${availableDrivers.length} 位可赴约</span></div><div class="date-driver-cards">${driverCards}</div></section><section class="date-scene-section"><div class="date-section-head"><h4>选择场景</h4><span class="date-section-meta">${window.DATE_SCENES.length} 条氛围路线</span></div><div class="date-scene-cards">${sceneCards}</div></section></div><button id="startDateBtn" class="date-start-btn"><span class="date-start-kicker">Open Session</span><strong>开始这场约会</strong></button></div>`;
        let selectedDriverId = availableDrivers[0]?.id || '';
        let selectedSceneId = window.DATE_SCENES[0]?.id || '';
        const updateActive = () => {
            document.querySelectorAll('.date-driver-card').forEach(card => card.classList.toggle('active', card.dataset.driverId === selectedDriverId));
            document.querySelectorAll('.date-scene-card').forEach(card => card.classList.toggle('active', card.dataset.sceneId === selectedSceneId));
        };
        document.querySelectorAll('.date-driver-card').forEach(card => card.addEventListener('click', () => { selectedDriverId = card.dataset.driverId; updateActive(); }));
        document.querySelectorAll('.date-scene-card').forEach(card => card.addEventListener('click', () => { selectedSceneId = card.dataset.sceneId; updateActive(); }));
        updateActive();
        document.getElementById('startDateBtn')?.addEventListener('click', () => startDate(selectedDriverId, selectedSceneId));
        return;
    }
    const messagesHtml = dateMessages.map(msg => {
        const avatarMarkup = msg.role === 'user'
            ? buildDateUserAvatarMarkup()
            : buildDateDriverAvatarMarkup(currentDateDriver?.id);
        const eventMetaHtml = msg.meta?.type === 'date-event-choice'
            ? `<div class="date-message-tag">${escapeHtml(msg.meta.eventTitle)} · ${escapeHtml(msg.meta.eventChoiceLabel)}</div>`
            : '';
        return `<div class="date-message-row ${msg.role}">${msg.role === 'bot' ? avatarMarkup : ''}<div class="date-message ${msg.role}">${eventMetaHtml}<div class="date-bubble">${formatDateBubbleContent(msg.content, msg.role)}</div></div>${msg.role === 'user' ? avatarMarkup : ''}</div>`;
    }).join('');
    const driverAvatarBg = getDriverAvatarStyle(currentDateDriver.id);
    const eventHtml = currentDateEvent ? `
        <div class="date-event-modal">
            <div class="date-event-backdrop"></div>
            <section class="date-event-card">
                <div class="date-event-head">
                    <div>
                        <div class="date-event-kicker">${escapeHtml(currentDateEvent.tag || 'Date Event')}</div>
                        <div class="date-event-title">${escapeHtml(currentDateEvent.title)}</div>
                    </div>
                    <div class="date-event-badge">Live</div>
                </div>
                <div class="date-event-desc">${escapeHtml(currentDateEvent.desc)}</div>
                <div class="date-event-choices">
                    ${currentDateEvent.choices.map((choice, index) => `<button type="button" class="date-event-choice" data-date-event-choice="${index}"><span>${escapeHtml(choice.label)}</span><small>${escapeHtml(choice.actionText)}</small></button>`).join('')}
                </div>
            </section>
        </div>
    ` : '';
    container.innerHTML = `<div class="date-panel-header"><div class="date-panel-main"><div class="date-panel-avatar"${driverAvatarBg ? ` style="background-image:${driverAvatarBg};background-size:cover;background-position:center;"` : ''}>${driverAvatarBg ? '' : currentDateDriver.avatarLetter}</div><div class="date-panel-meta"><div class="date-panel-title">${escapeHtml(currentDateDriver.name)}</div><div class="date-panel-subtitle">${escapeHtml(currentDateDriver.team)} · ${escapeHtml(currentDateScene?.name || '约会中')}</div></div></div><div class="date-panel-scene"><div class="date-panel-scene-label">Scene</div><strong>${escapeHtml(currentDateScene?.name || '')}</strong></div></div><div class="round-counter date-panel-pill">第 ${currentRound + 1} / ${maxRounds} 轮 · ${currentDateEvent ? '今晚有小插曲' : `${currentDateDriver.name} 的约会`}</div><div class="date-chat-area" id="dateChatArea">${messagesHtml}</div><div class="date-input-area"><input type="text" id="dateUserInput" class="date-input" placeholder="写一点今晚想说的话..." autocomplete="off"><button id="dateSendBtn" class="send-msg-btn"><span>发送</span></button></div>${eventHtml}`;
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
        submitDateAction('自定义', text);
    };
    document.getElementById('dateSendBtn')?.addEventListener('click', send);
    container.querySelectorAll('[data-date-event-choice]').forEach(button => {
        button.addEventListener('click', () => {
            const choice = currentDateEvent?.choices?.[Number(button.dataset.dateEventChoice)];
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
    return {
        messages,
        chatText: messages.map(msg => `${msg.role === 'user' ? userProfile.name : (window.DRIVERS.find(item => item.id === targetId)?.name || '车手')}: ${msg.content}`).join('\n'),
        dateMemoryText: dateMemory?.dateKey === dateKey ? dateMemory.summary : '',
        title: `${window.DRIVERS.find(item => item.id === targetId)?.name || '车手'} 的日记`,
        emptyHint: '这一天还没有聊天记录可用于生成日记',
        fallbackText: `今天和${window.DRIVERS.find(item => item.id === targetId)?.name || '这位车手'}聊了不少。\n\n${messages.map(msg => `${msg.role === 'user' ? userProfile.name : (window.DRIVERS.find(item => item.id === targetId)?.name || '车手')}: ${msg.content}`).join('\n').slice(0, 300)}`,
        prompt: `请根据下面这一天的聊天内容，写一篇关系日记。要求：第三人称概括、自然细腻、突出关系进展、100 到 220 字。\n【聊天记录】\n${messages.map(msg => `${msg.role === 'user' ? userProfile.name : (window.DRIVERS.find(item => item.id === targetId)?.name || '车手')}: ${msg.content}`).join('\n')}\n【约会记忆】\n${dateMemory?.dateKey === dateKey ? dateMemory.summary : '无'}`,
        sourceMeta: `当日聊天记录 ${messages.length} 条`,
        memoryHint: dateMemory?.dateKey === dateKey ? dateMemory.summary : '这一天没有同步到约会记忆摘要。'
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
